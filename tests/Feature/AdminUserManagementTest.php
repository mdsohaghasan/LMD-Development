<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminUserManagementTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_promote_user_to_teacher()
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $user = User::factory()->create(['role' => 'user']);

        $this->actingAs($admin)
            ->patch(route('admin.users.update', $user), ['role' => 'teacher'])
            ->assertRedirect();

        $this->assertDatabaseHas('users', [
            'id' => $user->id,
            'role' => 'teacher',
        ]);
    }

    public function test_non_admin_cannot_change_user_roles()
    {
        $student = User::factory()->create(['role' => 'student']);
        $user = User::factory()->create(['role' => 'user']);

        $this->actingAs($student)
            ->patch(route('admin.users.update', $user), ['role' => 'teacher'])
            ->assertStatus(403);
    }
}
