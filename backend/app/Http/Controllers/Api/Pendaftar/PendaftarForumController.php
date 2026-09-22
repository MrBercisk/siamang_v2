<?php

namespace App\Http\Controllers\Api\Pendaftar;

use App\Http\Controllers\Controller;
use App\Http\Resources\Pendaftar\PendaftarForumMessageResource;
use App\Models\Bimbingan;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PendaftarForumController extends Controller
{
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

        return response()->json([
            'data' => new PendaftarForumMessageResource($message->load('sender:id,name')),
        ], 201);
    }

    /**
     * Pendaftar hanya punya satu bimbingan aktif, jadi tidak perlu id dari
     * request. Sesuaikan kolom `pendaftar_id` kalau relasi Bimbingan ->
     * User sebenarnya lewat nama kolom lain (mis. `user_id`) atau harus
     * ditelusuri lewat relasi ke model Application.
     */
    private function findOwnBimbingan(Request $request): Bimbingan
    {
       return Bimbingan::whereHas('application', fn ($application) =>
            $application->where('user_id', $request->user()->id)
        )
            ->latest()
            ->firstOrFail();
    }
}