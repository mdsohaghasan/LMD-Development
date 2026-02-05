<?php

namespace Database\Factories;

use App\Models\Lesson;
use Illuminate\Database\Eloquent\Factories\Factory;

class LessonFactory extends Factory
{
    protected $model = Lesson::class;

    public function definition()
    {
        return [
            'title' => $this->faker->sentence(6),
            'content' => $this->faker->paragraph(),
            'type' => 'text',
            'order' => 0,
        ];
    }
}
