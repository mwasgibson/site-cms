<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\BlogPostRequest;
use App\Models\BlogPost;
use App\Support\HtmlSanitizer;
use Illuminate\Http\JsonResponse;

class BlogPostController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(
            BlogPost::with('author:id,name')->latest()->get()
        );
    }
    public function store(BlogPostRequest $request): JsonResponse
    {
        $data = $request->validated();
        $data['body'] = HtmlSanitizer::clean($data['body']);
        $data['author_id'] = $request->user()->id;
        $post = BlogPost::create($data);
        return response()->json($post, 201);
    }
    public function show(BlogPost $blogPost): JsonResponse
    {
        return response()->json($blogPost);
    }
    public function update(BlogPostRequest $request, BlogPost $blogPost): JsonResponse
    {
        $data = $request->validated();
        if (isset($data['body'])) {
            $data['body'] = HtmlSanitizer::clean($data['body']);
        }
        $blogPost->update($data);
        return response()->json($blogPost);
    }
    public function destroy(BlogPost $blogPost): JsonResponse
    {
        $blogPost->delete();
        return response()->json(null, 204);
    }
    /** Public: published posts only, newest first. */
    public function public(): JsonResponse
    {
        return response()->json(
            BlogPost::published()
                ->orderByDesc('published_at')
                ->get(['id', 'title', 'slug', 'excerpt', 'cover_image_url', 'published_at'])
        );
    }
    /** Public: single post by slug, for the blog post detail page. */
    public function publicShow(string $slug): JsonResponse
    {
        $post = BlogPost::published()->where('slug', $slug)->firstOrFail();
        return response()->json($post);
    }
}
