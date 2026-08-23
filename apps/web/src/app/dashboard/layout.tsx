import Link from 'next/link';

const NAV = [
  { href: '/dashboard', label: 'Overview' },
  { href: '/dashboard/runs', label: 'Test Runs' },
  { href: '/dashboard/agents/new', label: 'New Agent' },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Sidebar */}
      <aside className="w-56 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 fixed inset-y-0 left-0 z-40 flex flex-col">
        {/* Logo */}
        <div className="h-14 px-5 flex items-center border-b border-slate-200 dark:border-slate-800">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-green-500 flex items-center justify-center">
              <span className="text-black font-bold text-xs">AG</span>
            </div>
            <span className="font-semibold text-slate-900 dark:text-white">AgentGuard</span>
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

        <div className="p-3 border-t border-slate-200 dark:border-slate-800">
          <Link href="/" className="px-3 py-2 text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors block">
            ← Back to landing
          </Link>
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
