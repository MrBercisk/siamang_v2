<?php

namespace App\Http\Requests\Mentor;

use Illuminate\Foundation\Http\FormRequest;

class StoreNilaiRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->role === 'mentor';
    }

    public function rules(): array
    {
        $score = ['required', 'numeric', 'between:0,10'];

        return [
            'kehadiran' => $score,
            'kemampuanKerja' => $score,
            'kualitasKerja' => $score,
            'kerjasama' => $score,
            'inisiatifKreativitas' => $score,
            'disiplin' => $score,

            'suratKeterangan' => ['nullable', 'file', 'mimes:pdf,doc,docx', 'max:5120'], // 5 MB
        ];
    }

    public function attributes(): array
    {
        return [
            'kemampuanKerja' => 'kemampuan kerja',
            'kualitasKerja' => 'kualitas kerja',
            'inisiatifKreativitas' => 'inisiatif & kreativitas',
            'suratKeterangan' => 'surat keterangan magang',
        ];
    }

    /** Nilai dalam nama kolom tabel bimbingan_nilai. */
    public function scores(): array
    {
        $validated = $this->validated();

        return [
            'kehadiran' => $validated['kehadiran'],
            'kemampuan_kerja' => $validated['kemampuanKerja'],
            'kualitas_kerja' => $validated['kualitasKerja'],
            'kerjasama' => $validated['kerjasama'],
            'inisiatif_kreativitas' => $validated['inisiatifKreativitas'],
            'disiplin' => $validated['disiplin'],
        ];
    }
}