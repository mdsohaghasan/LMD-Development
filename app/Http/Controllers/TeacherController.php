<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\Lesson;
use App\Models\Assignment;
use App\Models\AssignmentSubmission;
use App\Models\Quiz;
use App\Models\LiveClass;
use App\Models\SupportTicket;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class TeacherController extends Controller
{
    /**
     * Teacher Dashboard
     */
    public function dashboard()
    {
        $teacher = Auth::user();
        
        $courses = $teacher->courses()->withCount('enrollments')->get();
        $totalStudents = $teacher->courses()
            ->withCount('enrollments')
            ->get()
            ->sum('enrollments_count');

        $stats = [
            'totalCourses' => $courses->count(),
            'totalStudents' => $totalStudents,
            'totalLessons' => Lesson::whereHas('course', function($q) use ($teacher) {
                $q->where('teacher_id', $teacher->id);
            })->count(),
            'pendingAssignments' => AssignmentSubmission::whereHas('assignment', function($q) use ($teacher) {
                $q->whereHas('course', function($q2) use ($teacher) {
                    $q2->where('teacher_id', $teacher->id);
                });
            })->where('status', 'submitted')->count(),
        ];

        return Inertia::render('Teacher/Dashboard', [
            'courses' => $courses,
            'stats' => $stats,
        ]);
    }

    /**
     * Course Management
     */
    public function courses()
    {
        $teacher = Auth::user();
        $courses = $teacher->courses()->with('category')->paginate(15);

        return Inertia::render('Teacher/Courses', [
            'courses' => $courses,
        ]);
    }

    public function createCourse(Request $request)
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'category_id' => ['nullable', 'exists:categories,id'],
            'thumbnail' => ['nullable', 'image', 'max:2048'],
            'duration_hours' => ['nullable', 'numeric'],
            'level' => ['nullable', 'in:beginner,intermediate,advanced'],
        ]);

        $teacher = Auth::user();

        if ($request->hasFile('thumbnail')) {
            $validated['thumbnail'] = $request->file('thumbnail')->store('courses', 'public');
        }

        $course = $teacher->courses()->create($validated);

        return redirect()->route('teacher.courses.show', $course)
            ->with('success', 'Course created successfully.');
    }

    public function updateCourse(Request $request, Course $course)
    {
        // Ensure teacher owns this course
        if ($course->teacher_id !== Auth::id()) {
            abort(403);
        }

        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'category_id' => ['nullable', 'exists:categories,id'],
            'thumbnail' => ['nullable', 'image', 'max:2048'],
            'duration_hours' => ['nullable', 'numeric'],
            'level' => ['nullable', 'in:beginner,intermediate,advanced'],
            'is_published' => ['boolean'],
        ]);

        if ($request->hasFile('thumbnail')) {
            if ($course->thumbnail) {
                Storage::disk('public')->delete($course->thumbnail);
            }
            $validated['thumbnail'] = $request->file('thumbnail')->store('courses', 'public');
        }

        $course->update($validated);

        return redirect()->back()->with('success', 'Course updated successfully.');
    }

    /**
     * Lesson Management
     */
    public function lessons(Course $course)
    {
        // Ensure teacher owns this course
        if ($course->teacher_id !== Auth::id()) {
            abort(403);
        }

        $lessons = $course->lessons()->orderBy('order')->get();

        return Inertia::render('Teacher/Lessons', [
            'course' => $course,
            'lessons' => $lessons,
        ]);
    }

    public function createLesson(Request $request, Course $course)
    {
        // Ensure teacher owns this course
        if ($course->teacher_id !== Auth::id()) {
            abort(403);
        }

        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'type' => ['required', 'in:video,text,pdf,audio'],
            'content' => ['nullable', 'string'], // For text lessons
            'video_url' => ['nullable', 'url'], // For video lessons
            'file' => ['nullable', 'file', 'max:102400'], // For PDF/audio (100MB)
            'order' => ['nullable', 'integer'],
        ]);

        if ($request->hasFile('file')) {
            $validated['file_path'] = $request->file('file')->store('lessons', 'public');
        }

        $course->lessons()->create($validated);

        return redirect()->back()->with('success', 'Lesson created successfully.');
    }

    /**
     * Assignment Management
     */
    public function assignments(Course $course)
    {
        // Ensure teacher owns this course
        if ($course->teacher_id !== Auth::id()) {
            abort(403);
        }

        $assignments = $course->assignments()->with('submissions')->get();

        return Inertia::render('Teacher/Assignments', [
            'course' => $course,
            'assignments' => $assignments,
        ]);
    }

    public function createAssignment(Request $request, Course $course)
    {
        // Ensure teacher owns this course
        if ($course->teacher_id !== Auth::id()) {
            abort(403);
        }

        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'due_date' => ['required', 'date'],
            'max_score' => ['nullable', 'numeric'],
        ]);

        $course->assignments()->create($validated);

        return redirect()->back()->with('success', 'Assignment created successfully.');
    }

    public function reviewAssignment(AssignmentSubmission $submission)
    {
        $assignment = $submission->assignment;
        $course = $assignment->course;

        // Ensure teacher owns this course
        if ($course->teacher_id !== Auth::id()) {
            abort(403);
        }

        return Inertia::render('Teacher/ReviewAssignment', [
            'submission' => $submission->load('student', 'assignment'),
        ]);
    }

    public function gradeAssignment(Request $request, AssignmentSubmission $submission)
    {
        $assignment = $submission->assignment;
        $course = $assignment->course;

        // Ensure teacher owns this course
        if ($course->teacher_id !== Auth::id()) {
            abort(403);
        }

        $validated = $request->validate([
            'score' => ['required', 'numeric', 'min:0', 'max:' . ($assignment->max_score ?? 100)],
            'feedback' => ['nullable', 'string'],
        ]);

        $submission->update([
            'score' => $validated['score'],
            'feedback' => $validated['feedback'],
            'status' => 'graded',
            'graded_at' => now(),
        ]);

        return redirect()->back()->with('success', 'Assignment graded successfully.');
    }

    /**
     * Quiz/Exam Management
     */
    public function quizzes(Course $course)
    {
        // Ensure teacher owns this course
        if ($course->teacher_id !== Auth::id()) {
            abort(403);
        }

        $quizzes = $course->quizzes()->with('attempts')->get();

        return Inertia::render('Teacher/Quizzes', [
            'course' => $course,
            'quizzes' => $quizzes,
        ]);
    }

    public function createQuiz(Request $request, Course $course)
    {
        // Ensure teacher owns this course
        if ($course->teacher_id !== Auth::id()) {
            abort(403);
        }

        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'time_limit' => ['nullable', 'integer'], // minutes
        ]);

        $course->quizzes()->create($validated);

        return redirect()->back()->with('success', 'Quiz created successfully.');
    }

    /**
     * Student List (only their courses)
     */
    public function students(Course $course)
    {
        // Ensure teacher owns this course
        if ($course->teacher_id !== Auth::id()) {
            abort(403);
        }

        $students = $course->students()->withPivot('progress_percentage', 'completed_at')->get();

        return Inertia::render('Teacher/Students', [
            'course' => $course,
            'students' => $students,
        ]);
    }

    /**
     * Student Progress Tracking
     */
    public function studentProgress(Course $course)
    {
        // Ensure teacher owns this course
        if ($course->teacher_id !== Auth::id()) {
            abort(403);
        }

        $students = $course->students()
            ->withPivot('progress_percentage', 'completed_at')
            ->with(['enrollments' => function($q) use ($course) {
                $q->where('course_id', $course->id);
            }])
            ->get();

        return Inertia::render('Teacher/StudentProgress', [
            'course' => $course,
            'students' => $students,
        ]);
    }

    /**
     * Live Class Management
     */
    public function liveClasses(Course $course)
    {
        // Ensure teacher owns this course
        if ($course->teacher_id !== Auth::id()) {
            abort(403);
        }

        $liveClasses = $course->liveClasses()->orderBy('scheduled_at')->get();

        return Inertia::render('Teacher/LiveClasses', [
            'course' => $course,
            'liveClasses' => $liveClasses,
        ]);
    }

    public function createLiveClass(Request $request, Course $course)
    {
        // Ensure teacher owns this course
        if ($course->teacher_id !== Auth::id()) {
            abort(403);
        }

        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'meeting_link' => ['required', 'url'],
            'meeting_id' => ['nullable', 'string'],
            'meeting_password' => ['nullable', 'string'],
            'scheduled_at' => ['required', 'date'],
            'duration_minutes' => ['required', 'integer', 'min:1'],
        ]);

        $validated['teacher_id'] = Auth::id();

        $course->liveClasses()->create($validated);

        return redirect()->back()->with('success', 'Live class scheduled successfully.');
    }

    /**
     * Announcements to Students
     */
    public function announcements(Course $course)
    {
        // Ensure teacher owns this course
        if ($course->teacher_id !== Auth::id()) {
            abort(403);
        }

        $announcements = $course->announcements()->latest()->get();

        return Inertia::render('Teacher/Announcements', [
            'course' => $course,
            'announcements' => $announcements,
        ]);
    }

    public function createAnnouncement(Request $request, Course $course)
    {
        // Ensure teacher owns this course
        if ($course->teacher_id !== Auth::id()) {
            abort(403);
        }

        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'content' => ['required', 'string'],
        ]);

        $course->announcements()->create([
            'title' => $validated['title'],
            'content' => $validated['content'],
            'teacher_id' => Auth::id(),
        ]);

        return redirect()->back()->with('success', 'Announcement created successfully.');
    }

    /**
     * Support Tickets to Admin
     */
    public function support()
    {
        $teacher = Auth::user();
        $tickets = $teacher->supportTickets()->latest()->paginate(15);

        return Inertia::render('Teacher/Support', [
            'tickets' => $tickets,
        ]);
    }

    public function createSupportTicket(Request $request)
    {
        $validated = $request->validate([
            'subject' => ['required', 'string', 'max:255'],
            'message' => ['required', 'string', 'max:5000'],
            'priority' => ['nullable', 'in:low,medium,high,urgent'],
        ]);

        $teacher = Auth::user();

        SupportTicket::create([
            'user_id' => $teacher->id,
            'subject' => $validated['subject'],
            'message' => $validated['message'],
            'priority' => $validated['priority'] ?? 'medium',
            'status' => 'open',
        ]);

        return redirect()->back()->with('success', 'Support ticket created successfully.');
    }
}
