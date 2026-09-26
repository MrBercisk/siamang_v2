<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class StoreKategoriRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // otorisasi sudah dijaga middleware 'role:admin' di routes
    }

    public function rules(): array
    {
        return [
            'bidang_id' => ['required', 'exists:bidang,id'],
            'name' => ['required', 'string', 'max:255'],
            'quota' => ['nullable', 'integer', 'min:0'],
            'description' => ['nullable', 'string'],
        ];
    }
}