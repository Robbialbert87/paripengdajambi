<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsurePermission
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): Response  $next
     */
    public function handle(Request $request, Closure $next, string ...$permissions): Response
    {
        $user = $request->user();

        if (! $user) {
            abort(403);
        }

        if (! $user->is_active) {
            abort(403, 'Akun Anda tidak aktif.');
        }

        $role = $user->role;

        if (! $role) {
            abort(403);
        }

        if ($role->slug === 'admin') {
            return $next($request);
        }

        foreach ($permissions as $permission) {
            if ($role->can($permission)) {
                return $next($request);
            }
        }

        abort(403);
    }
}
