import Link from 'next/link';
import Image from 'next/image';

const NAV = [
  { href: '/dashboard', label: '📊 Overview' },
  { href: '/dashboard/agents/new', label: '+ New Agent' },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Sidebar */}
      <aside className="w-56 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 fixed inset-y-0 left-0 z-40 flex flex-col">
        {/* Logo */}
        <div className="h-14 px-4 flex items-center border-b border-slate-200 dark:border-slate-800">
          <Link href="/" className="flex items-center gap-2.5">
            <img src="/logo.svg" alt="AgentGuard" className="w-8 h-8" />
            <span className="font-semibold text-slate-900 dark:text-white text-sm">AgentGuard</span>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-0.5">
          {NAV.map(({ href, label }) => (
            <Link key={href} href={href}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors">
              {label}
            </Link>
          ))}
        </nav>

        {/* Sidebar footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 space-y-3">
          <Link href="/" className="px-3 py-2 text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors block">
            ← Back to landing
          </Link>
          {/* Credit */}
          <p className="text-xs text-slate-400 px-3 leading-relaxed">
            By{' '}
            <a href="https://mayankcodes.dev" target="_blank" rel="noopener noreferrer"
              className="text-green-400 hover:text-green-300 transition-colors font-medium">
              Mayank Singh
            </a>
          </p>
        </div>
      </aside>

      {/* Main */}
      <main className="ml-56 flex-1">
        <div className="h-14 border-b border-slate-200 dark:border-slate-800 px-6 flex items-center justify-between bg-white dark:bg-slate-950 sticky top-0 z-30">
          <div />
          <Link href="/dashboard/agents/new"
            className="inline-flex items-center gap-2 px-4 py-1.5 bg-green-500 hover:bg-green-400 text-black font-semibold rounded-lg text-sm transition-colors">
            + New Agent
          </Link>
        </div>
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
