import Link from "next/link";

export function MetricCard({ label, value, href }: { label: string; value: number; href: string }) {
  return (
    <Link href={href} className="rounded-2xl border border-slate-800 bg-slate-900 p-5 transition hover:border-cyan-600">
      <p className="text-sm text-slate-400">{label}</p>
      <p className="mt-3 text-3xl font-bold">{value}</p>
    </Link>
  );
}
