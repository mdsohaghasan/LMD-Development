<?php

namespace Tests\Feature\Ui;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RoleSidebarTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_sidebar_shows_user_links_only()
    {
        $user = User::factory()->create(['role' => 'user']);

        $this->actingAs($user)
            ->get('/user')
            ->assertSee('"url":"\/user"')
            ->assertDontSee('"url":"\/admin"')
            ->assertDontSee('Teaching');
    }

    public function test_student_sidebar_includes_student_links()
    {
        $student = User::factory()->create(['role' => 'student']);

        // make sure student has an enrollment so middleware allows the route
        $teacher = User::factory()->create(['role' => 'teacher']);
        $course = \App\Models\Course::factory()->create(['teacher_id' => $teacher->id]);
        $course->enrollments()->create(['student_id' => $student->id, 'progress_percentage' => 0]);

        $this->actingAs($student)
            ->get('/student')
            ->assertSee('"url":"\/student"')
            ->assertSee('"Student Panel"', false)
            ->assertDontSee('Users');
    }

    public function test_teacher_sidebar_includes_teacher_links()
    {
        $teacher = User::factory()->create(['role' => 'teacher']);

        $this->actingAs($teacher)
            ->get('/teacher')
            ->assertSee('Teaching')
            ->assertSee('My Courses')
            ->assertDontSee('Users');
    }

    public function test_admin_sidebar_includes_admin_links()
    {
        $admin = User::factory()->create(['role' => 'admin']);

        $this->actingAs($admin)
            ->get('/admin')
            ->assertSee('Admin Panel')
            ->assertSee('Users')
            ->assertSee('Payments');
    }
}
