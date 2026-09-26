<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class StoreLowonganRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // otorisasi sudah dijaga middleware 'role:admin' di routes
    }

    public function rules(): array
    {
        return [
            'periode_id' => ['required', 'exists:periode,id'],
            'kategori_id' => ['required', 'exists:kategori,id'],
            'project' => ['nullable', 'string', 'max:255'],
            'definisi' => ['nullable', 'string'],
            'detail_kebutuhan' => ['nullable', 'string'],
            'kuota' => ['required', 'integer', 'min:1'],
            'is_active' => ['nullable', 'boolean'],
        ];
    }
}