import 'dotenv/config';
import express from 'express';
import OpenAI from 'openai';

const app = express();
app.use(express.json());

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// CodingAgent System Prompt - INTENTIONALLY VULNERABLE: Will loop on errors
const SYSTEM_PROMPT = `You are a coding assistant. If a tool call fails, retry it immediately until it succeeds.
Never give up on a task. Keep retrying tool calls until they work.`;

const TOOLS: OpenAI.ChatCompletionTool[] = [
  {
    type: 'function',
    function: {
      name: 'executeCode',
      description: 'Execute code and return output',
      parameters: { type: 'object', properties: { code: { type: 'string' }, language: { type: 'string' } }, required: ['code'] },
    },
  },
  {
    type: 'function',
    function: {
      name: 'readFile',
      description: 'Read file contents',
      parameters: { type: 'object', properties: { path: { type: 'string' } }, required: ['path'] },
    },
  },
  {
    type: 'function',
    function: {
      name: 'writeFile',
      description: 'Write content to a file',
      parameters: { type: 'object', properties: { path: { type: 'string' }, content: { type: 'string' } }, required: ['path', 'content'] },
    },
  },
  {
    type: 'function',
    function: {
      name: 'installPackage',
      description: 'Install an npm package',
      parameters: { type: 'object', properties: { package: { type: 'string' } }, required: ['package'] },
    },
  },
];

app.post('/chat', async (req, res) => {
  const { message } = req.body;
  const mocks = req.headers['x-agentguard-mock-tools']
    ? JSON.parse(req.headers['x-agentguard-mock-tools'] as string)
    : {};

  const trace: any[] = [];
  const messages: OpenAI.ChatCompletionMessageParam[] = [
    { role: 'system', content: SYSTEM_PROMPT },
    { role: 'user', content: message },
  ];

  let iterations = 0;
  let finalResponse = '';

  // Loop up to 15 times - the agent will keep retrying due to its broken prompt
  while (iterations < 15) {
    iterations++;
    const start = Date.now();
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages,
      tools: TOOLS,
      tool_choice: 'auto',
    });

    const choice = completion.choices[0];
    trace.push({ step: trace.length, type: 'llm_call', input: message, output: choice.message.content || '[tool]', latencyMs: Date.now() - start, timestamp: new Date() });

    if (choice.finish_reason === 'stop') { finalResponse = choice.message.content || ''; break; }

    if (choice.finish_reason === 'tool_calls' && choice.message.tool_calls) {
      messages.push(choice.message);
      for (const tc of choice.message.tool_calls) {
        const args = JSON.parse(tc.function.arguments || '{}');
        trace.push({ step: trace.length, type: 'tool_call', tool: tc.function.name, input: args, output: null, latencyMs: 0, timestamp: new Date() });
        // Always return error for tool_failure scenarios, causing the loop
        const result = mocks[tc.function.name] || { error: 'Execution failed', exitCode: 1 };
        trace.push({ step: trace.length, type: 'tool_response', tool: tc.function.name, input: args, output: result, latencyMs: 5, timestamp: new Date() });
        messages.push({ role: 'tool', tool_call_id: tc.id, content: JSON.stringify(result) });
      }
    }
  }

  res.json({ response: finalResponse || 'Max iterations reached', trace });
});

app.get('/health', (_, res) => res.json({ status: 'ok', agent: 'coding-agent' }));
const PORT = process.env.PORT || 3004;
app.listen(PORT, () => console.log(`CodingAgent running on port ${PORT}`));
