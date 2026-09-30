<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\N8n\N8nService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class N8nController extends Controller
{
    public function chat(Request $request, N8nService $n8nService): JsonResponse
    {
        $token = $request->bearerToken();
        abort_if(! $token, 401, 'Token tidak ditemukan.');

        return $this->sendChat($request, $n8nService, $token, 'intern');
    }

    public function publicChat(Request $request, N8nService $n8nService): JsonResponse
    {
        return $this->sendChat($request, $n8nService, null, 'public');
    }

    public function applicantChat(Request $request, N8nService $n8nService): JsonResponse
    {
        $token = $request->bearerToken();
        abort_if(! $token, 401, 'Token tidak ditemukan.');

        return $this->sendChat($request, $n8nService, $token, 'applicant');
    }

    private function sendChat(
        Request $request,
        N8nService $n8nService,
        ?string $token,
        string $audience
    ): JsonResponse {
        $validated = $request->validate([
            'message'    => ['required', 'string', 'max:2000'],
            'session_id' => ['nullable', 'string', 'max:100'],
        ]);

        $result = $n8nService->sendMessage(
            $validated['message'],
            $token,
            $validated['session_id'] ?? null,
            $audience
        );

        return response()->json($result);
    }
}