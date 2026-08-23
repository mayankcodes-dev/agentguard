import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center relative overflow-hidden">
      <img
        src="https://images.unsplash.com/photo-1518770660439-4636190af475?w=1920&q=80"
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
        style={{ filter: 'brightness(0.15) contrast(1.3)' }}
      />
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 60% 60% at 50% 40%, rgba(0,229,255,0.07) 0%, transparent 70%)' }} />

      <div className="relative z-10 w-full max-w-md px-4">
        <div className="flex flex-col items-center mb-8">
          <img src="/logo.svg" alt="AgentGuard" className="w-16 h-16 mb-4" />
          <h1 className="text-2xl font-bold text-white tracking-tight">Create account</h1>
          <p className="text-sm text-slate-500 mt-1">Start testing your AI agents for free</p>
        </div>

        <SignUp
          appearance={{
            elements: {
              rootBox: 'w-full',
              card: 'bg-slate-900/90 backdrop-blur border border-white/[0.07] shadow-2xl shadow-black/50 rounded-2xl',
              headerTitle: 'hidden',
              headerSubtitle: 'hidden',
              socialButtonsBlockButton:
                'bg-white/[0.05] border border-white/[0.08] text-white hover:bg-white/[0.1] rounded-xl h-11 transition-colors',
              socialButtonsBlockButtonText: 'text-white text-sm font-medium',
              dividerLine: 'bg-white/[0.07]',
              dividerText: 'text-slate-500 text-xs',
              formFieldLabel: 'text-slate-300 text-xs font-medium mb-1',
              formFieldInput:
                'bg-white/[0.05] border border-white/[0.08] text-white placeholder-slate-600 rounded-xl h-11 px-4 text-sm focus:border-cyan-500/50 transition-colors',
              formButtonPrimary:
                'bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold rounded-xl h-11 text-sm transition-colors shadow-lg shadow-cyan-500/20',
              footerActionText: 'text-slate-500 text-xs',
              footerActionLink: 'text-cyan-400 hover:text-cyan-300 font-medium transition-colors',
              alertText: 'text-red-400 text-xs',
              alert: 'bg-red-500/10 border border-red-500/20 rounded-xl',
            },
            layout: {
              socialButtonsVariant: 'blockButton',
              logoPlacement: 'none',
            },
          }}
        />

        <p className="text-center text-xs text-slate-600 mt-6">
          Designed by{' '}
          <a href="https://mayankcodes.dev" target="_blank" rel="noopener noreferrer"
            className="text-cyan-500/60 hover:text-cyan-400 transition-colors">
            Mayank Singh
          </a>
        </p>
      </div>
    </div>
  );
}
