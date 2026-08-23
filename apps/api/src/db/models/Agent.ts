import mongoose, { Schema, Document } from 'mongoose';

export interface IAgent extends Document {
  userId: string;
  name: string;
  description: string;
  endpoint: string;
  systemPrompt: string;
  tools: Array<{
    name: string;
    description: string;
    endpoint: string;
    method: string;
    isDestructive: boolean;
    isSensitive: boolean;
    mockResponse?: Record<string, unknown>;
  }>;
  domain: string;
  currentVersion: string;
  apiKey: string;
  createdAt: Date;
  updatedAt: Date;
}

const AgentSchema = new Schema<IAgent>({
  userId: { type: String, required: true, index: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  endpoint: { type: String, required: true },
  systemPrompt: { type: String, required: true },
  tools: [{
    name: String,
    description: String,
    endpoint: String,
    method: { type: String, default: 'POST' },
    isDestructive: { type: Boolean, default: false },
    isSensitive: { type: Boolean, default: false },
    mockResponse: { type: Schema.Types.Mixed },
  }],
  domain: { type: String, required: true },
  currentVersion: { type: String, default: 'v1.0' },
  apiKey: { type: String, required: true, unique: true },
}, { timestamps: true });

export const Agent = mongoose.model<IAgent>('Agent', AgentSchema);
