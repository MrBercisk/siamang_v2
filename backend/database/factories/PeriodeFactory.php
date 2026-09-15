<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class PeriodeFactory extends Factory
{
    public function definition(): array
    {
        return [
            'name' => 'Periode ' . $this->faker->unique()->numerify('#') . ' - ' . now()->year,
            'start_date' => now()->subMonth(),
            'end_date' => now()->addWeeks(2),
            'announcement_date' => now()->addWeeks(3),
            'internship_start' => now()->addMonth(),
            'internship_end' => now()->addMonths(5),
            'duration_info' => '4 - 6 Bulan',
            'system_type' => 'Hybrid',
            'is_active' => true,
            'application_sequence' => 0,
        ];
    }
}