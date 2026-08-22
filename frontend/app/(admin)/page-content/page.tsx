"use client";

import { useEffect, useState } from "react";
import { apiFetch, ApiError } from "@/lib/api";
import {
  ArraySectionEditor,
  type FieldDescriptor,
} from "@/components/ArraySectionEditor";

// ---- Types — mirror the marketing site's lib/cms.ts PageContent shape ----

interface HeroContent {
  eyebrow: string;
  headline_before: string;
  headline_highlight: string;
  headline_after: string;
  subhead: string;
  primary_cta_label: string;
  secondary_cta_label: string;
  trust_stats: { label: string; value: string }[];
}
interface FeaturesContent {
  heading: string;
  groups: { category: string; items: string[] }[];
}
interface SecurityContent {
  heading: string;
  bullets: { icon: string; title: string; body: string }[];
}
interface GlossaryContent {
  items: { title: string; body: string }[];
}
interface HowItWorksContent {
  heading: string;
  subhead: string;
  steps: { n: string; title: string; badges: string[]; body: string }[];
}
interface EngineeringContent {
  heading: string;
  bullets: string[];
  cta_label: string;
  api_endpoints: { method: string; path: string; desc: string }[];
}
interface StatsContent {
  items: { value: string; label: string }[];
}
interface UseCasesContent {
  heading: string;
  closing_line: string;
  segments: { segment: string; body: string; scenarios: string[] }[];
}
interface FinalCtaContent {
  headline: string;
  body: string;
  cta_label: string;
}

interface PageContent {
  hero: HeroContent;
  features: FeaturesContent;
  security: SecurityContent;
  glossary: GlossaryContent;
  how_it_works: HowItWorksContent;
  engineering: EngineeringContent;
  stats: StatsContent;
  use_cases: UseCasesContent;
  final_cta: FinalCtaContent;
}

const ICON_OPTIONS = [
  "lock",
  "shield-check",
  "key-round",
  "scroll-text",
  "clock-3",
  "list-checks",
];
const METHOD_OPTIONS = ["GET", "POST", "PUT", "DELETE"];

// ---- Save hook — shared PUT-and-status logic for every section --------

function useSectionSave(
  pageContent: PageContent | null,
  setPageContent: (p: PageContent) => void,
) {
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [savedKey, setSavedKey] = useState<string | null>(null);
  const [errorKey, setErrorKey] = useState<{
    key: string;
    message: string;
  } | null>(null);

  async function save<K extends keyof PageContent>(
    key: K,
    value: PageContent[K],
  ) {
    if (!pageContent) return;
    setSavingKey(key);
    setErrorKey(null);
    setSavedKey(null);
    try {
      await apiFetch(`/api/v1/admin/page-content/${key}`, {
        method: "PUT",
        body: { content: value },
      });
      setPageContent({ ...pageContent, [key]: value });
      setSavedKey(key);
    } catch (err) {
      setErrorKey({
        key,
        message: err instanceof ApiError ? err.message : "Failed to save.",
      });
    } finally {
      setSavingKey(null);
    }
  }

  return { save, savingKey, savedKey, errorKey };
}

// ---- Small shared bits --------------------------------------------------

function SaveBar({
  sectionKey,
  onSave,
  savingKey,
  savedKey,
  errorKey,
}: {
  sectionKey: keyof PageContent;
  onSave: () => void;
  savingKey: string | null;
  savedKey: string | null;
  errorKey: { key: string; message: string } | null;
}) {
  return (
    <div className="mt-4 flex items-center gap-3 border-t border-slate-200 pt-4">
      <button
        type="button"
        onClick={onSave}
        disabled={savingKey === sectionKey}
        className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
      >
        {savingKey === sectionKey ? "Saving…" : "Save section"}
      </button>
      {savedKey === sectionKey && (
        <span className="text-xs text-slate-400">Saved.</span>
      )}
      {errorKey?.key === sectionKey && (
        <span className="text-xs text-red-600">{errorKey.message}</span>
      )}
    </div>
  );
}

function TextField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block text-sm font-medium text-slate-700">
      {label}
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
      />
    </label>
  );
}

