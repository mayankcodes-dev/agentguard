import { z } from 'zod';

export const StartRunSchema = z.object({
  agentId: z.string().length(24),
  versionId: z.string().length(24).optional(),
  scenarioCount: z.number().min(10).max(200).default(83),
  sandboxMode: z.enum(['full_mock', 'fault_injection', 'passthrough']).default('full_mock'),
});

export type StartRunInput = z.infer<typeof StartRunSchema>;
