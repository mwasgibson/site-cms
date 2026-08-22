<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

class PageSection extends Model
{
    protected $fillable = ['key', 'content'];

    protected $casts = [
        'content' => 'array',
    ];

    public static function getContent(string $key): ?array
    {
        return Cache::remember("page_section:{$key}", 300, function () use ($key) {
            return static::where('key', $key)->value('content');
        });
    }

    public static function setContent(string $key, array $content): void
    {
        static::updateOrCreate(['key' => $key], ['content' => $content]);
        Cache::forget("page_section:{$key}");
    }

    /** All sections as ['key' => content, ...] — one call for the whole page. */
    public static function allAsMap(): array
    {
        return static::all()->pluck('content', 'key')->all();
    }
}
