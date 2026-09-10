<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Periode;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PeriodeController extends Controller
{
    /**
     * Publik — daftar semua periode (buat halaman riwayat/arsip).
     */
    public function index(): JsonResponse
    {
        return response()->json([
            'data' => Periode::orderByDesc('start_date')->get(),
        ]);
    }

    /**
     * Publik — periode yang sedang buka pendaftaran. Dipakai landing page
     * pendaftaran untuk tahu periode mana yang aktif tanpa admin harus
     * kirim ID manual dari frontend.
     */
    public function active(): JsonResponse
    {
        $periode = Periode::where('is_active', true)->first();

        if (! $periode) {
            return response()->json([
                'data' => null,
                'message' => 'Belum ada periode pendaftaran yang aktif.',
            ]);
        }

        return response()->json(['data' => $periode]);
    }

    public function show(Periode $periode): JsonResponse
    {
        return response()->json(['data' => $periode]);
    }

    // store/update/destroy dibatasi middleware 'role:admin' di routes.

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate($this->rules());

        $periode = DB::transaction(function () use ($validated) {
            $this->deactivateOthersIfNeeded($validated);

            return Periode::create($validated);
        });

        return response()->json([
            'message' => 'Periode berhasil ditambahkan.',
            'data' => $periode,
        ], 201);
    }

    public function update(Request $request, Periode $periode): JsonResponse
    {
        $validated = $request->validate($this->rules(sometimes: true));

        DB::transaction(function () use ($validated, $periode) {
            $this->deactivateOthersIfNeeded($validated, except: $periode->id);
            $periode->update($validated);
        });

        return response()->json([
            'message' => 'Periode berhasil diperbarui.',
            'data' => $periode->fresh(),
        ]);
    }

    public function destroy(Periode $periode): JsonResponse
    {
        // Cegah hapus periode yang sudah punya lowongan/pendaftaran —
        // ini adalah data riwayat, bukan sekadar master data kosong.
        if ($periode->lowongans()->exists() || $periode->applications()->exists()) {
            return response()->json([
                'message' => 'Periode ini sudah punya lowongan/pendaftaran terkait, tidak bisa dihapus. Nonaktifkan saja.',
            ], 422);
        }

        $periode->delete();

        return response()->json([
            'message' => 'Periode berhasil dihapus.',
        ]);
    }

    protected function rules(bool $sometimes = false): array
    {
        $rule = $sometimes ? 'sometimes' : 'required';

        return [
            'name' => ['nullable', 'string', 'max:100'],
            'start_date' => [$rule, 'date'],
            'end_date' => [$rule, 'date', 'after_or_equal:start_date'],
            'announcement_date' => [$rule, 'date'],
            'internship_start' => ['nullable', 'date'],
            'internship_end' => ['nullable', 'date', 'after_or_equal:internship_start'],
            'duration_info' => ['nullable', 'string', 'max:100'],
            'system_type' => ['nullable', 'string', 'max:50'],
            'is_active' => ['nullable', 'boolean'],
        ];
    }

    /**
     * Hanya boleh ada 1 periode aktif dalam satu waktu (dipakai sebagai
     * "periode pendaftaran yang sedang buka"). Kalau request ini
     * menyalakan is_active, matikan periode aktif lainnya dulu.
     */
    protected function deactivateOthersIfNeeded(array $validated, ?int $except = null): void
    {
        if (! ($validated['is_active'] ?? false)) {
            return;
        }

        Periode::where('is_active', true)
            ->when($except, fn ($q) => $q->where('id', '!=', $except))
            ->update(['is_active' => false]);
    }
}