<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Course;
use App\Models\Enrollment;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Idempotent demo users (defensive: only set 'role' if the column exists)
        $hasRole = \Illuminate\Support\Facades\Schema::hasColumn('users', 'role');

        $adminAttrs = [
            'name' => 'Admin User',
            'password' => Hash::make('password123'),
        ];
        if ($hasRole) {
            $adminAttrs['role'] = 'admin';
        }
        $admin = User::updateOrCreate([
            'email' => 'admin@test.com',
        ], $adminAttrs);

        $teacherAttrs = [
            'name' => 'Teacher User',
            'password' => Hash::make('password123'),
        ];
        if ($hasRole) {
            $teacherAttrs['role'] = 'teacher';
        }
        $teacher = User::updateOrCreate([
            'email' => 'teacher@test.com',
        ], $teacherAttrs);

        $studentAttrs = [
            'name' => 'Student User',
            'password' => Hash::make('password123'),
        ];
        if ($hasRole) {
            $studentAttrs['role'] = 'student';
        }
        $student = User::updateOrCreate([
            'email' => 'student@test.com',
        ], $studentAttrs);

        $normalAttrs = [
            'name' => 'Normal User',
            'password' => Hash::make('password123'),
        ];
        if ($hasRole) {
            // use a 'user' role so this account is considered a non-student by role checks
            $normalAttrs['role'] = 'user';
        }
        $normal = User::updateOrCreate([
            'email' => 'user@test.com',
        ], $normalAttrs);

        // Ensure there is a sample course taught by the demo teacher (create category if missing)
        $category = \App\Models\Category::firstOrCreate(
            ['slug' => Str::slug('General')],
            ['name' => 'General']
        );

        $course = Course::firstOrCreate([
            'slug' => Str::slug('Getting Started with Laravel'),
        ], [
            'category_id' => $category->id,
            'teacher_id' => $teacher->id,
            'title' => 'Getting Started with Laravel',
            'description' => 'Introductory course to Laravel framework.',
            'is_published' => true,
        ]);

        // Enroll the demo student into the sample course (idempotent)
        $course->enrollments()->firstOrCreate([
            'student_id' => $student->id,
        ], [
            'progress_percentage' => 0,
        ]);
    }
}
