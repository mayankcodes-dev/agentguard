import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <SignUp
        appearance={{
          elements: {
            rootBox: 'mx-auto',
            card: 'bg-slate-900 border border-slate-800 shadow-2xl',
            headerTitle: 'text-white',
            headerSubtitle: 'text-slate-400',
            socialButtonsBlockButton: 'bg-slate-800 border-slate-700 text-white hover:bg-slate-700',
            socialButtonsBlockButtonText: 'text-white',
            dividerLine: 'bg-slate-700',
            dividerText: 'text-slate-500',
            formFieldLabel: 'text-slate-300',
            formFieldInput: 'bg-slate-800 border-slate-700 text-white placeholder-slate-500 focus:border-green-500',
            formButtonPrimary: 'bg-green-500 hover:bg-green-400 text-black font-semibold',
            footerActionText: 'text-slate-400',
            footerActionLink: 'text-green-400 hover:text-green-300',
          },
        }}
      />
    </div>
  );
}
