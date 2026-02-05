<?php

namespace Tests\Feature;

use App\Models\Course;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RoleManagementTest extends TestCase
{
    use RefreshDatabase;

    public function test_enrolling_promotes_user_to_student()
    {
        $user = User::factory()->create(['role' => 'user']);
        $teacher = User::factory()->create(['role' => 'teacher']);
        $course = Course::factory()->create(['teacher_id' => $teacher->id]);

        $this->actingAs($user)
            ->post(route('courses.enroll', $course))
            ->assertRedirect();

        $this->assertDatabaseHas('users', [
            'id' => $user->id,
            'role' => 'student',
        ]);

        $this->assertDatabaseHas('enrollments', [
            'course_id' => $course->id,
            'student_id' => $user->id,
        ]);
    }

    public function test_student_middleware_blocks_non_students_from_student_routes()
    {
        $user = User::factory()->create(['role' => 'user']);

        $this->actingAs($user)
            ->get(route('student.dashboard'))
            ->assertRedirect(route('dashboard'));
    }

    public function test_inertia_shared_props_include_role_capabilities()
    {
        $teacher = User::factory()->create(['role' => 'teacher']);

        $response = $this->actingAs($teacher)->get('/app');

        // Shared props should include the user's role so front-end can decide capabilities
        $response->assertSee('"role":"teacher"');
        $response->assertDontSee('"role":"admin"');
    }
}
