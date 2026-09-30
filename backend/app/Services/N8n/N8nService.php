<?php

namespace App\Services\N8n;

use Illuminate\Support\Facades\Http;

class N8nService
{
    public function sendMessage(
        string $message,
        ?string $token,
        ?string $sessionId = null,
        string $audience = 'intern'
    ): array
    {
        $response = Http::timeout(90)->post(
            config('services.n8n.webhook_url'),
            [
                'message'    => $message,
                'token'      => $token,
                'session_id' => $sessionId,
                'audience'   => $audience,
            ]
        );

        $response->throw();

        return $response->json() ?? [];
    }
}