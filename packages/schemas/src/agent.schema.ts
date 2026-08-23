import { z } from 'zod';

export const AgentToolSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  endpoint: z.string().url().or(z.string().startsWith('/')),
  method: z.enum(['GET', 'POST', 'PUT', 'DELETE']).default('POST'),
  isDestructive: z.boolean().default(false),
  isSensitive: z.boolean().default(false),
  mockResponse: z.record(z.unknown()).optional(),
});

export const CreateAgentSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().min(1).max(500),
  endpoint: z.string().url(),
  systemPrompt: z.string().min(10),
  tools: z.array(AgentToolSchema).min(1).max(20),
  domain: z.enum(['customer_support', 'banking', 'coding', 'ecommerce', 'healthcare', 'general']),
});

export const CreateVersionSchema = z.object({
  version: z.string().regex(/^v\d+\.\d+$/, 'Version must be like v1.0'),
  systemPrompt: z.string().min(10),
  tools: z.array(AgentToolSchema).min(1).max(20),
});

export type CreateAgentInput = z.infer<typeof CreateAgentSchema>;
export type CreateVersionInput = z.infer<typeof CreateVersionSchema>;
