<?php

namespace App\Http\Controllers;

use App\Models\Course;
use Illuminate\Http\Request;

class HomeController extends Controller
{
    public function index(Request $request)
    {
        $courses = Course::with('teacher')
            ->where('is_published', true)
            ->orderBy('created_at', 'desc')
            ->paginate(9);

        return $this->renderInertia('Home', [
            'courses' => $courses,
        ]);
    }
}
