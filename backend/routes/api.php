<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ApplicationController;
use App\Http\Controllers\Api\BidangController;
use App\Http\Controllers\Api\KategoriController;
use App\Http\Controllers\Api\LowonganController;
use App\Http\Controllers\Api\Mentor\MentorBimbinganController;
use App\Http\Controllers\Api\Mentor\MentorDashboardController;
use App\Http\Controllers\Api\Mentor\MentorForumController;
use App\Http\Controllers\Api\Mentor\MentorPendaftarController;
use App\Http\Controllers\Api\PeriodeController;
use App\Http\Controllers\Api\Admin\ApplicationAdminController;
use App\Http\Controllers\Api\Admin\BidangAdminController;
use App\Http\Controllers\Api\Admin\BimbinganAdminController;
use App\Http\Controllers\Api\Admin\JadwalBimbinganAdminController;
use App\Http\Controllers\Api\Admin\KategoriAdminController;
use App\Http\Controllers\Api\Admin\LowonganAdminController;
use App\Http\Controllers\Api\Admin\MentorAdminController;
use App\Http\Controllers\Api\Admin\PeriodeAdminController;
use App\Http\Controllers\Api\Pendaftar\PendaftarDashboardController;
use App\Http\Controllers\Api\Pendaftar\PendaftarForumController;
use App\Http\Controllers\Api\Pendaftar\PendaftarLaporanController;
use App\Http\Controllers\Api\Pendaftar\PendaftarNilaiController;
use App\Http\Controllers\Api\Pendaftar\PendaftarProgressController;
use Illuminate\Support\Facades\Route;

Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
    Route::post('/reset-password', [AuthController::class, 'resetPassword']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/me', [AuthController::class, 'me']);
        Route::post('/change-password', [AuthController::class, 'changePassword']);
    });
});
// Publik — tracking pendaftaran tanpa login (by registration_number + email)
Route::get('/applications/track', [ApplicationController::class, 'track']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/applications', [ApplicationController::class, 'index']);
    Route::post('/applications', [ApplicationController::class, 'store']);
});

Route::get('/periodes/active', [PeriodeController::class, 'active']);

Route::apiResource('bidangs', BidangController::class)->only(['index', 'show']);
Route::apiResource('kategoris', KategoriController::class)->only(['index', 'show']);
Route::apiResource('periodes', PeriodeController::class)->only(['index', 'show']);
Route::apiResource('lowongans', LowonganController::class)->only(['index', 'show']);

