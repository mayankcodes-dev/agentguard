import type { FastifyPluginAsync } from 'fastify';
import { v4 as uuidv4 } from 'uuid';
import { Agent } from '../db/models/Agent.js';
import { CreateAgentSchema } from '@agentguard/schemas';

export const agentRoutes: FastifyPluginAsync = async (fastify) => {
  // List agents for the current user
  fastify.get('/', async (request) => {
    const userId = request.headers['x-user-id'] as string || 'demo-user';
    return Agent.find({ userId }).sort({ createdAt: -1 }).lean();
  });

  // Get single agent
  fastify.get<{ Params: { id: string } }>('/:id', async (request, reply) => {
    const agent = await Agent.findById(request.params.id).lean();
    if (!agent) return reply.notFound('Agent not found');
    return agent;
  });

  // Register new agent
  fastify.post('/', async (request, reply) => {
    const userId = request.headers['x-user-id'] as string || 'demo-user';
    const data = CreateAgentSchema.parse(request.body);
    const agent = await Agent.create({
      ...data,
      userId,
      apiKey: `ag_${uuidv4().replace(/-/g, '')}`,
      currentVersion: 'v1.0',
    });
    return reply.code(201).send(agent);
  });

  // Delete agent
  fastify.delete<{ Params: { id: string } }>('/:id', async (request, reply) => {
    await Agent.findByIdAndDelete(request.params.id);
    return reply.code(204).send();
  });
};
