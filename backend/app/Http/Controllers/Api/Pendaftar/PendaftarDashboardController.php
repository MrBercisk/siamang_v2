<?php

namespace App\Http\Controllers\Api\Pendaftar;

use App\Http\Controllers\Api\Pendaftar\Concerns\ResolvesOwnBimbingan;
use App\Http\Controllers\Controller;
use App\Http\Resources\Pendaftar\PendaftarDashboardSummaryResource;
use App\Http\Resources\Pendaftar\PendaftarJadwalBimbinganResource;
use App\Models\JadwalBimbingan;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

class PendaftarDashboardController extends Controller
{
    use ResolvesOwnBimbingan;

    // GET /intern/dashboard — ringkasan 3 card atas
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        $bimbingan = $this->findOwnBimbingan($request);

        $nextJadwal = JadwalBimbingan::where('student_user_id', $user->id)
            ->where('event_date', '>=', now()->toDateString())
            ->orderBy('event_date')
            ->orderBy('event_time')
            ->first();

        $totalBimbingan = JadwalBimbingan::where('student_user_id', $user->id)
            ->where('event_date', '<=', now()->toDateString())
            ->count();

        $endDate = $bimbingan->application?->end_date;
        $remainingDays = $endDate
            ? max(0, (int) now()->startOfDay()->diffInDays(Carbon::parse($endDate), false))
            : null;

        return ApiResponse::data(new PendaftarDashboardSummaryResource([
            'progressPercent' => $bimbingan->progress_percent ?? 0,
            'judulProject' => $bimbingan->judul_project,
            'internshipEndDate' => $endDate,
            'remainingDays' => $remainingDays,
            'totalBimbingan' => $totalBimbingan,
            'nextBimbinganDate' => $nextJadwal?->event_date?->toDateString(),
            'nextBimbinganTime' => $nextJadwal?->event_time,
        ]));
    }

    // GET /intern/jadwal-bimbingans?month=6&year=2026 — kalender & agenda
    public function jadwal(Request $request): JsonResponse
    {
        $user = $request->user();
        $month = (int) $request->query('month', now()->month);
        $year = (int) $request->query('year', now()->year);

        $items = JadwalBimbingan::where('student_user_id', $user->id)
            ->whereYear('event_date', $year)
            ->whereMonth('event_date', $month)
            ->orderBy('event_date')
            ->orderBy('event_time')
            ->get();

        return ApiResponse::data(
            PendaftarJadwalBimbinganResource::collection($items)
        );
    }
}