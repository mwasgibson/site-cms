"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";

const navItems = [
  { href: "/faqs", label: "FAQs" },
  { href: "/blog-posts", label: "Blog posts" },
  { href: "/testimonials", label: "Testimonials" },
  { href: "/page-content", label: "Page content" },
  { href: "/settings", label: "Site settings" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) router.replace("/login");
  }, [isLoading, user, router]);

  if (isLoading) {
    return <div className="p-8 field-hint">Loading…</div>;
  }

  if (!user) return null; // redirect effect above will fire

  return (
    <div className="flex min-h-screen">
      <aside className="w-56 shrink-0 border-r border-border bg-surface p-4 fixed top-0 left-0 bottom-0">
        <p className="px-2 font-display text-sm font-semibold text-ink">CMS</p>
        <nav className="mt-6 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block rounded-md px-2 py-1.5 text-sm text-muted transition duration-fast hover:bg-paper hover:text-ink"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="mt-8 border-t pt-4">
          <p className="px-2 field-hint">{user.email}</p>
          <button
            onClick={() => logout()}
            className="mt-2 w-full rounded-md px-2 py-1.5 text-left text-sm text-muted transition duration-fast hover:bg-paper hover:text-ink"
          >
            Sign out
          </button>
        </div>
      </aside>
      <main className="flex-1 p-8 ml-56">{children}</main>
    </div>
  );
}
