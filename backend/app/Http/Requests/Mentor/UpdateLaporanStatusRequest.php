<?php

namespace App\Http\Requests\Mentor;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateLaporanStatusRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->role === 'mentor';
    }

    public function rules(): array
    {
        return [
            'status' => ['required', Rule::in(['diterima', 'ditolak'])],
            // Alasan penolakan (disimpan di laporan.catatan_reject), opsional.
            'catatan' => ['nullable', 'string', 'max:1000'],
        ];
    }
}