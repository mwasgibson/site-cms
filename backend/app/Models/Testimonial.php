<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Testimonial extends Model
{
    use HasFactory;
    protected $fillable = [
        'client_name',
        'client_role',
        'client_org',
        'logo_url',
        'quote',
        'sort_order',
        'is_published',
    ];
    protected $casts = [
        'is_published' => 'boolean',
        'sort_order' => 'integer',
    ];
    public function scopePublished($query)
    {
        return $query->where('is_published', true);
    }
    public function scopeOrdered($query)
    {
        return $query->orderBy('sort_order')->orderBy('id');
    }
}
