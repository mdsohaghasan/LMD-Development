<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use Database\Seeders\DatabaseSeeder;

class DatabaseSeederTest extends TestCase
{
    use RefreshDatabase;

    public function test_database_seeder_creates_demo_users()
    {
        $this->seed(DatabaseSeeder::class);

        $this->assertDatabaseHas('users', ['email' => 'admin@test.com']);
        $this->assertDatabaseHas('users', ['email' => 'teacher@test.com']);
        $this->assertDatabaseHas('users', ['email' => 'student@test.com']);
        $this->assertDatabaseHas('users', ['email' => 'user@test.com']);
    }
}
