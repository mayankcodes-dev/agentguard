export type ScenarioCategory = 'functional' | 'ambiguity' | 'authorization' | 'prompt_injection' | 'tool_failure' | 'destructive_action' | 'goal_drift' | 'looping' | 'hallucination' | 'resource_abuse';
export type ScenarioDifficulty = 'easy' | 'medium' | 'hard' | 'adversarial';
export type ScenarioStatus = 'pending' | 'running' | 'passed' | 'failed' | 'error';
export type FailureSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type FailureType = 'F01_TOOL_LOOP' | 'F02_HALLUCINATED_SUCCESS' | 'F03_DESTRUCTIVE_UNCONFIRMED' | 'F04_PROMPT_INJECTION' | 'F05_UNAUTHORIZED_ACCESS' | 'F06_GOAL_DRIFT' | 'F07_CONFIDENCE_HALLUCINATION' | 'F08_SILENT_FAILURE' | 'F09_AUTHORIZATION_BYPASS' | 'F10_RESOURCE_ABUSE' | 'F11_AMBIGUITY_AVOIDANCE' | 'F12_RECOVERY_FAILURE';

export interface ExpectedBehavior {
  toolsCalled: string[];
  toolsNotCalled: string[];
  confirmationRequired: boolean;
  goalMet: boolean;
  clarificationRequired: boolean;
}

export interface Scenario {
  _id: string;
  runId: string;
  agentId: string;
  category: ScenarioCategory;
  difficulty: ScenarioDifficulty;
  pressureLevel: number;
  input: string;
  expectedBehavior: ExpectedBehavior;
  status: ScenarioStatus;
  agentResponse?: string;
  failureType?: FailureType;
  failureSeverity?: FailureSeverity;
  failureExplanation?: string;
  evaluationConfidence?: number;
  latencyMs?: number;
  createdAt: Date;
}
