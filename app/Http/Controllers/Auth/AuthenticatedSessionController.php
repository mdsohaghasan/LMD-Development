<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Login');
    }

    /**
     * Handle an incoming authentication request.
     * 
     * Redirects users based on their role for full SPA experience.
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        $request->authenticate();

        $request->session()->regenerate();

        $user = Auth::user();

        // Redirect directly based on role for SPA experience
        // Inertia will handle this as an XHR request without full page reload
        if ($user->isAdmin()) {
            return redirect()->intended(route('admin.dashboard', absolute: false));
        }

        if ($user->isTeacher()) {
            return redirect()->intended(route('teacher.dashboard', absolute: false));
        }

        // Students with enrollments go to the student panel
        if ($user->isStudent() && $user->enrollments()->exists()) {
            return redirect()->intended(route('student.dashboard', absolute: false));
        }

        // Normal users go to their /user panel
        if ($user->role === 'user') {
            return redirect()->intended(route('user.dashboard', absolute: false));
        }

        // Fallback to home
        return redirect()->intended('/', absolute: false);
    }

    /**
     * Destroy an authenticated session.
     * Uses Inertia redirect for SPA experience.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        // Use Inertia redirect to maintain SPA experience
        return redirect('/');
    }
}
