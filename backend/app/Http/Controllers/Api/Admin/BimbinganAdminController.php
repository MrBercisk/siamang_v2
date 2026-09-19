<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\Admin\BimbinganAdminResource;
use App\Services\BimbinganService;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BimbinganAdminController extends Controller
{
    public function __construct(
        private BimbinganService $bimbinganService
    ) {}

    /** Filter opsional: status, periode_id. */
    public function index(Request $request): JsonResponse
    {
        $bimbingans = $this->bimbinganService->getAllForAdmin(
            $request->only(['status', 'periode_id'])
        );

        return ApiResponse::data(
            BimbinganAdminResource::collection($bimbingans)
        );
    }
}