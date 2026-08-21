<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class BlogPost extends Model
{
    use HasFactory;
    protected $fillable = [
        'author_id',
        'title',
        'slug',
        'excerpt',
        'body',
        'cover_image_url',
        'seo_title',
        'seo_description',
        'published_at',
    ];
    protected $casts = [
        'published_at' => 'datetime',
    ];
    protected static function booted(): void
    {
        static::creating(function (BlogPost $post) {
            if (empty($post->slug)) {
                $post->slug = static::uniqueSlugFrom($post->title);
            }
        });
    }
    public static function uniqueSlugFrom(string $title): string
    {
        $base = Str::slug($title);
        $slug = $base;
        $i = 1;
        while (static::where('slug', $slug)->exists()) {
            $slug = "{$base}-" . ++$i;
        }
        return $slug;
    }
    public function author()
    {
        return $this->belongsTo(User::class, 'author_id');
    }
    public function scopePublished($query)
    {
        return $query->whereNotNull('published_at')->where('published_at', '<=', now());
    }
}
