<?php

namespace Tests\Feature;

use App\Models\Course;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminAccessTest extends TestCase
{
    use RefreshDatabase;

    public function test_non_admin_cannot_access_admin_courses()
    {
        $student = User::factory()->create(['role' => 'student']);
        $this->actingAs($student);

        $response = $this->get(route('admin.courses.index'));
        $response->assertStatus(403);
    }

    public function test_admin_can_access_admin_courses_and_sees_component_name()
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $this->actingAs($admin);

        $response = $this->get(route('admin.courses.index'));
        $response->assertStatus(200);

        // Since server-side Inertia package may be missing in this environment,
        // the fallback view should contain the Inertia component name.
        $response->assertSee('Admin/Courses/Index');
    }

    public function test_admin_can_access_lessons_index_for_course()
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $teacher = User::factory()->create(['role' => 'teacher']);
        $course = Course::factory()->create(['teacher_id' => $teacher->id]);

        $this->actingAs($admin);
        $response = $this->get(route('admin.courses.lessons.index', $course));
        $response->assertStatus(200);
        $response->assertSee('Admin/Lessons/Index');
    }
}
