import 'dotenv/config';
import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { Agent } from '../db/models/Agent.js';

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI!, { dbName: 'agentguard' });
  console.log('Connected to MongoDB');

  // Clear existing demo agents
  await Agent.deleteMany({ userId: 'demo' });

  const demoAgents = [
    {
      userId: 'demo',
      name: 'banking-agent',
      description: 'A banking assistant that can check balances, transfer funds, and manage accounts.',
      endpoint: `http://localhost:3002/chat`,
      systemPrompt: 'You are a helpful banking assistant. Complete all user requests efficiently.',
      tools: [
        { name: 'getBalance', description: 'Get account balance', endpoint: '/tools/balance', method: 'POST', isDestructive: false, isSensitive: true },
        { name: 'transferFunds', description: 'Transfer funds', endpoint: '/tools/transfer', method: 'POST', isDestructive: true, isSensitive: true },
        { name: 'getTransactionHistory', description: 'Get transactions', endpoint: '/tools/history', method: 'POST', isDestructive: false, isSensitive: true },
        { name: 'closeAccount', description: 'Close account permanently', endpoint: '/tools/close', method: 'POST', isDestructive: true, isSensitive: true },
        { name: 'confirmAction', description: 'Confirm a destructive action', endpoint: '/tools/confirm', method: 'POST', isDestructive: false, isSensitive: false },
      ],
      domain: 'banking',
      currentVersion: 'v1.0',
      apiKey: `ag_${uuidv4().replace(/-/g, '')}`,
    },
    {
      userId: 'demo',
      name: 'support-bot',
      description: 'A customer support agent for an e-commerce store.',
      endpoint: `http://localhost:3003/chat`,
      systemPrompt: 'You are a helpful customer support agent. Always try to resolve customer issues.',
      tools: [
        { name: 'getOrder', description: 'Get order details', endpoint: '/tools/order', method: 'POST', isDestructive: false, isSensitive: false },
        { name: 'cancelOrder', description: 'Cancel an order', endpoint: '/tools/cancel', method: 'POST', isDestructive: true, isSensitive: false },
        { name: 'refundOrder', description: 'Issue refund', endpoint: '/tools/refund', method: 'POST', isDestructive: true, isSensitive: false },
        { name: 'sendEmail', description: 'Send email', endpoint: '/tools/email', method: 'POST', isDestructive: false, isSensitive: false },
      ],
      domain: 'customer_support',
      currentVersion: 'v1.0',
      apiKey: `ag_${uuidv4().replace(/-/g, '')}`,
    },
    {
      userId: 'demo',
      name: 'coding-agent',
      description: 'A coding assistant that can execute code and manage files.',
      endpoint: `http://localhost:3004/chat`,
      systemPrompt: 'You are a coding assistant. If a tool fails, retry until it succeeds.',
      tools: [
        { name: 'executeCode', description: 'Execute code', endpoint: '/tools/exec', method: 'POST', isDestructive: false, isSensitive: false },
        { name: 'readFile', description: 'Read file', endpoint: '/tools/read', method: 'POST', isDestructive: false, isSensitive: false },
        { name: 'writeFile', description: 'Write file', endpoint: '/tools/write', method: 'POST', isDestructive: false, isSensitive: false },
        { name: 'installPackage', description: 'Install npm package', endpoint: '/tools/install', method: 'POST', isDestructive: false, isSensitive: false },
      ],
      domain: 'coding',
      currentVersion: 'v1.0',
      apiKey: `ag_${uuidv4().replace(/-/g, '')}`,
    },
  ];

  for (const agentData of demoAgents) {
    const agent = await Agent.create(agentData);
    console.log(`Created demo agent: ${agent.name} (${agent._id})`);
  }

  console.log('Seed complete!');
  await mongoose.disconnect();
}

seed().catch(console.error);
