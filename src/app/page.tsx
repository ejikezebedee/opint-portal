import Link from "next/link";

const metrics = [
  { value: "Compliant", label: "Source monitoring only from approved public inputs" },
  { value: "Structured", label: "Every opportunity normalized into a usable record" },
  { value: "Traceable", label: "Audit trail from source to delivery" },
];

const workflow = [
  {
    title: "Monitor relevant sources",
    desc: "OPINT continuously watches approved public feeds and pages for fresh market, lead, and opportunity signals.",
  },
  {
    title: "Normalize and score",
    desc: "Raw information is cleaned, deduplicated, scored, and prepared for business use instead of staying scattered and noisy.",
  },
  {
    title: "Review and deliver",
    desc: "Qualified opportunities are matched to the correct client project and delivered through feed, export, or digest.",
  },
];

const useCases = [
  "Lead intelligence for service businesses",
  "Sector monitoring for LNG, energy, tax, and recruitment markets",
  "Client-specific opportunity feeds and digests",
  "Structured review workflow for low-confidence signals",
  "Operational visibility for source, project, and delivery performance",
  "Repeatable market intelligence as a service",
];

const actions = [
  {
    href: "/client/login",
    title: "Client Access",
    desc: "Open the client side of OPINT to consume project-linked opportunity delivery.",
    cta: "Client login",
  },
  {
    href: "/login",
    title: "Operator Access",
    desc: "Use the admin side to manage sources, projects, review workflow, and delivery operations.",
    cta: "Admin login",
  },
  {
    href: "/blog/how-to-use-opint",
    title: "How to Use OPINT",
    desc: "Read the step-by-step guide for understanding how the platform works from source to delivery.",
    cta: "Read guide",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <section className="border-b border-slate-800 bg-slate-950/95">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-5">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-400">OPINT</p>
            <p className="mt-1 text-sm text-slate-400">Opportunity Intelligence Platform</p>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <Link href="/blog/how-to-use-opint" className="rounded-lg px-3 py-2 text-slate-300 transition hover:bg-slate-900 hover:text-white">
              Guide
            </Link>
            <Link href="/client/login" className="rounded-lg px-3 py-2 text-slate-300 transition hover:bg-slate-900 hover:text-white">
              Client Login
            </Link>
            <Link href="/login" className="rounded-lg bg-cyan-500 px-4 py-2 font-medium text-slate-950 transition hover:bg-cyan-400">
              Admin Login
            </Link>
          </div>
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-2 lg:items-center">
          <div className="space-y-6">
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-400">Professional opportunity intelligence</p>
            <h1 className="max-w-4xl text-5xl font-bold leading-tight">
              Turn public market signals into structured, client-ready business intelligence.
            </h1>
            <p className="max-w-3xl text-lg leading-8 text-slate-300">
              OPINT helps teams discover, organize, review, and deliver high-value opportunities through a controlled workflow built for visibility, repeatability, and commercial use.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/client/login" className="rounded-xl bg-cyan-500 px-5 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400">
                Enter Client Portal
              </Link>
              <Link href="/blog/how-to-use-opint" className="rounded-xl border border-slate-700 px-5 py-3 font-semibold text-slate-100 transition hover:border-cyan-500 hover:bg-slate-900">
                Read How It Works
              </Link>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
            {metrics.map((item) => (
              <div key={item.value} className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-sm shadow-cyan-950/20">
                <p className="text-3xl font-bold text-cyan-400">{item.value}</p>
                <p className="mt-3 text-sm leading-6 text-slate-300">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-slate-800 bg-slate-900/40 px-6 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-400">How OPINT works</p>
            <h2 className="mt-3 text-3xl font-bold">A clean workflow from source to client delivery</h2>
            <p className="mt-3 text-slate-300">
              OPINT is designed to prevent chaos. Each opportunity moves through a structured pipeline so that delivery is useful, reviewable, and traceable.
            </p>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {workflow.map((step, index) => (
              <div key={step.title} className="rounded-2xl border border-slate-800 bg-slate-950 p-6">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400">Step {index + 1}</p>
                <h3 className="mt-3 text-xl font-semibold">{step.title}</h3>
                <p className="mt-3 leading-7 text-slate-300">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-2">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-400">What OPINT supports</p>
            <h2 className="mt-3 text-3xl font-bold">Built for real business use cases</h2>
            <p className="mt-3 max-w-2xl text-slate-300">
              Whether the goal is opportunity discovery, market intelligence, lead flow, or client reporting, OPINT is built to make that work operational instead of manual.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <ul className="space-y-3 text-slate-200">
              {useCases.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-1 inline-flex h-2.5 w-2.5 rounded-full bg-cyan-400" />
                  <span className="leading-7">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="border-t border-slate-800 bg-slate-900/40 px-6 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-400">Start here</p>
            <h2 className="mt-3 text-3xl font-bold">Choose the right path into the platform</h2>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {actions.map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className="rounded-2xl border border-slate-800 bg-slate-950 p-6 transition hover:border-cyan-500 hover:bg-slate-900"
              >
                <h3 className="text-xl font-semibold">{action.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-300">{action.desc}</p>
                <p className="mt-5 text-sm font-semibold text-cyan-400">{action.cta} →</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
