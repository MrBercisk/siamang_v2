<?php

namespace Database\Factories;

use App\Models\Bidang;
use Illuminate\Database\Eloquent\Factories\Factory;

class KategoriFactory extends Factory
{
    public function definition(): array
    {
        return [
            'bidang_id' => Bidang::factory(),
            'name' => $this->faker->unique()->randomElement([
                'Backend Developer', 'Frontend Developer', 'Data Analyst', 'UI/UX Designer',
            ]),
            'quota' => 5,
            'description' => $this->faker->sentence(),
        ];
    }
}