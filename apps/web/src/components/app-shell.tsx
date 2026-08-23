"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  LayoutDashboard, Cpu, Terminal, Shield, Settings, ChevronRight,
  Bell, Search, User, LogOut, ChevronDown, Home
} from "lucide-react";

interface SidebarItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: string;
}

const SIDEBAR: SidebarItem[] = [
  { label: "Overview", href: "/dashboard", icon: <LayoutDashboard size={15} /> },
  { label: "Agents", href: "/dashboard/agents/new", icon: <Cpu size={15} /> },
  { label: "Test Runs", href: "/dashboard", icon: <Terminal size={15} />, badge: "3" },
  { label: "Reports", href: "/dashboard", icon: <Shield size={15} /> },
  { label: "Settings", href: "/dashboard", icon: <Settings size={15} /> },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-950 text-white">
      {/* ─── Sidebar ─────────────────────────────────────────────── */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex flex-col border-r border-white/[0.06] bg-slate-950 transition-all duration-300 ${
          collapsed ? "w-16" : "w-60"
        }`}
      >
        {/* Logo */}
        <div className={`h-14 flex items-center border-b border-white/[0.06] ${collapsed ? "justify-center px-2" : "px-4 gap-3"}`}>
          <Link href="/" className="flex-shrink-0">
            <img src="/logo.svg" alt="AgentGuard" className="w-8 h-8" />
          </Link>
          {!collapsed && (
            <Link href="/" className="font-semibold text-white text-sm tracking-tight">
              AgentGuard
            </Link>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 p-2 space-y-0.5 overflow-y-auto">
          {SIDEBAR.map(({ label, href, icon, badge }) => (
            <Link key={label} href={href}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-400 hover:bg-white/5 hover:text-white transition-all group ${
                collapsed ? "justify-center" : ""
              }`}>
              <span className="flex-shrink-0 text-slate-500 group-hover:text-cyan-400 transition-colors">{icon}</span>
              {!collapsed && (
                <>
                  <span className="flex-1">{label}</span>
                  {badge && (
                    <span className="flex-shrink-0 text-xs bg-cyan-500/20 text-cyan-400 ring-1 ring-cyan-500/30 rounded-full px-1.5 py-0.5 leading-none">
                      {badge}
                    </span>
                  )}
                </>
              )}
            </Link>
          ))}
        </nav>

        {/* Bottom section */}
        <div className={`border-t border-white/[0.06] p-2 space-y-1 ${collapsed ? "" : ""}`}>
          {!collapsed && (
            <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-white/5 cursor-pointer transition-colors">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center flex-shrink-0">
                <User size={13} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-medium text-white truncate">Mayank Singh</div>
                <div className="text-xs text-slate-500 truncate">mayankcodes.dev</div>
              </div>
              <ChevronDown size={13} className="text-slate-600 flex-shrink-0" />
            </div>
          )}
          <button onClick={() => setCollapsed(!collapsed)}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs text-slate-600 hover:text-slate-400 hover:bg-white/5 transition-colors ${
              collapsed ? "justify-center" : ""
            }`}>
            <ChevronRight size={13} className={`transition-transform ${collapsed ? "" : "rotate-180"}`} />
            {!collapsed && "Collapse"}
          </button>
        </div>
      </aside>

      {/* ─── Main content ─────────────────────────────────────────── */}
      <main className={`flex-1 flex flex-col transition-all duration-300 ${collapsed ? "ml-16" : "ml-60"}`}>
        {/* Topbar */}
        <div className="h-14 border-b border-white/[0.06] bg-slate-950/80 backdrop-blur sticky top-0 z-30 flex items-center px-6 gap-4">
          {/* Search */}
          <div className="flex-1 flex items-center gap-2 max-w-sm">
            <div className="flex items-center gap-2 bg-white/[0.04] rounded-xl px-3 py-2 ring-1 ring-white/[0.06] flex-1">
              <Search size={13} className="text-slate-500 flex-shrink-0" />
              <input type="text" placeholder="Search agents, runs..." className="bg-transparent text-xs text-slate-400 placeholder-slate-600 outline-none flex-1" />
            </div>
          </div>

          <div className="ml-auto flex items-center gap-2">
            {/* Notification bell */}
            <button className="relative h-8 w-8 flex items-center justify-center rounded-xl bg-white/[0.04] hover:bg-white/[0.08] ring-1 ring-white/[0.06] transition-colors">
              <Bell size={14} className="text-slate-400" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-cyan-400 rounded-full" />
            </button>

            {/* New agent CTA */}
            <Link href="/dashboard/agents/new"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-semibold rounded-xl text-xs transition-colors">
              + New Agent
            </Link>
          </div>
        </div>

        {/* Page content */}
        <div className="flex-1 p-6 overflow-auto">
          {children}
        </div>

        {/* Footer */}
        <footer className="border-t border-white/[0.04] px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/logo.svg" alt="AgentGuard" className="w-5 h-5 opacity-60" />
            <span className="text-xs text-slate-600">Break your AI agent before your users do.</span>
          </div>
          <p className="text-xs text-slate-600">
            Designed &amp; developed by{" "}
            <a href="https://mayankcodes.dev" target="_blank" rel="noopener noreferrer"
              className="text-cyan-500/70 hover:text-cyan-400 transition-colors">
              Mayank Singh
            </a>
          </p>
        </footer>
      </main>
    </div>
  );
}
