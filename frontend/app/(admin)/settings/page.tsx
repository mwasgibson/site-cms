"use client";

import { useEffect, useState, type FormEvent } from "react";
import { apiFetch } from "@/lib/api";

interface Settings {
  product_name: string;
  company_name: string;
  tagline: string;
  domain: string;
  contact_email: string;
  contact_phone: string;
  street_address: string;
  address_locality: string;
  address_country: string;
  regulator: string;
  licence: string;
  data_law: string;
  social_linkedin: string;
  social_x: string;
}

const FIELD_GROUPS: {
  title: string;
  fields: { key: keyof Settings; label: string }[];
}[] = [
  {
    title: "Identity",
    fields: [
      { key: "product_name", label: "Product name" },
      { key: "company_name", label: "Company legal name" },
      { key: "tagline", label: "Tagline" },
    ],
  },
  {
    title: "Domain / contact",
    fields: [
      { key: "domain", label: "Domain" },
      { key: "contact_email", label: "Contact email" },
      { key: "contact_phone", label: "Contact phone" },
    ],
  },
  {
    title: "Location",
    fields: [
      { key: "street_address", label: "Street address" },
      { key: "address_locality", label: "Locality" },
      { key: "address_country", label: "Country code" },
    ],
  },
  {
    title: "Regulatory / trust signals",
    fields: [
      { key: "regulator", label: "Regulator" },
      { key: "licence", label: "Licence" },
      { key: "data_law", label: "Data protection law" },
    ],
  },
  {
    title: "Social",
    fields: [
      { key: "social_linkedin", label: "LinkedIn URL" },
      { key: "social_x", label: "X (Twitter) URL" },
    ],
  },
];

export default function SettingsPage() {
  const [values, setValues] = useState<Settings | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiFetch<Settings>("/api/v1/admin/settings").then(setValues);
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!values) return;
    setError(null);
    setIsSaving(true);
    try {
      const updated = await apiFetch<Settings>("/api/v1/admin/settings", {
        method: "PUT",
        body: values,
      });
      setValues(updated);
      setSavedAt(Date.now());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save.");
    } finally {
      setIsSaving(false);
    }
  }

  if (!values) return <p className="field-hint">Loading…</p>;

  return (
    <div>
      <h1 className="text-lg font-semibold text-ink">Site settings</h1>

      <form onSubmit={handleSubmit} className="mt-6 max-w-2xl space-y-8">
        {error && (
          <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        )}

        {FIELD_GROUPS.map((group) => (
          <fieldset
            key={group.title}
            className="panel p-4"
          >
            <legend className="px-1 text-xs font-semibold uppercase tracking-wide text-muted">
              {group.title}
            </legend>
            <div className="space-y-3">
              {group.fields.map((field) => (
                <label
                  key={field.key}
                  className="field-label"
                >
                  {field.label}
                  <input
                    value={values[field.key]}
                    onChange={(e) =>
                      setValues({ ...values, [field.key]: e.target.value })
                    }
                    className="field-input"
                  />
                </label>
              ))}
            </div>
          </fieldset>
        ))}

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={isSaving}
            className="btn-primary"
          >
            {isSaving ? "Saving…" : "Save settings"}
          </button>
          {savedAt && <span className="field-hint">Saved.</span>}
        </div>
      </form>
    </div>
  );
}
