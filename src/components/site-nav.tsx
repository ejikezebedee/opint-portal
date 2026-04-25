import Link from "next/link";
import { LogoutButton } from "./logout-button";

const links = [
  { href: "/", label: "Home" },
  { href: "/admin/dashboard", label: "Dashboard" },
  { href: "/admin/operations", label: "Operations" },
  { href: "/admin/analytics", label: "Analytics" },
  { href: "/admin/sources", label: "Sources" },
  { href: "/admin/clients", label: "Clients" },
  { href: "/admin/projects", label: "Projects" },
  { href: "/admin/opportunities", label: "Opportunities" },
  { href: "/admin/review", label: "Review" },
  { href: "/client/feed", label: "Client Feed" },
];

export function SiteNav() {
  return (
    <nav className="sticky top-0 z-20 border-b border-slate-800 bg-slate-950/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-6 py-4 text-sm text-slate-300">
        <div className="flex flex-wrap items-center gap-3">
          <span className="mr-4 text-sm font-semibold uppercase tracking-[0.25em] text-cyan-400">OPINT</span>
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="rounded-lg px-3 py-2 transition hover:bg-slate-900 hover:text-white">
              {link.label}
            </Link>
          ))}
        </div>
        <LogoutButton />
      </div>
    </nav>
  );
}
