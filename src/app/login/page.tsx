import { Suspense } from "react";
import { LoginForm } from "./login-form";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-slate-100">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-cyan-400">Opportunity Intelligence Platform</p>
          <h1 className="mt-3 text-4xl font-bold">Secure Access</h1>
        </div>
        <Suspense fallback={<div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 text-slate-300">Loading login...</div>}>
          <LoginForm />
        </Suspense>
      </div>
    </main>
  );
}
