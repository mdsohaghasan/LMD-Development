<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" class="scroll-smooth">
    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="csrf-token" content="{{ csrf_token() }}" />
        <title inertia>{{ config('app.name', 'LMS Platform') }}</title>

        @if (class_exists(\Tightenco\Ziggy\Ziggy::class))
            @routes
        @endif
        @viteReactRefresh
        @vite(['resources/js/app.jsx', 'resources/css/app.css'])
        @inertiaHead
    </head>
    <body class="font-sans antialiased bg-white dark:bg-slate-900">
        @inertia
    </body>
</html>
