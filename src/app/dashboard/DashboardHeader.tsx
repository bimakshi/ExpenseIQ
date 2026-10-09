"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import LogoutButton from "./LogoutButton";

const links = [
  { href: "/dashboard", label: "Overview", exact: true },
  { href: "/dashboard/budgets", label: "Budgets", exact: false },
  { href: "/dashboard/categories", label: "Categories", exact: false },
];

function isActive(pathname: string, href: string, exact: boolean) {
  if (exact) {
    return pathname === href;
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function DashboardHeader() {
  const pathname = usePathname();

  return (
    <header className="eq-app-header">
      <div className="eq-app-header-inner">
        <Link href="/dashboard" className="eq-app-brand">
          Expense<span>IQ</span>
        </Link>

        <nav className="eq-app-nav" aria-label="Dashboard navigation">
          {links.map((link) => {
            const active = isActive(pathname, link.href, link.exact);

            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={active ? "eq-app-nav-link is-active" : "eq-app-nav-link"}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <LogoutButton />
      </div>
    </header>
  );
}
