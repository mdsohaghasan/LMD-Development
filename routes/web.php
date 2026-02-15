<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\TeacherController;
use App\Http\Controllers\StudentController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

use App\Http\Controllers\HomeController;

Route::get('/', [HomeController::class, 'index'])->name('home');

// SPA test route (requires auth)
Route::get('/app', function () {
    return Inertia::render('Dashboard');
})->middleware('auth')->name('spa.dashboard');

// Public courses
use App\Http\Controllers\Web\CourseController as WebCourseController;
Route::get('/courses', [WebCourseController::class, 'index'])->name('courses.index');
Route::get('/courses/{course}', [WebCourseController::class, 'show'])->name('courses.show');
Route::post('/courses/{course}/enroll', [WebCourseController::class, 'enroll'])->middleware('auth')->name('courses.enroll');

Route::middleware('auth')->group(function () {
    Route::get('/dashboard', function () {
        $user = auth()->user();

        if ($user->isAdmin()) {
            return redirect()->route('admin.dashboard');
        }

        if ($user->isTeacher()) {
            return redirect()->route('teacher.dashboard');
        }

        // Students with enrollments go to the student panel
        if ($user->isStudent() && $user->enrollments()->exists()) {
            return redirect()->route('student.dashboard');
        }

        // Normal users go to their /user panel
        if ($user->role === 'user') {
            return redirect()->route('user.dashboard');
        }

        // Fallback to the general dashboard Inertia page
        return Inertia::render('Dashboard');
    })->name('dashboard');

    // Profile routes (legacy - redirects to role-specific profiles)
    Route::get('/profile', function() {
        $user = auth()->user();
        if ($user->isAdmin()) return redirect()->route('admin.dashboard');
        if ($user->isTeacher()) return redirect()->route('teacher.dashboard');
        if ($user->isStudent()) return redirect()->route('student.profile');
        return redirect()->route('user.profile');
    })->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// Admin routes - Strict: Only 'admin' role
Route::middleware(['auth', \App\Http\Middleware\AdminMiddleware::class])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', [AdminController::class, 'dashboard'])->name('dashboard');
    Route::redirect('/', '/admin/dashboard');

    // Course Management & Approval
    Route::get('/courses', [AdminController::class, 'courses'])->name('courses');
    Route::post('/courses/{course}/approve', [AdminController::class, 'approveCourse'])->name('courses.approve');
    Route::post('/courses/{course}/reject', [AdminController::class, 'rejectCourse'])->name('courses.reject');

    // Category & Curriculum Management
    Route::get('/categories', [AdminController::class, 'categories'])->name('categories');
    Route::post('/categories', [AdminController::class, 'createCategory'])->name('categories.create');

    // Payment & Transaction Management
    Route::get('/payments', [AdminController::class, 'payments'])->name('payments');

    // Coupon / Discount Management
    Route::get('/coupons', [AdminController::class, 'coupons'])->name('coupons');

    // User Management - Create/Edit/Delete Users & Assign Roles
    Route::get('/users', [AdminController::class, 'users'])->name('users');
    Route::post('/users', [AdminController::class, 'createUser'])->name('users.create');
    Route::patch('/users/{user}/role', [AdminController::class, 'updateUserRole'])->name('users.update-role');
    Route::delete('/users/{user}', [AdminController::class, 'deleteUser'])->name('users.delete');

    // Contact Messages
    Route::get('/contact-messages', [AdminController::class, 'contactMessages'])->name('contact-messages');
    Route::patch('/tickets/{ticket}', [AdminController::class, 'updateTicketStatus'])->name('tickets.update');

    // Reports & Logs
    Route::get('/reports', [AdminController::class, 'reports'])->name('reports');
    Route::get('/activity-logs', [AdminController::class, 'activityLogs'])->name('activity-logs');

    // System Settings
    Route::get('/settings', [AdminController::class, 'settings'])->name('settings');
});

// Teacher routes - Strict: Only 'teacher' role
Route::middleware(['auth', \App\Http\Middleware\TeacherMiddleware::class])->prefix('teacher')->name('teacher.')->group(function () {
    Route::get('/dashboard', [TeacherController::class, 'dashboard'])->name('dashboard');
    Route::redirect('/', '/teacher/dashboard');
    
    // Course management (only their own courses)
    Route::get('/courses', [TeacherController::class, 'courses'])->name('courses');
    Route::post('/courses', [TeacherController::class, 'createCourse'])->name('courses.create');
    Route::patch('/courses/{course}', [TeacherController::class, 'updateCourse'])->name('courses.update');
    
    // Lesson management
    Route::get('/courses/{course}/lessons', [TeacherController::class, 'lessons'])->name('courses.lessons');
    Route::post('/courses/{course}/lessons', [TeacherController::class, 'createLesson'])->name('lessons.create');
    
    // Assignment management
    Route::get('/courses/{course}/assignments', [TeacherController::class, 'assignments'])->name('courses.assignments');
    Route::post('/courses/{course}/assignments', [TeacherController::class, 'createAssignment'])->name('assignments.create');
    Route::get('/assignments/{submission}/review', [TeacherController::class, 'reviewAssignment'])->name('assignments.review');
    Route::post('/assignments/{submission}/grade', [TeacherController::class, 'gradeAssignment'])->name('assignments.grade');
    
    // Quiz management
    Route::get('/courses/{course}/quizzes', [TeacherController::class, 'quizzes'])->name('courses.quizzes');
    Route::post('/courses/{course}/quizzes', [TeacherController::class, 'createQuiz'])->name('quizzes.create');
    
    // Student management (only their courses)
    Route::get('/courses/{course}/students', [TeacherController::class, 'students'])->name('courses.students');
    Route::get('/courses/{course}/progress', [TeacherController::class, 'studentProgress'])->name('courses.progress');
    
    // Live classes
    Route::get('/courses/{course}/live-classes', [TeacherController::class, 'liveClasses'])->name('courses.live-classes');
    Route::post('/courses/{course}/live-classes', [TeacherController::class, 'createLiveClass'])->name('live-classes.create');
    
    // Announcements
    Route::get('/courses/{course}/announcements', [TeacherController::class, 'announcements'])->name('courses.announcements');
    Route::post('/courses/{course}/announcements', [TeacherController::class, 'createAnnouncement'])->name('announcements.create');
    
    // Support tickets to admin
    Route::get('/support', [TeacherController::class, 'support'])->name('support');
    Route::post('/support', [TeacherController::class, 'createSupportTicket'])->name('support.create');
});

