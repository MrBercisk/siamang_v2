<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateApplicationStatusRequest extends FormRequest
{
    public function authorize(): bool
    {
        // Middleware role sudah handle otorisasi di route, ini cuma safety net.
        return $this->user()?->role === 'admin';
    }

    public function rules(): array
    {
        return [
            'status' => [
                'required',
                Rule::in(['reviewing', 'accepted', 'rejected']),
            ],
            'admin_notes' => ['nullable', 'string', 'max:1000'],

            'mentor_id' => [
                Rule::requiredIf(fn () => $this->input('status') === 'accepted'),
                'nullable',
                'integer',
                'exists:users,id',
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'mentor_id.required_if' => 'Mentor wajib dipilih sebelum menerima pendaftaran ini.',
        ];
    }
}