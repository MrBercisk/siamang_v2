<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UpdateLowonganRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // otorisasi sudah dijaga middleware 'role:admin' di routes
    }

    public function rules(): array
    {
        return [
            'periode_id' => ['sometimes', 'exists:periodes,id'],
            'kategori_id' => ['sometimes', 'exists:kategori,id'],
            'project' => ['sometimes', 'nullable', 'string', 'max:255'],
            'definisi' => ['sometimes', 'nullable', 'string'],
            'detail_kebutuhan' => ['sometimes', 'nullable', 'string'],
            'kuota' => ['sometimes', 'integer', 'min:1'],
            'is_active' => ['sometimes', 'boolean'],
        ];
    }
}