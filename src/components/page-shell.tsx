import { ReactNode } from "react";
import { SiteNav } from "./site-nav";

export function PageShell({ title, subtitle, children }: { title: string; subtitle?: string; children: ReactNode }) {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <SiteNav />
      <div className="px-6 py-10">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-3xl font-bold">{title}</h1>
          {subtitle ? <p className="mt-2 text-slate-300">{subtitle}</p> : null}
          <div className="mt-8">{children}</div>
        </div>
      </div>
    </main>
  );
}
