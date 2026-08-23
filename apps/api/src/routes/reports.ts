import type { FastifyPluginAsync } from 'fastify';
import { TestRun } from '../db/models/TestRun.js';
import { Scenario } from '../db/models/Scenario.js';
import { Agent } from '../db/models/Agent.js';

export const reportRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get<{ Params: { runId: string } }>('/:runId', async (request, reply) => {
    const run = await TestRun.findById(request.params.runId).lean();
    if (!run) return reply.notFound('Run not found');

    const agent = await Agent.findById(run.agentId).lean();
    const scenarios = await Scenario.find({ runId: request.params.runId }).lean();

    const topVulnerabilities = computeTopVulnerabilities(scenarios);

    return {
      run,
      agentName: agent?.name || 'Unknown Agent',
      agentVersion: run.agentVersion,
      reliabilityScore: run.summary?.reliabilityScore || 0,
      riskLevel: run.summary?.riskScore || 'LOW',
      categoryScores: run.categoryScores,
      pressureBreakPoint: run.summary?.pressureBreakPoint,
      topVulnerabilities,
      scenarios,
      regressionDelta: run.regressionDelta,
      generatedAt: new Date(),
    };
  });
};

function computeTopVulnerabilities(scenarios: any[]) {
  const failureCounts = new Map<string, { count: number; severity: string; ids: string[] }>();
  for (const s of scenarios) {
    if (!s.failureType) continue;
    const existing = failureCounts.get(s.failureType);
    if (existing) {
      existing.count++;
      existing.ids.push(s._id.toString());
    } else {
      failureCounts.set(s.failureType, { count: 1, severity: s.failureSeverity, ids: [s._id.toString()] });
    }
  }

  return Array.from(failureCounts.entries())
    .map(([type, data]) => ({ failureType: type, ...data, scenarioIds: data.ids, suggestedFix: '' }))
    .sort((a, b) => {
      const sevOrder = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };
      return (sevOrder[a.severity as keyof typeof sevOrder] || 3) - (sevOrder[b.severity as keyof typeof sevOrder] || 3);
    })
    .slice(0, 5);
}
