# Frontend

Next.js 16 admin SPA for managing CMS content. Talks to the Laravel
API over HTTP with cookie-based (Sanctum SPA) auth — this app has no
database or business logic of its own.

## Requirements

- Node 18.18+ (Next.js 16 requirement)
- The backend running first (see `../backend/README.md`) — this app has
  nothing to show without it

## Setup

```bash
npm install
```

**Environment** — create `.env.local`:

NEXT_PUBLIC_API_URL=`http://localhost:8000`

Points the admin at the Laravel API. Change this for staging/production.

## Running

```bash
npm run dev
```

Admin UI is now at `http://localhost:3001` (note: port 3001, not the Next.js
default 3000 — deliberately different from the marketing site so both can
run side by side locally without a port clash).

You'll be redirected to `/login`. Sign in with the admin user you created
in the backend setup.

## Testing it's working

Walk through each content type once:

1. **FAQs** — create one, edit it, delete it. Confirms the base CRUD + auth
   flow works end-to-end.
2. **Blog posts** — create one with the rich-text editor (try bold, a
   heading, a bullet list), upload a cover image, leave "Published at"
   blank, save. Confirms Tiptap + the sanitizer + file upload all work.
   Then check `curl http://localhost:8000/api/v1/public/blog-posts` — it
   should return `[]` still, since the post is a draft (no `published_at`).
   Edit it again, set a "Published at" date, save — now it should appear.
3. **Testimonials** — create one with a logo upload. This is the one that
   isn't consumed by the marketing site yet, so nothing to visually check
   beyond the CMS itself.
4. **Settings** — change a field, save, refresh the page — confirms it
   persisted (reload fetches from the API again, not local state).

If all four of those work, the whole stack — auth, CRUD, uploads, rich
text, settings — is verified end-to-end.

## Structure

```bash
app/login/ Login page
app/(admin)/layout.tsx Auth guard + sidebar nav — everything under here requires login
app/(admin)/faqs/ FAQ list/create/edit
app/(admin)/blog-posts/ Blog post list/create/edit (rich text)
app/(admin)/testimonials/ Testimonial list/create/edit (file upload)
app/(admin)/settings/ Single flat settings form
components/RichTextEditor.tsx Tiptap wrapper
components/ImageUploadField.tsx Reusable upload widget
lib/api.ts Fetch wrapper — handles Sanctum's CSRF cookie dance
lib/auth-context.tsx Login/logout/current-user React context
```

## Troubleshooting

| Symptom | Likely cause |
| --- | --- |
| Login form submits but nothing happens / silent failure | Check the Network tab — if `/sanctum/csrf-cookie` or `/api/login` shows a CORS error, it's the backend's `config/cors.php`, not this app |
| Logged in, but every page immediately bounces back to `/login` | `/api/me` is returning 401 — session cookie isn't being sent/accepted, usually a `SANCTUM_STATEFUL_DOMAINS`/`SESSION_DOMAIN` mismatch on the backend |
| Image upload spins forever or fails | Check the file is under 2MB and is jpeg/png/webp — the backend rejects everything else, including SVG |
| Rich text editor shows a hydration warning in the console | Should already be handled (`immediatelyRender: false` in `RichTextEditor.tsx`) — if you see this, something upstream changed; don't ignore it |
