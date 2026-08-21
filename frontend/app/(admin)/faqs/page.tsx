"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch } from "@/lib/api";

interface Faq {
  id: number;
  question: string;
  answer: string;
  sort_order: number;
  is_published: boolean;
}

export default function FaqsPage() {
  const [faqs, setFaqs] = useState<Faq[] | null>(null);

  async function load() {
    setFaqs(await apiFetch<Faq[]>("/api/v1/admin/faqs"));
  }

  useEffect(() => {
    load();
  }, []);

  async function handleDelete(id: number) {
    if (!confirm("Delete this FAQ?")) return;
    await apiFetch(`/api/v1/admin/faqs/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold text-slate-900">FAQs</h1>
        <Link
          href="/faqs/new"
          className="rounded-md bg-slate-900 px-3 py-1.5 text-sm font-semibold text-white"
        >
          New FAQ
        </Link>
      </div>

      {faqs === null && <p className="mt-6 text-sm text-slate-500">Loading…</p>}

      {faqs?.length === 0 && (
        <p className="mt-6 text-sm text-slate-500">No FAQs yet.</p>
      )}

      <ul className="mt-6 divide-y divide-slate-200 rounded-lg border bg-white">
        {faqs?.map((faq) => (
          <li
            key={faq.id}
            className="flex items-center justify-between gap-4 px-4 py-3"
          >
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-slate-900">
                {faq.question}
              </p>
              <p className="mt-0.5 text-xs text-slate-400">
                order {faq.sort_order} ·{" "}
                {faq.is_published ? "published" : "draft"}
              </p>
            </div>
            <div className="flex shrink-0 gap-3 text-sm">
              <Link
                href={`/faqs/${faq.id}`}
                className="text-slate-600 hover:underline"
              >
                Edit
              </Link>
              <button
                onClick={() => handleDelete(faq.id)}
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
