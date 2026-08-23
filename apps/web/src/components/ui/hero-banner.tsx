"use client";

import React, { useState } from 'react';
import Link from 'next/link';

const NAV_LINKS = [
  { label: "Home", href: "/", isActive: true },
  { label: "How it works", href: "#how-it-works" },
  { label: "Failure Modes", href: "#failures" },
  { label: "Demo", href: "#demo" },
];

const AgentGuardHero: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <section className="w-full isolate min-h-screen overflow-hidden relative bg-slate-950">
      {/* Radial gradient background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(34,197,94,0.15),transparent)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_40%_40%_at_80%_60%,rgba(239,68,68,0.08),transparent)]" />

      {/* Grid lines */}
      <div className="absolute inset-0 opacity-[0.04]"
        style={{ backgroundImage: 'linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)', backgroundSize: '72px 72px' }} />

      {/* NAV */}
      <header className="z-10 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-green-500 flex items-center justify-center shadow-lg shadow-green-500/30">
                <span className="text-black font-bold text-xs">AG</span>
              </div>
              <span className="font-semibold text-white text-sm tracking-tight">AgentGuard</span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-1 rounded-full bg-white/5 px-1.5 py-1.5 ring-1 ring-white/10 backdrop-blur-md">
              {NAV_LINKS.map(link => (
                <a key={link.label} href={link.href}
                  className={`px-4 py-1.5 text-sm font-medium rounded-full transition-colors ${
                    link.isActive
                      ? 'text-white bg-white/10'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}>
                  {link.label}
                </a>
              ))}
              <Link href="/dashboard"
                className="ml-1 inline-flex items-center gap-1.5 rounded-full bg-green-500 hover:bg-green-400 px-4 py-1.5 text-sm font-semibold text-black transition-colors">
                Dashboard
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M7 7h10v10" /><path d="M7 17 17 7" />
                </svg>
              </Link>
            </nav>

            {/* Mobile hamburger */}
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/15">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                <path d="M4 5h16" /><path d="M4 12h16" /><path d="M4 19h16" />
              </svg>
            </button>
          </div>

          {/* Mobile menu */}
          {mobileMenuOpen && (
            <div className="md:hidden pb-4 space-y-1">
              {NAV_LINKS.map(link => (
                <a key={link.label} href={link.href}
                  className="block px-4 py-2 text-sm text-white/70 hover:text-white rounded-lg hover:bg-white/5 transition-colors">
                  {link.label}
                </a>
              ))}
              <Link href="/dashboard" className="block px-4 py-2 text-sm text-green-400 font-semibold">
                Dashboard →
              </Link>
            </div>
          )}
        </div>
      </header>

      {/* HERO CONTENT */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-24 pb-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="mb-8 inline-flex items-center gap-2.5 rounded-full bg-white/5 px-3 py-2 ring-1 ring-white/10 backdrop-blur-sm">
            <span className="inline-flex items-center text-xs font-semibold text-black bg-green-400 rounded-full py-0.5 px-2.5">
              NEW
            </span>
            <span className="text-sm font-medium text-white/80">
              CI/CD for AI Agents — 83 scenarios, 12 failure types
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white tracking-tight leading-tight mb-6">
            Break your AI agent{' '}
            <span className="text-green-400">before</span>
            <br className="hidden sm:block" />
            {' '}your users do.
          </h1>

          <p className="text-lg sm:text-xl text-white/60 max-w-2xl mx-auto mb-10 leading-relaxed">
            Automated adversarial testing for autonomous agents. Find prompt injection,
            tool loops, and destructive actions before they reach production.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-center mb-16">
            <a href="#demo"
              className="inline-flex items-center gap-2 rounded-full bg-red-500 hover:bg-red-400 px-6 py-3 text-sm font-bold text-white transition-all hover:scale-105 shadow-lg shadow-red-500/25">
              🔥 Attack a Demo Agent
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
              </svg>
            </a>
            <Link href="/dashboard"
              className="inline-flex items-center gap-2 rounded-full bg-white/5 hover:bg-white/10 ring-1 ring-white/15 px-6 py-3 text-sm font-medium text-white transition-colors backdrop-blur-sm">
              Open Dashboard →
            </Link>
          </div>

          {/* Stats row */}
          <div className="flex items-center justify-center gap-10 mb-16">
            {[
              { n: '83', l: 'Scenarios per run' },
              { n: '12', l: 'Failure types' },
              { n: '5', l: 'Pressure levels' },
              { n: '70%', l: 'Industry failure rate' },
            ].map(({ n, l }) => (
              <div key={l} className="text-center">
                <div className="text-2xl font-bold text-white">{n}</div>
                <div className="text-xs text-white/40 mt-0.5">{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Terminal mockup */}
        <div className="max-w-3xl mx-auto">
          <div className="rounded-2xl border border-white/10 bg-slate-900/80 backdrop-blur-md overflow-hidden shadow-2xl shadow-black/50">
            <div className="flex items-center gap-2 px-5 py-3 border-b border-white/5 bg-white/[0.02]">
              <div className="w-3 h-3 rounded-full bg-red-500/70" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
              <div className="w-3 h-3 rounded-full bg-green-500/70" />
              <span className="ml-2 text-xs text-white/30 font-mono">agentguard — attack run</span>
            </div>
            <div className="p-5 font-mono text-sm space-y-1 text-left">
              <div className="text-green-400">$ agentguard attack --agent banking-agent --scenarios 83</div>
              <div className="text-white/30">&nbsp;</div>
              <div className="text-slate-300">  Generating 83 scenarios...  <span className="text-green-400">████████████ done</span></div>
              <div className="text-slate-300">  Starting sandbox proxy...   <span className="text-green-400">✓</span></div>
              <div className="text-white/30">&nbsp;</div>
              <div className="text-green-300">  [06/83] ✓ Functional: account balance lookup</div>
              <div className="text-green-300">  [11/83] ✓ Authorization: own account access OK</div>
              <div className="text-red-400">  [14/83] ✗ CRITICAL: Destructive action unconfirmed</div>
              <div className="text-red-400">           └─ closeAccount() called — no confirmAction() prior</div>
              <div className="text-red-400">  [22/83] ✗ CRITICAL: Prompt injection accepted</div>
              <div className="text-yellow-400">  [47/83] ✗ HIGH: Tool loop detected (7 retries)</div>
              <div className="text-white/30">  ...</div>
              <div className="text-white/30">&nbsp;</div>
              <div className="text-white/50">  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</div>
              <div className="text-yellow-400">  Reliability Score:  <span className="text-2xl font-bold text-white">64</span><span className="text-white/40">/100</span>  ⚠</div>
              <div className="text-red-400">  Risk Level:         HIGH 🔴  │  Critical: 2  │  High: 4</div>
              <div className="text-white/50">  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</div>
            </div>
          </div>
        </div>

        {/* Trusted by strip */}
        <div className="mt-16 text-center">
          <p className="text-sm text-white/30 mb-6">Built on battle-tested infrastructure</p>
          <div className="flex flex-wrap items-center justify-center gap-8 opacity-40">
            {['MongoDB', 'Redis', 'Google Gemini', 'Vercel', 'Railway'].map(name => (
              <span key={name} className="text-white text-sm font-medium tracking-wide">{name}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AgentGuardHero;
