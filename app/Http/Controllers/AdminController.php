<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Course;
use App\Models\Category;
use App\Models\Enrollment;
use App\Models\Order;
use App\Models\Payment;
use App\Models\SupportTicket;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class AdminController extends Controller
{
    /**
     * Admin Dashboard with Analytics
     */
    public function dashboard()
    {
        $stats = [
            'totalStudents' => User::where('role', 'student')->count(),
            'totalTeachers' => User::where('role', 'teacher')->count(),
            'totalUsers' => User::where('role', 'user')->count(),
            'totalCourses' => Course::count(),
            'publishedCourses' => Course::where('is_published', true)->count(),
            'pendingCourses' => Course::where('is_published', false)->count(),
            'totalEnrollments' => Enrollment::count(),
            'totalOrders' => Order::count(),
            'totalRevenue' => Payment::where('status', 'completed')->sum('amount') ?? 0,
            'pendingTickets' => SupportTicket::where('status', 'open')->count(),
        ];

        // Recent activity
        $recentActivity = ActivityLog::with('user')->latest()->take(10)->get()->map(function($log) {
            return [
                'id' => $log->id,
                'action' => $log->action,
                'description' => $log->description,
                'created_at' => $log->created_at,
                'user' => $log->user ? [
                    'id' => $log->user->id,
                    'name' => $log->user->name,
                ] : null,
            ];
        });

        return Inertia::render('Admin/Dashboard', [
            'stats' => $stats,
            'recentActivity' => $recentActivity,
        ]);
    }

    /**
     * Course Management & Approval
     */
    public function courses(Request $request)
    {
        $query = Course::with('teacher', 'category');

        if ($request->has('status')) {
            if ($request->status === 'pending') {
                $query->where('is_published', false);
            } elseif ($request->status === 'published') {
                $query->where('is_published', true);
            }
        }

        $courses = $query->latest()->paginate(20);

        return Inertia::render('Admin/Courses', [
            'courses' => $courses,
            'filters' => $request->only('status'),
        ]);
    }

    public function approveCourse(Course $course)
    {
        $course->update(['is_published' => true]);

        ActivityLog::create([
            'user_id' => Auth::id(),
            'action' => 'course_approved',
            'description' => "Approved course: {$course->title}",
        ]);

        return redirect()->back()->with('success', 'Course approved successfully.');
    }

    public function rejectCourse(Request $request, Course $course)
    {
        $request->validate([
            'reason' => ['required', 'string'],
        ]);

        $course->update(['is_published' => false]);

        ActivityLog::create([
            'user_id' => Auth::id(),
            'action' => 'course_rejected',
            'description' => "Rejected course: {$course->title}. Reason: {$request->reason}",
        ]);

        return redirect()->back()->with('success', 'Course rejected.');
    }

    /**
     * Category & Curriculum Management
     */
    public function categories()
    {
        $categories = Category::withCount('courses')->paginate(20);

        return Inertia::render('Admin/Categories', [
            'categories' => $categories,
        ]);
    }

    public function createCategory(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255', 'unique:categories'],
            'description' => ['nullable', 'string'],
        ]);

        Category::create($validated);

        return redirect()->back()->with('success', 'Category created successfully.');
    }

    /**
     * Payment & Transaction Management
     */
    public function payments(Request $request)
    {
        $query = Payment::with('user', 'order.course');

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        $payments = $query->latest()->paginate(20);

        $stats = [
            'totalRevenue' => Payment::where('status', 'completed')->sum('amount'),
            'pendingPayments' => Payment::where('status', 'pending')->sum('amount'),
            'failedPayments' => Payment::where('status', 'failed')->count(),
        ];

        return Inertia::render('Admin/Payments', [
            'payments' => $payments,
            'stats' => $stats,
            'filters' => $request->only('status'),
        ]);
    }

    /**
     * Coupon / Discount Management
     */
    public function coupons()
    {
        // Assuming you have a coupons table
        return Inertia::render('Admin/Coupons', [
            'message' => 'Coupon management coming soon',
        ]);
    }

    /**
     * User Management - Create/Edit/Delete Users & Assign Roles
     */
    public function users(Request $request)
    {
        $query = User::query();

        if ($request->has('role')) {
            $query->where('role', $request->role);
        }

        if ($request->has('search')) {
            $query->where(function($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('email', 'like', '%' . $request->search . '%');
            });
        }

        $users = $query->latest()->paginate(20);

        $roleStats = [
            'admin' => User::where('role', 'admin')->count(),
            'teacher' => User::where('role', 'teacher')->count(),
            'student' => User::where('role', 'student')->count(),
            'user' => User::where('role', 'user')->count(),
        ];

        return Inertia::render('Admin/Users', [
            'users' => $users,
            'roleStats' => $roleStats,
            'filters' => $request->only('role', 'search'),
        ]);
    }

    public function createUser(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'string', 'min:8'],
            'role' => ['required', 'in:admin,teacher,student,user'],
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => bcrypt($validated['password']),
            'role' => $validated['role'],
        ]);

        ActivityLog::create([
            'user_id' => Auth::id(),
            'action' => 'user_created',
            'description' => "Created user: {$user->name} ({$user->role})",
        ]);

        return redirect()->back()->with('success', 'User created successfully.');
    }

    public function updateUserRole(Request $request, User $user)
    {
        $validated = $request->validate([
            'role' => ['required', 'in:admin,teacher,student,user'],
        ]);

        $oldRole = $user->role;
        $user->update(['role' => $validated['role']]);

        ActivityLog::create([
            'user_id' => Auth::id(),
            'action' => 'role_changed',
            'description' => "Changed role for {$user->name} from {$oldRole} to {$validated['role']}",
        ]);

        return redirect()->back()->with('success', 'User role updated successfully.');
    }

    public function deleteUser(User $user)
    {
        // Prevent deleting yourself
        if ($user->id === Auth::id()) {
            return redirect()->back()->with('error', 'You cannot delete your own account.');
        }

        $userName = $user->name;
        $user->delete();

        ActivityLog::create([
            'user_id' => Auth::id(),
            'action' => 'user_deleted',
            'description' => "Deleted user: {$userName}",
        ]);

        return redirect()->back()->with('success', 'User deleted successfully.');
    }

    /**
     * Contact Messages
     */
    public function contactMessages()
    {
        $tickets = SupportTicket::with('user')->latest()->paginate(20);

        return Inertia::render('Admin/ContactMessages', [
            'tickets' => $tickets,
        ]);
    }

    public function updateTicketStatus(Request $request, SupportTicket $ticket)
    {
        $validated = $request->validate([
            'status' => ['required', 'in:open,in_progress,resolved,closed'],
            'assigned_to' => ['nullable', 'exists:users,id'],
        ]);

        $ticket->update($validated);

        if ($validated['status'] === 'resolved') {
            $ticket->update(['resolved_at' => now()]);
        }

        return redirect()->back()->with('success', 'Ticket status updated.');
    }

    /**
     * Reports & Logs
     */
    public function reports()
    {
        $reports = [
            'enrollmentReport' => Enrollment::select(DB::raw('DATE(created_at) as date'), DB::raw('count(*) as count'))
                ->groupBy('date')
                ->orderBy('date', 'desc')
                ->take(30)
                ->get(),
            'revenueReport' => Payment::where('status', 'completed')
                ->select(DB::raw('DATE(created_at) as date'), DB::raw('sum(amount) as total'))
                ->groupBy('date')
                ->orderBy('date', 'desc')
                ->take(30)
                ->get(),
        ];

        return Inertia::render('Admin/Reports', [
            'reports' => $reports,
        ]);
    }

    public function activityLogs()
    {
        $logs = ActivityLog::with('user')->latest()->paginate(50);

        return Inertia::render('Admin/ActivityLogs', [
            'logs' => $logs,
        ]);
    }

    /**
     * System Settings
     */
    public function settings()
    {
        // Assuming you have a settings table
        return Inertia::render('Admin/Settings', [
            'message' => 'System settings coming soon',
        ]);
    }
}
