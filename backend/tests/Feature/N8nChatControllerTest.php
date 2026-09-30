<?php

namespace Tests\Feature;

use Illuminate\Http\Client\Request as ClientRequest;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class N8nChatControllerTest extends TestCase
{
    public function test_guest_chat_forwards_public_scope_without_a_token(): void
    {
        config(['services.n8n.webhook_url' => 'https://n8n.example.test/webhook/chat']);
        Http::fake([
            'https://n8n.example.test/webhook/chat' => Http::response([
                'success' => true,
                'message' => 'Periode aktif dan lowongan tersedia.',
            ]),
        ]);

        $response = $this->postJson('/api/public/chat', [
            'message' => 'Apa lowongan yang tersedia?',
            'session_id' => 'guest-session-1',
        ]);

        $response->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonPath('message', 'Periode aktif dan lowongan tersedia.');

        Http::assertSent(fn (ClientRequest $request) =>
            $request->url() === 'https://n8n.example.test/webhook/chat'
            && $request['message'] === 'Apa lowongan yang tersedia?'
            && $request['token'] === null
            && $request['session_id'] === 'guest-session-1'
            && $request['audience'] === 'public'
        );
    }

    public function test_guest_cannot_use_intern_chat_endpoint(): void
    {
        $this->postJson('/api/intern/chat', ['message' => 'Berapa nilai saya?'])
            ->assertUnauthorized();
    }
}