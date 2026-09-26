<?php

namespace App\Services;

use App\Models\User;
use DomainException;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class MentorService
{
    public function getAll(Request $request): Collection
    {
        $query = User::mentors()
            ->with('kategoriDiampu.bidang')
            ->withCount('bimbinganSebagaiMentor');

        if ($request->filled('kategori_id')) {
            $kategoriId = $request->integer('kategori_id');
            $query->whereHas('kategoriDiampu', fn ($q) => $q->where('kategori.id', $kategoriId));
        }

        return $query->orderBy('name')->get();
    }

    public function findWithRelations(User $mentor): User
    {
        $this->ensureIsMentor($mentor);

        return $mentor->load('kategoriDiampu.bidang')->loadCount('bimbinganSebagaiMentor');
    }

    /**
     * Balikin [User $mentor, string $temporaryPassword] — password sementara
     * cuma ada di response create, tidak pernah disimpan plain di mana pun.
     */
    public function create(array $validated): array
    {
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

        return [$mentor->load('kategoriDiampu.bidang'), $temporaryPassword];
    }

    public function update(User $mentor, array $validated): User
    {
        $this->ensureIsMentor($mentor);

        $mentor->update(collect($validated)->except('kategori_ids')->toArray());

        if (array_key_exists('kategori_ids', $validated)) {
            $mentor->kategoriDiampu()->sync($validated['kategori_ids']);
        }

        return $mentor->fresh()->load('kategoriDiampu.bidang');
    }

    public function delete(User $mentor): void
    {
        $this->ensureIsMentor($mentor);

        if ($mentor->bimbinganSebagaiMentor()->exists()) {
            throw new DomainException(
                'Mentor ini masih membimbing mahasiswa. Alokasikan ulang mahasiswa bimbingannya ke mentor lain dulu sebelum menghapus.'
            );
        }

        $mentor->kategoriDiampu()->detach();
        $mentor->delete();
    }

    private function generateTemporaryPassword(): string
    {
        // 10 karakter, campuran huruf besar/kecil/angka
        return Str::password(10, symbols: false);
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