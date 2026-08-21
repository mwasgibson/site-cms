<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class BlogPostRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }
    public function rules(): array
    {
        $postId = $this->route('blogPost')?->id;
        return [
            'title' => ['required', 'string', 'max:255'],
            'slug' => [
                'sometimes',
                'nullable',
                'string',
                'max:255',
                'alpha_dash',
                Rule::unique('blog_posts', 'slug')->ignore($postId),
            ],
            'excerpt' => ['nullable', 'string', 'max:320'],
            'body' => ['required', 'string'],
            'cover_image_url' => ['nullable', 'url', 'max:2048'],
            'seo_title' => ['nullable', 'string', 'max:255'],
            'seo_description' => ['nullable', 'string', 'max:320'],
            'published_at' => ['nullable', 'date'],
        ];
    }
}
