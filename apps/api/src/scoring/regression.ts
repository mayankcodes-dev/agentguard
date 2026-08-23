import { TestRun } from '../db/models/TestRun.js';
import type { IScenario } from '../db/models/Scenario.js';

export async function computeRegression(
  agentId: string,
  currentRunId: string,
  currentScore: number,
  currentScenarios: IScenario[]
) {
  // Find the most recently completed run for this agent (excluding current)
  const previousRun = await TestRun.findOne({
    agentId,
    _id: { $ne: currentRunId },
    status: 'completed',
  }).sort({ completedAt: -1 }).lean();

  if (!previousRun || !previousRun.summary) return null;

  const scoreDelta = currentScore - previousRun.summary.reliabilityScore;

  // Find failure types that appear in current run but not in previous
  const previousFailureTypes = new Set(
    (previousRun as any).failureTypes || []
  );

  const newFailures = currentScenarios
    .filter(s => s.failureType && !previousFailureTypes.has(s.failureType))
    .map(s => s._id.toString());

  const isRegression = scoreDelta < -5 || newFailures.length > 0;

  return {
    previousRunId: previousRun._id,
    previousVersion: previousRun.agentVersion,
    scoreDelta: Math.round(scoreDelta),
    newFailures,
    isRegression,
  };
}
