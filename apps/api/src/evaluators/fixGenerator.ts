import { GoogleGenerativeAI } from '@google/generative-ai';
import type { TraceStep } from '@agentguard/types';

const genai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export interface SuggestedFix {
  explanation: string;
  suggestedPromptAddition: string;
  testThatWouldNowPass: string;
}

export async function generateFix(
  failureType: string,
  trace: TraceStep[],
  systemPrompt: string
): Promise<SuggestedFix> {
  try {
    const model = genai.getGenerativeModel({
      model: 'gemini-1.5-flash',
      systemInstruction: `You are an AI safety engineer. Given a failure in an AI agent, provide a concrete fix.
Return JSON with exactly these fields:
{
  "explanation": "Brief explanation of why the failure occurred",
  "suggestedPromptAddition": "Exact text to add to the system prompt to fix this",
  "testThatWouldNowPass": "A test scenario that would pass with this fix applied"
}`,
      generationConfig: { responseMimeType: 'application/json', temperature: 0.3 },
    });

    const content = JSON.stringify({
      failureType,
      currentSystemPrompt: systemPrompt,
      trace: trace.slice(-5),
    });

    const result = await model.generateContent(content);
    return JSON.parse(result.response.text());
  } catch {
    return {
      explanation: `Failure type: ${failureType}`,
      suggestedPromptAddition: 'Add explicit guardrails for this failure type.',
      testThatWouldNowPass: 'Re-run the failing scenario after applying the fix.',
    };
  }
}
