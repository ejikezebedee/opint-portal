import Link from "next/link";

const posts = [
  {
    href: "/blog/how-to-use-opint",
    title: "How to Use OPINT Step by Step",
    excerpt:
      "A practical walkthrough for first-time visitors: what OPINT does, how to set up a project, how opportunities flow, and how to use the portal effectively.",
  },
];

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-slate-100">
      <div className="mx-auto max-w-5xl space-y-8">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-cyan-400">OPINT Blog</p>
          <h1 className="mt-3 text-4xl font-bold">Guides, walkthroughs, and platform explainers</h1>
          <p className="mt-3 max-w-3xl text-slate-300">
            This section helps any visitor understand what OPINT is, how it works, and how to use the site step by step.
          </p>
        </div>

        <div className="grid gap-6">
          {posts.map((post) => (
            <Link
              key={post.href}
              href={post.href}
              className="rounded-2xl border border-slate-800 bg-slate-900 p-6 transition hover:border-cyan-500 hover:bg-slate-900/80"
            >
              <h2 className="text-2xl font-semibold">{post.title}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-300">{post.excerpt}</p>
              <p className="mt-4 text-sm font-medium text-cyan-400">Read article →</p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
