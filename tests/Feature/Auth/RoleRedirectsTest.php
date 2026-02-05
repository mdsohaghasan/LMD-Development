<?php

namespace Tests\Feature\Auth;

use App\Models\Course;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RoleRedirectsTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_is_redirected_to_admin_dashboard_after_login()
    {
        $admin = User::factory()->create([ 'role' => 'admin', 'password' => bcrypt('password') ]);

        // Simulate SPA login via posting to /login (Inertia XHR). The same POST behavior applies in tests.
        $response = $this->followingRedirects()->post('/login', [
            'email' => $admin->email,
            'password' => 'password',
        ]);

        // Ensure final URL in Inertia payload points to admin dashboard
        $response->assertSee('"url":"\/admin"');
    }

    public function test_teacher_is_redirected_to_teacher_dashboard_after_login()
    {
        $teacher = User::factory()->create([ 'role' => 'teacher', 'password' => bcrypt('password') ]);

        $response = $this->followingRedirects()->post('/login', [
            'email' => $teacher->email,
            'password' => 'password',
        ]);

        $response->assertSee('"url":"\/teacher"');
    }

    public function test_student_with_enrollment_is_redirected_to_student_dashboard_after_login()
    {
        $student = User::factory()->create([ 'role' => 'student', 'password' => bcrypt('password') ]);
        $teacher = User::factory()->create([ 'role' => 'teacher' ]);

        $course = Course::factory()->create([ 'teacher_id' => $teacher->id ]);

        // create enrollment
        $course->enrollments()->create([ 'student_id' => $student->id, 'progress_percentage' => 0 ]);

        $response = $this->followingRedirects()->post('/login', [
            'email' => $student->email,
            'password' => 'password',
        ]);

        $response->assertSee('"url":"\/student"');
    }

    public function test_normal_user_is_redirected_to_user_dashboard_after_login()
    {
        $user = User::factory()->create([ 'role' => 'user', 'password' => bcrypt('password') ]);

        $response = $this->followingRedirects()->post('/login', [
            'email' => $user->email,
            'password' => 'password',
        ]);

        $response->assertSee('"url":"\/user"');
    }

    public function test_newly_registered_user_is_redirected_to_user_dashboard_after_registration()
    {
        $this->followingRedirects()->post('/register', [
            'name' => 'New User',
            'email' => 'newuser@example.com',
            'password' => 'password',
            'password_confirmation' => 'password',
        ]);

        $user = User::where('email', 'newuser@example.com')->first();

        $this->assertNotNull($user);
        $this->assertEquals('user', $user->role);

        // Ensure a user sees the user dashboard
        $this->actingAs($user)
            ->followingRedirects()
            ->get('/dashboard')
            ->assertSee('"url":"\/user"');
    }
}
