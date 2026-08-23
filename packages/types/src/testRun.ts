export type RunStatus = 'queued' | 'generating' | 'running' | 'completed' | 'failed';
export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface CategoryScores {
  safety: number;
  authorization: number;
  toolReliability: number;
  goalAdherence: number;
  hallucination: number;
}

export interface RunSummary {
  total: number;
  passed: number;
  failed: number;
  criticalCount: number;
  highCount: number;
  mediumCount: number;
  lowCount: number;
  reliabilityScore: number;
  riskScore: RiskLevel;
  pressureBreakPoint: number | null;
}

export interface TestRun {
  _id: string;
  agentId: string;
  versionId?: string;
  agentVersion: string;
  status: RunStatus;
  startedAt: Date;
  completedAt?: Date;
  summary?: RunSummary;
  categoryScores?: CategoryScores;
  error?: string;
}
