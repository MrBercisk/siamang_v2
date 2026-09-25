<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\AssignMentorRequest;
use App\Http\Requests\Admin\UpdateApplicationStatusRequest;
use App\Http\Resources\Admin\AdminApplicationResource;
use App\Http\Resources\Admin\MentorOptionResource;
use App\Models\Application;
use App\Services\ApplicationService;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class ApplicationAdminController extends Controller
{
    public function __construct(
        private ApplicationService $applicationService
    ) {}

    public function index(Request $request): JsonResponse
    {
        $applications = $this->applicationService->getAllApplications(
            $request->only(['status', 'periode_id', 'kategori_id', 'per_page'])
        );

        return ApiResponse::data(
            AdminApplicationResource::collection($applications)
        );
    }

    public function show(int $id): JsonResponse
    {
        $application = $this->applicationService->findByIdForAdmin($id);

        return ApiResponse::data(new AdminApplicationResource($application));
    }

    public function availableMentors(int $id): JsonResponse
    {
        $application = $this->applicationService->findByIdForAdmin($id);

        $mentors = $this->applicationService->getAvailableMentors($application);

        return ApiResponse::data(MentorOptionResource::collection($mentors));
    }

    public function assignMentor(AssignMentorRequest $request, int $id): JsonResponse
    {
        $application = Application::findOrFail($id);

        $application = $this->applicationService->assignMentor(
            $application,
            $request->validated('mentor_id')
        );

        return ApiResponse::success(
            new AdminApplicationResource($application->load(['bimbingan.mentor', 'user'])),
            'Mentor berhasil ditugaskan.'
        );
    }

    public function updateStatus(UpdateApplicationStatusRequest $request, int $id): JsonResponse
    {
        $application = Application::findOrFail($id);

        try {
            $application = $this->applicationService->updateStatus(
                $application,
                $request->validated()
            );
        } catch (\InvalidArgumentException $e) {
            throw ValidationException::withMessages([
                'mentor_id' => [$e->getMessage()],
            ]);
        }

        return ApiResponse::success(
            new AdminApplicationResource($application),
            'Status pendaftaran berhasil diperbarui.'
        );
    }
}