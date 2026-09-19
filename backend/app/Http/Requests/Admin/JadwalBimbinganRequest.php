<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class JadwalBimbinganRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->role === 'admin';
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],

            'studentUserId' => ['required', 'integer', 'exists:users,id'],
            'mentorUserId' => [
                'required',
                'integer',
                Rule::exists('users', 'id')->where('role', 'mentor'),
            ],

            'date' => ['required', 'date_format:Y-m-d'],

            // Format "HH:MM - HH:MM", contoh "09:00 - 10:30"
            'time' => [
                'bail',
                'required',
                'string',
                'regex:/^\d{2}:\d{2} - \d{2}:\d{2}$/',
                function (string $attribute, mixed $value, \Closure $fail) {
                    [$start, $end] = explode(' - ', $value);

                    if ($end <= $start) {
                        $fail('Jam selesai harus setelah jam mulai.');
                    }
                },
            ],

            'location' => ['nullable', 'string', 'max:255'],
            'meetLink' => ['nullable', 'url', 'max:500'],
            'notes' => ['nullable', 'string'],

            // Dipakai saat integrasi Google Calendar aktif (lihat JadwalBimbinganService).
            'syncGoogleCalendar' => ['nullable', 'boolean'],
        ];
    }

    public function messages(): array
    {
        return [
            'mentorUserId.exists' => 'User yang dipilih bukan mentor.',
            'time.regex' => 'Format waktu harus "HH:MM - HH:MM", contoh 09:00 - 10:30.',
            'date.date_format' => 'Format tanggal harus YYYY-MM-DD.',
        ];
    }
}