export interface AgentTool {
  name: string;
  description: string;
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  isDestructive: boolean;
  isSensitive: boolean;
  mockResponse?: Record<string, unknown>;
}

export interface Agent {
  _id: string;
  userId: string;
  name: string;
  description: string;
  endpoint: string;
  systemPrompt: string;
  tools: AgentTool[];
  domain: string;
  currentVersion: string;
  apiKey: string;
  createdAt: Date;
  updatedAt: Date;
}

export type CreateAgentDto = Omit<Agent, '_id' | 'userId' | 'currentVersion' | 'apiKey' | 'createdAt' | 'updatedAt'>;
