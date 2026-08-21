"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch } from "@/lib/api";

interface Testimonial {
  id: number;
  client_name: string;
  client_org: string | null;
  is_published: boolean;
}

export default function TestimonialsPage() {
  const [items, setItems] = useState<Testimonial[] | null>(null);

  async function load() {
    setItems(await apiFetch<Testimonial[]>("/api/v1/admin/testimonials"));
  }

  useEffect(() => {
    load();
  }, []);

  async function handleDelete(id: number) {
    if (!confirm("Delete this testimonial?")) return;
    await apiFetch(`/api/v1/admin/testimonials/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-slate-900">Testimonials</h1>
        </div>
        <Link
          href="/testimonials/new"
          className="shrink-0 rounded-md bg-slate-900 px-3 py-1.5 text-sm font-semibold text-white"
        >
          New testimonial
        </Link>
      </div>

      {items === null && (
        <p className="mt-6 text-sm text-slate-500">Loading…</p>
      )}
      {items?.length === 0 && (
        <p className="mt-6 text-sm text-slate-500">None yet.</p>
      )}

      <ul className="mt-6 divide-y divide-slate-200 rounded-lg border bg-white">
        {items?.map((t) => (
          <li
            key={t.id}
            className="flex items-center justify-between gap-4 px-4 py-3"
          >
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-slate-900">
                {t.client_name}
              </p>
              <p className="mt-0.5 text-xs text-slate-400">
                {t.client_org ?? "—"} · {t.is_published ? "published" : "draft"}
              </p>
            </div>
            <div className="flex shrink-0 gap-3 text-sm">
              <Link
                href={`/testimonials/${t.id}`}
                className="text-slate-600 hover:underline"
              >
                Edit
              </Link>
              <button
                onClick={() => handleDelete(t.id)}
                className="text-red-600 hover:underline"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
