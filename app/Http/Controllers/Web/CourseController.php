<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Enrollment;
use Illuminate\Http\Request;

class CourseController extends Controller
{
    public function index()
    {
        $courses = Course::with('teacher')
            ->where('is_published', true)
            ->paginate(12);

        return $this->renderInertia('Courses/Index', [
            'courses' => $courses,
        ]);
    }

    public function show(Course $course)
    {
        $course->load(['teacher', 'lessons']);

        return $this->renderInertia('Courses/Show', [
            'course' => $course,
        ]);
    }

    public function enroll(Request $request, Course $course)
    {
        $user = $request->user();

        // Check if already enrolled
        $enrollment = $user->enrollments()->where('course_id', $course->id)->first();
        
        if ($enrollment) {
            return redirect()->back()->with('info', 'You are already enrolled in this course.');
        }

        // Create enrollment
        $user->enrollments()->create([
            'course_id' => $course->id,
            'student_id' => $user->id,
            'status' => 'active',
            'progress_percentage' => 0,
        ]);

        // Role transition: User → Student (automatic on first enrollment)
        if ($user->role === 'user') {
            $user->role = 'student';
            $user->save();
        }

        // Redirect to student dashboard if this is their first enrollment
        if ($user->enrollments()->count() === 1) {
            return redirect()->route('student.dashboard')
                ->with('success', 'Enrolled successfully! Welcome to the student panel.');
        }

        return redirect()->back()->with('success', 'Enrolled successfully.');
    }
}
