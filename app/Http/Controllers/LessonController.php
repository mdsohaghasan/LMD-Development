<?php

namespace App\Http\Controllers;

use App\Models\Lesson;
use App\Models\Course;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LessonController extends Controller
{
    public function index(Course $course)
    {
        $lessons = $course->lessons()->paginate(10);
        return $this->renderInertia('Admin/Lessons/Index', [
            'course' => $course,
            'lessons' => $lessons,
        ]);
    }

    public function create(Course $course)
    {
        return $this->renderInertia('Admin/Lessons/Create', [
            'course' => $course,
        ]);
    }

    public function store(Request $request, Course $course)
    {
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'nullable|string',
            'type' => 'string',
            'order' => 'integer',
        ]);
        $course->lessons()->create($data);
        return redirect()->route('admin.lessons.index', $course)->with('success', 'Lesson created.');
    }

    public function edit(Course $course, Lesson $lesson)
    {
        return $this->renderInertia('Admin/Lessons/Edit', [
            'course' => $course,
            'lesson' => $lesson,
        ]);
    }

    public function update(Request $request, Course $course, Lesson $lesson)
    {
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'nullable|string',
            'type' => 'string',
            'order' => 'integer',
        ]);
        $lesson->update($data);
        return redirect()->route('admin.lessons.index', $course)->with('success', 'Lesson updated.');
    }

    public function destroy(Course $course, Lesson $lesson)
    {
        $lesson->delete();
        return redirect()->route('admin.lessons.index', $course)->with('success', 'Lesson deleted.');
    }
}
