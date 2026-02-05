<?php

namespace App\Http\Controllers;

use Illuminate\Contracts\View\View;

abstract class Controller
{
    /**
     * Helper to render Inertia pages when the server-side Inertia package
     * is available, otherwise return a simple fallback view.
     */
    protected function renderInertia(string $component, array $props = [])
    {
        if (class_exists(\Inertia\Inertia::class)) {
            return \Inertia\Inertia::render($component, $props);
        }

        return view('inertia_fallback', [
            'component' => $component,
            'props' => $props,
        ]);
    }
}
