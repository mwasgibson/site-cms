"use client";

import { useState, type ChangeEvent } from "react";
import { apiUpload, ApiError } from "@/lib/api";

interface ImageUploadFieldProps {
  label: string;
  value: string | null;
  onChange: (url: string | null) => void;
}

export function ImageUploadField({
  label,
  value,
  onChange,
}: ImageUploadFieldProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setIsUploading(true);
    try {
      const { url } = await apiUpload("/api/v1/admin/media/upload", file);
      onChange(url);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Upload failed.");
    } finally {
      setIsUploading(false);
      e.target.value = ""; // allow re-selecting the same file
    }
  }

  return (
    <div>
      <label className="block text-sm font-medium text-slate-700">
        {label}
      </label>

      {value && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={value}
          alt=""
          className="mt-2 h-20 w-20 rounded-md border border-slate-200 object-cover"
        />
      )}

      <div className="mt-2 flex items-center gap-3">
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFileChange}
          disabled={isUploading}
          className="text-sm text-slate-600"
        />
        {isUploading && (
          <span className="text-xs text-slate-400">Uploading…</span>
        )}
        {value && !isUploading && (
          <button
            type="button"
            onClick={() => onChange(null)}
            className="text-xs text-red-600 hover:underline"
          >
            Remove
          </button>
        )}
      </div>

      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
