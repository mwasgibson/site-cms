<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\PageSectionRequest;
use App\Models\PageSection;
use Illuminate\Http\JsonResponse;

class PageSectionController extends Controller
{
    /** Admin: every section, keyed — powers the single page-content editor. */
    public function index(): JsonResponse
    {
        return response()->json(PageSection::allAsMap());
    }

    public function show(string $key): JsonResponse
    {
        $content = PageSection::getContent($key);
        if ($content === null) {
            return response()->json(['message' => 'Section not found'], 404);
        }
        return response()->json($content);
    }

    public function update(PageSectionRequest $request, string $key): JsonResponse
    {
        PageSection::setContent($key, $request->validated()['content']);
        return response()->json(PageSection::getContent($key));
    }

    /**
     * Public: every section in one call. The marketing site fetches this
     * once per page load instead of 9 separate requests.
     */
    public function public(): JsonResponse
    {
        return response()->json(PageSection::allAsMap());
    }
}
