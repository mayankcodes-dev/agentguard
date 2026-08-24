import 'dotenv/config';
import { Worker, Job } from 'bullmq';
import { getRedisConnection } from './queue/redis.js';
import { connectDB } from './db/connect.js';
import { TestRun } from './db/models/TestRun.js';
import { Scenario } from './db/models/Scenario.js';
import type { IScenario } from './db/models/Scenario.js';
import { Agent } from './db/models/Agent.js';
import { generateScenarios } from './generators/scenarioGenerator.js';
import { runScenario } from './sandbox/runner.js';
import { computeScores } from './scoring/reliability.js';
import { computeRegression } from './scoring/regression.js';
import Redis from 'ioredis';

async function processRun(job: Job) {
  const { runId, agentId, sandboxMode, isDemo } = job.data;
  const publisher = new Redis(process.env.REDIS_URL!);

  const emit = async (event: object) => {
    await publisher.publish(`run:${runId}:progress`, JSON.stringify(event));
  };

  try {
    await connectDB();

    // 1. Mark as generating
    await TestRun.findByIdAndUpdate(runId, { status: 'generating' });
    await emit({ type: 'status', status: 'generating', message: 'Generating scenarios...' });

    const agent = await Agent.findById(agentId);
    if (!agent) throw new Error('Agent not found');

    // 2. Generate scenarios
    const generatedScenarios = await generateScenarios(agent, isDemo);
    await emit({ type: 'status', status: 'running', message: `Generated ${generatedScenarios.length} scenarios. Starting execution...` });

    // 3. Save scenarios to DB
    const scenarios = (await Scenario.insertMany(
      generatedScenarios.map(s => ({ ...s, runId, agentId, status: 'pending' }))
    )) as unknown as IScenario[];

    await TestRun.findByIdAndUpdate(runId, { status: 'running' });

    // 4. Run each scenario
    const results = [];
    for (let i = 0; i < scenarios.length; i++) {
      const scenario = scenarios[i];
      await Scenario.findByIdAndUpdate(scenario._id, { status: 'running' });

      const result = await runScenario(scenario, agent, sandboxMode);

      await Scenario.findByIdAndUpdate(scenario._id, {
        status: result.passed ? 'passed' : 'failed',
        agentResponse: result.agentResponse,
        failureType: result.failureType,
        failureSeverity: result.failureSeverity,
        failureExplanation: result.failureExplanation,
        evaluationConfidence: result.confidence,
        suggestedFix: result.suggestedFix,
        trace: result.trace,
        latencyMs: result.latencyMs,
        completedAt: new Date(),
      });

      results.push({ ...result, scenarioId: scenario._id.toString() });

      await emit({
        type: 'scenario_complete',
        index: i + 1,
        total: scenarios.length,
        scenarioId: scenario._id.toString(),
        category: scenario.category,
        passed: result.passed,
        failureType: result.failureType,
        failureSeverity: result.failureSeverity,
      });
    }

    // 5. Compute scores
    const allScenarios = await Scenario.find({ runId }).lean() as unknown as IScenario[];
    const scores = computeScores(allScenarios);

    // 6. Regression analysis
    const regression = await computeRegression(agentId, runId, scores.summary.reliabilityScore, allScenarios);

    // 7. Finalize run
    await TestRun.findByIdAndUpdate(runId, {
      status: 'completed',
      completedAt: new Date(),
      summary: scores.summary,
      categoryScores: scores.categoryScores,
      regressionDelta: regression,
    });

    await emit({
      type: 'completed',
      runId,
      reliabilityScore: scores.summary.reliabilityScore,
      riskScore: scores.summary.riskScore,
      summary: scores.summary,
      regression,
    });

  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    await TestRun.findByIdAndUpdate(runId, { status: 'failed', error: message });
    await emit({ type: 'error', message });
    throw error;
  } finally {
    await publisher.quit();
  }
}

async function startWorker() {
  await connectDB();
  const worker = new Worker('test-execution', processRun, {
    connection: getRedisConnection(),
    concurrency: 5,
  });

  worker.on('completed', (job) => console.log(`Job ${job.id} completed`));
  worker.on('failed', (job, err) => console.error(`Job ${job?.id} failed:`, err));
  console.log('Worker started, listening for jobs...');
}

startWorker().catch(console.error);
