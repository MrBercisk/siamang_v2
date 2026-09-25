<?php

namespace App\Http\Controllers\Api\Pendaftar;

use App\Http\Controllers\Api\Pendaftar\Concerns\ResolvesOwnBimbingan;
use App\Http\Controllers\Controller;
use App\Http\Requests\Pendaftar\PendaftarProgressStoreRequest;
use App\Http\Requests\Pendaftar\PendaftarProgressUpdateRequest;
use App\Http\Resources\Pendaftar\PendaftarProgressItemResource;
use App\Models\Bimbingan;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class PendaftarProgressController extends Controller
{
    use ResolvesOwnBimbingan;

    /**
     * Target jumlah progress untuk mencapai 100%.
     *
     * Saat ini mengikuti asumsi magang sekitar 3 bulan
     * dengan evaluasi progress setiap 2 minggu.
     */
    private const TARGET_PROGRESS_COUNT = 6;

    public function index(Request $request): JsonResponse
    {
        $bimbingan = $this->findOwnBimbingan($request);

        $items = $bimbingan->progressItems()
            ->orderByDesc('tanggal_upload')
            ->orderByDesc('id')
            ->get();

        return ApiResponse::data(
            PendaftarProgressItemResource::collection($items)
        );
    }

    public function store(PendaftarProgressStoreRequest $request): JsonResponse
    {
        $validated = $request->validated();
        $bimbingan = $this->findOwnBimbingan($request);

        $file = $request->file('file_presentasi');
        $directory = 'applications/' . $bimbingan->application->registration_number . '/progress';

        $path = $file->store($directory, 'public');

        $item = $bimbingan->progressItems()->create([
            'judul_project' => $validated['judul_project'],
            'tanggal_bimbingan' => $validated['tanggal_bimbingan'],
            'pencapaian' => $validated['pencapaian'],
            'catatan' => $validated['catatan'] ?? null,
            'file_presentasi' => $path,
            'file_name' => $file->getClientOriginalName(),
            'tanggal_upload' => now(),
        ]);

        $this->syncProgress($bimbingan);

        return ApiResponse::data(
            new PendaftarProgressItemResource($item),
            201
        );
    }

    public function update(
        PendaftarProgressUpdateRequest $request,
        int $id
    ): JsonResponse {
        $validated = $request->validated();
        $bimbingan = $this->findOwnBimbingan($request);
        $item = $bimbingan->progressItems()->findOrFail($id);

        $item->judul_project = $validated['judul_project'];
        $item->tanggal_bimbingan = $validated['tanggal_bimbingan'];
        $item->pencapaian = $validated['pencapaian'];
        $item->catatan = $validated['catatan'] ?? null;

        if ($request->hasFile('file_presentasi')) {
            if ($item->file_presentasi) {
                Storage::disk('public')->delete($item->file_presentasi);
            }

            $file = $request->file('file_presentasi');
            $directory = 'applications/' . $bimbingan->application->registration_number . '/progress';

            $item->file_presentasi = $file->store($directory, 'public');
            $item->file_name = $file->getClientOriginalName();
        }

        $item->tanggal_upload = now();
        $item->save();

        // Edit tidak menambah jumlah progress, tetapi tetap dianggap
        // sebagai aktivitas terbaru pada bimbingan
        $bimbingan->update(['last_update' => now()]);

        return ApiResponse::data(
            new PendaftarProgressItemResource($item)
        );
    }

    /**
     * Menyesuaikan progress bimbingan berdasarkan jumlah progress yang sudah dikirim.
     */
    private function syncProgress(Bimbingan $bimbingan): void
    {
        $count = $bimbingan->progressItems()->count();
        $percent = min(
            100,
            (int) round(($count / self::TARGET_PROGRESS_COUNT) * 100)
        );

        $bimbingan->update([
            'progress_percent' => $percent,
            'last_update' => now(),
        ]);
    }
}