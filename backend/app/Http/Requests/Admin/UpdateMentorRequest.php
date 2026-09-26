<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateMentorRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // otorisasi sudah dijaga middleware 'role:admin' di routes
    }

    public function rules(): array
    {
        $mentor = $this->route('mentor');

        return [
            'name' => ['sometimes', 'string', 'max:255'],
            'nip' => ['sometimes', 'nullable', 'string', 'max:50'],
            'email' => [
                'sometimes',
                'email',
                'max:255',
                Rule::unique('users', 'email')->ignore($mentor?->id),
            ],
            'phone' => ['sometimes', 'nullable', 'string', 'max:30'],
            'position' => ['sometimes', 'nullable', 'string', 'max:255'],
            'status' => ['sometimes', Rule::in(['Aktif', 'Nonaktif'])],
            'kategori_ids' => ['sometimes', 'array', 'min:1'],
            'kategori_ids.*' => ['exists:kategori,id'],
        ];
    }
}