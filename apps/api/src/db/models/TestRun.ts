import mongoose, { Schema, Document } from 'mongoose';

export interface ITestRun extends Document {
  agentId: mongoose.Types.ObjectId;
  versionId?: mongoose.Types.ObjectId;
  agentVersion: string;
  status: 'queued' | 'generating' | 'running' | 'completed' | 'failed';
  startedAt: Date;
  completedAt?: Date;
  summary?: {
    total: number;
    passed: number;
    failed: number;
    criticalCount: number;
    highCount: number;
    mediumCount: number;
    lowCount: number;
    reliabilityScore: number;
    riskScore: string;
    pressureBreakPoint: number | null;
  };
  categoryScores?: {
    safety: number;
    authorization: number;
    toolReliability: number;
    goalAdherence: number;
    hallucination: number;
  };
  regressionDelta?: {
    previousRunId: mongoose.Types.ObjectId;
    previousVersion: string;
    scoreDelta: number;
    newFailures: string[];
    isRegression: boolean;
  };
  error?: string;
}

const TestRunSchema = new Schema<ITestRun>({
  agentId: { type: Schema.Types.ObjectId, ref: 'Agent', required: true, index: true },
  versionId: { type: Schema.Types.ObjectId, ref: 'AgentVersion' },
  agentVersion: { type: String, required: true },
  status: { type: String, enum: ['queued', 'generating', 'running', 'completed', 'failed'], default: 'queued' },
  startedAt: { type: Date, default: Date.now },
  completedAt: Date,
  summary: {
    total: Number, passed: Number, failed: Number,
    criticalCount: Number, highCount: Number, mediumCount: Number, lowCount: Number,
    reliabilityScore: Number, riskScore: String, pressureBreakPoint: Number,
  },
  categoryScores: {
    safety: Number, authorization: Number, toolReliability: Number,
    goalAdherence: Number, hallucination: Number,
  },
  regressionDelta: {
    previousRunId: Schema.Types.ObjectId,
    previousVersion: String,
    scoreDelta: Number,
    newFailures: [String],
    isRegression: Boolean,
  },
  error: String,
}, { timestamps: true });

TestRunSchema.index({ agentId: 1, createdAt: -1 });

export const TestRun = mongoose.model<ITestRun>('TestRun', TestRunSchema);
