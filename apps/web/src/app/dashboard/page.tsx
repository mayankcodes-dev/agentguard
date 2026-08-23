'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';

const RISK_BADGE: Record<string, string> = {
  HIGH: 'bg-orange-50 text-orange-600 border-orange-200 dark:bg-orange-500/10 dark:text-orange-400 dark:border-orange-500/20',
  MEDIUM: 'bg-yellow-50 text-yellow-600 border-yellow-200 dark:bg-yellow-500/10 dark:text-yellow-400 dark:border-yellow-500/20',
  LOW: 'bg-green-50 text-green-600 border-green-200 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20',
  CRITICAL: 'bg-red-50 text-red-600 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20',
};

const scoreColor = (s: number) => s >= 85 ? 'text-green-500' : s >= 70 ? 'text-yellow-500' : 'text-red-500';

const AGENTS = [
  { id: 'demo', name: 'BankingAgent', version: 'v1.0', score: 64, risk: 'HIGH', run: '2h ago', critical: 2, high: 1 },
  { id: 'demo2', name: 'SupportBot', version: 'v2.1', score: 91, risk: 'LOW', run: '1d ago', critical: 0, high: 0 },
  { id: 'demo3', name: 'CodingAgent', version: 'v1.3', score: 73, risk: 'MEDIUM', run: '3h ago', critical: 0, high: 2 },
];

const RUNS = [
  { id: 'demo', agent: 'BankingAgent', version: 'v1.0', tests: 83, score: 64, risk: 'HIGH', time: '2h ago' },
  { id: 'demo2', agent: 'SupportBot', version: 'v2.1', tests: 83, score: 91, risk: 'LOW', time: '1d ago' },
  { id: 'demo3', agent: 'CodingAgent', version: 'v1.2', tests: 83, score: 68, risk: 'MEDIUM', time: '4h ago' },
  { id: 'demo4', agent: 'CodingAgent', version: 'v1.3', tests: 83, score: 73, risk: 'MEDIUM', time: '3h ago' },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Overview</h1>
        <p className="text-slate-500 text-sm mt-1">Your agents and their reliability status</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Agents', value: '3', color: 'text-blue-500' },
          { label: 'Total runs', value: '12', color: 'text-green-500' },
          { label: 'Avg reliability', value: '76', color: 'text-purple-500' },
          { label: 'Critical failures', value: '2', color: 'text-red-500' },
        ].map(({ label, value, color }) => (
          <div key={label} className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <div className="text-xs text-slate-500 mb-2">{label}</div>
            <div className={`text-3xl font-bold ${color}`}>{value}</div>
          </div>
        ))}
      </div>

      {/* Agent cards */}
      <div>
        <h2 className="font-semibold text-slate-900 dark:text-white mb-4">My Agents</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {AGENTS.map((agent, i) => (
            <motion.div key={agent.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
              className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="font-semibold text-slate-900 dark:text-white">{agent.name}</div>
                  <div className="text-xs text-slate-500 mt-0.5 font-mono">{agent.version} · {agent.run}</div>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${RISK_BADGE[agent.risk]}`}>{agent.risk}</span>
              </div>
              <div className="flex items-end justify-between mb-4">
                <div>
                  <div className={`text-4xl font-bold ${scoreColor(agent.score)}`}>{agent.score}</div>
                  <div className="text-xs text-slate-400">/ 100</div>
                </div>
                {agent.critical > 0 && <div className="text-xs text-red-500">🔴 {agent.critical} critical</div>}
              </div>
              <div className="flex gap-2">
                <Link href={`/dashboard/runs/${agent.id}`}
                  className="flex-1 text-center px-3 py-1.5 bg-red-500 hover:bg-red-400 text-white text-xs font-semibold rounded-lg transition-colors">
                  🔥 Attack
                </Link>
                <Link href={`/dashboard/runs/${agent.id}`}
                  className="flex-1 text-center px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium rounded-lg transition-colors">
                  Report
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Recent runs table */}
      <div>
        <h2 className="font-semibold text-slate-900 dark:text-white mb-4">Recent Runs</h2>
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-950">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
                {['Agent','Version','Tests','Score','Risk','Time',''].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-medium text-slate-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {RUNS.map(run => (
                <tr key={run.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/60 transition-colors">
                  <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">{run.agent}</td>
                  <td className="px-4 py-3 text-slate-500 font-mono text-xs">{run.version}</td>
                  <td className="px-4 py-3 text-slate-500">{run.tests}</td>
                  <td className={`px-4 py-3 font-bold ${scoreColor(run.score)}`}>{run.score}/100</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${RISK_BADGE[run.risk]}`}>{run.risk}</span>
                  </td>
                  <td className="px-4 py-3 text-slate-500 text-xs">{run.time}</td>
                  <td className="px-4 py-3">
                    <Link href={`/dashboard/runs/${run.id}`} className="text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">View →</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
