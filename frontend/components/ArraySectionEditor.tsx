"use client";

type FieldType = "text" | "textarea" | "lines" | "select";

export interface FieldDescriptor {
  key: string;
  label: string;
  type: FieldType;
  options?: string[]; // for type: "select"
  placeholder?: string;
}

interface ArraySectionEditorProps {
  items: Record<string, unknown>[];
  onChange: (items: Record<string, unknown>[]) => void;
  fields: FieldDescriptor[];
  newItem: () => Record<string, unknown>;
  itemLabel: string;
}

/**
 * Renders a list of objects as repeatable rows, one row per array item,
 * with add/remove/reorder controls. Which fields each row has — and how —
 * comes entirely from `fields`, so this one component covers every
 * list-shaped page section (features, security bullets, glossary, steps,
 * API endpoints, stats, use-case segments) without bespoke UI per section.
 *
 * "lines" fields store a string[] in the data, shown as a textarea with
 * one entry per line — used for things like a step's badges or a use-case
 * segment's scenario list, where nested repeatable sub-rows would be more
 * UI than the content is worth.
 */
export function ArraySectionEditor({
  items,
  onChange,
  fields,
  newItem,
  itemLabel,
}: ArraySectionEditorProps) {
  function updateItem(index: number, key: string, value: unknown) {
    const next = items.slice();
    next[index] = { ...next[index], [key]: value };
    onChange(next);
  }

  function removeItem(index: number) {
    onChange(items.filter((_, i) => i !== index));
  }

  function moveItem(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= items.length) return;
    const next = items.slice();
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  }

  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <div key={index} className="rounded-md border border-slate-200 p-4">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              {itemLabel} {index + 1}
            </p>
            <div className="flex gap-2 text-xs">
              <button
                type="button"
                onClick={() => moveItem(index, -1)}
                disabled={index === 0}
                className="text-slate-500 hover:underline disabled:opacity-30"
              >
                ↑
              </button>
              <button
                type="button"
                onClick={() => moveItem(index, 1)}
                disabled={index === items.length - 1}
                className="text-slate-500 hover:underline disabled:opacity-30"
              >
                ↓
              </button>
              <button
                type="button"
                onClick={() => removeItem(index)}
                className="text-red-600 hover:underline"
              >
                Remove
              </button>
            </div>
          </div>

          <div className="mt-3 space-y-3">
            {fields.map((field) => (
              <label key={field.key} className="block text-sm font-medium text-slate-700">
                {field.label}
                {field.type === "textarea" && (
                  <textarea
                    rows={3}
                    value={(item[field.key] as string) ?? ""}
                    onChange={(e) => updateItem(index, field.key, e.target.value)}
                    className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                  />
                )}
                {field.type === "lines" && (
                  <>
                    <textarea
                      rows={3}
                      value={((item[field.key] as string[]) ?? []).join("\n")}
                      onChange={(e) =>
                        updateItem(
                          index,
                          field.key,
                          e.target.value.split("\n").filter((line) => line.trim() !== ""),
                        )
                      }
                      className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                    />
                    <span className="mt-1 block text-xs text-slate-400">One per line.</span>
                  </>
                )}
                {field.type === "select" && (
                  <select
                    value={(item[field.key] as string) ?? ""}
                    onChange={(e) => updateItem(index, field.key, e.target.value)}
                    className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                  >
                    {field.options?.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                )}
                {field.type === "text" && (
                  <input
                    value={(item[field.key] as string) ?? ""}
                    onChange={(e) => updateItem(index, field.key, e.target.value)}
                    placeholder={field.placeholder}
                    className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                  />
                )}
              </label>
            ))}
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={() => onChange([...items, newItem()])}
        className="rounded-md border border-dashed border-slate-300 px-3 py-1.5 text-sm text-slate-600 hover:border-slate-400"
      >
        + Add {itemLabel.toLowerCase()}
      </button>
    </div>
  );
}
