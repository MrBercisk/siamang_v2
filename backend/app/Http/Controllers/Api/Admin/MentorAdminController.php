<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreMentorRequest;
use App\Http\Requests\Admin\UpdateMentorRequest;
use App\Http\Resources\Admin\MentorResource;
use App\Models\User;
use App\Services\MentorService;
use DomainException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MentorAdminController extends Controller
{
    public function __construct(
        private MentorService $mentorService
    ) {}

    public function index(Request $request): JsonResponse
    {
        $mentors = $this->mentorService->getAll($request);

        return response()->json([
            'data' => MentorResource::collection($mentors),
        ]);
    }

    public function show(User $mentor): JsonResponse
    {
        $mentor = $this->mentorService->findWithRelations($mentor);

        return response()->json([
            'data' => new MentorResource($mentor),
        ]);
    }

    public function store(StoreMentorRequest $request): JsonResponse
    {
        [$mentor, $temporaryPassword] = $this->mentorService->create($request->validated());

        return response()->json([
            'message' => 'Mentor berhasil ditambahkan.',
            'data' => new MentorResource($mentor),
            'temporary_password' => $temporaryPassword,
        ], 201);
    }

    public function update(UpdateMentorRequest $request, User $mentor): JsonResponse
    {
        $mentor = $this->mentorService->update($mentor, $request->validated());

        return response()->json([
            'message' => 'Mentor berhasil diperbarui.',
            'data' => new MentorResource($mentor),
        ]);
    }

    public function destroy(User $mentor): JsonResponse
    {
        try {
            $this->mentorService->delete($mentor);
        } catch (DomainException $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }

        return response()->json([
            'message' => 'Mentor berhasil dihapus.',
        ]);
    }
}