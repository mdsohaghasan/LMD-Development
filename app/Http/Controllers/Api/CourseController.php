<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Enrollment;
use Illuminate\Http\Request;

class CourseController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        
        if ($user->isAdmin()) {
            $courses = Course::with('teacher')->paginate(15);
        } elseif ($user->isTeacher()) {
            $courses = $user->courses()->with('enrollments')->paginate(15);
        } else {
            $courses = $user->enrolled_courses()->paginate(15);
        }

        return response()->json([
            'success' => true,
            'data' => $courses,
        ]);
    }

    public function show($id)
    {
        $course = Course::with(['teacher', 'lessons', 'enrollments'])->find($id);

        if (!$course) {
            return response()->json(['error' => 'Course not found'], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $course,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'category' => 'required|string',
            'level' => 'required|in:beginner,intermediate,advanced',
        ]);

        $course = auth()->user()->courses()->create($validated);

        return response()->json([
            'success' => true,
            'data' => $course,
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $course = Course::find($id);

        if (!$course || $course->teacher_id !== auth()->id()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'title' => 'string|max:255',
            'description' => 'string',
            'is_published' => 'boolean',
        ]);

        $course->update($validated);

        return response()->json([
            'success' => true,
            'data' => $course,
        ]);
    }

    public function destroy($id)
    {
        $course = Course::find($id);

        if (!$course || $course->teacher_id !== auth()->id()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $course->delete();

        return response()->json(['success' => true]);
    }

    public function enroll(Request $request, $id)
    {
        $course = Course::find($id);

        if (!$course) {
            return response()->json(['error' => 'Course not found'], 404);
        }

        $enrollment = Enrollment::firstOrCreate([
            'course_id' => $id,
            'student_id' => auth()->id(),
        ]);

        return response()->json([
            'success' => true,
            'data' => $enrollment,
        ]);
    }
}
