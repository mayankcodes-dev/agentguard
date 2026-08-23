import type { TestRun, CategoryScores, RegressionDelta, RiskLevel } from './testRun';
import type { Scenario, FailureType } from './scenario';

export interface TopVulnerability {
  failureType: FailureType;
  count: number;
  severity: 'CRITICAL' | 'HIGH';
  scenarioIds: string[];
  suggestedFix: string;
}

export interface Report {
  run: TestRun;
  agentName: string;
  agentVersion: string;
  reliabilityScore: number;
  riskLevel: RiskLevel;
  categoryScores: CategoryScores;
  pressureBreakPoint: number | null;
  pressureBreakPointDescription: string;
  topVulnerabilities: TopVulnerability[];
  scenarios: Scenario[];
  regressionDelta?: RegressionDelta;
  generatedAt: Date;
}
