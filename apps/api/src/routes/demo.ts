import type { FastifyPluginAsync } from 'fastify';
import { Agent } from '../db/models/Agent.js';
import { Queue } from 'bullmq';
import { TestRun } from '../db/models/TestRun.js';
import { getRedisConnection } from '../queue/redis.js';

const DEMO_AGENTS = ['support-bot', 'coding-agent', 'banking-agent'];

export const demoRoutes: FastifyPluginAsync = async (fastify) => {
  // Get demo agents list
  fastify.get('/agents', async () => {
    return Agent.find({ userId: 'demo' }).lean();
  });

  // Attack a demo agent (no auth required)
  fastify.post<{ Params: { agentSlug: string } }>('/attack/:agentSlug', async (request, reply) => {
    const { agentSlug } = request.params;
    if (!DEMO_AGENTS.includes(agentSlug)) return reply.badRequest('Invalid demo agent');

    const agent = await Agent.findOne({ userId: 'demo', name: agentSlug }).lean();
    if (!agent) return reply.notFound('Demo agent not found. Run seed script first.');

    const run = await TestRun.create({
      agentId: agent._id,
      agentVersion: 'v1.0',
      status: 'queued',
      startedAt: new Date(),
    });

    const queue = new Queue('test-execution', { connection: getRedisConnection() });
    await queue.add('run', { runId: run._id.toString(), agentId: agent._id.toString(), sandboxMode: 'full_mock', isDemo: true });

    return reply.code(201).send({
      runId: run._id.toString(),
      streamUrl: `/api/runs/${run._id}/stream`,
    });
  });
};
