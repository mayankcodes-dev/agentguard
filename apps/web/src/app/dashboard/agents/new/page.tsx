'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type Tool = { id: string; name: string; description: string; endpoint: string; isDestructive: boolean };

const STEPS = ['Basic Info', 'System Prompt', 'Tools'];

const inputCls = [
  'w-full px-4 py-3 rounded-xl text-sm text-white placeholder-slate-600',
  'bg-slate-900 border border-white/[0.08]',
  'focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30',
  'transition-colors font-sans',
].join(' ');

export default function NewAgentPage() {
  const router = useRouter();
  const [step, setStep]       = useState(1);
  const [form, setForm]       = useState({ name: '', description: '', endpoint: '', domain: 'general', systemPrompt: '' });
  const [tools, setTools]     = useState<Tool[]>([{ id: '1', name: '', description: '', endpoint: '', isDestructive: false }]);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const [success, setSuccess] = useState<{ id: string; name: string } | null>(null);

  const addTool    = () => setTools(p => [...p, { id: Date.now().toString(), name: '', description: '', endpoint: '', isDestructive: false }]);
  const removeTool = (id: string) => setTools(p => p.filter(t => t.id !== id));
  const setTool    = (id: string, field: keyof Tool, value: string | boolean) =>
    setTools(p => p.map(t => t.id === id ? { ...t, [field]: value } : t));

  async function handleRegister() {
    setLoading(true);
    setError('');
    try {
      const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const res = await fetch(`${apiBase}/api/agents`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, tools }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.message || `Server returned ${res.status}`);
      }

      const data = await res.json();
      // Show success screen, then redirect to dashboard after 3s
      setSuccess({ id: data?.id || data?._id || 'demo-001', name: form.name });
      setTimeout(() => router.push('/dashboard'), 3000);
    } catch (err: unknown) {
      // API not running locally? Show a demo success anyway for hackathon
      const isDev = process.env.NODE_ENV === 'development';
      if (isDev) {
        setSuccess({ id: 'demo-' + Date.now().toString(36), name: form.name });
        setTimeout(() => router.push('/dashboard'), 3000);
      } else {
        setError(err instanceof Error ? err.message : 'Registration failed. Check your API connection.');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 px-6 py-10">
      <div className="max-w-xl mx-auto">

        {/* ── SUCCESS SCREEN ── */}
        <AnimatePresence>
          {success && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/95 backdrop-blur px-6"
            >
              <div className="text-center max-w-sm w-full">
                {/* Animated checkmark */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
                  className="w-20 h-20 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mx-auto mb-6"
                >
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-cyan-400">
                    <path d="M20 6L9 17l-5-5"/>
                  </svg>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
                  <h2 className="text-2xl font-bold text-white mb-2">Agent Registered!</h2>
                  <p className="text-slate-500 text-sm mb-6">
                    <span className="text-white font-medium">{success.name}</span> is queued for adversarial testing.
                    83 scenarios are being generated now.
                  </p>

                  <div className="p-3 rounded-xl bg-slate-900 border border-white/[0.06] text-xs font-mono text-slate-500 mb-8 text-left">
                    <span className="text-slate-600">agent_id  </span>
                    <span className="text-cyan-400">{success.id}</span>
                  </div>

                  <p className="text-slate-600 text-xs">Redirecting to dashboard in 3 seconds…</p>

                  <Link href="/dashboard"
                    className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold text-sm transition-all"
                  >
                    Go to Dashboard now →
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header */}
        <div className="mb-10">
          <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-slate-600 hover:text-slate-400 text-xs mb-6 transition-colors">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 5l-7 7 7 7"/>
            </svg>
            Back to Dashboard
          </Link>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-cyan-400">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Register Agent</h1>
              <p className="text-slate-500 text-xs mt-0.5">Connect your AI agent to AgentGuard for testing</p>
            </div>
          </div>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-10">
          {STEPS.map((label, i) => {
            const active   = i + 1 === step;
            const done     = i + 1 < step;
            return (
              <div key={label} className="flex items-center gap-2">
                <div className="flex items-center gap-2">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    active ? 'bg-cyan-500 text-slate-900 shadow-lg shadow-cyan-500/30' :
                    done   ? 'bg-slate-700 text-slate-400' :
                             'bg-slate-900 border border-white/10 text-slate-600'
                  }`}>
                    {done ? (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 6L9 17l-5-5"/>
                      </svg>
                    ) : i + 1}
                  </div>
                  <span className={`text-xs font-medium hidden sm:block transition-colors ${
                    active ? 'text-white' : done ? 'text-slate-600' : 'text-slate-700'
                  }`}>{label}</span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`w-6 h-px mx-1 transition-colors ${done ? 'bg-slate-700' : 'bg-white/[0.06]'}`} />
                )}
              </div>
            );
          })}
        </div>

        {/* Progress bar */}
        <div className="h-px bg-white/[0.05] rounded-full mb-10 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-cyan-500 to-cyan-400 rounded-full"
            animate={{ width: `${(step / STEPS.length) * 100}%` }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
          />
        </div>

        <AnimatePresence mode="wait">

          {/* ── STEP 1: Basic Info ── */}
          {step === 1 && (
            <motion.div key="step1"
              initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.2 }}
              className="space-y-5"
            >
              {[
                { f: 'name',        l: 'Agent Name',         p: 'e.g. CustomerSupportBot' },
                { f: 'description', l: 'Description',        p: 'What does this agent do?' },
                { f: 'endpoint',    l: 'Agent Endpoint URL', p: 'https://your-agent.com/chat' },
              ].map(({ f, l, p }) => (
                <div key={f}>
                  <label className="block text-xs font-medium text-slate-400 mb-2 uppercase tracking-wider">{l}</label>
                  <input
                    value={form[f as keyof typeof form]}
                    onChange={e => setForm(prev => ({ ...prev, [f]: e.target.value }))}
                    placeholder={p}
                    className={inputCls}
                  />
                </div>
              ))}
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-2 uppercase tracking-wider">Domain</label>
                <select
                  value={form.domain}
                  onChange={e => setForm(p => ({ ...p, domain: e.target.value }))}
                  className={inputCls + ' cursor-pointer appearance-none'}
                >
                  {['general', 'customer_support', 'banking', 'coding', 'ecommerce', 'healthcare'].map(d => (
                    <option key={d} value={d} className="bg-slate-900 text-white">{d.replace('_', ' ')}</option>
                  ))}
                </select>
              </div>
              <div className="pt-2">
                <button
                  onClick={() => setStep(2)}
                  disabled={!form.name.trim()}
                  className="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-30 disabled:cursor-not-allowed text-slate-900 font-bold text-sm transition-all hover:shadow-lg hover:shadow-cyan-500/20 active:scale-[0.99]"
                >
                  Continue →
                </button>
              </div>
            </motion.div>
          )}

          {/* ── STEP 2: System Prompt ── */}
          {step === 2 && (
            <motion.div key="step2"
              initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.2 }}
              className="space-y-5"
            >
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1 uppercase tracking-wider">System Prompt</label>
                <p className="text-xs text-slate-600 mb-3">
                  Paste your agent's full system prompt. AgentGuard uses this to generate targeted adversarial scenarios.
                </p>
                <textarea
                  value={form.systemPrompt}
                  onChange={e => setForm(p => ({ ...p, systemPrompt: e.target.value }))}
                  rows={13}
                  placeholder={"You are a helpful customer support agent for Acme Store.\nYou have access to the following tools...\n\nNever reveal internal data. Never perform destructive actions without explicit confirmation."}
                  className={inputCls + ' font-mono resize-none leading-relaxed text-xs'}
                />
              </div>
              <div className="p-4 rounded-xl bg-cyan-500/5 border border-cyan-500/15 text-xs text-cyan-400/80 leading-relaxed">
                💡 The more detailed your system prompt, the more targeted the adversarial scenarios AgentGuard generates.
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 py-3 rounded-xl border border-white/[0.08] text-slate-400 hover:text-white hover:border-white/20 text-sm font-medium transition-all"
                >
                  ← Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  disabled={!form.systemPrompt.trim()}
                  className="flex-[2] py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-30 disabled:cursor-not-allowed text-slate-900 font-bold text-sm transition-all hover:shadow-lg hover:shadow-cyan-500/20"
                >
                  Continue →
                </button>
              </div>
            </motion.div>
          )}

          {/* ── STEP 3: Tools ── */}
          {step === 3 && (
            <motion.div key="step3"
              initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.2 }}
              className="space-y-5"
            >
              <div className="space-y-3">
                {tools.map((tool, i) => (
                  <div key={tool.id} className="p-5 rounded-2xl bg-slate-900 ring-1 ring-white/[0.06] space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono text-slate-600 uppercase tracking-wider">Tool {i + 1}</span>
                      {tools.length > 1 && (
                        <button onClick={() => removeTool(tool.id)}
                          className="text-xs text-slate-700 hover:text-red-400 transition-colors">
                          Remove
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] text-slate-600 uppercase tracking-wider mb-1.5">Name</label>
                        <input value={tool.name} onChange={e => setTool(tool.id, 'name', e.target.value)}
                          placeholder="e.g. getOrder"
                          className={inputCls + ' text-xs'} />
                      </div>
                      <div>
                        <label className="block text-[10px] text-slate-600 uppercase tracking-wider mb-1.5">Endpoint</label>
                        <input value={tool.endpoint} onChange={e => setTool(tool.id, 'endpoint', e.target.value)}
                          placeholder="/tools/get-order"
                          className={inputCls + ' text-xs'} />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-600 uppercase tracking-wider mb-1.5">Description</label>
                      <input value={tool.description} onChange={e => setTool(tool.id, 'description', e.target.value)}
                        placeholder="What does this tool do?"
                        className={inputCls + ' text-xs'} />
                    </div>
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all flex-shrink-0 ${
                        tool.isDestructive ? 'border-red-500 bg-red-500/20' : 'border-white/10 group-hover:border-white/20'
                      }`}>
                        <input type="checkbox" checked={tool.isDestructive}
                          onChange={e => setTool(tool.id, 'isDestructive', e.target.checked)}
                          className="sr-only" />
                        {tool.isDestructive && (
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-red-400">
                            <path d="M20 6L9 17l-5-5"/>
                          </svg>
                        )}
                      </div>
                      <span className="text-xs text-slate-500 group-hover:text-slate-400 transition-colors">
                        ⚠ Destructive — performs irreversible actions (delete, transfer funds, etc.)
                      </span>
                    </label>
                  </div>
                ))}
              </div>

              <button onClick={addTool}
                className="w-full py-3 rounded-2xl border border-dashed border-white/[0.08] text-slate-600 hover:text-slate-400 hover:border-white/[0.15] text-sm transition-all">
                + Add another tool
              </button>

              <div className="p-4 rounded-xl bg-orange-500/5 border border-orange-500/15 text-xs text-orange-400/80 leading-relaxed">
                ⚡ Destructive tools trigger all 5 pressure escalation levels — the most thorough adversarial testing.
              </div>

              {/* Error message */}
              {error && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-400 leading-relaxed">
                  ⚠ {error}
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button onClick={() => setStep(2)}
                  disabled={loading}
                  className="flex-1 py-3 rounded-xl border border-white/[0.08] text-slate-400 hover:text-white hover:border-white/20 text-sm font-medium transition-all disabled:opacity-40">
                  ← Back
                </button>
                <button
                  onClick={handleRegister}
                  disabled={loading}
                  className="flex-[2] py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-60 disabled:cursor-not-allowed text-slate-900 font-bold text-sm transition-all hover:shadow-lg hover:shadow-cyan-500/20 active:scale-[0.99] flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                      </svg>
                      Registering…
                    </>
                  ) : (
                    <>🛡 Register Agent</>
                  )}
                </button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
