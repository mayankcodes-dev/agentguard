// Dashboard layout is now handled by AppShell inside page.tsx
// This layout is kept minimal to avoid double-wrapping
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
