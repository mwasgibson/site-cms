# Zentive CMS

Internal content management system for the Zentive marketing site (built by
Xtranet Communications Limited). Lets non-technical team members manage FAQs,
blog posts, testimonials, and site-wide settings without touching the
marketing site's codebase directly.
Two independent, decoupled apps:

```bash
backend/    Laravel 13 API — content storage, auth, file uploads
frontend/            Next.js 16 admin SPA — the UI content editors use
```

They talk to each other over HTTP; neither depends on the other's code.
Nothing here touches the `zentive` marketing-site repo — this CMS exposes a
public read-only API that the marketing site _could_ fetch from, but that
integration hasn't been built yet (see [Roadmap](#roadmap)).

## Architecture

```image
┌─────────────────┐         ┌──────────────────┐         ┌─────────────────┐
│  Next.js admin  │  HTTP   │  Laravel API     │         │  MySQL/SQLite   │
│  (frontend/)    │ ──────▶ │  (backend).      │ ──────▶ │  database       │
│  content editors│◀──────  │  Sanctum auth    │         │                 │
└─────────────────┘         └──────────────────┘         └─────────────────┘
                                       │
                                       │ (not yet wired up)
                                       ▼
                              ┌──────────────────┐
                              │zentive marketing │
                              │  site (Next.js)  │
                              └──────────────────┘
```

Auth is Sanctum's SPA (session/cookie) mode — the admin and API need to share
a top-level domain in production for this to work (see
`backend/SANCTUM_SETUP_NOTES.md`).

## Quick start

Each app has its own README with full setup instructions:

- **[`backend/README.md`](./backend/README.md)** — backend setup, database, seeding
- **[`frontend/README.md`](./frontend/README.md)** — admin UI setup
  In short, once both are set up:

```bash
# Terminal 1
cd backend && php artisan serve        # http://localhost:8000
# Terminal 2
cd frontend && npm run dev                       # http://localhost:3001
```

## Content types

| Type              | Fields worth noting                                                                             | Public endpoint                                                         |
| ----------------- | ----------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| **FAQs**          | question, answer, sort order                                                                    | `GET /api/v1/public/faqs`                                               |
| **Blog posts**    | rich-text body (Tiptap → sanitized HTML), SEO title/description, draft via blank `published_at` | `GET /api/v1/public/blog-posts`, `GET /api/v1/public/blog-posts/{slug}` |
| **Testimonials**  | client name/role/org, logo (file upload), quote                                                 | `GET /api/v1/public/testimonials`                                       |
| **Site settings** | mirrors every field in the marketing site's `lib/site-config.ts`                                | `GET /api/v1/public/settings`                                           |

All public endpoints are read-only and return only published content.
Everything else lives under `/api/v1/admin/*`, behind Sanctum auth.

## Security notes

- Blog post bodies are run through a hand-written HTML allowlist sanitizer
  (`app/Support/HtmlSanitizer.php`) before storage — the rich-text editor's
  output is untrusted input, sanitized server-side, not just client-side.
- Image uploads are restricted to `jpeg`/`png`/`webp`, 2MB max. SVG is
  deliberately excluded (can carry executable script).
- No security headers (CSP/HSTS/etc.) are configured on the admin frontend
  yet — see [Roadmap](#roadmap).

## Roadmap

- [ ] Wire the marketing site (`zentive` repo) to actually fetch from the
      four public endpoints above, replacing its hardcoded content arrays.
- [ ] Add a testimonials section to the marketing site once there are real
      pilot-client testimonials to feature — the CMS side is ready now.
- [ ] Security headers (CSP/HSTS/X-Frame-Options) on the admin frontend,
      matching what's on the marketing site.
- [ ] Role-based access — currently any authenticated user has full admin
      access; there's no distinction between roles yet.
- [ ] Automated tests — none exist yet on either side.
