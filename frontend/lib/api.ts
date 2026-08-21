const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  return match ? decodeURIComponent(match[2]) : null;
}

/**
 * Sanctum's SPA auth requires hitting /sanctum/csrf-cookie before any
 * state-changing request (POST/PUT/DELETE), which sets the XSRF-TOKEN
 * cookie Laravel expects echoed back in the X-XSRF-TOKEN header.
 */
async function ensureCsrfCookie(): Promise<void> {
  await fetch(`${API_BASE}/sanctum/csrf-cookie`, { credentials: "include" });
}

interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
}

export async function apiFetch<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const method = options.method ?? "GET";

  if (method !== "GET") {
    await ensureCsrfCookie();
  }

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    credentials: "include",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(method !== "GET"
        ? { "X-XSRF-TOKEN": getCookie("XSRF-TOKEN") ?? "" }
        : {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (res.status === 401) {
    throw new ApiError("unauthenticated", 401);
  }

  if (!res.ok) {
    const payload = await res.json().catch(() => null);
    throw new ApiError(
      payload?.message ?? `Request failed (${res.status})`,
      res.status,
      payload,
    );
  }

  if (res.status === 204) return undefined as T;
  return res.json();
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public payload?: unknown,
  ) {
    super(message);
  }
}

/**
 * Separate from apiFetch because file uploads need multipart/form-data,
 * where the browser must set its own Content-Type (with boundary) — setting
 * it manually, as apiFetch does for JSON, breaks the upload.
 */
export async function apiUpload(
  path: string,
  file: File,
): Promise<{ url: string }> {
  await ensureCsrfCookie();

  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    credentials: "include",
    headers: {
      Accept: "application/json",
      "X-XSRF-TOKEN": getCookie("XSRF-TOKEN") ?? "",
    },
    body: formData,
  });

  if (!res.ok) {
    const payload = await res.json().catch(() => null);
    throw new ApiError(
      payload?.message ?? `Upload failed (${res.status})`,
      res.status,
      payload,
    );
  }

  return res.json();
}
