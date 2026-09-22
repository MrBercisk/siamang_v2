<?php

namespace App\Http\Controllers\Api\Mentor;

use App\Http\Controllers\Controller;
use App\Http\Resources\Mentor\MentorForumMessageResource;
use App\Models\Bimbingan;
use App\Models\ForumMessage;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MentorForumController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = ForumMessage::with('sender:id,name')
            ->whereHas('bimbingan', fn ($bimbingan) =>
                $bimbingan->where('mentor_id', $request->user()->id)
            );

        if ($request->filled('bimbingan_id')) {
            $bimbinganId = $request->integer('bimbingan_id');
            $this->findMentorBimbingan($request, $bimbinganId);
            $query->where('bimbingan_id', $bimbinganId);
        }

        return ApiResponse::data(
            MentorForumMessageResource::collection(
                $query->orderBy('created_at')->orderBy('id')->get()
            )
        );
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'bimbingan_id' => ['required', 'integer'],
            'message' => ['required', 'string', 'max:5000'],
        ]);

        $bimbingan = $this->findMentorBimbingan($request, $validated['bimbingan_id']);
        $message = $bimbingan->forumMessages()->create([
            'sender_id' => $request->user()->id,
            'message' => trim($validated['message']),
            'is_mentor' => true,
        ]);

        return response()->json([
            'data' => new MentorForumMessageResource($message->load('sender:id,name')),
        ], 201);
    }

    private function findMentorBimbingan(Request $request, int $id): Bimbingan
    {
        return Bimbingan::where('mentor_id', $request->user()->id)->findOrFail($id);
    }
}