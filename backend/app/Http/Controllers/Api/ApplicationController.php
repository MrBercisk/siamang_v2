<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ApplicationRequest;
use App\Http\Requests\TrackApplicationRequest;
use App\Http\Resources\ApplicationResource;
use App\Http\Resources\ApplicationTrackResource;
use App\Models\Application;
use App\Services\ApplicationService;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ApplicationController extends Controller
{
    public function __construct(
        private ApplicationService $applicationService
    ) {}

    public function index(Request $request): JsonResponse
    {
        $applications = $this->applicationService
            ->getUserApplications($request->user());

        return ApiResponse::data(
            ApplicationResource::collection($applications)
        );
    }

    public function myStatus(Request $request): JsonResponse
    {
        $application = $request->user()->applications()
            ->with(['periode', 'bidang', 'lowongan'])
            ->latest('submitted_at')
            ->first();

        return response()->json([
            'data' => $application ? [
                'registrationNumber' => $application->registration_number,
                'status' => $application->status,
                'notes' => $application->admin_notes,
                'submittedAt' => $application->submitted_at?->toIso8601String(),
                'periode' => $application->periode?->name,
            ] : null,
        ]);
    }

    public function myHistory(Request $request): JsonResponse
    {
        $applications = $request->user()->applications()
            ->with(['periode', 'bidang', 'lowongan'])
            ->latest('submitted_at')
            ->get();

        return response()->json([
            'data' => $applications->map(fn (Application $application) => [
                'registrationNumber' => $application->registration_number,
                'periode' => $application->periode?->name,
                'periodeStart' => $application->periode?->start_date?->toDateString(),
                'periodeEnd' => $application->periode?->end_date?->toDateString(),
                'bidang' => $application->bidang?->name,
                'lowongan' => $application->lowongan?->project,
                'status' => $application->status,
                'submittedAt' => $application->submitted_at?->toIso8601String(),
            ]),
        ]);
    }

    public function store(ApplicationRequest $request): JsonResponse
    {
        $application = $this->applicationService->create(
            $request->user(),
            $request->validated(),
            $request
        );

        return ApiResponse::success(
            new ApplicationResource($application),
            'Pendaftaran berhasil dikirim.',
            201
        );
    }

    public function track(TrackApplicationRequest $request): JsonResponse
    {
        $application = $this->applicationService->findForTracking(
            $request->validated('registration_number'),
            $request->validated('email')
        );

        if (! $application) {
            return response()->json([
                'message' => 'Data pendaftaran tidak ditemukan. Periksa kembali nomor pendaftaran dan email Anda.',
            ], 404);
        }

        return ApiResponse::data(new ApplicationTrackResource($application));
    }
}