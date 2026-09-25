<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class MentorController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = User::mentors()
            ->with('kategoriDiampu.bidang')
            ->withCount('bimbinganSebagaiMentor');

        if ($request->filled('kategori_id')) {
            $kategoriId = $request->integer('kategori_id');
            $query->whereHas('kategoriDiampu', fn ($q) => $q->where('kategori.id', $kategoriId));
        }

        return response()->json([
            'data' => $query->orderBy('name')->get(),
        ]);
    }

    public function show(User $mentor): JsonResponse
    {
        $this->ensureIsMentor($mentor);

        return response()->json([
            'data' => $mentor->load('kategoriDiampu.bidang')->loadCount('bimbinganSebagaiMentor'),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $this->validatePayload($request);
        $temporaryPassword = $this->generateTemporaryPassword();

        $mentor = User::create([
            'name' => $validated['name'],
            'nip' => $validated['nip'] ?? null,
            'email' => $validated['email'],
            'phone' => $validated['phone'] ?? null,
            'position' => $validated['position'] ?? null,
            'status' => $validated['status'] ?? 'Aktif',
            'role' => 'mentor',
            'password' => Hash::make($temporaryPassword),
            'must_change_password' => true,
        ]);

        $mentor->kategoriDiampu()->sync($validated['kategori_ids']);

        return response()->json([
            'message' => 'Mentor berhasil ditambahkan.',
            'data' => $mentor->load('kategoriDiampu.bidang'),
            'temporary_password' => $temporaryPassword,
        ], 201);
    }
    private function generateTemporaryPassword(): string
    {
        // 10 karakter, campuran huruf besar/kecil/angka 
        return Str::password(10, symbols: false);
    }

    public function update(Request $request, User $mentor): JsonResponse
    {
        $this->ensureIsMentor($mentor);

        $validated = $this->validatePayload($request, $mentor->id, partial: true);

        $mentor->update(collect($validated)->except('kategori_ids')->toArray());

        if (array_key_exists('kategori_ids', $validated)) {
            $mentor->kategoriDiampu()->sync($validated['kategori_ids']);
        }

        return response()->json([
            'message' => 'Mentor berhasil diperbarui.',
            'data' => $mentor->fresh()->load('kategoriDiampu.bidang'),
        ]);
    }

    public function destroy(User $mentor): JsonResponse
    {
        $this->ensureIsMentor($mentor);

        if ($mentor->bimbinganSebagaiMentor()->exists()) {
            return response()->json([
                'message' => 'Mentor ini masih membimbing mahasiswa. Alokasikan ulang mahasiswa bimbingannya ke mentor lain dulu sebelum menghapus.',
            ], 422);
        }

        $mentor->kategoriDiampu()->detach();
        $mentor->delete();

        return response()->json([
            'message' => 'Mentor berhasil dihapus.',
        ]);
    }

    private function validatePayload(Request $request, ?int $ignoreUserId = null, bool $partial = false): array
    {
        $rule = fn (string $required) => $partial ? 'sometimes' : $required;

        return $request->validate([
            'name' => [$rule('required'), 'string', 'max:255'],
            'nip' => ['sometimes', 'nullable', 'string', 'max:50'],
            'email' => [
                $rule('required'),
                'email',
                'max:255',
                Rule::unique('users', 'email')->ignore($ignoreUserId),
            ],
            'phone' => ['sometimes', 'nullable', 'string', 'max:30'],
            'position' => ['sometimes', 'nullable', 'string', 'max:255'],
            'status' => ['sometimes', Rule::in(['Aktif', 'Nonaktif'])],
            'kategori_ids' => [$rule('required'), 'array', 'min:1'],
            'kategori_ids.*' => ['exists:kategori,id'],
        ]);
    }

    private function ensureIsMentor(User $mentor): void
    {
        if ($mentor->role !== 'mentor') {
            throw ValidationException::withMessages([
                'mentor' => ['User yang dipilih bukan mentor.'],
            ]);
        }
    }
}