<?php

namespace App\Http\Requests\Pendaftar;

use Illuminate\Foundation\Http\FormRequest;

class PendaftarProgressStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'judul_project' => ['required', 'string', 'max:255'],
            'tanggal_bimbingan' => ['required', 'date'],
            'pencapaian' => ['required', 'string'],
            'catatan' => ['nullable', 'string'],
            'file_presentasi' => ['required', 'file', 'mimes:pdf', 'max:2048'],
        ];
    }
}