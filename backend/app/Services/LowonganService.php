<?php

namespace App\Services;

use App\Models\Lowongan;
use DomainException;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\Request;

class LowonganService
{
    public function getAll(Request $request): Collection
    {
        $query = Lowongan::query()->with(['periode', 'kategori.bidang']);

        if ($request->filled('periode_id')) {
            $query->where('periode_id', $request->integer('periode_id'));
        }

        if ($request->filled('kategori_id')) {
            $query->where('kategori_id', $request->integer('kategori_id'));
        }

        if ($request->filled('bidang_id')) {
            $query->whereHas('kategori', fn ($q) => $q->where('bidang_id', $request->integer('bidang_id')));
        }

        if (! $request->boolean('all')) {
            $query->where('is_active', true)->whereColumn('filled', '<', 'kuota');
        }

        return $query->orderByDesc('created_at')->get();
    }

    public function findWithRelations(Lowongan $lowongan): Lowongan
    {
        return $lowongan->load(['periode', 'kategori.bidang']);
    }

    public function create(array $validated): Lowongan
    {
        // 'filled' selalu mulai dari 0 — tidak boleh di-set manual lewat
        // request, karena nilainya bergantung jumlah application yang diterima
        $lowongan = Lowongan::create([...$validated, 'filled' => 0]);

        return $lowongan->load(['periode', 'kategori.bidang']);
    }

    public function update(Lowongan $lowongan, array $validated): Lowongan
    {
        $lowongan->update($validated);

        return $lowongan->fresh(['periode', 'kategori.bidang']);
    }

    public function delete(Lowongan $lowongan): void
    {
        if ($lowongan->applications()->exists()) {
            throw new DomainException(
                'Lowongan ini sudah punya pendaftar, tidak bisa dihapus. Nonaktifkan saja.'
            );
        }

        $lowongan->delete();
    }
}