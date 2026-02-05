<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use App\Models\Course;
use Illuminate\Http\Request;

class CourseController extends Controller
{
    public function index()
    {
        $courses = auth()->user()->courses()->paginate(12);

        return $this->renderInertia('Teacher/Courses/Index', [
            'courses' => $courses,
        ]);
    }

    public function create()
    {
        return $this->renderInertia('Teacher/Courses/Create');
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'is_published' => 'boolean',
        ]);

        $data['teacher_id'] = auth()->id();

        $course = Course::create($data);

        return redirect()->route('teacher.courses.index')->with('success', 'Course created.');
    }

    public function edit(Course $course)
    {
        // ensure teacher owns this course
        if ($course->teacher_id !== auth()->id()) {
            abort(403);
        }

        return $this->renderInertia('Teacher/Courses/Edit', [
            'course' => $course,
        ]);
    }

    public function update(Request $request, Course $course)
    {
        if ($course->teacher_id !== auth()->id()) {
            abort(403);
        }

        $data = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'is_published' => 'boolean',
        ]);

        $course->update($data);

        return redirect()->route('teacher.courses.index')->with('success', 'Course updated.');
    }

    public function destroy(Course $course)
    {
        if ($course->teacher_id !== auth()->id()) {
            abort(403);
        }

        $course->delete();

        return redirect()->route('teacher.courses.index')->with('success', 'Course deleted.');
    }
}
