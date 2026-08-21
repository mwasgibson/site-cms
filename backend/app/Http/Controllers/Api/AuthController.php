<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * Session-based login for the Sanctum SPA flow. The Next.js admin must
     * first GET /sanctum/csrf-cookie (Sanctum registers this route
     * automatically), then POST here with credentials: 'include'.
     */
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);
        if (! Auth::attempt($credentials, remember: true)) {
            throw ValidationException::withMessages([
                'email' => __('auth.failed'),
            ]);
        }
        $request->session()->regenerate();
        return response()->json(['user' => $request->user()]);
    }
    public function logout(Request $request)
    {
        Auth::guard('web')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return response()->json(null, 204);
    }
    public function me(Request $request)
    {
        return response()->json($request->user());
    }
}
