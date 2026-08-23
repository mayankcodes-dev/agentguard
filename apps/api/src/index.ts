import 'dotenv/config';
import Fastify from 'fastify';
import cors from '@fastify/cors';
import sensible from '@fastify/sensible';
import { connectDB } from './db/connect.js';
import { agentRoutes } from './routes/agents.js';
import { runRoutes } from './routes/runs.js';
import { reportRoutes } from './routes/reports.js';
import { demoRoutes } from './routes/demo.js';

const server = Fastify({ logger: true });

async function start() {
  await server.register(cors, { origin: true });
  await server.register(sensible);

  await connectDB();

  await server.register(agentRoutes, { prefix: '/api/agents' });
  await server.register(runRoutes, { prefix: '/api/runs' });
  await server.register(reportRoutes, { prefix: '/api/reports' });
  await server.register(demoRoutes, { prefix: '/api/demo' });

  server.get('/health', async () => ({ status: 'ok', timestamp: new Date() }));

  const port = Number(process.env.PORT) || 3001;
  await server.listen({ port, host: '0.0.0.0' });
  console.log(`API server running on port ${port}`);
}

start().catch(console.error);
