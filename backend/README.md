# Backend

Laravel 13 API powering the CMS. Provides content storage (FAQs,
blog posts, testimonials, site settings), Sanctum-based authentication for
the admin frontend, and public read-only endpoints the marketing site can
eventually consume.

## Requirements

- PHP 8.3+
- Composer
- SQLite (default, zero-config) or MySQL/Postgres

## Setup

```bash
composer install
cp .env.example .env
php artisan key:generate
```

**Database** — SQLite is the default and needs no server:

```bash
touch database/database.sqlite
```

If using MySQL/Postgres instead, set `DB_CONNECTION`, `DB_HOST`,
`DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD` in `.env` and create the
database first.

**Migrate and seed:**

```bash
php artisan migrate
php artisan db:seed --class=SiteSettingSeeder
```

The seeder pre-populates site settings with the real current
values (product name, address, contact email, etc.) — without it,
`/api/v1/admin/settings` returns everything empty.

**File storage** (needed for blog cover images and testimonial logos):

```bash
php artisan storage:link
```

This symlinks `storage/app/public` → `public/storage`, which is what makes
uploaded files reachable by URL.

**Create your admin user** — there's no registration screen by design:

```bash
php artisan tinker
>>> \App\Models\User::create(['name' => 'Mwas', 'email' => 'you@xtranet.co.ke', 'password' => bcrypt('change-me')]);
>>> exit
```

## Sanctum SPA auth — the part most likely to confuse you

This API uses cookie-based session auth (Sanctum's SPA mode), not bearer
tokens. Three things have to be true for it to work, all covered in detail
in [`SANCTUM_SETUP_NOTES.md`](./SANCTUM_SETUP_NOTES.md):

1. `bootstrap/app.php` has `$middleware->statefulApi();`
2. `config/cors.php` has `supports_credentials => true` and the frontend's
   exact origin in `allowed_origins`
3. `.env` has `SANCTUM_STATEFUL_DOMAINS` and `SESSION_DOMAIN` set correctly

If login returns a 401 with no obvious error, it's almost always one of
these three, not a code bug.

## Running

```bash
php artisan serve
```

API is now at `http://localhost:8000`.

## Testing

```bash
# Should return [] (empty array), not a 404 or 500
curl http://localhost:8000/api/v1/public/faqs
curl http://localhost:8000/api/v1/public/settings   # should return real values from the seeder
```

For the authenticated side, easiest is to just use the admin frontend
(see `frontend/README.md`) — testing Sanctum's cookie flow with raw `curl`
is more trouble than it's worth. If you do want to script it:

```bash
curl -c cookies.txt http://localhost:8000/sanctum/csrf-cookie
curl -b cookies.txt -c cookies.txt -X POST http://localhost:8000/api/login \
  -H "Content-Type: application/json" \
  -H "X-XSRF-TOKEN: $(grep XSRF-TOKEN cookies.txt | cut -f7)" \
  -d '{"email":"you@xtranet.co.ke","password":"change-me"}'
```

## API reference

**Public (no auth, read-only, published content only):**

| Method | Path |
| --- | --- |
| GET | `/api/v1/public/faqs` |
| GET | `/api/v1/public/blog-posts` |
| GET | `/api/v1/public/blog-posts/{slug}` |
| GET | `/api/v1/public/testimonials` |
| GET | `/api/v1/public/settings` |

**Admin (Sanctum auth required):**

| Method | Path |
| --- | --- |
| POST | `/api/login` |
| POST | `/api/logout` |
| GET | `/api/me` |
| GET/POST/PUT/DELETE | `/api/v1/admin/faqs[/{id}]` |
| GET/POST/PUT/DELETE | `/api/v1/admin/blog-posts[/{id}]` |
| GET/POST/PUT/DELETE | `/api/v1/admin/testimonials[/{id}]` |
| GET/PUT | `/api/v1/admin/settings` |
| POST | `/api/v1/admin/media/upload` |

## Troubleshooting

| Symptom | Likely cause |
| --- | --- |
| `/api/v1/public/faqs` returns 404 | `routes/api.php` isn't loaded — check `bootstrap/app.php` has `api: __DIR__.'/../routes/api.php'` in `withRouting()` |
| Login returns 401 | One of the 3 Sanctum config steps above |
| CORS error in browser console | `config/cors.php` origin doesn't exactly match the frontend's URL (including port) |
| Uploaded images 404 | Forgot `php artisan storage:link` |
| `/api/v1/admin/settings` returns all empty strings | Forgot to run the `SiteSettingSeeder` |

## Structure

```bash
app/Http/Controllers/Api/   Auth, FaqItem, BlogPost, Testimonial, SiteSetting, Media
app/Http/Requests/           Validation for each resource
app/Models/                    Eloquent models
app/Support/HtmlSanitizer.php    Allowlist HTML sanitizer for blog post bodies
database/migrations/            Schema for all 4 content types
database/seeders/                 SiteSettingSeeder — real default values
routes/api.php                     All routes: public, auth, admin
```
