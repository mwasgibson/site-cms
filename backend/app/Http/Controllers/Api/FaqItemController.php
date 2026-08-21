<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\FaqItemRequest;
use App\Models\FaqItem;
use Illuminate\Http\JsonResponse;

class FaqItemController extends Controller
{
    /** Admin: full list, any publish state. */
    public function index(): JsonResponse
    {
        return response()->json(FaqItem::ordered()->get());
    }
    public function store(FaqItemRequest $request): JsonResponse
    {
        $faq = FaqItem::create($request->validated());
        return response()->json($faq, 201);
    }
    public function show(FaqItem $faqItem): JsonResponse
    {
        return response()->json($faqItem);
    }
    public function update(FaqItemRequest $request, FaqItem $faqItem): JsonResponse
    {
        $faqItem->update($request->validated());
        return response()->json($faqItem);
    }
    public function destroy(FaqItem $faqItem): JsonResponse
    {
        $faqItem->delete();
        return response()->json(null, 204);
    }
    /**
     * Public: published-only, ordered — this is what the Next.js marketing
     * site fetches to replace the hardcoded `faqs` array in page.tsx.
     */
    public function public(): JsonResponse
    {
        return response()->json(
            FaqItem::published()->ordered()->get(['id', 'question', 'answer'])
        );
    }
}
