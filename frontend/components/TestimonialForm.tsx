"use client";

import { useState, type FormEvent } from "react";
import { ImageUploadField } from "@/components/ImageUploadField";

export interface TestimonialFormValues {
  client_name: string;
  client_role: string;
  client_org: string;
  logo_url: string | null;
  quote: string;
  sort_order: number;
  is_published: boolean;
}

interface TestimonialFormProps {
  initialValues?: TestimonialFormValues;
  onSubmit: (values: TestimonialFormValues) => Promise<void>;
  submitLabel: string;
}

const emptyValues: TestimonialFormValues = {
  client_name: "",
  client_role: "",
  client_org: "",
  logo_url: null,
  quote: "",
  sort_order: 0,
  is_published: true,
};

export function TestimonialForm({
  initialValues,
  onSubmit,
  submitLabel,
}: TestimonialFormProps) {
  const [values, setValues] = useState<TestimonialFormValues>(
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
        Client name
        <input
          required
          value={values.client_name}
          onChange={(e) =>
            setValues({ ...values, client_name: e.target.value })
          }
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
        />
      </label>

      <div className="grid grid-cols-2 gap-4">
        <label className="block text-sm font-medium text-slate-700">
          Role
          <input
            value={values.client_role}
            onChange={(e) =>
              setValues({ ...values, client_role: e.target.value })
            }
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Organization
          <input
            value={values.client_org}
            onChange={(e) =>
              setValues({ ...values, client_org: e.target.value })
            }
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
        </label>
      </div>

      <label className="block text-sm font-medium text-slate-700">
        Quote
        <textarea
          required
          rows={4}
          value={values.quote}
          onChange={(e) => setValues({ ...values, quote: e.target.value })}
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
        />
      </label>

      <ImageUploadField
        label="Logo"
        value={values.logo_url}
        onChange={(url) => setValues({ ...values, logo_url: url })}
      />

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
