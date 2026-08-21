<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\SiteSettingRequest;
use App\Models\SiteSetting;
use Illuminate\Http\JsonResponse;

class SiteSettingController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(SiteSetting::allAsArray());
    }
    public function update(SiteSettingRequest $request): JsonResponse
    {
        foreach ($request->validated() as $key => $value) {
            SiteSetting::set($key, $value);
        }
        return response()->json(SiteSetting::allAsArray());
    }
    /** Public: same shape as index() — this is what site-config.ts would fetch. */
    public function public(): JsonResponse
    {
        return response()->json(SiteSetting::allAsArray());
    }
}
