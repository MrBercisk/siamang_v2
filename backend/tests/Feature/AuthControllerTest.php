<?php

namespace Tests\Feature;

use App\Models\Application;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class AuthControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_dapat_melakukan_registrasi(): void
    {
        $payload = [
            'name' => 'Bimo Satrio',
            'email' => 'bimo@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ];

        $response = $this->postJson('/api/auth/register', $payload);

        $response->assertCreated()
            ->assertJsonStructure([
                'message',
                'user',
                'token',
            ])
            ->assertJsonPath('message', 'Registrasi berhasil.')
            ->assertJsonPath('user.email', 'bimo@example.com')
            ->assertJsonPath('user.role', 'applicant');

        $this->assertDatabaseHas('users', [
            'name' => 'Bimo Satrio',
            'email' => 'bimo@example.com',
            'role' => 'applicant',
        ]);

        $user = User::where('email', 'bimo@example.com')->firstOrFail();

        $this->assertNotSame(
            'password123',
            $user->password
        );

        $this->assertDatabaseCount('personal_access_tokens', 1);
    }

    public function test_registrasi_gagal_jika_email_sudah_terdaftar(): void
    {
        User::factory()->create([
            'email' => 'bimo@example.com',
        ]);

        $payload = [
            'name' => 'Bimo Satrio',
            'email' => 'bimo@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ];

        $response = $this->postJson('/api/auth/register', $payload);

        $response->assertUnprocessable()
            ->assertJsonValidationErrors('email');
    }

    public function test_registrasi_gagal_jika_data_wajib_tidak_lengkap(): void
    {
        $response = $this->postJson('/api/auth/register', []);

        $response->assertUnprocessable()
            ->assertJsonValidationErrors([
                'name',
                'email',
                'password',
            ]);
    }

    public function test_user_dapat_melakukan_login(): void
    {
        $user = User::factory()->create([
            'email' => 'bimo@example.com',
            'password' => bcrypt('password123'),
            'role' => 'applicant',
        ]);

        $response = $this->postJson('/api/auth/login', [
            'email' => 'bimo@example.com',
            'password' => 'password123',
        ]);

        $response->assertOk()
            ->assertJsonStructure([
                'message',
                'user',
                'token',
            ])
            ->assertJsonPath('message', 'Login berhasil.')
            ->assertJsonPath('user.email', $user->email)
            ->assertJsonPath('user.role', 'applicant');

        $this->assertDatabaseCount('personal_access_tokens', 1);
    }

    public function test_login_gagal_jika_password_salah(): void
    {
        User::factory()->create([
            'email' => 'bimo@example.com',
            'password' => bcrypt('password123'),
        ]);

        $response = $this->postJson('/api/auth/login', [
            'email' => 'bimo@example.com',
            'password' => 'password-salah',
        ]);

        $response->assertUnprocessable()
            ->assertJsonValidationErrors('email');

        $this->assertDatabaseCount('personal_access_tokens', 0);
    }

    public function test_login_gagal_jika_email_tidak_ditemukan(): void
    {
        $response = $this->postJson('/api/auth/login', [
            'email' => 'tidakada@example.com',
            'password' => 'password123',
        ]);

        $response->assertUnprocessable()
            ->assertJsonValidationErrors('email');

        $this->assertDatabaseCount('personal_access_tokens', 0);
    }

    public function test_login_gagal_jika_data_wajib_tidak_lengkap(): void
    {
        $response = $this->postJson('/api/auth/login', []);

        $response->assertUnprocessable()
            ->assertJsonValidationErrors([
                'email',
                'password',
            ]);
    }

    public function test_user_dapat_mendapatkan_data_me(): void
    {
        $user = User::factory()->create([
            'email' => 'bimo@example.com',
            'role' => 'applicant',
        ]);

        Sanctum::actingAs($user);

        $response = $this->getJson('/api/auth/me');

        $response->assertOk()
            ->assertJsonStructure([
                'user',
            ])
            ->assertJsonPath('user.email', $user->email)
            ->assertJsonPath('user.role', 'applicant');
    }

    public function test_me_mengembalikan_current_application_user(): void
    {
        $user = User::factory()->create([
            'role' => 'applicant',
        ]);

        Application::factory()->create([
            'user_id' => $user->id,
            'status' => 'reviewing',
        ]);

        Sanctum::actingAs($user);

        $response = $this->getJson('/api/auth/me');

        $response->assertOk()
            ->assertJsonStructure([
                'user',
            ]);
        $response->assertJsonPath(
            'user.current_application.status',
            'reviewing'
        );
    }

    public function test_me_gagal_jika_user_belum_login(): void
    {
        $response = $this->getJson('/api/auth/me');

        $response->assertUnauthorized();
    }

    public function test_user_dapat_logout_dan_token_saat_ini_dicabut(): void
    {
        $user = User::factory()->create();

        $token = $user->createToken('test-device');

        $this->withToken($token->plainTextToken)
            ->postJson('/api/auth/logout')
            ->assertOk()
            ->assertJson([
                'message' => 'Logout berhasil.',
            ]);

        $this->assertDatabaseCount('personal_access_tokens', 0);
    }

    public function test_logout_hanya_mencabut_token_yang_sedang_digunakan(): void
    {
        $user = User::factory()->create();

        $token1 = $user->createToken('device-1');
        $token2 = $user->createToken('device-2');

        $this->withToken($token1->plainTextToken)
            ->postJson('/api/auth/logout')
            ->assertOk();

        $this->assertDatabaseHas('personal_access_tokens', [
            'id' => $token2->accessToken->id,
            'tokenable_id' => $user->id,
            'name' => 'device-2',
        ]);

        $this->assertDatabaseMissing('personal_access_tokens', [
            'id' => $token1->accessToken->id,
        ]);
    }

    public function test_user_tidak_bisa_logout_jika_belum_login(): void
    {
        $response = $this->postJson('/api/auth/logout');

        $response->assertUnauthorized();
    }
}
