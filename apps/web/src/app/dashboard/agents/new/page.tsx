'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

type Tool = { id: string; name: string; description: string; endpoint: string; isDestructive: boolean };

const STEPS = ['Basic Info', 'System Prompt', 'Tools'];

export default function NewAgentPage() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name: '', description: '', endpoint: '', domain: 'general', systemPrompt: '' });
  const [tools, setTools] = useState<Tool[]>([{ id: '1', name: '', description: '', endpoint: '', isDestructive: false }]);

  const addTool = () => setTools(p => [...p, { id: Date.now().toString(), name: '', description: '', endpoint: '', isDestructive: false }]);
  const removeTool = (id: string) => setTools(p => p.filter(t => t.id !== id));
  const setTool = (id: string, field: keyof Tool, value: string | boolean) =>
    setTools(p => p.map(t => t.id === id ? { ...t, [field]: value } : t));

  const inputClass = 'w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition';

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Register Agent</h1>
        <p className="text-slate-500 text-sm mt-1">Connect your AI agent to AgentGuard for testing</p>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-8">
        {STEPS.map((label, i) => (
          <div key={label} className="flex items-center gap-2">
            <div className={`flex items-center gap-2 ${i + 1 === step ? 'text-green-600 dark:text-green-400' : i + 1 < step ? 'text-slate-400' : 'text-slate-300 dark:text-slate-600'}`}>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 ${
                i + 1 === step ? 'border-green-500 bg-green-500 text-white' :
                i + 1 < step ? 'border-slate-400 bg-slate-400 text-white' :
                'border-slate-300 dark:border-slate-700 text-slate-400'}`}>
                {i + 1 < step ? '✓' : i + 1}
              </div>
              <span className="text-sm font-medium hidden sm:block">{label}</span>
            </div>
            {i < STEPS.length - 1 && <span className="text-slate-300 dark:text-slate-700 mx-1">›</span>}
          </div>
        ))}
      </div>

      {/* Step 1 */}
      {step === 1 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
          {[
            { f: 'name', l: 'Agent Name', p: 'e.g. CustomerSupportBot' },
            { f: 'description', l: 'Description', p: 'What does this agent do?' },
            { f: 'endpoint', l: 'Agent Endpoint URL', p: 'https://your-agent.com/chat' },
          ].map(({ f, l, p }) => (
            <div key={f}>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">{l}</label>
              <input value={form[f as keyof typeof form]} onChange={e => setForm(prev => ({ ...prev, [f]: e.target.value }))}
                placeholder={p} className={inputClass} />
            </div>
          ))}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Domain</label>
            <select value={form.domain} onChange={e => setForm(p => ({ ...p, domain: e.target.value }))}
              className={inputClass}>
              {['general', 'customer_support', 'banking', 'coding', 'ecommerce', 'healthcare'].map(d => (
                <option key={d} value={d}>{d.replace('_', ' ')}</option>
              ))}
            </select>
          </div>
          <button onClick={() => setStep(2)} className="w-full py-2.5 bg-green-500 hover:bg-green-400 text-black font-semibold rounded-lg transition-colors">
            Continue →
          </button>
        </motion.div>
      )}

      {/* Step 2 */}
      {step === 2 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">System Prompt</label>
            <p className="text-xs text-slate-500 mb-2">Paste your agent's full system prompt. AgentGuard uses this to generate targeted adversarial scenarios.</p>
            <textarea value={form.systemPrompt} onChange={e => setForm(p => ({ ...p, systemPrompt: e.target.value }))}
              rows={12} placeholder="You are a helpful customer support agent for Acme Store. You have access to the following tools..."
              className={`${inputClass} font-mono resize-none`} />
          </div>
          <div className="flex gap-3">
            <button onClick={() => setStep(1)} className="flex-1 py-2.5 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
              ← Back
            </button>
            <button onClick={() => setStep(3)} className="flex-1 py-2.5 bg-green-500 hover:bg-green-400 text-black font-semibold rounded-lg transition-colors">
              Continue →
            </button>
          </div>
        </motion.div>
      )}

      {/* Step 3 */}
      {step === 3 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
          <div className="space-y-4">
            {tools.map((tool, i) => (
              <div key={tool.id} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500">Tool {i + 1}</span>
                  {tools.length > 1 && (
                    <button onClick={() => removeTool(tool.id)} className="text-slate-400 hover:text-red-500 text-xs transition-colors">Remove</button>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <input value={tool.name} onChange={e => setTool(tool.id, 'name', e.target.value)}
                    placeholder="Tool name (e.g. getOrder)"
                    className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500" />
                  <input value={tool.endpoint} onChange={e => setTool(tool.id, 'endpoint', e.target.value)}
                    placeholder="Endpoint (e.g. /tools/get-order)"
                    className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500" />
                </div>
                <input value={tool.description} onChange={e => setTool(tool.id, 'description', e.target.value)}
                  placeholder="Tool description — what does it do?"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500" />
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={tool.isDestructive} onChange={e => setTool(tool.id, 'isDestructive', e.target.checked)}
                    className="w-4 h-4 rounded text-red-500" />
                  <span className="text-sm text-slate-700 dark:text-slate-300">⚠ This tool performs irreversible actions (delete, transfer, etc.)</span>
                </label>
              </div>
            ))}
            <button onClick={addTool}
              className="w-full py-2.5 border border-dashed border-slate-300 dark:border-slate-700 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 rounded-xl text-sm transition-colors">
              + Add another tool
            </button>
          </div>

          <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 text-sm text-blue-700 dark:text-blue-300">
            💡 AgentGuard will generate extra scenarios for tools marked as destructive — testing all 5 pressure levels.
          </div>

          <div className="flex gap-3">
            <button onClick={() => setStep(2)} className="flex-1 py-2.5 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
              ← Back
            </button>
            <button
              onClick={() => alert('In production: POST /api/agents — then redirects to the run detail page.')}
              className="flex-1 py-2.5 bg-green-500 hover:bg-green-400 text-black font-semibold rounded-lg transition-colors">
              🛡 Register Agent
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
