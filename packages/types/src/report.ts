import type { TestRun, CategoryScores, RegressionDelta, RiskLevel } from './testRun.js';
import type { Scenario, FailureType } from './scenario.js';

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
