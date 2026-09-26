<?php

namespace App\Services;

use App\Models\Periode;
use DomainException;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;

class PeriodeService
{
    public function getAll(): Collection
    {
        return Periode::orderByDesc('start_date')->get();
    }

    public function getActive(): ?Periode
    {
        return Periode::where('is_active', true)->first();
    }

    public function create(array $validated): Periode
    {
        return DB::transaction(function () use ($validated) {
            $this->deactivateOthersIfNeeded($validated);

            return Periode::create($validated);
        });
    }

    public function update(Periode $periode, array $validated): Periode
    {
        DB::transaction(function () use ($validated, $periode) {
            $this->deactivateOthersIfNeeded($validated, except: $periode->id);
            $periode->update($validated);
        });

        return $periode->fresh();
    }

    public function delete(Periode $periode): void
    {
        // Cegah hapus periode yang sudah punya lowongan/pendaftaran
        if ($periode->lowongans()->exists() || $periode->applications()->exists()) {
            throw new DomainException(
                'Periode ini sudah punya lowongan/pendaftaran terkait, tidak bisa dihapus. Nonaktifkan saja.'
            );
        }

        $periode->delete();
    }

    /**
     * Hanya boleh ada 1 periode aktif dalam satu waktu (dipakai sebagai
     * "periode pendaftaran yang sedang buka"). Kalau request ini
     * menyalakan is_active, matikan periode aktif lainnya dulu.
     */
    private function deactivateOthersIfNeeded(array $validated, ?int $except = null): void
    {
        if (! ($validated['is_active'] ?? false)) {
            return;
        }

        Periode::where('is_active', true)
            ->when($except, fn ($q) => $q->where('id', '!=', $except))
            ->update(['is_active' => false]);
    }
}