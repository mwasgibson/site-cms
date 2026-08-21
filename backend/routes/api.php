<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BlogPostController;
use App\Http\Controllers\Api\FaqItemController;
use App\Http\Controllers\Api\MediaController;
use App\Http\Controllers\Api\SiteSettingController;
use App\Http\Controllers\Api\TestimonialController;
use Illuminate\Support\Facades\Route;
/*
|--------------------------------------------------------------------------
| Auth (Sanctum SPA — session/cookie based)
|--------------------------------------------------------------------------
*/

Route::post('/login', [AuthController::class, 'login']);
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
});
/*
|--------------------------------------------------------------------------
| Public, read-only — consumed by the Next.js marketing site
|--------------------------------------------------------------------------
*/
Route::prefix('v1/public')->group(function () {
    Route::get('/faqs', [FaqItemController::class, 'public']);
    Route::get('/blog-posts', [BlogPostController::class, 'public']);
    Route::get('/blog-posts/{slug}', [BlogPostController::class, 'publicShow']);
    Route::get('/testimonials', [TestimonialController::class, 'public']);
    Route::get('/settings', [SiteSettingController::class, 'public']);
});
/*
|--------------------------------------------------------------------------
| Admin — behind Sanctum auth, used by the Next.js admin SPA
|--------------------------------------------------------------------------
*/
Route::prefix('v1/admin')->middleware('auth:sanctum')->group(function () {
    Route::apiResource('faqs', FaqItemController::class)->parameters(['faqs' => 'faqItem']);
    Route::apiResource('blog-posts', BlogPostController::class)->parameters(['blog-posts' => 'blogPost']);
    Route::apiResource('testimonials', TestimonialController::class);
    Route::get('settings', [SiteSettingController::class, 'index']);
    Route::put('settings', [SiteSettingController::class, 'update']);
    Route::post('media/upload', [MediaController::class, 'upload']);
});
