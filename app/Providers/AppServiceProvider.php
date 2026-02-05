<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Inertia\Inertia;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        if (class_exists(\Inertia\Inertia::class)) {
            \Inertia\Inertia::share([
                'appName' => config('app.name'),
                'auth' => [
                    'user' => fn () => auth()->user(),
                ],
                'flash' => fn () => [
                    'success' => session('success'),
                    'error' => session('error'),
                ],
                'locale' => fn () => app()->getLocale(),
            ]);
        }
    }
}
