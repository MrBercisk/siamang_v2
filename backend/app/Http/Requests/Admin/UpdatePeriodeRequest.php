<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePeriodeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // otorisasi sudah dijaga middleware 'role:admin' di routes
    }

    public function rules(): array
    {
        return [
            'name' => ['nullable', 'string', 'max:100'],
            'start_date' => ['sometimes', 'date'],
            'end_date' => ['sometimes', 'date', 'after_or_equal:start_date'],
            'announcement_date' => ['sometimes', 'date'],
            'internship_start' => ['nullable', 'date'],
            'internship_end' => ['nullable', 'date', 'after_or_equal:internship_start'],
            'duration_info' => ['nullable', 'string', 'max:100'],
            'system_type' => ['nullable', 'string', 'max:50'],
            'is_active' => ['nullable', 'boolean'],
        ];
    }
}