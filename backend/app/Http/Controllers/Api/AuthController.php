<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function register(RegisterRequest $request): JsonResponse
    {
        $user = User::create([
            ...$request->validated(),
            'password' => Hash::make($request->validated('password')),
            'role' => 'applicant',
        ]);

        $token = $user->createToken($request->userAgent() ?: 'default')->plainTextToken;

        return response()->json([
            'message' => 'Registrasi berhasil.',
            'user' => new UserResource($user),
            'token' => $token,
        ], 201);
    }

    public function login(LoginRequest $request): JsonResponse
    {
        $user = User::where('email', $request->validated('email'))->first();

        if (! $user || ! Hash::check($request->validated('password'), $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Email atau password salah.'],
            ]);
        }

        $deviceName = $request->validated('device_name') ?: ($request->userAgent() ?: 'default');
        $token = $user->createToken($deviceName)->plainTextToken;

        $user->load('currentApplication');

        return response()->json([
            'message' => 'Login berhasil.',
            'user' => new UserResource($user),
            'token' => $token,
        ]);
    }

    public function logout(Request $request): JsonResponse
    {
        // Hanya cabut token yang sedang dipakai request ini
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logout berhasil.',
        ]);
    }

    public function me(Request $request): JsonResponse
    {
        $user = $request->user()->load('currentApplication');

        return response()->json([
            'user' => new UserResource($user),
        ]);
    }
    public function changePassword(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'current_password' => ['required', 'string'],
            'new_password' => ['required', 'string', 'min:8', 'confirmed'],
        ]);

        $user = $request->user();

        if (! Hash::check($validated['current_password'], $user->password)) {
            throw ValidationException::withMessages([
                'current_password' => ['Password saat ini salah.'],
            ]);
        }

        $user->update([
            'password' => Hash::make($validated['new_password']),
            'must_change_password' => false,
        ]);

        return response()->json([
            'message' => 'Password berhasil diperbarui.',
        ]);
    }

    public function forgotPassword(Request $request): JsonResponse
    {
        $request->validate(['email' => ['required', 'email']]);

        $status = Password::sendResetLink($request->only('email'));

        // Selalu balas sukses meski email tidak terdaftar, supaya tidak
        // membocorkan apakah suatu email terdaftar di sistem (enumeration).
        if ($status === Password::RESET_LINK_SENT || $status === Password::INVALID_USER) {
            return response()->json([
                'message' => 'Jika email terdaftar, instruksi reset password telah dikirim.',
            ]);
        }

        return response()->json([
            'message' => 'Gagal mengirim link reset password. Coba lagi nanti.',
        ], 422);
    }

    public function resetPassword(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'token' => ['required', 'string'],
            'email' => ['required', 'email'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ]);

        $status = Password::reset(
            $validated,
            function ($user, $password) {
                $user->forceFill([
                    'password' => Hash::make($password),
                    'must_change_password' => false,
                ])->save();
            }
        );

        if ($status === Password::PASSWORD_RESET) {
            return response()->json(['message' => 'Password berhasil direset. Silakan masuk kembali.']);
        }

        throw ValidationException::withMessages([
            'email' => [__($status)],
        ]);
    }
}