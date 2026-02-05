<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class StudentMiddleware
{
    /**
     * Handle an incoming request.
     * 
     * Strict access: Only users with 'student' role AND at least one enrollment
     * can access the student panel.
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (!auth()->check()) {
            return redirect()->guest(route('login'));
        }

        $user = auth()->user();

        // Strict: Must be student role
        if (!$user->isStudent()) {
            abort(403, 'Access denied. Student role required.');
        }

        // Strict: Must have at least one enrollment
        if (!$user->enrollments()->exists()) {
            return redirect()->route('user.dashboard')
                ->with('error', 'You must enroll in at least one course to access the student panel.');
        }

        return $next($request);
    }
}
