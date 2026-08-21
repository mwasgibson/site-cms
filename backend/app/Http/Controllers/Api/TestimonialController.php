<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\TestimonialRequest;
use App\Models\Testimonial;
use Illuminate\Http\JsonResponse;

class TestimonialController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(Testimonial::ordered()->get());
    }
    public function store(TestimonialRequest $request): JsonResponse
    {
        $testimonial = Testimonial::create($request->validated());
        return response()->json($testimonial, 201);
    }
    public function show(Testimonial $testimonial): JsonResponse
    {
        return response()->json($testimonial);
    }
    public function update(TestimonialRequest $request, Testimonial $testimonial): JsonResponse
    {
        $testimonial->update($request->validated());
        return response()->json($testimonial);
    }
    public function destroy(Testimonial $testimonial): JsonResponse
    {
        $testimonial->delete();
        return response()->json(null, 204);
    }
    /**
     * Public: published testimonials, ordered. Not consumed by the
     * marketing site yet — that section hasn't been built there because
     * there are no pilot clients to feature yet. This endpoint exists so
     * that whenever it is added, the CMS side needs zero further work.
     */
    public function public(): JsonResponse
    {
        return response()->json(
            Testimonial::published()->ordered()->get([
                'id',
                'client_name',
                'client_role',
                'client_org',
                'logo_url',
                'quote',
            ])
        );
    }
}
