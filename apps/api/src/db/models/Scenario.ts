import mongoose, { Schema, Document } from 'mongoose';

export interface IScenario extends Document {
  runId: mongoose.Types.ObjectId;
  agentId: mongoose.Types.ObjectId;
  category: string;
  difficulty: string;
  pressureLevel: number;
  input: string;
  expectedBehavior: {
    toolsCalled: string[];
    toolsNotCalled: string[];
    confirmationRequired: boolean;
    goalMet: boolean;
    clarificationRequired: boolean;
  };
  status: 'pending' | 'running' | 'passed' | 'failed' | 'error';
  agentResponse?: string;
  failureType?: string;
  failureSeverity?: string;
  failureExplanation?: string;
  evaluationConfidence?: number;
  suggestedFix?: {
    explanation: string;
    suggestedPromptAddition: string;
    testThatWouldNowPass: string;
  };
  trace: Array<{
    step: number;
    type: string;
    tool?: string;
    input: unknown;
    output: unknown;
    latencyMs: number;
    tokenCost?: number;
    timestamp: Date;
    isAnomaly?: boolean;
    anomalyReason?: string;
  }>;
  latencyMs?: number;
  tokenCost?: number;
  createdAt: Date;
  completedAt?: Date;
}

const ScenarioSchema = new Schema<IScenario>({
  runId: { type: Schema.Types.ObjectId, ref: 'TestRun', required: true },
  agentId: { type: Schema.Types.ObjectId, ref: 'Agent', required: true },
  category: { type: String, required: true },
  difficulty: { type: String, required: true },
  pressureLevel: { type: Number, default: 0 },
  input: { type: String, required: true },
  expectedBehavior: {
    toolsCalled: [String],
    toolsNotCalled: [String],
    confirmationRequired: Boolean,
    goalMet: Boolean,
    clarificationRequired: Boolean,
  },
  status: { type: String, enum: ['pending', 'running', 'passed', 'failed', 'error'], default: 'pending' },
  agentResponse: String,
  failureType: String,
  failureSeverity: String,
  failureExplanation: String,
  evaluationConfidence: Number,
  suggestedFix: {
    explanation: String,
    suggestedPromptAddition: String,
    testThatWouldNowPass: String,
  },
  trace: [{
    step: Number,
    type: String,
    tool: String,
    input: Schema.Types.Mixed,
    output: Schema.Types.Mixed,
    latencyMs: Number,
    tokenCost: Number,
    timestamp: Date,
    isAnomaly: Boolean,
    anomalyReason: String,
  }],
  latencyMs: Number,
  tokenCost: Number,
  completedAt: Date,
}, { timestamps: true });

ScenarioSchema.index({ runId: 1, status: 1 });
ScenarioSchema.index({ agentId: 1, failureType: 1 });

export const Scenario = mongoose.model<IScenario>('Scenario', ScenarioSchema);
