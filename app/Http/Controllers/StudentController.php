<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\Enrollment;
use App\Models\Lesson;
use App\Models\LessonProgress;
use App\Models\Assignment;
use App\Models\AssignmentSubmission;
use App\Models\Quiz;
use App\Models\QuizAttempt;
use App\Models\Certificate;
use App\Models\LiveClass;
use App\Models\Order;
use App\Models\SupportTicket;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class StudentController extends Controller
{
    /**
     * Student Dashboard - Only accessible if enrolled in at least 1 course
     */
    public function dashboard()
    {
        $student = Auth::user();
        
        $enrollments = $student->enrollments()
            ->with(['course.teacher', 'course.lessons'])
            ->get();

        $stats = [
            'totalCourses' => $enrollments->count(),
            'completedCourses' => $enrollments->where('status', 'completed')->count(),
            'inProgressCourses' => $enrollments->where('status', 'active')->count(),
            'totalAssignments' => Assignment::whereHas('course', function($q) use ($student) {
                $q->whereHas('enrollments', function($q2) use ($student) {
                    $q2->where('student_id', $student->id);
                });
            })->count(),
            'completedAssignments' => AssignmentSubmission::where('student_id', $student->id)
                ->where('status', 'graded')
                ->count(),
            'certificates' => $student->certificates()->count(),
        ];

        return Inertia::render('Student/Dashboard', [
            'enrollments' => $enrollments->map(function($enrollment) {
                return [
                    'id' => $enrollment->id,
                    'course_id' => $enrollment->course_id,
                    'status' => $enrollment->status,
                    'progress_percentage' => $enrollment->progress_percentage,
                    'course' => [
                        'id' => $enrollment->course->id,
                        'title' => $enrollment->course->title,
                        'description' => $enrollment->course->description,
                    ]
                ];
            }),
            'stats' => $stats,
        ]);
    }

    /**
     * Enrolled Courses List
     */
    public function courses()
    {
        $student = Auth::user();
        $enrollments = $student->enrollments()
            ->with(['course.teacher'])
            ->paginate(12);

        return Inertia::render('Student/Courses', [
            'enrollments' => $enrollments,
        ]);
    }

    /**
     * Course Detail with Lessons
     */
    public function course(Course $course)
    {
        $student = Auth::user();
        
        // Ensure student is enrolled
        $enrollment = $student->enrollments()->where('course_id', $course->id)->first();
        if (!$enrollment) {
            abort(403, 'You must be enrolled in this course to access it.');
        }

        $course->load(['lessons', 'teacher', 'quizzes', 'assignments']);
        
        // Get lesson progress
        $lessonProgress = LessonProgress::where('student_id', $student->id)
            ->whereIn('lesson_id', $course->lessons->pluck('id'))
            ->get()
            ->keyBy('lesson_id');

        return Inertia::render('Student/CourseDetail', [
            'course' => $course,
            'enrollment' => $enrollment,
            'lessonProgress' => $lessonProgress,
        ]);
    }

    /**
     * Video Lessons
     */
    public function lesson(Lesson $lesson)
    {
        $student = Auth::user();
        $course = $lesson->course;

        // Ensure student is enrolled
        if (!$student->enrollments()->where('course_id', $course->id)->exists()) {
            abort(403);
        }

        $lesson->load('course');

        // Mark as started if not already
        LessonProgress::firstOrCreate([
            'student_id' => $student->id,
            'lesson_id' => $lesson->id,
        ], [
            'status' => 'in_progress',
        ]);

        return Inertia::render('Student/Lesson', [
            'lesson' => $lesson,
            'course' => $course,
        ]);
    }

    /**
     * Mark Lesson as Complete
     */
    public function completeLesson(Lesson $lesson)
    {
        $student = Auth::user();
        
        $progress = LessonProgress::updateOrCreate(
            [
                'student_id' => $student->id,
                'lesson_id' => $lesson->id,
            ],
            [
                'status' => 'completed',
                'completed_at' => now(),
            ]
        );

        // Update course progress
        $this->updateCourseProgress($student, $lesson->course_id);

        return redirect()->back()->with('success', 'Lesson marked as complete.');
    }

    /**
     * Assignments
     */
    public function assignments()
    {
        $student = Auth::user();
        
        $assignments = Assignment::whereHas('course', function($q) use ($student) {
            $q->whereHas('enrollments', function($q2) use ($student) {
                $q2->where('student_id', $student->id);
            });
        })->with(['course', 'submissions' => function($q) use ($student) {
            $q->where('student_id', $student->id);
        }])->paginate(15);

        return Inertia::render('Student/Assignments', [
            'assignments' => $assignments,
        ]);
    }

    public function submitAssignment(Request $request, Assignment $assignment)
    {
        $student = Auth::user();

        // Ensure student is enrolled
        if (!$student->enrollments()->where('course_id', $assignment->course_id)->exists()) {
            abort(403);
        }

        $validated = $request->validate([
            'submission_text' => ['required', 'string'],
            'attachment' => ['nullable', 'file', 'max:10240'], // 10MB
        ]);

        $submission = AssignmentSubmission::create([
            'assignment_id' => $assignment->id,
            'student_id' => $student->id,
            'submission_text' => $validated['submission_text'],
            'status' => 'submitted',
        ]);

        if ($request->hasFile('attachment')) {
            $submission->attachment = $request->file('attachment')->store('assignments', 'public');
            $submission->save();
        }

        return redirect()->back()->with('success', 'Assignment submitted successfully.');
    }

    /**
     * Quizzes/Exams
     */
    public function quizzes()
    {
        $student = Auth::user();
        
        $quizzes = Quiz::whereHas('course', function($q) use ($student) {
            $q->whereHas('enrollments', function($q2) use ($student) {
                $q2->where('student_id', $student->id);
            });
        })->with(['course', 'attempts' => function($q) use ($student) {
            $q->where('student_id', $student->id)->latest();
        }])->paginate(15);

        return Inertia::render('Student/Quizzes', [
            'quizzes' => $quizzes,
        ]);
    }

    public function takeQuiz(Quiz $quiz)
    {
        $student = Auth::user();

        // Ensure student is enrolled
        if (!$student->enrollments()->where('course_id', $quiz->course_id)->exists()) {
            abort(403);
        }

        $quiz->load(['questions.options', 'course']);

        return Inertia::render('Student/TakeQuiz', [
            'quiz' => $quiz,
        ]);
    }

    public function submitQuiz(Request $request, Quiz $quiz)
    {
        $student = Auth::user();

        // Ensure student is enrolled
        if (!$student->enrollments()->where('course_id', $quiz->course_id)->exists()) {
            abort(403);
        }

        $answers = $request->validate([
            'answers' => ['required', 'array'],
            'answers.*' => ['required'],
        ]);

        // Calculate score
        $score = $this->calculateQuizScore($quiz, $answers['answers']);
        $totalQuestions = $quiz->questions()->count();
        $percentage = ($score / $totalQuestions) * 100;

        QuizAttempt::create([
            'quiz_id' => $quiz->id,
            'student_id' => $student->id,
            'score' => $score,
            'total_questions' => $totalQuestions,
            'percentage' => $percentage,
            'answers' => $answers['answers'],
            'completed_at' => now(),
        ]);

        return redirect()->route('student.quizzes')
            ->with('success', "Quiz completed! Score: {$score}/{$totalQuestions} ({$percentage}%)");
    }

    /**
     * Certificates
     */
    public function certificates()
    {
        $student = Auth::user();
        $certificates = $student->certificates()->with('course')->paginate(15);

        return Inertia::render('Student/Certificates', [
            'certificates' => $certificates,
        ]);
    }

    /**
     * Live Classes
     */
    public function liveClasses()
    {
        $student = Auth::user();
        
        $liveClasses = LiveClass::whereHas('course', function($q) use ($student) {
            $q->whereHas('enrollments', function($q2) use ($student) {
                $q2->where('student_id', $student->id);
            });
        })->with('course')->paginate(15);

        return Inertia::render('Student/LiveClasses', [
            'liveClasses' => $liveClasses,
        ]);
    }

    /**
     * Payment & Enrollment History
     */
    public function orders()
    {
        $student = Auth::user();
        $orders = $student->orders()->with('course', 'payments')->latest()->paginate(15);

        return Inertia::render('Student/Orders', [
            'orders' => $orders,
        ]);
    }

    /**
     * Support/Contact
     */
    public function support()
    {
        $student = Auth::user();
        $tickets = $student->supportTickets()->latest()->paginate(15);

        return Inertia::render('Student/Support', [
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

        $student = Auth::user();

        SupportTicket::create([
            'user_id' => $student->id,
            'subject' => $validated['subject'],
            'message' => $validated['message'],
            'priority' => $validated['priority'] ?? 'medium',
            'status' => 'open',
        ]);

        return redirect()->back()->with('success', 'Support ticket created successfully.');
    }

    /**
     * Helper Methods
     */
    private function updateCourseProgress($student, $courseId)
    {
        $course = Course::find($courseId);
        $totalLessons = $course->lessons()->count();
        $completedLessons = LessonProgress::where('student_id', $student->id)
            ->whereIn('lesson_id', $course->lessons->pluck('id'))
            ->where('status', 'completed')
            ->count();

        $progress = $totalLessons > 0 ? ($completedLessons / $totalLessons) * 100 : 0;

        Enrollment::where('student_id', $student->id)
            ->where('course_id', $courseId)
            ->update(['progress_percentage' => $progress]);

        // Issue certificate if course is completed
        if ($progress >= 100) {
            Enrollment::where('student_id', $student->id)
                ->where('course_id', $courseId)
                ->update([
                    'status' => 'completed',
                    'completed_at' => now(),
                ]);

            // Create certificate
            Certificate::firstOrCreate([
                'student_id' => $student->id,
                'course_id' => $courseId,
            ], [
                'certificate_number' => 'CERT-' . strtoupper(uniqid()),
                'issued_at' => now(),
            ]);
        }
    }

    private function calculateQuizScore($quiz, $answers)
    {
        $score = 0;
        $questions = $quiz->questions()->with('options')->get();

        foreach ($questions as $question) {
            $correctOption = $question->options()->where('is_correct', true)->first();
            if ($correctOption && isset($answers[$question->id]) && $answers[$question->id] == $correctOption->id) {
                $score++;
            }
        }

        return $score;
    }
}
