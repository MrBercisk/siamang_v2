<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserHasRole
{
    /**
     * Contoh pemakaian di routes:
     *   Route::middleware(['auth:sanctum', 'role:admin'])->group(...)
     *   Route::middleware(['auth:sanctum', 'role:admin,mentor'])->group(...)
     */
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $user = $request->user();

        if (! $user || ! in_array($user->role, $roles, true)) {
            return response()->json([
                'message' => 'Kamu tidak punya akses untuk aksi ini.',
            ], 403);
        }

        return $next($request);
    }
}