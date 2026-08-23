export type TraceStepType = 'llm_call' | 'tool_call' | 'tool_response' | 'agent_response' | 'error';

export interface TraceStep {
  step: number;
  type: TraceStepType;
  tool?: string;
  input: unknown;
  output: unknown;
  latencyMs: number;
  tokenCost?: number;
  timestamp: Date;
  isAnomaly?: boolean;
  anomalyReason?: string;
}
