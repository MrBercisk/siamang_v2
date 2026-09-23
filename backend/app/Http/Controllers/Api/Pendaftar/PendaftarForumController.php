<?php

namespace App\Http\Controllers\Api\Pendaftar;

use App\Http\Controllers\Api\Pendaftar\Concerns\ResolvesOwnBimbingan;
use App\Http\Controllers\Controller;
use App\Http\Resources\Pendaftar\PendaftarForumMessageResource;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PendaftarForumController extends Controller
{
    use ResolvesOwnBimbingan;

    public function index(Request $request): JsonResponse
    {
        $bimbingan = $this->findOwnBimbingan($request);

        $messages = $bimbingan->forumMessages()
            ->with('sender:id,name')
            ->orderBy('created_at')
            ->orderBy('id')
            ->get();

        return ApiResponse::data(
            PendaftarForumMessageResource::collection($messages)
        );
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'message' => ['required', 'string', 'max:5000'],
        ]);

        $bimbingan = $this->findOwnBimbingan($request);

        $message = $bimbingan->forumMessages()->create([
            'sender_id' => $request->user()->id,
            'message' => trim($validated['message']),
            'is_mentor' => false,
        ]);

        return ApiResponse::data(
            new PendaftarForumMessageResource($message->load('sender:id,name')),
            201
        );
    }
}