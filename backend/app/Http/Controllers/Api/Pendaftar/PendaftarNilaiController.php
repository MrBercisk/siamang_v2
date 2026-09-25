<?php

namespace App\Http\Controllers\Api\Pendaftar;

use App\Http\Controllers\Api\Pendaftar\Concerns\ResolvesOwnBimbingan;
use App\Http\Resources\Pendaftar\PendaftarNilaiProfileResource;
use App\Http\Resources\Pendaftar\PendaftarNilaiResource;
use App\Http\Controllers\Controller;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PendaftarNilaiController extends Controller
{
    use ResolvesOwnBimbingan;

    // GET /intern/nilai
    public function index(Request $request): JsonResponse
    {
        $bimbingan = $this->findOwnBimbingan($request)->load('application.kategori', 'application.mentor');
        $application = $bimbingan->application;

        return ApiResponse::data([
            'profile' => new PendaftarNilaiProfileResource($application),
            'nilai' => $bimbingan->nilai ? new PendaftarNilaiResource($bimbingan->nilai) : null,
        ]);
    }
}