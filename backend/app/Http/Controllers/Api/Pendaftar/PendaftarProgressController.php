<?php

namespace App\Http\Controllers\Api\Pendaftar;

use App\Http\Controllers\Api\Pendaftar\Concerns\ResolvesOwnBimbingan;
use App\Http\Controllers\Controller;
use App\Http\Requests\Pendaftar\PendaftarProgressStoreRequest;
use App\Http\Requests\Pendaftar\PendaftarProgressUpdateRequest;
use App\Http\Resources\Pendaftar\PendaftarProgressItemResource;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class PendaftarProgressController extends Controller
{
    use ResolvesOwnBimbingan;

    // GET /intern/progress
    public function index(Request $request): JsonResponse
    {
        $bimbingan = $this->findOwnBimbingan($request);

        $items = $bimbingan->progressItems()
            ->orderByDesc('tanggal_upload')
            ->orderByDesc('id')
            ->get();

        return ApiResponse::data(PendaftarProgressItemResource::collection($items));
    }

    // POST /intern/progress (multipart)
    public function store(PendaftarProgressStoreRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $bimbingan = $this->findOwnBimbingan($request);
        $file = $request->file('file_presentasi');
        $path = $file->store('progress-presentasi', 'public');

        $item = $bimbingan->progressItems()->create([
            'judul_project' => $validated['judul_project'],
            'tanggal_bimbingan' => $validated['tanggal_bimbingan'],
            'pencapaian' => $validated['pencapaian'],
            'catatan' => $validated['catatan'] ?? null,
            'file_presentasi' => $path,
            'file_name' => $file->getClientOriginalName(),
            'tanggal_upload' => now(),
        ]);

        return ApiResponse::data(new PendaftarProgressItemResource($item), 201);
    }

    // POST /intern/progress/{id}
    public function update(PendaftarProgressUpdateRequest $request, int $id): JsonResponse
    {
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
            $item->file_presentasi = $file->store('progress-presentasi', 'public');
            $item->file_name = $file->getClientOriginalName();
        }

        $item->tanggal_upload = now();
        $item->save();

        return ApiResponse::data(new PendaftarProgressItemResource($item));
    }
}