Route::middleware(['auth:sanctum', 'role:admin'])->group(function () {
    Route::apiResource('bidangs', BidangAdminController::class)->only(['store', 'update', 'destroy']);

    // trashed/restore/force taruh di luar apiResource biar {bidang} di atas ga nangkep duluan
    Route::get('/bidangs-trashed', [BidangAdminController::class, 'trashed']);
    Route::patch('/bidangs/{id}/restore', [BidangAdminController::class, 'restore']);
    Route::delete('/bidangs/{id}/force', [BidangAdminController::class, 'forceDelete']);

    Route::apiResource('kategoris', KategoriAdminController::class)->only(['store', 'update', 'destroy']);

    // sama kayak bidang, trashed/restore/force di luar apiResource
    Route::get('/kategoris-trashed', [KategoriAdminController::class, 'trashed']);
    Route::patch('/kategoris/{id}/restore', [KategoriAdminController::class, 'restore']);
    Route::delete('/kategoris/{id}/force', [KategoriAdminController::class, 'forceDelete']);
    Route::apiResource('periodes', PeriodeAdminController::class)->only(['store', 'update', 'destroy']);
    Route::apiResource('lowongans', LowonganAdminController::class)->only(['store', 'update', 'destroy']);

    // Kelola mentor (User berrole 'mentor') + alokasi kategori via pivot kategori_mentor.
    Route::prefix('mentors')->group(function () {
        Route::get('/', [MentorAdminController::class, 'index']);
        Route::post('/', [MentorAdminController::class, 'store']);
        Route::get('/{mentor}', [MentorAdminController::class, 'show']);
        Route::put('/{mentor}', [MentorAdminController::class, 'update']);
        Route::delete('/{mentor}', [MentorAdminController::class, 'destroy']);
    });

    Route::prefix('admin')->group(function () {
        Route::get('/applications', [ApplicationAdminController::class, 'index']);
        Route::get('/applications/{id}', [ApplicationAdminController::class, 'show']);
        Route::get('/applications/{id}/available-mentors', [ApplicationAdminController::class, 'availableMentors']);
        Route::patch('/applications/{id}/mentor', [ApplicationAdminController::class, 'assignMentor']);
        Route::patch('/applications/{id}/status', [ApplicationAdminController::class, 'updateStatus']);

        // Monitoring bimbingan per peserta (model Bimbingan: mentor, status, progress).
        Route::get('/bimbingans', [BimbinganAdminController::class, 'index']);

        // Jadwal bimbingan (kalender admin + sinkronisasi Google Calendar).
        // /options dan /sync ditaruh sebelum route ber-{id} supaya tidak tertangkap sebagai id.
        Route::get('/jadwal-bimbingans', [JadwalBimbinganAdminController::class, 'index']);
        Route::get('/jadwal-bimbingans/options', [JadwalBimbinganAdminController::class, 'options']);
        Route::post('/jadwal-bimbingans/sync', [JadwalBimbinganAdminController::class, 'sync'])
            ->middleware('throttle:6,1');
        Route::post('/jadwal-bimbingans', [JadwalBimbinganAdminController::class, 'store']);
        Route::put('/jadwal-bimbingans/{id}', [JadwalBimbinganAdminController::class, 'update']);
        Route::delete('/jadwal-bimbingans/{id}', [JadwalBimbinganAdminController::class, 'destroy']);
    });
});

// Dashboard, bimbingan, & pendaftar mentor — data dibatasi ke mentor yang login
// (lihat MentorDashboardService, MentorBimbinganService, MentorPendaftarService).
Route::middleware(['auth:sanctum', 'role:mentor'])->prefix('mentor')->group(function () {
    Route::get('/dashboard', [MentorDashboardController::class, 'index']);

    // Halaman Bimbingan Mahasiswa: daftar, detail, setujui/tolak laporan, dan input nilai.
    Route::get('/bimbingans', [MentorBimbinganController::class, 'index']);
    Route::get('/bimbingans/{id}', [MentorBimbinganController::class, 'show']);
    Route::patch('/bimbingans/{id}/laporan/{laporanId}', [MentorBimbinganController::class, 'updateLaporan']);
    Route::post('/bimbingans/{id}/nilai', [MentorBimbinganController::class, 'storeNilai']);

    // Forum per bimbingan, dibatasi ke mahasiswa yang dibimbing mentor login.
    Route::get('/forum', [MentorForumController::class, 'index']);
    Route::post('/forum', [MentorForumController::class, 'store']);

    // Halaman Pendaftar Magang: baca saja — mentor tidak menerima/menolak,
    // itu wewenang admin (lihat ApplicationAdminController::updateStatus).
    Route::get('/pendaftars', [MentorPendaftarController::class, 'index']);
});

Route::middleware(['auth:sanctum', 'role:intern'])->prefix('intern')->group(function () {
    Route::get('/forum', [PendaftarForumController::class, 'index']);
    Route::post('/forum', [PendaftarForumController::class, 'store']);
    Route::get('/dashboard', [PendaftarDashboardController::class, 'index']);
    Route::get('/jadwal-bimbingans', [PendaftarDashboardController::class, 'jadwal']);
    Route::get('/progress', [PendaftarProgressController::class, 'index']);
    Route::post('/progress', [PendaftarProgressController::class, 'store']);
    Route::post('/progress/{id}', [PendaftarProgressController::class, 'update']);
    Route::get('/laporan', [PendaftarLaporanController::class, 'index']);
    Route::post('/laporan', [PendaftarLaporanController::class, 'store']);

    Route::get('/nilai', [PendaftarNilaiController::class, 'index']);
});