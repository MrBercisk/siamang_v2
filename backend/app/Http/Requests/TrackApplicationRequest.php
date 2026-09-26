<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class TrackApplicationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // endpoint publik, tidak butuh login
    }

    public function rules(): array
    {
        return [
            'registration_number' => ['required', 'string'],
            'email' => ['required', 'email'],
        ];
    }
}