<?php

namespace Tests\Feature;

use App\Models\Course;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TeacherCourseOwnershipTest extends TestCase
{
    use RefreshDatabase;

    public function test_teacher_sees_only_their_courses()
    {
        $teacherA = User::factory()->create(['role' => 'teacher']);
        $teacherB = User::factory()->create(['role' => 'teacher']);

        Course::factory()->create(['teacher_id' => $teacherA->id, 'title' => 'A Course']);
        Course::factory()->create(['teacher_id' => $teacherB->id, 'title' => 'B Course']);

        $this->actingAs($teacherA)
            ->get(route('teacher.courses.index'))
            ->assertSee('A Course')
            ->assertDontSee('B Course');
    }

    public function test_teacher_cannot_update_other_teacher_course()
    {
        $teacherA = User::factory()->create(['role' => 'teacher']);
        $teacherB = User::factory()->create(['role' => 'teacher']);

        $course = Course::factory()->create(['teacher_id' => $teacherB->id]);

        $this->actingAs($teacherA)
            ->patch(route('teacher.courses.update', $course), ['title' => 'Hacked'])
            ->assertStatus(403);
    }
}
