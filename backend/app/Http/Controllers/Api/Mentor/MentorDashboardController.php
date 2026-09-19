<?php

namespace App\Http\Controllers\Api\Mentor;

use App\Http\Controllers\Controller;
use App\Http\Resources\Admin\JadwalBimbinganResource;
use App\Services\MentorDashboardService;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MentorDashboardController extends Controller
{
    public function __construct(
        private MentorDashboardService $dashboardService
    ) {}

    public function index(Request $request): JsonResponse
    {
        $dashboard = $this->dashboardService->getDashboard($request->user());

        return ApiResponse::data([
            'stats' => $dashboard['stats'],
            // Resource yang sama dengan admin, supaya bentuk jadwal konsisten.
            'schedules' => JadwalBimbinganResource::collection($dashboard['schedules'])->resolve($request),
            'students' => $dashboard['students']->values(),
        ]);
    }
}