<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;

class PublicInfoController extends Controller
{
    public function requirements(): JsonResponse
    {
        return response()->json([
            'data' => [
                'documents' => [
                    [
                        'name' => 'Pas Foto 3 x 4',
                        'description' => 'Pas foto terbaru dengan latar belakang bebas.',
                        'required' => true,
                        'format' => ['JPG', 'PNG'],
                        'maxSize' => '200 KB',
                    ],
                    [
                        'name' => 'Berkas Persyaratan Pendaftaran',
                        'description' => 'Gabungkan semua berkas persyaratan dalam 1 file PDF.',
                        'required' => true,
                        'format' => ['PDF'],
                        'maxSize' => '2 MB',
                    ],
                    [
                        'name' => 'Surat NDA Perjanjian Magang Mahasiswa',
                        'description' => 'Surat NDA yang sudah ditandatangani peserta.',
                        'required' => true,
                        'format' => ['PDF'],
                        'maxSize' => '1 MB',
                    ],
                    [
                        'name' => 'Surat Permohonan',
                        'description' => 'Surat permohonan magang dari kampus/institusi.',
                        'required' => true,
                        'format' => ['PDF'],
                        'maxSize' => '1 MB',
                    ],
                    [
                        'name' => 'Video Perkenalan',
                        'description' => 'Video perkenalan diri, maksimal 2 menit.',
                        'required' => false,
                        'format' => ['MP4'],
                        'maxSize' => '20 MB',
                    ],
                ],
                'steps' => [
                    'Isi biodata',
                    'Pilih tipe pendaftaran individu atau kelompok',
                    'Pilih bidang, kategori, dan lowongan',
                    'Unggah berkas persyaratan',
                    'Periksa data dan kirim pendaftaran',
                ],
            ],
        ]);
    }

    public function contact(): JsonResponse
    {
        return response()->json([
            'data' => [
                'officePhone' => '(0274) 515865',
                'email' => 'kominfosandi@jogjakota.go.id',
                'address' => 'Jl. Kenari, Muja Muju, Kec. Umbulharjo, Kota Yogyakarta, DIY 55165',
                'serviceHours' => 'Senin-Jumat, 08.00-16.00 WIB',
            ],
        ]);
    }
}