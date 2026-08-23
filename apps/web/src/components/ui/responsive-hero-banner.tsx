"use client";

import React, { useState } from 'react';
import Link from 'next/link';

interface NavLink { label: string; href: string; isActive?: boolean; }

const NAV_LINKS: NavLink[] = [
  { label: "Home", href: "/", isActive: true },
  { label: "How it Works", href: "#how-it-works" },
  { label: "Failure Modes", href: "#failures" },
  { label: "Demo", href: "#demo" },
];

const TECH_STACK = ["MongoDB", "Redis", "Gemini AI", "BullMQ", "Fastify", "Next.js 14", "TypeScript"];

const ResponsiveHeroBanner: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <section className="w-full isolate min-h-screen overflow-hidden relative">
      {/* Full-bleed dark background image — dark circuit board */}
      <img
        src="https://images.unsplash.com/photo-1518770660439-4636190af475?w=1920&q=80"
        alt=""
        className="w-full h-full object-cover absolute inset-0 contrast-125"
        style={{ filter: 'grayscale(0.2) brightness(0.25) contrast(1.3)' }}
      />

      {/* Cyan radial glow overlay — from top center */}
      <div className="pointer-events-none absolute inset-0"
        style={{ background: 'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(0,229,255,0.12) 0%, transparent 70%)' }} />

      {/* Deep shadow vignette */}
      <div className="pointer-events-none absolute inset-0 ring-1 ring-black/40"
        style={{ background: 'radial-gradient(ellipse 100% 100% at 50% 100%, rgba(0,0,0,0.7) 0%, transparent 60%)' }} />

      {/* ─── NAVBAR ────────────────────────────────────────────────────── */}
      <header className="z-10 relative">
        <div className="mx-6">
          <div className="flex items-center justify-between pt-4">
            {/* Logo */}
            <Link href="/" className="inline-flex items-center gap-2.5">
              <img src="/logo.svg" alt="AgentGuard" className="w-10 h-10" />
              <span className="font-semibold text-white text-sm tracking-tight hidden sm:block">AgentGuard</span>
            </Link>

            {/* Desktop nav — glassmorphism pill */}
            <nav className="hidden md:flex items-center gap-1">
              <div className="flex items-center gap-0.5 rounded-full bg-white/5 px-1 py-1 ring-1 ring-white/10 backdrop-blur">
                {NAV_LINKS.map((link) => (
                  <a key={link.label} href={link.href}
                    className={`px-3.5 py-2 text-sm font-medium rounded-full transition-colors font-sans ${
                      link.isActive ? 'text-white bg-white/10' : 'text-white/70 hover:text-white hover:bg-white/5'
                    }`}>
                    {link.label}
                  </a>
                ))}
                <Link href="/dashboard"
                  className="ml-1 inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-white/90 font-sans transition-colors">
                  Dashboard
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M7 7h10v10"/><path d="M7 17 17 7"/>
                  </svg>
                </Link>
              </div>
            </nav>

            {/* Mobile burger */}
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/15 backdrop-blur">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                <path d="M4 5h16"/><path d="M4 12h16"/><path d="M4 19h16"/>
              </svg>
            </button>
          </div>

          {mobileMenuOpen && (
            <div className="md:hidden mt-2 rounded-2xl bg-slate-900/90 ring-1 ring-white/10 backdrop-blur p-3 space-y-1">
              {NAV_LINKS.map(link => (
                <a key={link.label} href={link.href}
                  className="block px-4 py-2.5 text-sm text-white/70 hover:text-white rounded-xl hover:bg-white/5 transition-colors">
                  {link.label}
                </a>
              ))}
              <Link href="/dashboard" className="block px-4 py-2.5 text-sm text-cyan-400 font-semibold">Dashboard →</Link>
            </div>
          )}
        </div>
      </header>

      {/* ─── HERO CONTENT ──────────────────────────────────────────────── */}
      <div className="z-10 relative">
        <div className="sm:pt-28 md:pt-32 lg:pt-44 max-w-7xl mx-auto pt-28 px-6 pb-16">
          <div className="mx-auto max-w-5xl text-center">

            {/* Badge */}
            <div className="mb-8 inline-flex items-center gap-3 rounded-full bg-white/5 px-2.5 py-2 ring-1 ring-white/10 backdrop-blur animate-fade-slide-in-1">
              <span className="inline-flex items-center text-xs font-semibold text-slate-900 bg-cyan-400 rounded-full py-0.5 px-2.5 font-sans">
                NEW
              </span>
              <span className="text-sm font-medium text-white/80 font-sans">
                CI/CD for Autonomous AI Agents — 83 adversarial scenarios
              </span>
            </div>

            {/* H1 — max-w-5xl, guaranteed 2 lines */}
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-none tracking-tight text-white animate-fade-slide-in-2"
              style={{ fontFamily: '"Instrument Serif", Georgia, serif', fontWeight: 400 }}>
              Break your agent
              <br />
              <span className="text-cyan-400">before</span> they do.
            </h1>

            <p className="sm:text-lg animate-fade-slide-in-3 text-base text-white/60 max-w-2xl mt-8 mx-auto font-sans leading-relaxed">
              Industry benchmarks report AI agents failing on 70% of real-world tasks.
              AgentGuard automatically generates adversarial tests, runs your agent in a sandboxed environment,
              and scores 12 failure modes — before you ship.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row sm:gap-4 mt-10 gap-3 items-center justify-center animate-fade-slide-in-4">
              <a href="#demo"
                className="inline-flex items-center gap-2 rounded-full bg-cyan-400 hover:bg-cyan-300 px-6 py-3 text-sm font-bold text-slate-900 font-sans transition-all hover:scale-105 shadow-lg shadow-cyan-500/20">
                Attack a Demo Agent
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
                </svg>
              </a>
              <Link href="/dashboard"
                className="inline-flex items-center gap-2 rounded-full bg-white/5 hover:bg-white/10 ring-1 ring-white/15 px-6 py-3 text-sm font-medium text-white font-sans transition-colors backdrop-blur">
                Open Dashboard →
              </Link>
            </div>

            {/* Stats row */}
            <div className="mt-16 flex flex-wrap items-center justify-center gap-10 animate-fade-slide-in-4">
              {[
                { n: '83', l: 'Scenarios per run' },
                { n: '12', l: 'Failure types detected' },
                { n: '5',  l: 'Pressure levels' },
                { n: '70%', l: 'Industry fail rate' },
              ].map(({ n, l }) => (
                <div key={l} className="text-center">
                  <div className="text-3xl font-bold text-white">{n}</div>
                  <div className="text-xs text-white/40 mt-1 font-sans">{l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Tech stack marquee */}
          <div className="mx-auto mt-20 max-w-5xl overflow-hidden">
            <p className="animate-fade-slide-in-1 text-xs text-white/40 text-center tracking-widest uppercase font-sans mb-6">
              Powered by battle-tested infrastructure
            </p>
            <div className="flex items-center justify-center gap-8 flex-wrap">
              {TECH_STACK.map(name => (
                <span key={name} className="text-white/30 text-sm font-medium font-sans hover:text-white/60 transition-colors">
                  {name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResponsiveHeroBanner;
