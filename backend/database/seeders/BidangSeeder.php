<?php

namespace Database\Seeders;

use App\Models\Bidang;
use Illuminate\Database\Seeder;

class BidangSeeder extends Seeder
{
    public function run(): void
    {
        $bidangs = [
            ['name' => 'Bidang Sistem Informasi dan Statistik', 'status' => 'aktif'],
            ['name' => 'Bidang Persandian dan Telekomunikasi', 'status' => 'aktif'],
            ['name' => 'Bidang Komunikasi dan Informasi Publik', 'status' => 'aktif'],
            ['name' => 'Bidang Infrastructure dan SPBE', 'status' => 'aktif'],
        ];

        foreach ($bidangs as $bidang) {
            Bidang::updateOrCreate(['name' => $bidang['name']], $bidang);
        }
    }
}