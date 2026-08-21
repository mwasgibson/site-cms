# Sanctum SPA setup — edits to the generated Laravel skeleton

After `composer create-project laravel/laravel backend` and
`composer require laravel/sanctum`, three things need wiring up. These are
edits to files Laravel already generated, not new files.

## 1. `bootstrap/app.php`

Laravel 11+ collapsed `app/Http/Kernel.php` into `bootstrap/app.php`. Add
`statefulApi()` — this is the one line that makes Sanctum treat requests
from your configured frontend domains as session-authenticated instead of
requiring a bearer token:

```php
->withMiddleware(function (Middleware $middleware) {
    $middleware->statefulApi();
})
```

## 2. `config/cors.php`

```php
'paths' => ['api/*', 'sanctum/csrf-cookie', 'login', 'logout'],
'allowed_methods' => ['*'],
'allowed_origins' => [env('FRONTEND_URL', 'http://localhost:3001')],
'allowed_headers' => ['*'],
'supports_credentials' => true, // required for cookie-based Sanctum auth
```

## 3. `.env`

```bash
FRONTEND_URL=http://localhost:3001
SANCTUM_STATEFUL_DOMAINS=localhost:3001
SESSION_DOMAIN=localhost
```

In production, these become your real subdomains, e.g.:

```bash
FRONTEND_URL=https://cms.zentive.xtranet.co.ke
SANCTUM_STATEFUL_DOMAINS=cms.zentive.xtranet.co.ke
SESSION_DOMAIN=.xtranet.co.ke
```

`SESSION_DOMAIN` needs the leading dot to share the cookie across
subdomains — this is _why_ the admin and API need to share a top-level
domain for cookie-based auth to work. If hosting puts them on unrelated
domains, tell me and I'll swap the whole auth flow to bearer tokens
instead — it's a real fork, not a tweak, so better to settle it before you
build the other 3 controllers on top of one pattern or the other.

## Seeding your first admin user

Laravel's default `User` model/migration already covers this — no schema
change needed. Create yourself an account with:

```bash
php artisan tinker
>>> \App\Models\User::create(['name' => 'Mwas', 'email' => 'you@xtranet.co.ke', 'password' => bcrypt('change-me')]);
```
