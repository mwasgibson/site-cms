"use client";

import { useState, type FormEvent } from "react";

export interface FaqFormValues {
  question: string;
  answer: string;
  sort_order: number;
  is_published: boolean;
}

interface FaqFormProps {
  initialValues?: FaqFormValues;
  onSubmit: (values: FaqFormValues) => Promise<void>;
  submitLabel: string;
}

const emptyValues: FaqFormValues = {
  question: "",
  answer: "",
  sort_order: 0,
  is_published: true,
};

export function FaqForm({
  initialValues,
  onSubmit,
  submitLabel,
}: FaqFormProps) {
  const [values, setValues] = useState<FaqFormValues>(
    initialValues ?? emptyValues,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await onSubmit(values);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-xl space-y-4">
      {error && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      <label className="block text-sm font-medium text-slate-700">
        Question
        <input
          required
          value={values.question}
          onChange={(e) => setValues({ ...values, question: e.target.value })}
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
        />
      </label>

      <label className="block text-sm font-medium text-slate-700">
        Answer
        <textarea
          required
          rows={5}
          value={values.answer}
          onChange={(e) => setValues({ ...values, answer: e.target.value })}
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
        />
      </label>

      <label className="block text-sm font-medium text-slate-700">
        Sort order
        <input
          type="number"
          min={0}
          value={values.sort_order}
          onChange={(e) =>
            setValues({ ...values, sort_order: Number(e.target.value) })
          }
          className="mt-1 w-32 rounded-md border border-slate-300 px-3 py-2 text-sm"
        />
      </label>

      <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
        <input
          type="checkbox"
          checked={values.is_published}
          onChange={(e) =>
            setValues({ ...values, is_published: e.target.checked })
          }
        />
        Published
      </label>

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
      >
        {isSubmitting ? "Saving…" : submitLabel}
      </button>
    </form>
  );
}
