import type { Metadata } from 'next';
import { ClerkProvider } from '@clerk/nextjs';
import { LenisProvider } from '@/components/lenis-provider';
import { ThemeProvider } from '@/components/theme-provider';
import './globals.css';

export const metadata: Metadata = {
  title: 'AgentGuard — Break Your AI Agent Before Your Users Do',
  description: 'Automated adversarial testing and reliability scoring for AI agents. Find prompt injection, tool loops, and destructive actions before they reach production.',
  openGraph: {
    title: 'AgentGuard',
    description: 'CI/CD for AI Agents — 83 adversarial scenarios, 12 failure types, real-time reliability scoring.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link
            href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&family=Instrument+Serif:ital@0;1&display=swap"
            rel="stylesheet"
          />
        </head>
        <body className="font-sans antialiased">
          <ThemeProvider>
            <LenisProvider>{children}</LenisProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
