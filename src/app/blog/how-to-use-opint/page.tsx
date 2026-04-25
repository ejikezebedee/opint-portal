import Link from "next/link";

const steps = [
  {
    title: "Understand what OPINT is",
    body:
      "OPINT is an Opportunity Intelligence Platform. It collects opportunities from compliant public sources, organizes them into a clean structure, matches them to client projects, and delivers them through the portal, export, or digest.",
  },
  {
    title: "Start with the right project",
    body:
      "Every workflow in OPINT begins with a project. A project defines the client, market, keywords, filters, and delivery goal. If the project is clear, the results become more useful and more focused.",
  },
  {
    title: "Connect or review the source flow",
    body:
      "Sources are the public places OPINT monitors. These can be RSS or HTML sources today. The platform ingests those records, normalizes them, and stores them for review and matching.",
  },
  {
    title: "Let OPINT organize the data",
    body:
      "After ingestion, OPINT cleans the raw records, removes duplicates, and stores a consistent opportunity record with the fields needed for search, review, and delivery.",
  },
  {
    title: "Review weak or ambiguous items",
    body:
      "If an item is low-confidence or unclear, it can be held for review before delivery. This protects quality and ensures clients receive useful intelligence instead of noise.",
  },
  {
    title: "Match opportunities to the right client work",
    body:
      "The matching engine compares opportunities against project keywords and filters. Good matches generate delivery events so the right client sees the right opportunity stream.",
  },
  {
    title: "Consume the feed or digest",
    body:
      "Clients can read their matched opportunities inside the client feed, export them as CSV, or receive them by email digest depending on delivery preferences.",
  },
  {
    title: "Use OPINT as an ongoing intelligence service",
    body:
      "The real value of OPINT is consistency. Instead of random manual searching, the platform gives a repeatable flow of market intelligence that can be used for lead generation, market monitoring, business development, and client reporting.",
  },
];

const keyAreas = [
  { href: "/", label: "Home", desc: "Overview of the platform and main entry points." },
  { href: "/admin/sources", label: "Sources", desc: "Manage the compliant source records being monitored." },
  { href: "/admin/clients", label: "Clients", desc: "Create and manage client accounts." },
  { href: "/admin/projects", label: "Projects", desc: "Define the target market, filters, and delivery goals." },
  { href: "/admin/opportunities", label: "Opportunities", desc: "Inspect the ingested records and quality signals." },
  { href: "/admin/review", label: "Review Queue", desc: "Handle low-confidence items before delivery." },
  { href: "/client/feed", label: "Client Feed", desc: "See what a client actually receives." },
];

export default function HowToUseOpintPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-slate-100">
      <article className="mx-auto max-w-4xl space-y-10">
        <div className="space-y-4">
          <Link href="/blog" className="text-sm font-medium text-cyan-400 hover:text-cyan-300">
            ← Back to blog
          </Link>
          <p className="text-sm uppercase tracking-[0.3em] text-cyan-400">Visitor Guide</p>
          <h1 className="text-4xl font-bold">How to Use OPINT Step by Step</h1>
          <p className="max-w-3xl text-lg leading-7 text-slate-300">
            If you are new to OPINT, this guide will help you understand what the site does, how information moves through it, and how to make practical use of the platform without confusion.
          </p>
        </div>

        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-2xl font-semibold">What OPINT is in one line</h2>
          <p className="mt-3 leading-7 text-slate-300">
            OPINT turns raw public opportunity signals into structured, reviewable, client-ready business intelligence.
          </p>
        </section>

        <section className="space-y-5">
          <h2 className="text-2xl font-semibold">Step-by-step walkthrough</h2>
          <div className="space-y-4">
            {steps.map((step, index) => (
              <div key={step.title} className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400">Step {index + 1}</p>
                <h3 className="mt-2 text-xl font-semibold">{step.title}</h3>
                <p className="mt-3 leading-7 text-slate-300">{step.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-5">
          <h2 className="text-2xl font-semibold">Where to go inside the site</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {keyAreas.map((area) => (
              <Link key={area.href} href={area.href} className="rounded-2xl border border-slate-800 bg-slate-900 p-5 transition hover:border-cyan-500 hover:bg-slate-900/80">
                <h3 className="text-lg font-semibold">{area.label}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-300">{area.desc}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-2xl font-semibold">Best way to use OPINT</h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-slate-300">
            <li>Define the client and project clearly.</li>
            <li>Use focused keywords and realistic filters.</li>
            <li>Review quality before promising delivery standards.</li>
            <li>Use the client feed and digest history as the delivery record.</li>
            <li>Treat the platform as an ongoing intelligence workflow, not a one-off search tool.</li>
          </ul>
        </section>
      </article>
    </main>
  );
}
