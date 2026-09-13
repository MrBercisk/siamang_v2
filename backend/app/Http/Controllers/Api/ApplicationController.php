<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ApplicationRequest;
use App\Http\Resources\ApplicationResource;
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
}