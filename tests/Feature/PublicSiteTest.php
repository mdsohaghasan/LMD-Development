<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PublicSiteTest extends TestCase
{
    use RefreshDatabase;

    public function test_home_page_loads_and_shows_welcome()
    {
        // Seed a published course to display
        $teacher = User::factory()->create(['role' => 'teacher']);
        $this->actingAs($teacher);

        $course = \App\Models\Course::factory()->create([
            'teacher_id' => $teacher->id,
            'is_published' => true,
            'title' => 'Intro to Testing',
        ]);

        // As guest (logout), visit home
        auth()->logout();

        $response = $this->get('/');
        $response->assertStatus(200);
        $response->assertSee('Welcome to our LMS');
        $response->assertSee('Browse all courses');
        // Ensure raw Blade directives like @routes are not rendered to visitors
        $response->assertDontSee('@routes');
    }

    public function test_login_and_register_pages_exist()
    {
        $response = $this->get('/login');
        $response->assertStatus(200);
        $response->assertSee('Log in');

        $response = $this->get('/register');
        $response->assertStatus(200);
        $response->assertSee('Register');
    }

    public function test_dashboard_redirects_based_on_role()
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $this->actingAs($admin);

        $response = $this->get('/dashboard');
        $response->assertRedirect('/admin');

        $teacher = User::factory()->create(['role' => 'teacher']);
        $this->actingAs($teacher);
        $response = $this->get('/dashboard');
        $response->assertRedirect('/teacher');

        // Student without enrollments stays on the main dashboard
        $student = User::factory()->create(['role' => 'student']);
        $this->actingAs($student);
        $response = $this->get('/dashboard');
        $response->assertStatus(200);

        // Student with enrollments is redirected to student panel
        $studentWithEnrollment = User::factory()->create(['role' => 'student']);
        $course = \App\Models\Course::factory()->create(['teacher_id' => User::factory()->create(['role' => 'teacher'])->id, 'is_published' => true]);
        $studentWithEnrollment->enrollments()->create(['course_id' => $course->id, 'student_id' => $studentWithEnrollment->id]);

        $this->actingAs($studentWithEnrollment);
        $response = $this->get('/dashboard');
        $response->assertRedirect('/student');
    }
}
