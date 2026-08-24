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
        <h1 className="text-lg font-semibold text-ink">FAQs</h1>
        <Link href="/faqs/new" className="btn-primary">
          New FAQ
        </Link>
      </div>

      {faqs === null && <p className="mt-6 field-hint">Loading…</p>}

      {faqs?.length === 0 && <p className="mt-6 field-hint">No FAQs yet.</p>}

      <ul className="mt-6 flex flex-col gap-4">
        {faqs?.map((faq) => (
          <li
            key={faq.id}
            className="flex items-center justify-between gap-4 px-4 py-3 bg-white border border-border rounded-lg"
          >
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-ink">
                {faq.question}
              </p>
              <p className="mt-0.5 field-hint">
                order {faq.sort_order} ·{" "}
                {faq.is_published ? "published" : "draft"}
              </p>
            </div>
            <div className="flex shrink-0 gap-3 text-sm">
              <Link
                href={`/faqs/${faq.id}`}
                className="text-muted hover:text-ink hover:underline"
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
