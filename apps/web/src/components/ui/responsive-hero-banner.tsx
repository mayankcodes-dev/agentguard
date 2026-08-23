"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useTheme } from 'next-themes';

interface NavLink { label: string; href: string; isActive?: boolean; }

const NAV_LINKS: NavLink[] = [
  { label: "Home", href: "/", isActive: true },
  { label: "How it Works", href: "#how-it-works" },
  { label: "Failure Modes", href: "#failures" },
  { label: "Demo", href: "#demo" },
];

const TECH_STACK = [
  { name: "MongoDB",    slug: "mongodb",      brandColor: "#47A248" },
  { name: "Redis",      slug: "redis",        brandColor: "#FF4438" },
  { name: "Gemini AI",  slug: "googlegemini", brandColor: "#8E75B2" },
  { name: "Fastify",    slug: "fastify",      brandColor: "#000000" },
  { name: "Next.js 14", slug: "nextdotjs",    brandColor: "#000000" },
  { name: "TypeScript", slug: "typescript",   brandColor: "#3178C6" },
];

const ResponsiveHeroBanner: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { resolvedTheme, setTheme } = useTheme();
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
                <button
                  onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
                  className="ml-1 inline-flex h-8 w-8 items-center justify-center rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-colors"
                  aria-label="Toggle theme"
                >
                  {resolvedTheme === 'dark' ? (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
                    </svg>
                  ) : (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                    </svg>
                  )}
                </button>
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
                CI/CD for AI Agents
              </span>
            </div>

            {/* H1 — max-w-5xl, guaranteed 2 lines */}
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-none tracking-tight text-white animate-fade-slide-in-2"
              style={{ fontFamily: '"Instrument Serif", Georgia, serif', fontWeight: 400 }}>
              Break your agent
              <br />
              <span className="text-cyan-400">before</span> they do.
            </h1>

            <p className="sm:text-lg animate-fade-slide-in-3 text-base text-white/50 max-w-xl mt-8 mx-auto font-sans leading-relaxed">
              83 adversarial scenarios. 12 failure types. Zero guessing.
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

          {/* Tech stack — logos + names */}
          <div className="mx-auto mt-20 max-w-5xl">
            <p className="animate-fade-slide-in-1 text-xs text-white/30 text-center tracking-widest uppercase font-sans mb-8">
              Powered by battle-tested infrastructure
            </p>
            <div className="flex items-end justify-center gap-8 flex-wrap">
              {TECH_STACK.map(({ name, slug, brandColor }) => (
                <div key={name} className="flex flex-col items-center gap-2 group relative">
                  {/* default: white faded icon */}
                  <img
                    src={`https://cdn.simpleicons.org/${slug}/ffffff`}
                    alt={name}
                    width={28}
                    height={28}
                    className="opacity-25 group-hover:opacity-0 transition-all duration-300 absolute"
                  />
                  {/* hover: brand color icon */}
                  <img
                    src={`https://cdn.simpleicons.org/${slug}/${brandColor.replace('#', '')}`}
                    alt=""
                    width={28}
                    height={28}
                    className="opacity-0 group-hover:opacity-90 transition-all duration-300"
                  />
                  <span className="text-xs text-white/25 font-sans group-hover:text-white/60 transition-colors">{name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResponsiveHeroBanner;
