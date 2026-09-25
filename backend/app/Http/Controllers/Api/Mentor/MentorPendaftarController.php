<?php

namespace App\Http\Controllers\Api\Mentor;

use App\Http\Controllers\Controller;
use App\Http\Resources\Mentor\MentorPendaftarResource;
use App\Services\MentorPendaftarService;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MentorPendaftarController extends Controller
{
    public function __construct(
        private MentorPendaftarService $pendaftarService
    ) {}

    /** Daftar pendaftar pada kategori yang diampu mentor yang login */
    public function index(Request $request): JsonResponse
    {
        return ApiResponse::data(
            MentorPendaftarResource::collection(
                $this->pendaftarService->list($request->user())
            )
        );
    }
}