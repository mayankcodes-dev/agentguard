"use client";

import React from "react";
import Link from "next/link";
import {
  LayoutDashboard, Shield, Activity, Settings, ChevronDown,
  TrendingUp, TrendingDown, AlertTriangle, CheckCircle2,
  Clock, Zap, Bug, Lock, RotateCcw, Search, Bell, User,
  MoreHorizontal, ArrowUpRight, ArrowDownRight, Target,
  Terminal, Cpu
} from "lucide-react";
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, LineChart, Line,
  Cell
} from "recharts";

// ─── Types ───────────────────────────────────────────────────────────────────
interface SidebarItem { label: string; href: string; icon: React.ReactNode; badge?: string; }
interface StatCard { label: string; value: string; delta: string; up: boolean; icon: React.ReactNode; color: string; }
interface AgentRow { name: string; domain: string; score: number; risk: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"; lastRun: string; }

// ─── Data ────────────────────────────────────────────────────────────────────
const SIDEBAR_ITEMS: SidebarItem[] = [
  { label: "Overview", href: "/dashboard", icon: <LayoutDashboard size={16} /> },
  { label: "Agents", href: "/dashboard/agents/new", icon: <Cpu size={16} /> },
  { label: "Test Runs", href: "/dashboard", icon: <Terminal size={16} />, badge: "3" },
  { label: "Reports", href: "/dashboard", icon: <Shield size={16} /> },
  { label: "Settings", href: "/dashboard", icon: <Settings size={16} /> },
];

const STATS: StatCard[] = [
  { label: "Avg Reliability Score", value: "68", delta: "+4 pts", up: true, icon: <Target size={18} />, color: "text-cyan-400" },
  { label: "Critical Failures", value: "7", delta: "-2 this week", up: false, icon: <AlertTriangle size={18} />, color: "text-red-400" },
  { label: "Scenarios Run", value: "1,992", delta: "+249 today", up: true, icon: <Zap size={18} />, color: "text-emerald-400" },
  { label: "Agents Registered", value: "8", delta: "+2 this week", up: true, icon: <Cpu size={18} />, color: "text-violet-400" },
];

const AGENTS: AgentRow[] = [
  { name: "Banking Agent", domain: "finance", score: 64, risk: "HIGH", lastRun: "2 min ago" },
  { name: "Support Bot", domain: "customer-service", score: 71, risk: "MEDIUM", lastRun: "14 min ago" },
  { name: "Coding Agent", domain: "developer-tools", score: 82, risk: "LOW", lastRun: "1 hr ago" },
  { name: "Legal Advisor", domain: "legal", score: 58, risk: "CRITICAL", lastRun: "3 hr ago" },
  { name: "HR Assistant", domain: "hr", score: 76, risk: "MEDIUM", lastRun: "5 hr ago" },
];

const RADAR_DATA = [
  { axis: "Safety", value: 58 },
  { axis: "Auth", value: 72 },
  { axis: "Goal", value: 80 },
  { axis: "Tools", value: 65 },
  { axis: "Halluc.", value: 70 },
];

const BAR_DATA = [
  { name: "Mon", passed: 18, failed: 4 },
  { name: "Tue", passed: 22, failed: 6 },
  { name: "Wed", passed: 15, failed: 9 },
  { name: "Thu", passed: 30, failed: 3 },
  { name: "Fri", passed: 25, failed: 7 },
  { name: "Sat", passed: 12, failed: 2 },
  { name: "Sun", passed: 20, failed: 5 },
];

const FAILURE_TYPES = [
  { code: "F03", label: "Destructive Unconfirmed", count: 12, sev: "CRITICAL" },
  { code: "F01", label: "Tool Loop", count: 8, sev: "HIGH" },
  { code: "F05", label: "Prompt Injection", count: 7, sev: "HIGH" },
  { code: "F07", label: "Confidence Hallucination", count: 5, sev: "MEDIUM" },
  { code: "F06", label: "Goal Drift", count: 4, sev: "MEDIUM" },
];

// ─── Risk badge ──────────────────────────────────────────────────────────────
const RISK_BADGE: Record<string, string> = {
  LOW: "bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/30",
  MEDIUM: "bg-yellow-500/15 text-yellow-400 ring-1 ring-yellow-500/30",
  HIGH: "bg-orange-500/15 text-orange-400 ring-1 ring-orange-500/30",
  CRITICAL: "bg-red-500/15 text-red-400 ring-1 ring-red-500/30",
};

const SEV_BADGE: Record<string, string> = {
  CRITICAL: "text-red-400",
  HIGH: "text-orange-400",
  MEDIUM: "text-yellow-400",
};

function ScoreRing({ score }: { score: number }) {
  const color = score >= 80 ? "#34d399" : score >= 60 ? "#fbbf24" : "#f87171";
  const pct = score / 100;
  const r = 20; const circ = 2 * Math.PI * r;
  return (
    <div className="relative flex items-center justify-center w-14 h-14">
      <svg viewBox="0 0 48 48" className="w-14 h-14 -rotate-90">
        <circle cx="24" cy="24" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="4" />
        <circle cx="24" cy="24" r={r} fill="none" stroke={color} strokeWidth="4"
          strokeDasharray={circ} strokeDashoffset={circ * (1 - pct)} strokeLinecap="round" />
      </svg>
      <span className="absolute text-xs font-bold text-white">{score}</span>
    </div>
  );
}

// ─── Dashboard Component ─────────────────────────────────────────────────────
export function Dashboard() {
  return (
    <div className="space-y-8">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-white">Overview</h1>
          <p className="text-sm text-slate-500 mt-0.5">Your agents' reliability at a glance</p>
        </div>
        <Link href="/dashboard/agents/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-semibold rounded-xl text-sm transition-colors">
          + New Agent
        </Link>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map(s => (
          <div key={s.label} className="rounded-2xl bg-slate-900 ring-1 ring-white/5 p-5">
            <div className="flex items-center justify-between mb-3">
              <div className={`p-2 rounded-lg bg-white/5 ${s.color}`}>{s.icon}</div>
              <span className={`text-xs font-medium flex items-center gap-1 ${s.up ? "text-emerald-400" : "text-red-400"}`}>
                {s.up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                {s.delta}
              </span>
            </div>
            <div className="text-2xl font-bold text-white">{s.value}</div>
            <div className="text-xs text-slate-500 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Bar chart — weekly runs */}
        <div className="lg:col-span-2 rounded-2xl bg-slate-900 ring-1 ring-white/5 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-white">Weekly Test Runs</h2>
            <div className="flex items-center gap-3 text-xs text-slate-500">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-cyan-500 inline-block" />Passed</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-red-500/70 inline-block" />Failed</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={BAR_DATA} barSize={10} barGap={2}>
              <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="name" tick={{ fill: '#71717a', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#71717a', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: '#18181b', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, color: '#fff', fontSize: 12 }}
                cursor={{ fill: 'rgba(255,255,255,0.03)' }}
              />
              <Bar dataKey="passed" fill="#06b6d4" radius={[4, 4, 0, 0]} />
              <Bar dataKey="failed" fill="rgba(239,68,68,0.6)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Radar chart — score breakdown */}
        <div className="rounded-2xl bg-slate-900 ring-1 ring-white/5 p-5">
          <h2 className="text-sm font-semibold text-white mb-1">Score Breakdown</h2>
          <p className="text-xs text-slate-500 mb-3">Across all agents</p>
          <ResponsiveContainer width="100%" height={180}>
            <RadarChart data={RADAR_DATA}>
              <PolarGrid stroke="rgba(255,255,255,0.06)" />
              <PolarAngleAxis dataKey="axis" tick={{ fill: '#71717a', fontSize: 10 }} />
              <Radar name="Score" dataKey="value" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.15} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom row: agents table + top failures */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Agents table */}
        <div className="lg:col-span-2 rounded-2xl bg-slate-900 ring-1 ring-white/5 overflow-hidden">
          <div className="px-5 py-4 border-b border-white/5">
            <h2 className="text-sm font-semibold text-white">Registered Agents</h2>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                <th className="px-5 py-3 text-left text-xs text-slate-500 font-medium">Agent</th>
                <th className="px-3 py-3 text-left text-xs text-slate-500 font-medium">Score</th>
                <th className="px-3 py-3 text-left text-xs text-slate-500 font-medium">Risk</th>
                <th className="px-3 py-3 text-left text-xs text-slate-500 font-medium">Last Run</th>
              </tr>
            </thead>
            <tbody>
              {AGENTS.map(a => (
                <tr key={a.name} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors group">
                  <td className="px-5 py-3.5">
                    <div className="font-medium text-white text-xs">{a.name}</div>
                    <div className="text-xs text-slate-500">{a.domain}</div>
                  </td>
                  <td className="px-3 py-3.5">
                    <ScoreRing score={a.score} />
                  </td>
                  <td className="px-3 py-3.5">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${RISK_BADGE[a.risk]}`}>
                      {a.risk}
                    </span>
                  </td>
                  <td className="px-3 py-3.5 text-xs text-slate-500">{a.lastRun}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Top failure types */}
        <div className="rounded-2xl bg-slate-900 ring-1 ring-white/5 p-5">
          <h2 className="text-sm font-semibold text-white mb-4">Top Failure Types</h2>
          <div className="space-y-3">
            {FAILURE_TYPES.map(f => (
              <div key={f.code} className="flex items-center gap-3">
                <span className="text-xs font-mono text-slate-600 w-8">{f.code}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-slate-300 truncate">{f.label}</div>
                  <div className="mt-1.5 h-1 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-cyan-500/60 rounded-full"
                      style={{ width: `${(f.count / 12) * 100}%` }} />
                  </div>
                </div>
                <span className={`text-xs font-semibold ${SEV_BADGE[f.sev]}`}>{f.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
