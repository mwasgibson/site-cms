<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class MediaController extends Controller
{
    /**
     * Accepts a single image, stores it on the public disk, returns its
     * public URL. SVG is deliberately excluded — an SVG can carry a <script>
     * tag and is served with a browser-executable content type, so allowing
     * it here would reopen the stored-XSS risk the HTML sanitizer elsewhere
     * is specifically trying to close.
     */
    public function upload(Request $request): JsonResponse
    {
        $request->validate([
            'file' => ['required', 'image', 'mimes:jpeg,jpg,png,webp', 'max:2048'], // 2MB
        ]);
        $file = $request->file('file');
        $filename = Str::uuid() . '.' . $file->getClientOriginalExtension();
        $path = $file->storeAs('media', $filename, 'public');
        /** @var \Illuminate\Filesystem\FilesystemAdapter $disk */
        $disk = Storage::disk('public');
        $url = $disk->url($path);
        return response()->json([
            'url' => $url,
        ], 201);
    }
}