// Student routes - Strict: Only 'student' role with enrollments
Route::middleware(['auth', \App\Http\Middleware\StudentMiddleware::class])->prefix('student')->name('student.')->group(function () {
    Route::get('/', [StudentController::class, 'dashboard'])->name('dashboard');
    
    // Enrolled courses
    Route::get('/courses', [StudentController::class, 'courses'])->name('courses');
    Route::get('/courses/{course}', [StudentController::class, 'course'])->name('courses.show');
    
    // Lessons
    Route::get('/lessons/{lesson}', [StudentController::class, 'lesson'])->name('lessons.show');
    Route::post('/lessons/{lesson}/complete', [StudentController::class, 'completeLesson'])->name('lessons.complete');
    
    // Assignments
    Route::get('/assignments', [StudentController::class, 'assignments'])->name('assignments');
    Route::post('/assignments/{assignment}/submit', [StudentController::class, 'submitAssignment'])->name('assignments.submit');
    
    // Quizzes/Exams
    Route::get('/quizzes', [StudentController::class, 'quizzes'])->name('quizzes');
    Route::get('/quizzes/{quiz}/take', [StudentController::class, 'takeQuiz'])->name('quizzes.take');
    Route::post('/quizzes/{quiz}/submit', [StudentController::class, 'submitQuiz'])->name('quizzes.submit');
    
    // Certificates
    Route::get('/certificates', [StudentController::class, 'certificates'])->name('certificates');
    
    // Live Classes
    Route::get('/live-classes', [StudentController::class, 'liveClasses'])->name('live-classes');
    
    // Orders & Payment History
    Route::get('/orders', [StudentController::class, 'orders'])->name('orders');
    
    // Support
    Route::get('/support', [StudentController::class, 'support'])->name('support');
    Route::post('/support', [StudentController::class, 'createSupportTicket'])->name('support.create');
    
    // Profile
    Route::get('/profile', function() {
        $student = auth()->user();
        return \Inertia\Inertia::render('Student/Profile', [
            'user' => $student->only('id', 'name', 'email', 'avatar', 'phone', 'bio'),
        ]);
    })->name('profile');
    
    // Settings
    Route::get('/settings', function() {
        return \Inertia\Inertia::render('User/Settings');
    })->name('settings');
});

// Normal user routes - Strict: Only 'user' role
Route::middleware(['auth'])->prefix('user')->name('user.')->group(function () {
    Route::get('/', [App\Http\Controllers\UserController::class, 'dashboard'])->name('dashboard');
    
    // Profile management
    Route::get('/profile', [App\Http\Controllers\UserController::class, 'profile'])->name('profile');
    Route::patch('/profile', [App\Http\Controllers\UserController::class, 'updateProfile'])->name('profile.update');
    Route::patch('/password', [App\Http\Controllers\UserController::class, 'updatePassword'])->name('password.update');
    
    // Settings
    Route::get('/settings', function() {
        return \Inertia\Inertia::render('User/Settings');
    })->name('settings');
    
    // Browse courses
    Route::get('/courses', [App\Http\Controllers\UserController::class, 'browseCourses'])->name('courses.browse');
    
    // Wishlist
    Route::get('/wishlist', [App\Http\Controllers\UserController::class, 'wishlist'])->name('wishlist');
    Route::post('/wishlist/{course}', [App\Http\Controllers\UserController::class, 'addToWishlist'])->name('wishlist.add');
    Route::delete('/wishlist/{course}', [App\Http\Controllers\UserController::class, 'removeFromWishlist'])->name('wishlist.remove');
    
    // Purchase/Enroll
    Route::post('/courses/{course}/purchase', [App\Http\Controllers\UserController::class, 'purchaseCourse'])->name('courses.purchase');
    
    // Orders & Invoices
    Route::get('/orders', [App\Http\Controllers\UserController::class, 'orders'])->name('orders');
    Route::get('/orders/{order}', [App\Http\Controllers\UserController::class, 'showOrder'])->name('orders.show');
    
    // Support/Contact
    Route::get('/support', [App\Http\Controllers\UserController::class, 'support'])->name('support');
    Route::post('/support', [App\Http\Controllers\UserController::class, 'createSupportTicket'])->name('support.create');
});

// Language switch route
Route::post('/language', function (\Illuminate\Http\Request $request) {
    $lang = $request->validate(['lang' => 'required|in:en,bn,ar'])['lang'];
    session(['locale' => $lang]);
    app()->setLocale($lang);
    return back();
});

require __DIR__.'/auth.php';
