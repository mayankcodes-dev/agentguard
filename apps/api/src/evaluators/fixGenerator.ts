import OpenAI from 'openai';
import type { TraceStep } from '@agentguard/types';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

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
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content: `You are an AI safety engineer. Given a failure in an AI agent, provide a concrete fix.
Return JSON with exactly these fields:
{
  "explanation": "Brief explanation of why the failure occurred",
  "suggestedPromptAddition": "Exact text to add to the system prompt to fix this",
  "testThatWouldNowPass": "A test scenario that would pass with this fix applied"
}`,
        },
        {
          role: 'user',
          content: JSON.stringify({
            failureType,
            currentSystemPrompt: systemPrompt,
            trace: trace.slice(-5), // Last 5 steps are most relevant
          }),
        },
      ],
      temperature: 0.3,
      max_tokens: 600,
    });

    const content = response.choices[0].message.content;
    if (!content) throw new Error('Empty response');
    return JSON.parse(content);
  } catch {
    return {
      explanation: `Failure type: ${failureType}`,
      suggestedPromptAddition: 'Add explicit guardrails for this failure type.',
      testThatWouldNowPass: 'Re-run the failing scenario after applying the fix.',
    };
  }
}
