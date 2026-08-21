"use client";

import { useState, type FormEvent } from "react";
import { RichTextEditor } from "@/components/RichTextEditor";
import { ImageUploadField } from "@/components/ImageUploadField";

export interface BlogPostFormValues {
  title: string;
  slug?: string;
  excerpt: string;
  body: string;
  cover_image_url: string | null;
  seo_title: string;
  seo_description: string;
  published_at: string; // datetime-local string, or "" for draft
}

interface BlogPostFormProps {
  initialValues?: BlogPostFormValues;
  onSubmit: (values: BlogPostFormValues) => Promise<void>;
  submitLabel: string;
}

const emptyValues: BlogPostFormValues = {
  title: "",
  excerpt: "",
  body: "",
  cover_image_url: null,
  seo_title: "",
  seo_description: "",
  published_at: "",
};

export function BlogPostForm({
  initialValues,
  onSubmit,
  submitLabel,
}: BlogPostFormProps) {
  const [values, setValues] = useState<BlogPostFormValues>(
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
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-5">
      {error && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      <label className="block text-sm font-medium text-slate-700">
        Title
        <input
          required
          value={values.title}
          onChange={(e) => setValues({ ...values, title: e.target.value })}
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
        />
      </label>

      {initialValues && (
        <label className="block text-sm font-medium text-slate-700">
          Slug
          <input
            value={values.slug ?? ""}
            onChange={(e) => setValues({ ...values, slug: e.target.value })}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm font-mono"
          />
          <span className="mt-1 block text-xs text-slate-400">
            Changing this breaks any existing links to the post.
          </span>
        </label>
      )}

      <label className="block text-sm font-medium text-slate-700">
        Excerpt
        <textarea
          rows={2}
          maxLength={320}
          value={values.excerpt}
          onChange={(e) => setValues({ ...values, excerpt: e.target.value })}
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
        />
      </label>

      <div>
        <label className="block text-sm font-medium text-slate-700">Body</label>
        <div className="mt-1">
          <RichTextEditor
            value={values.body}
            onChange={(html) => setValues((v) => ({ ...v, body: html }))}
          />
        </div>
      </div>

      <ImageUploadField
        label="Cover image"
        value={values.cover_image_url}
        onChange={(url) => setValues({ ...values, cover_image_url: url })}
      />

      <fieldset className="rounded-md border border-slate-200 p-4">
        <legend className="px-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
          SEO
        </legend>
        <label className="block text-sm font-medium text-slate-700">
          SEO title
          <input
            value={values.seo_title}
            onChange={(e) =>
              setValues({ ...values, seo_title: e.target.value })
            }
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
        </label>
        <label className="mt-3 block text-sm font-medium text-slate-700">
          SEO description
          <textarea
            rows={2}
            maxLength={320}
            value={values.seo_description}
            onChange={(e) =>
              setValues({ ...values, seo_description: e.target.value })
            }
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
        </label>
      </fieldset>

      <label className="block text-sm font-medium text-slate-700">
        Published at
        <input
          type="datetime-local"
          value={values.published_at}
          onChange={(e) =>
            setValues({ ...values, published_at: e.target.value })
          }
          className="mt-1 w-64 rounded-md border border-slate-300 px-3 py-2 text-sm"
        />
        <span className="mt-1 block text-xs text-slate-400">
          Leave blank to save as a draft — it won&apos;t appear on the public
          endpoint.
        </span>
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
