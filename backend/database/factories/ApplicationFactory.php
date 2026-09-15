<?php

namespace Database\Factories;

use App\Models\Bidang;
use App\Models\Kategori;
use App\Models\Lowongan;
use App\Models\Periode;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class ApplicationFactory extends Factory
{
    public function definition(): array
    {
        return [
            'registration_number' => 'MAG-' . now()->year . '-' . $this->faker->unique()->numerify('######'),
            'user_id' => User::factory(),
            'periode_id' => Periode::factory(),
            'lowongan_id' => Lowongan::factory(),
            'bidang_id' => Bidang::factory(),
            'kategori_id' => Kategori::factory(),
            'full_name' => $this->faker->name(),
            'email' => $this->faker->unique()->safeEmail(),
            'phone' => $this->faker->phoneNumber(),
            'university' => $this->faker->company() . ' University',
            'major' => 'Teknik Informatika',
            'semester' => '6',
            'nim' => $this->faker->numerify('##########'),
            'skills' => 'PHP, Laravel',
            'tools' => 'VSCode, Git',
            'project_title' => $this->faker->sentence(),
            'registration_type' => 'Individu',
            'internship_start' => now(),
            'internship_end' => now()->addMonths(4),
            'status' => 'reviewing',
            'submitted_at' => now(),
            'declared_at' => now(),
        ];
    }
}