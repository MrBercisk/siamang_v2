<?php

namespace Database\Factories;

use App\Models\Kategori;
use App\Models\Periode;
use Illuminate\Database\Eloquent\Factories\Factory;

class LowonganFactory extends Factory
{
    public function definition(): array
    {
        return [
            'periode_id' => Periode::factory(),
            'kategori_id' => Kategori::factory(),
            'project' => $this->faker->bs(),
            'definisi' => $this->faker->paragraph(),
            'detail_kebutuhan' => $this->faker->paragraph(),
            'kuota' => 3,
            'filled' => 0,
            'is_active' => true,
        ];
    }
}