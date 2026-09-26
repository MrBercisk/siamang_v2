<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreBidangRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // otorisasi sudah dijaga middleware 'role:admin' di routes
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255', 'unique:bidang,name'],
            'status' => ['nullable', Rule::in(['Aktif', 'Nonaktif'])],
        ];
    }
}