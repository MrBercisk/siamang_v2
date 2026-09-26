<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Validation\ValidationException;

class AuthService
{
    /**
     * Balikin [User $user, string $token].
     */
    public function register(array $validated, ?string $userAgent): array
    {
        $user = User::create([
            ...$validated,
            'password' => Hash::make($validated['password']),
            'role' => 'applicant',
        ]);

        $token = $user->createToken($userAgent ?: 'default')->plainTextToken;

        return [$user, $token];
    }

    /**
     * Balikin [User $user, string $token].
     */
    public function login(array $validated, ?string $userAgent): array
    {
        $user = User::where('email', $validated['email'])->first();

        if (! $user || ! Hash::check($validated['password'], $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Email atau password salah.'],
            ]);
        }

        $deviceName = $validated['device_name'] ?? null ?: ($userAgent ?: 'default');
        $token = $user->createToken($deviceName)->plainTextToken;

        $user->load('currentApplication');

        return [$user, $token];
    }

    public function logout(User $user): void
    {
        /** @var \Laravel\Sanctum\PersonalAccessToken $token */
        $token = $user->currentAccessToken();
        $token->delete();
    }

    public function getProfile(User $user): User
    {
        return $user->load('currentApplication');
    }

    public function changePassword(User $user, array $validated): void
    {
        if (! Hash::check($validated['current_password'], $user->password)) {
            throw ValidationException::withMessages([
                'current_password' => ['Password saat ini salah.'],
            ]);
        }

        $user->update([
            'password' => Hash::make($validated['new_password']),
            'must_change_password' => false,
        ]);
    }

    /**
     * True kalau frontend harus ditunjukin pesan sukses generik (baik email
     * beneran terdaftar atau tidak — sengaja disamarkan biar tidak jadi
     * celah enumeration email).
     */
    public function sendPasswordResetLink(string $email): bool
    {
        $status = Password::sendResetLink(['email' => $email]);

        return $status === Password::RESET_LINK_SENT || $status === Password::INVALID_USER;
    }

    public function resetPassword(array $validated): void
    {
        $status = Password::reset(
            $validated,
            function ($user, $password) {
                $user->forceFill([
                    'password' => Hash::make($password),
                    'must_change_password' => false,
                ])->save();
            }
        );

        if ($status !== Password::PASSWORD_RESET) {
            throw ValidationException::withMessages([
                'email' => [__($status)],
            ]);
        }
    }
}