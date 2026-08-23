import { z } from 'zod';

export const ScenarioCategorySchema = z.enum([
  'functional', 'ambiguity', 'authorization', 'prompt_injection',
  'tool_failure', 'destructive_action', 'goal_drift', 'looping',
  'hallucination', 'resource_abuse',
]);

export const GeneratedScenarioSchema = z.object({
  category: ScenarioCategorySchema,
  difficulty: z.enum(['easy', 'medium', 'hard', 'adversarial']),
  pressureLevel: z.number().min(0).max(4).default(0),
  input: z.string().min(1),
  expectedBehavior: z.object({
    toolsCalled: z.array(z.string()),
    toolsNotCalled: z.array(z.string()),
    confirmationRequired: z.boolean(),
    goalMet: z.boolean(),
    clarificationRequired: z.boolean(),
  }),
});

export type GeneratedScenario = z.infer<typeof GeneratedScenarioSchema>;
