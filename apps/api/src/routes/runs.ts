import type { FastifyPluginAsync } from 'fastify';
import { Queue } from 'bullmq';
import { TestRun } from '../db/models/TestRun.js';
import { Scenario } from '../db/models/Scenario.js';
import { Agent } from '../db/models/Agent.js';
import { StartRunSchema } from '@agentguard/schemas';
import { getRedisConnection } from '../queue/redis.js';

export const runRoutes: FastifyPluginAsync = async (fastify) => {
  // Start a new test run
  fastify.post('/', async (request, reply) => {
    const data = StartRunSchema.parse(request.body);
    const agent = await Agent.findById(data.agentId);
    if (!agent) return reply.notFound('Agent not found');

    const run = await TestRun.create({
      agentId: agent._id,
      agentVersion: agent.currentVersion,
      status: 'queued',
      startedAt: new Date(),
    });

    const queue = new Queue('test-execution', { connection: getRedisConnection() });
    await queue.add('run', { runId: run._id.toString(), agentId: data.agentId, sandboxMode: data.sandboxMode });

    return reply.code(201).send({
      runId: run._id.toString(),
      status: 'queued',
      streamUrl: `/api/runs/${run._id}/stream`,
    });
  });

  // Get run status
  fastify.get<{ Params: { id: string } }>('/:id', async (request, reply) => {
    const run = await TestRun.findById(request.params.id).lean();
    if (!run) return reply.notFound('Run not found');
    return run;
  });

  // Get runs for an agent
  fastify.get('/agent/:agentId', async (request: any) => {
    return TestRun.find({ agentId: request.params.agentId }).sort({ startedAt: -1 }).limit(20).lean();
  });

  // SSE stream for live progress
  fastify.get<{ Params: { id: string } }>('/:id/stream', async (request, reply) => {
    reply.raw.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
    });

    const { createClient } = await import('redis');
    const subscriber = createClient({ url: process.env.REDIS_URL });
    await subscriber.connect();

    const channel = `run:${request.params.id}:progress`;
    await subscriber.subscribe(channel, (message) => {
      reply.raw.write(`data: ${message}\n\n`);
    });

    request.raw.on('close', async () => {
      await subscriber.unsubscribe(channel);
      await subscriber.disconnect();
    });
  });

  // Get scenarios for a run
  fastify.get<{ Params: { id: string } }>('/:id/scenarios', async (request, reply) => {
    const scenarios = await Scenario.find({ runId: request.params.id }).lean();
    return scenarios;
  });
};
