<?php

namespace App\Services;

use App\Models\Kategori;
use DomainException;
use Illuminate\Database\Eloquent\Collection;

class KategoriService
{
    public function getAll(?int $bidangId, bool $all): Collection
    {
        $query = Kategori::query()->with('bidang')->withCount('applications');

        if ($bidangId) {
            $query->where('bidang_id', $bidangId);
        }

        if (! $all) {
            $query->whereHas('bidang', fn ($q) => $q->where('status', 'Aktif'));
        }

        return $query->orderBy('name')->get();
    }

    public function findWithBidang(Kategori $kategori): Kategori
    {
        return $kategori->load('bidang')->loadCount('applications');
    }

    public function getTrashed(?int $bidangId): Collection
    {
        $query = Kategori::onlyTrashed()->with('bidang')->withCount('applications');

        if ($bidangId) {
            $query->where('bidang_id', $bidangId);
        }

        return $query->orderByDesc('deleted_at')->get();
    }

    public function create(array $validated): Kategori
    {
        return Kategori::create($validated)->load('bidang');
    }

    public function update(Kategori $kategori, array $validated): Kategori
    {
        $kategori->update($validated);

        return $kategori->load('bidang');
    }

    public function delete(Kategori $kategori): void
    {
        if ($kategori->lowongans()->exists() || $kategori->applications()->exists()) {
            throw new DomainException(
                'Kategori ini masih dipakai lowongan/pendaftaran, tidak bisa dihapus.'
            );
        }

        $kategori->delete();
    }

    public function restore(int $id): Kategori
    {
        $kategori = Kategori::onlyTrashed()->findOrFail($id);
        $kategori->restore();

        return $kategori->fresh()->load('bidang');
    }

    public function forceDelete(int $id): void
    {
        $kategori = Kategori::onlyTrashed()->findOrFail($id);

        if ($kategori->lowongans()->exists() || $kategori->applications()->exists()) {
            throw new DomainException(
                'Kategori ini masih terkait lowongan/pendaftaran, tidak bisa dihapus permanen.'
            );
        }

        $kategori->forceDelete();
    }
}