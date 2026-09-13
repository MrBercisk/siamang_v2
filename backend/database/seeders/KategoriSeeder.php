<?php

namespace Database\Seeders;

use App\Models\Bidang;
use App\Models\Kategori;
use Illuminate\Database\Seeder;

class KategoriSeeder extends Seeder
{
    public function run(): void
    {
        // Map nama bidang -> daftar kategori miliknya
        $data = [
            'Bidang Sistem Informasi dan Statistik' => [
                ['name' => 'Perencanaan dan Implementasi Sistem Informasi', 'quota' => 10, 'description' => 'Perencanaan, analisis, dan implementasi sistem informasi.'],
                ['name' => 'Pengembangan Aplikasi Web & Mobile', 'quota' => 10, 'description' => 'Pengembangan aplikasi berbasis web dan mobile.'],
            ],
            'Bidang Persandian dan Telekomunikasi' => [
                ['name' => 'Jaringan dan Keamanan Siber', 'quota' => 8, 'description' => 'Administrasi jaringan dan keamanan informasi.'],
            ],
            'Bidang Komunikasi dan Informasi Publik' => [
                ['name' => 'Desain Komunikasi Visual & Konten Digital', 'quota' => 6, 'description' => 'Desain grafis, UI/UX, dan konten digital.'],
            ],
            'Bidang Infrastructure dan SPBE' => [
                ['name' => 'Administrasi Infrastruktur & SPBE', 'quota' => 6, 'description' => 'Pengelolaan infrastruktur TI dan layanan SPBE.'],
            ],
        ];

        foreach ($data as $bidangName => $kategoris) {
            $bidang = Bidang::where('name', $bidangName)->first();
            if (!$bidang) {
                continue;
            }
            foreach ($kategoris as $kategori) {
                Kategori::updateOrCreate(
                    ['bidang_id' => $bidang->id, 'name' => $kategori['name']],
                    $kategori + ['bidang_id' => $bidang->id]
                );
            }
        }
    }
}