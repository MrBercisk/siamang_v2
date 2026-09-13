<?php

namespace App\Support;

use Illuminate\Http\JsonResponse;

class ApiResponse
{
    public static function success(
        mixed $data = null,
        string $message = 'Success',
        int $status = 200
    ): JsonResponse {
        return response()->json([
            'message' => $message,
            'data' => $data,
        ], $status);
    }

    public static function data(
        mixed $data,
        int $status = 200
    ): JsonResponse {
        return response()->json([
            'data' => $data,
        ], $status);
    }

    public static function error(
        string $message,
        int $status = 400,
        mixed $errors = null
    ): JsonResponse {
        return response()->json([
            'message' => $message,
            ...($errors !== null ? ['errors' => $errors] : []),
        ], $status);
    }
}