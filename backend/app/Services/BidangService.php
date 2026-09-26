<?php

namespace App\Services;

use App\Models\Bidang;
use DomainException;
use Illuminate\Database\Eloquent\Collection;

class BidangService
{
    public function getAll(bool $all): Collection
    {
        $query = Bidang::query()->withCount('kategori');

        if (! $all) {
            $query->where('status', 'Aktif');
        }

        return $query->orderBy('name')->get();
    }

    public function findWithKategori(Bidang $bidang): Bidang
    {
        return $bidang->load('kategori');
    }

    public function getTrashed(): Collection
    {
        return Bidang::onlyTrashed()
            ->withCount(['kategori' => fn ($query) => $query->withTrashed()])
            ->orderByDesc('deleted_at')
            ->get();
    }

    public function create(array $validated): Bidang
    {
        return Bidang::create($validated);
    }

    public function update(Bidang $bidang, array $validated): Bidang
    {
        $bidang->update($validated);

        return $bidang;
    }

    public function delete(Bidang $bidang): void
    {
        $bidang->delete();
    }

    public function restore(int $id): Bidang
    {
        $bidang = Bidang::onlyTrashed()->findOrFail($id);
        $bidang->restore();

        return $bidang->fresh();
    }

    /**
     * Hapus permanen. Ditolak kalau bidang masih punya kategori (termasuk
     * yang ada di Sampah), supaya tidak ada kategori tanpa bidang.
     */
    public function forceDelete(int $id): void
    {
        $bidang = Bidang::onlyTrashed()->findOrFail($id);

        if ($bidang->kategori()->withTrashed()->exists()) {
            throw new DomainException(
                'Bidang ini masih punya kategori (termasuk yang ada di Sampah). Hapus permanen kategorinya dulu.'
            );
        }

        $bidang->forceDelete();
    }
}