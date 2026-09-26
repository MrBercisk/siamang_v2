<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UpdateKategoriRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // otorisasi sudah dijaga middleware 'role:admin' di routes
    }

    public function rules(): array
    {
        return [
            'bidang_id' => ['sometimes', 'exists:bidang,id'],
            'name' => ['sometimes', 'string', 'max:255'],
            'quota' => ['sometimes', 'nullable', 'integer', 'min:0'],
            'description' => ['sometimes', 'nullable', 'string'],
        ];
    }
}