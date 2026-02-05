<!doctype html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Inertia Fallback</title>
    <style>body{font-family:Inter,Segoe UI,Roboto,Helvetica,Arial,sans-serif;padding:40px;background:#f8fafc;color:#111827}</style>
</head>
<body>
    <h1>Inertia (server) package not installed</h1>
    <p>This server does not have the <code>inertiajs/inertia-laravel</code> package installed. Showing a fallback page for component <strong>{{ $component }}</strong>.</p>

    <h2>Props</h2>
    <pre style="background:#fff;padding:12px;border-radius:6px;overflow:auto;max-height:400px">{{ json_encode($props, JSON_PRETTY_PRINT|JSON_UNESCAPED_SLASHES) }}</pre>

    <p><a href="/">Go to homepage</a></p>
</body>
</html>