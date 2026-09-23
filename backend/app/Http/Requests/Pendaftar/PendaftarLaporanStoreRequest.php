<?php

namespace App\Http\Requests\Pendaftar;

use Illuminate\Foundation\Http\FormRequest;

class PendaftarLaporanStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'judul_laporan' => ['required', 'string', 'max:255'],
            'link_google_drive' => ['required', 'url', 'max:2048'],
            'file_laporan' => ['nullable', 'file', 'mimes:pdf', 'max:2048'],
            'form_nilai' => ['nullable', 'file', 'mimes:pdf', 'max:2048'],
        ];
    }
}