<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\Order;
use App\Models\Wishlist;
use App\Models\SupportTicket;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class UserController extends Controller
{
    /**
     * User Dashboard - Basic user panel
     * Access: All authenticated users with 'user' role
     */
    public function dashboard()
    {
        $user = Auth::user();
        
        // Ensure only 'user' role can access
        if ($user->role !== 'user') {
            return redirect()->route('dashboard');
        }

        $stats = [
            'wishlist_count' => $user->wishlists()->count(),
            'orders_count' => $user->orders()->count(),
            'support_tickets_count' => $user->supportTickets()->count(),
        ];

        return Inertia::render('User/Dashboard', [
            'stats' => $stats,
        ]);
    }

    /**
     * Profile Management
     */
    public function profile()
    {
        $user = Auth::user();
        
        return Inertia::render('User/Profile', [
            'user' => $user->only('id', 'name', 'email', 'avatar', 'phone', 'bio'),
        ]);
    }

    public function updateProfile(Request $request)
    {
        $user = Auth::user();

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', Rule::unique('users')->ignore($user->id)],
            'phone' => ['nullable', 'string', 'max:20'],
            'bio' => ['nullable', 'string', 'max:1000'],
            'avatar' => ['nullable', 'image', 'max:2048'],
        ]);

        if ($request->hasFile('avatar')) {
            $validated['avatar'] = $request->file('avatar')->store('avatars', 'public');
        }

        $user->update($validated);

        return redirect()->back()->with('success', 'Profile updated successfully.');
    }

    public function updatePassword(Request $request)
    {
        $request->validate([
            'current_password' => ['required', 'string'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ]);

        $user = Auth::user();

        if (!Hash::check($request->current_password, $user->password)) {
            return redirect()->back()->withErrors(['current_password' => 'Current password is incorrect.']);
        }

        $user->update([
            'password' => Hash::make($request->password),
        ]);

        return redirect()->back()->with('success', 'Password updated successfully.');
    }

    /**
     * Browse Courses - Public course listing
     */
    public function browseCourses(Request $request)
    {
        $query = Course::with('teacher')
            ->where('is_published', true);

        if ($request->has('search')) {
            $query->where('title', 'like', '%' . $request->search . '%');
        }

        if ($request->has('category')) {
            $query->where('category_id', $request->category);
        }

        $courses = $query->paginate(12);

        return Inertia::render('User/BrowseCourses', [
            'courses' => $courses,
            'filters' => $request->only('search', 'category'),
        ]);
    }

    /**
     * Wishlist Management
     */
    public function wishlist()
    {
        $user = Auth::user();
        $wishlistItems = $user->wishlists()->with('course.teacher')->paginate(12);

        return Inertia::render('User/Wishlist', [
            'wishlistItems' => $wishlistItems,
        ]);
    }

    public function addToWishlist(Course $course)
    {
        $user = Auth::user();

        $user->wishlists()->firstOrCreate([
            'course_id' => $course->id,
        ]);

        return redirect()->back()->with('success', 'Course added to wishlist.');
    }

    public function removeFromWishlist(Course $course)
    {
        $user = Auth::user();

        $user->wishlists()->where('course_id', $course->id)->delete();

        return redirect()->back()->with('success', 'Course removed from wishlist.');
    }

    /**
     * Purchase/Enroll Course System
     */
    public function purchaseCourse(Request $request, Course $course)
    {
        $user = Auth::user();

        // Check if already enrolled
        if ($user->enrollments()->where('course_id', $course->id)->exists()) {
            return redirect()->back()->with('info', 'You are already enrolled in this course.');
        }

        // Create order
        $order = Order::create([
            'user_id' => $user->id,
            'course_id' => $course->id,
            'amount' => $course->price ?? 0, // Assuming course has price field
            'status' => 'pending',
            'payment_method' => $request->payment_method ?? 'free',
        ]);

        // If free course, auto-enroll
        if (($course->price ?? 0) == 0) {
            $user->enrollments()->create([
                'course_id' => $course->id,
                'status' => 'active',
                'progress_percentage' => 0,
            ]);

            $order->update(['status' => 'completed']);

            // Role transition: User → Student
            if ($user->role === 'user') {
                $user->role = 'student';
                $user->save();
            }

            return redirect()->route('student.dashboard')
                ->with('success', 'Enrolled successfully! Welcome to the student panel.');
        }

        return redirect()->route('user.orders.show', $order)
            ->with('success', 'Order created. Please complete payment.');
    }

    /**
     * Order History & Invoices
     */
    public function orders()
    {
        $user = Auth::user();
        $orders = $user->orders()->with('course', 'payments')->latest()->paginate(15);

        return Inertia::render('User/Orders', [
            'orders' => $orders,
        ]);
    }

    public function showOrder(Order $order)
    {
        // Ensure user owns this order
        if ($order->user_id !== Auth::id()) {
            abort(403);
        }

        $order->load('course', 'payments');

        return Inertia::render('User/OrderDetail', [
            'order' => $order,
        ]);
    }

    /**
     * Support/Contact Form
     */
    public function support()
    {
        $user = Auth::user();
        $tickets = $user->supportTickets()->latest()->paginate(15);

        return Inertia::render('User/Support', [
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

        $user = Auth::user();

        SupportTicket::create([
            'user_id' => $user->id,
            'subject' => $validated['subject'],
            'message' => $validated['message'],
            'priority' => $validated['priority'] ?? 'medium',
            'status' => 'open',
        ]);

        return redirect()->back()->with('success', 'Support ticket created successfully.');
    }
}
