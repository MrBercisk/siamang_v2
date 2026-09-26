<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateBidangRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // otorisasi sudah dijaga middleware 'role:admin' di routes
    }

    public function rules(): array
    {
        $bidang = $this->route('bidang');

        return [
            'name' => [
                'sometimes',
                'string',
                'max:255',
                Rule::unique('bidang', 'name')->ignore($bidang?->id),
            ],
            'status' => ['sometimes', Rule::in(['Aktif', 'Nonaktif'])],
        ];
    }
}