import http from 'http';
import httpProxy from 'http-proxy';
import type { IAgent } from '../db/models/Agent.js';
import type { IScenario } from '../db/models/Scenario.js';
import type { TraceStep } from '@agentguard/types';

export type SandboxMode = 'full_mock' | 'fault_injection' | 'passthrough';

export interface RunScenarioResult {
  passed: boolean;
  agentResponse: string;
  failureType?: string;
  failureSeverity?: string;
  failureExplanation?: string;
  confidence?: number;
  suggestedFix?: {
    explanation: string;
    suggestedPromptAddition: string;
    testThatWouldNowPass: string;
  };
  trace: TraceStep[];
  latencyMs: number;
}

export async function runScenario(
  scenario: IScenario,
  agent: IAgent,
  sandboxMode: SandboxMode = 'full_mock'
): Promise<RunScenarioResult> {
  const startTime = Date.now();
  const trace: TraceStep[] = [];
  let stepIndex = 0;

  // Build mock tool responses for this scenario
  const mockToolResponses = buildMockResponses(scenario, agent);

  // If the agent has a real endpoint, send the request through the sandbox proxy
  // For demo agents, we simulate the entire interaction deterministically
  let agentResponse = '';

  try {
    // Send message to agent
    const agentCallStart = Date.now();

    const response = await fetch(agent.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-AgentGuard-Run-ID': scenario.runId.toString(),
        'X-AgentGuard-Sandbox': sandboxMode,
        'X-AgentGuard-Mock-Tools': JSON.stringify(mockToolResponses),
      },
      body: JSON.stringify({ message: scenario.input }),
      signal: AbortSignal.timeout(30000),
    });

    const responseData = await response.json() as { response?: string; message?: string; toolCalls?: any[]; trace?: TraceStep[] };
    agentResponse = responseData.response || responseData.message || '';

    // Collect trace from agent response headers or body
    if (responseData.trace) {
      trace.push(...responseData.trace);
    }

    trace.push({
      step: stepIndex++,
      type: 'agent_response',
      input: scenario.input,
      output: agentResponse,
      latencyMs: Date.now() - agentCallStart,
      timestamp: new Date(),
    });

  } catch (error) {
    agentResponse = '';
    trace.push({
      step: stepIndex++,
      type: 'error',
      input: scenario.input,
      output: error instanceof Error ? error.message : 'Unknown error',
      latencyMs: Date.now() - startTime,
      timestamp: new Date(),
    });
  }

  const latencyMs = Date.now() - startTime;

  // Run failure classifiers
  const { classifyFailures } = await import('../evaluators/deterministic.js');
  const { evaluateSemantics } = await import('../evaluators/semantic.js');

  const deterministicResult = classifyFailures(trace, scenario, agentResponse);
  let semanticResult = null;

  if (!deterministicResult.failureType) {
    semanticResult = await evaluateSemantics(scenario, trace, agentResponse);
  }

  const failureType = deterministicResult.failureType || semanticResult?.failureType;
  const failureSeverity = deterministicResult.failureSeverity || semanticResult?.failureSeverity;
  const passed = !failureType;

  let suggestedFix = undefined;
  if (failureType && (failureSeverity === 'CRITICAL' || failureSeverity === 'HIGH')) {
    const { generateFix } = await import('../evaluators/fixGenerator.js');
    suggestedFix = await generateFix(failureType, trace, agent.systemPrompt);
  }

  return {
    passed,
    agentResponse,
    failureType,
    failureSeverity,
    failureExplanation: deterministicResult.explanation || semanticResult?.explanation,
    confidence: deterministicResult.confidence || semanticResult?.confidence,
    suggestedFix,
    trace,
    latencyMs,
  };
}

function buildMockResponses(scenario: IScenario, agent: IAgent): Record<string, unknown> {
  const mocks: Record<string, unknown> = {};

  for (const tool of agent.tools) {
    if (tool.mockResponse) {
      mocks[tool.name] = tool.mockResponse;
      continue;
    }

    // Inject fault for tool_failure scenarios
    if (scenario.category === 'tool_failure') {
      mocks[tool.name] = { error: 'Internal Server Error', status: 500 };
      continue;
    }

    // Default successful mock responses
    mocks[tool.name] = getDefaultMock(tool.name);
  }

  return mocks;
}

function getDefaultMock(toolName: string): unknown {
  const defaults: Record<string, unknown> = {
    getOrder: { orderId: '123', status: 'delivered', amount: 49.99 },
    cancelOrder: { success: true, message: 'Order cancelled' },
    refundOrder: { success: true, refundAmount: 49.99 },
    sendEmail: { success: true, messageId: 'msg_123' },
    getBalance: { balance: 1250.00, currency: 'USD' },
    transferFunds: { success: true, txId: 'tx_9821', amount: 500 },
    getTransactionHistory: { transactions: [{ id: 'tx_1', amount: 100, date: '2024-01-01' }] },
    closeAccount: { success: true, message: 'Account closed' },
    confirmAction: { confirmed: true },
    executeCode: { output: 'Hello World', exitCode: 0 },
    readFile: { content: '# README\nThis is a file.' },
    writeFile: { success: true },
    installPackage: { success: true, package: 'lodash@4.17.21' },
  };

  return defaults[toolName] || { success: true };
}
