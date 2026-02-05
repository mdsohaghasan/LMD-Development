<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     */
    public function share(Request $request): array
    {
        return array_merge(parent::share($request), [
            'auth' => [
                'user' => fn () => $request->user() ? $request->user()->only('id', 'name', 'email', 'role', 'language', 'theme') : null,
                'can' => fn () => [
                    'isAdmin' => $request->user() ? $request->user()->isAdmin() : false,
                    'isTeacher' => $request->user() ? $request->user()->isTeacher() : false,
                    'isStudent' => $request->user() ? $request->user()->isStudent() : false,
                    'hasEnrollments' => $request->user() ? $request->user()->enrollments()->exists() : false,
                ],
            ],
            'flash' => [
                'success' => session('success'),
                'error' => session('error'),
            ],
            'locale' => app()->getLocale(),
        ]);
    }
}
