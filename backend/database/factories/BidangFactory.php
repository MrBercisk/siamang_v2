<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class BidangFactory extends Factory
{
    public function definition(): array
    {
        return [
            'name' => $this->faker->unique()->randomElement([
                'Teknologi Informasi', 'Marketing', 'Keuangan', 'Administrasi',
            ]),
            'status' => 'Aktif',
        ];
    }
}