function TextareaField({
  label,
  value,
  onChange,
  rows = 3,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
}) {
  return (
    <label className="block text-sm font-medium text-slate-700">
      {label}
      <textarea
        rows={rows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
      />
    </label>
  );
}

// ---- Field configs for the list-shaped sections -------------------------

const featureGroupFields: FieldDescriptor[] = [
  { key: "category", label: "Category name", type: "text" },
  { key: "items", label: "Items", type: "lines" },
];
const securityBulletFields: FieldDescriptor[] = [
  { key: "icon", label: "Icon", type: "select", options: ICON_OPTIONS },
  { key: "title", label: "Title", type: "text" },
  { key: "body", label: "Body", type: "textarea" },
];
const glossaryFields: FieldDescriptor[] = [
  { key: "title", label: "Title", type: "text" },
  {
    key: "body",
    label: "Body — use {productName} for the product name",
    type: "textarea",
  },
];
const stepFields: FieldDescriptor[] = [
  { key: "n", label: "Number (e.g. 01)", type: "text" },
  { key: "title", label: "Title", type: "text" },
  { key: "badges", label: "Badges", type: "lines" },
  { key: "body", label: "Body", type: "textarea" },
];
const apiEndpointFields: FieldDescriptor[] = [
  { key: "method", label: "Method", type: "select", options: METHOD_OPTIONS },
  { key: "path", label: "Path", type: "text", placeholder: "/v1/sms/send" },
  { key: "desc", label: "Description", type: "text" },
];
const statFields: FieldDescriptor[] = [
  { key: "value", label: "Value", type: "text", placeholder: "10–30 TPS" },
  { key: "label", label: "Label", type: "text" },
];
const segmentFields: FieldDescriptor[] = [
  { key: "segment", label: "Segment name", type: "text" },
  { key: "body", label: "Body", type: "textarea" },
  { key: "scenarios", label: "Scenarios", type: "lines" },
];
const INITIAL_CONTENT: PageContent = {
  hero: {
    eyebrow: "",
    headline_before: "",
    headline_highlight: "",
    headline_after: "",
    subhead: "",
    primary_cta_label: "",
    secondary_cta_label: "",
    trust_stats: [],
  },
  features: { heading: "", groups: [] },
  security: { heading: "", bullets: [] },
  glossary: { items: [] },
  how_it_works: { heading: "", subhead: "", steps: [] },
  engineering: { heading: "", bullets: [], cta_label: "", api_endpoints: [] },
  stats: { items: [] },
  use_cases: { heading: "", closing_line: "", segments: [] },
  final_cta: { headline: "", body: "", cta_label: "" },
};

// ---- Page ----------------------------------------------------------------

export default function PageContentPage() {
  const [page, setPage] = useState<PageContent>(INITIAL_CONTENT);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch<PageContent>("/api/v1/admin/page-content")
      .then((data) => {
        // Merge defaults with API data to prevent missing keys
        setPage((prev) => ({ ...prev, ...data }));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const { save, savingKey, savedKey, errorKey } = useSectionSave(page, setPage);

  if (loading) return <p className="text-sm text-slate-500">Loading…</p>;

  return (
    <div>
      <h1 className="text-lg font-semibold text-slate-900">Page content</h1>
      <p className="mt-1 max-w-2xl text-xs text-slate-400">
        Edits the marketing homepage&apos;s Hero, Platform, Security, Glossary,
        How It Works, Engineering, Stats, Use Cases, and Final CTA sections. The
        header/nav and footer aren&apos;t covered here — nav labels are tied to
        in-page anchor links, and footer content already comes from Site
        Settings. Each section below saves independently.
      </p>

      <div className="mt-8 space-y-4 max-w-2xl">
        {/* HERO */}
        <details className="rounded-lg border bg-white p-5" open>
          <summary className="cursor-pointer font-display text-base font-semibold text-slate-900">
            Hero
          </summary>
          <div className="mt-4 space-y-3">
            <TextField
              label="Eyebrow"
              value={page.hero.eyebrow}
              onChange={(v) =>
                setPage((prev) => ({
                  ...prev,
                  hero: { ...prev.hero, eyebrow: v },
                }))
              }
            />
            <div className="grid grid-cols-3 gap-3">
              <TextField
                label="Headline (before highlight)"
                value={page.hero.headline_before}
                onChange={(v) =>
                  setPage((prev) => ({
                    ...prev,
                    hero: { ...prev.hero, headline_before: v },
                  }))
                }
              />
              <TextField
                label="Headline (highlighted)"
                value={page.hero.headline_highlight}
                onChange={(v) =>
                  setPage((prev) => ({
                    ...prev,
                    hero: { ...prev.hero, headline_highlight: v },
                  }))
                }
              />
              <TextField
                label="Headline (after highlight)"
                value={page.hero.headline_after}
                onChange={(v) =>
                  setPage((prev) => ({
                    ...prev,
                    hero: { ...prev.hero, headline_after: v },
                  }))
                }
              />
            </div>
            <TextareaField
              label="Subhead — use {productName} for the product name"
              value={page.hero.subhead}
              onChange={(v) =>
                setPage((prev) => ({
                  ...prev,
                  hero: { ...prev.hero, subhead: v },
                }))
              }
            />
            <div className="grid grid-cols-2 gap-3">
              <TextField
                label="Primary CTA label"
                value={page.hero.primary_cta_label}
                onChange={(v) =>
                  setPage((prev) => ({
                    ...prev,
                    hero: { ...prev.hero, primary_cta_label: v },
                  }))
                }
              />
              <TextField
                label="Secondary CTA label"
                value={page.hero.secondary_cta_label}
                onChange={(v) =>
                  setPage((prev) => ({
                    ...prev,
                    hero: { ...prev.hero, secondary_cta_label: v },
                  }))
                }
              />
            </div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Trust stats
            </p>
            <ArraySectionEditor
              items={page.hero.trust_stats}
              onChange={(items) =>
                setPage((prev) => ({
                  ...prev,
                  hero: {
                    ...prev.hero,
                    trust_stats: items as HeroContent["trust_stats"],
                  },
                }))
              }
              fields={[
                { key: "label", label: "Label", type: "text" },
                { key: "value", label: "Value", type: "text" },
              ]}
              newItem={() => ({ label: "", value: "" })}
              itemLabel="Stat"
            />
          </div>
          <SaveBar
            sectionKey="hero"
            onSave={() => save("hero", page.hero)}
            savingKey={savingKey}
            savedKey={savedKey}
            errorKey={errorKey}
          />
        </details>

        {/* FEATURES */}
        <details className="rounded-lg border bg-white p-5">
          <summary className="cursor-pointer font-display text-base font-semibold text-slate-900">
            Platform / Features
          </summary>
          <div className="mt-4 space-y-3">
            <TextField
              label="Heading"
              value={page.features.heading}
              onChange={(v) =>
                setPage((prev) => ({
                  ...prev,
                  features: { ...prev.features, heading: v },
                }))
              }
            />
            <ArraySectionEditor
              items={page.features.groups}
              onChange={(items) =>
                setPage((prev) => ({
                  ...prev,
                  features: {
                    ...prev.features,
                    groups: items as FeaturesContent["groups"],
                  },
                }))
              }
              fields={featureGroupFields}
              newItem={() => ({ category: "", items: [] })}
              itemLabel="Category"
            />
          </div>
          <SaveBar
            sectionKey="features"
            onSave={() => save("features", page.features)}
            savingKey={savingKey}
            savedKey={savedKey}
            errorKey={errorKey}
          />
        </details>

        {/* SECURITY */}
        <details className="rounded-lg border bg-white p-5">
          <summary className="cursor-pointer font-display text-base font-semibold text-slate-900">
            Security &amp; Compliance
          </summary>
          <div className="mt-4 space-y-3">
            <TextField
              label="Heading"
              value={page.security.heading}
              onChange={(v) =>
                setPage((prev) => ({
                  ...prev,
                  security: { ...prev.security, heading: v },
                }))
              }
            />
            <ArraySectionEditor
              items={page.security.bullets}
              onChange={(items) =>
                setPage((prev) => ({
                  ...prev,
                  security: {
                    ...prev.security,
                    bullets: items as SecurityContent["bullets"],
                  },
                }))
              }
              fields={securityBulletFields}
              newItem={() => ({ icon: "lock", title: "", body: "" })}
              itemLabel="Bullet"
            />
          </div>
          <SaveBar
            sectionKey="security"
            onSave={() => save("security", page.security)}
            savingKey={savingKey}
            savedKey={savedKey}
            errorKey={errorKey}
          />
        </details>

        {/* GLOSSARY */}
        <details className="rounded-lg border bg-white p-5">
          <summary className="cursor-pointer font-display text-base font-semibold text-slate-900">
            Glossary (&ldquo;In plain terms&rdquo;)
          </summary>
          <div className="mt-4">
            <ArraySectionEditor
              items={page.glossary.items}
              onChange={(items) =>
                setPage((prev) => ({
                  ...prev,
                  glossary: { items: items as GlossaryContent["items"] },
                }))
              }
              fields={glossaryFields}
              newItem={() => ({ title: "", body: "" })}
              itemLabel="Term"
            />
          </div>
          <SaveBar
            sectionKey="glossary"
            onSave={() => save("glossary", page.glossary)}
            savingKey={savingKey}
            savedKey={savedKey}
            errorKey={errorKey}
          />
        </details>

        {/* HOW IT WORKS */}
        <details className="rounded-lg border bg-white p-5">
          <summary className="cursor-pointer font-display text-base font-semibold text-slate-900">
            How It Works
          </summary>
          <div className="mt-4 space-y-3">
            <TextField
              label="Heading"
              value={page.how_it_works.heading}
              onChange={(v) =>
                setPage((prev) => ({
                  ...prev,
                  how_it_works: { ...prev.how_it_works, heading: v },
                }))
              }
            />
            <TextareaField
              label="Subhead"
              value={page.how_it_works.subhead}
              onChange={(v) =>
                setPage((prev) => ({
                  ...prev,
                  how_it_works: { ...prev.how_it_works, subhead: v },
                }))
              }
            />
            <ArraySectionEditor
              items={page.how_it_works.steps}
              onChange={(items) =>
                setPage((prev) => ({
                  ...prev,
                  how_it_works: {
                    ...prev.how_it_works,
                    steps: items as HowItWorksContent["steps"],
                  },
                }))
              }
              fields={stepFields}
              newItem={() => ({ n: "", title: "", badges: [], body: "" })}
              itemLabel="Step"
            />
          </div>
          <SaveBar
            sectionKey="how_it_works"
            onSave={() => save("how_it_works", page.how_it_works)}
            savingKey={savingKey}
            savedKey={savedKey}
            errorKey={errorKey}
          />
        </details>

        {/* ENGINEERING */}
        <details className="rounded-lg border bg-white p-5">
          <summary className="cursor-pointer font-display text-base font-semibold text-slate-900">
            For Engineering Teams
          </summary>
          <div className="mt-4 space-y-3">
            <TextField
              label="Heading"
              value={page.engineering.heading}
              onChange={(v) =>
                setPage((prev) => ({
                  ...prev,
                  engineering: { ...prev.engineering, heading: v },
                }))
              }
            />
            <label className="block text-sm font-medium text-slate-700">
              Bullets
              <textarea
                rows={4}
                value={page.engineering.bullets.join("\n")}
                onChange={(e) =>
                  setPage((prev) => ({
                    ...prev,
                    engineering: {
                      ...prev.engineering,
                      bullets: e.target.value
                        .split("\n")
                        .filter((l) => l.trim() !== ""),
                    },
                  }))
                }
                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
              />
              <span className="mt-1 block text-xs text-slate-400">
                One per line.
              </span>
            </label>
            <TextField
              label="CTA label"
              value={page.engineering.cta_label}
              onChange={(v) =>
                setPage((prev) => ({
                  ...prev,
                  engineering: { ...prev.engineering, cta_label: v },
                }))
              }
            />
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              API endpoints table
            </p>
            <ArraySectionEditor
              items={page.engineering.api_endpoints}
              onChange={(items) =>
                setPage((prev) => ({
                  ...prev,
                  engineering: {
                    ...prev.engineering,
                    api_endpoints: items as EngineeringContent["api_endpoints"],
                  },
                }))
              }
              fields={apiEndpointFields}
              newItem={() => ({ method: "GET", path: "", desc: "" })}
              itemLabel="Endpoint"
            />
          </div>
          <SaveBar
            sectionKey="engineering"
            onSave={() => save("engineering", page.engineering)}
            savingKey={savingKey}
            savedKey={savedKey}
            errorKey={errorKey}
          />
        </details>

        {/* STATS */}
        <details className="rounded-lg border bg-white p-5">
          <summary className="cursor-pointer font-display text-base font-semibold text-slate-900">
            By The Numbers
          </summary>
          <div className="mt-4">
            <ArraySectionEditor
              items={page.stats.items}
              onChange={(items) =>
                setPage((prev) => ({
                  ...prev,
                  stats: { items: items as StatsContent["items"] },
                }))
              }
              fields={statFields}
              newItem={() => ({ value: "", label: "" })}
              itemLabel="Stat"
            />
          </div>
          <SaveBar
            sectionKey="stats"
            onSave={() => save("stats", page.stats)}
            savingKey={savingKey}
            savedKey={savedKey}
            errorKey={errorKey}
          />
        </details>

        {/* USE CASES */}
        <details className="rounded-lg border bg-white p-5">
          <summary className="cursor-pointer font-display text-base font-semibold text-slate-900">
            Use Cases
          </summary>
          <div className="mt-4 space-y-3">
            <TextField
              label="Heading"
              value={page.use_cases.heading}
              onChange={(v) =>
                setPage((prev) => ({
                  ...prev,
                  use_cases: { ...prev.use_cases, heading: v },
                }))
              }
            />
            <TextareaField
              label="Closing line (shown under every segment)"
              value={page.use_cases.closing_line}
              onChange={(v) =>
                setPage((prev) => ({
                  ...prev,
                  use_cases: { ...prev.use_cases, closing_line: v },
                }))
              }
            />
            <ArraySectionEditor
              items={page.use_cases.segments}
              onChange={(items) =>
                setPage((prev) => ({
                  ...prev,
                  use_cases: {
                    ...prev.use_cases,
                    segments: items as UseCasesContent["segments"],
                  },
                }))
              }
              fields={segmentFields}
              newItem={() => ({ segment: "", body: "", scenarios: [] })}
              itemLabel="Segment"
            />
          </div>
          <SaveBar
            sectionKey="use_cases"
            onSave={() => save("use_cases", page.use_cases)}
            savingKey={savingKey}
            savedKey={savedKey}
            errorKey={errorKey}
          />
        </details>

        {/* FINAL CTA */}
        <details className="rounded-lg border bg-white p-5">
          <summary className="cursor-pointer font-display text-base font-semibold text-slate-900">
            Final CTA
          </summary>
          <div className="mt-4 space-y-3">
            <TextField
              label="Headline"
              value={page.final_cta.headline}
              onChange={(v) =>
                setPage((prev) => ({
                  ...prev,
                  final_cta: { ...prev.final_cta, headline: v },
                }))
              }
            />
            <TextareaField
              label="Body"
              value={page.final_cta.body}
              onChange={(v) =>
                setPage((prev) => ({
                  ...prev,
                  final_cta: { ...prev.final_cta, body: v },
                }))
              }
            />
            <TextField
              label="CTA label"
              value={page.final_cta.cta_label}
              onChange={(v) =>
                setPage((prev) => ({
                  ...prev,
                  final_cta: { ...prev.final_cta, cta_label: v },
                }))
              }
            />
          </div>
          <SaveBar
            sectionKey="final_cta"
            onSave={() => save("final_cta", page.final_cta)}
            savingKey={savingKey}
            savedKey={savedKey}
            errorKey={errorKey}
          />
        </details>
      </div>
    </div>
  );
}
