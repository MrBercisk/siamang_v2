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
        $request->validate([
            'message'    => ['required', 'string', 'max:2000'],
            'session_id' => ['nullable', 'string', 'max:100'],
        ]);

        $token = $request->bearerToken();
        abort_if(! $token, 401, 'Token tidak ditemukan.');

        $result = $n8nService->sendMessage(
            $request->string('message')->toString(),
            $token,
            $request->string('session_id')->toString() ?: null
        );

        return response()->json($result);
    }
}