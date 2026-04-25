import { Suspense } from "react";
import { ClientLoginForm } from "./login-form";

export default function ClientLoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-slate-100">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-cyan-400">Opportunity Intelligence Platform</p>
          <h1 className="mt-3 text-4xl font-bold">Client Access</h1>
          <p className="mt-2 text-sm text-slate-300">Enter your project ID to access your delivery feed.</p>
        </div>
        <Suspense fallback={<div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 text-slate-300">Loading...</div>}>
          <ClientLoginForm />
        </Suspense>
      </div>
    </main>
  );
}