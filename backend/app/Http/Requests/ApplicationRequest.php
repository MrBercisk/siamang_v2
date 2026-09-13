<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ApplicationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'applicantName' => ['required', 'string', 'max:255'],
            'institution' => ['nullable', 'string', 'max:255'],
            'major' => ['nullable', 'string', 'max:255'],
            'nim' => ['nullable', 'string', 'max:50'],
            'phone' => ['nullable', 'string', 'max:20'],
            'email' => ['nullable', 'email', 'max:255'],
            'address' => ['nullable', 'string'],
            'projectTitle' => ['nullable', 'string', 'max:500'],
            'skills' => ['nullable', 'string'],
            'tools' => ['nullable', 'string'],
            'semester' => ['nullable', 'string'],

            'startDate' => [
                'nullable',
                'date',
                'after_or_equal:today',
            ],

            'endDate' => [
                'nullable',
                'date',
                'after_or_equal:startDate',
            ],

            'fieldId' => ['nullable'],
            'fieldName' => ['required', 'string', 'max:255'],
            'kategoriName' => ['required', 'string', 'max:255'],

            'lowonganId' => [
                'required',
                'integer',
                'exists:lowongan,id',
            ],

            'registrationType' => [
                'nullable',
                'in:Individu,Kelompok',
            ],

            'documents' => ['nullable', 'array'],

            'documents.*.document_type' => [
                'required_with:documents',
                'string',
                'in:pas_foto,berkas_persyaratan,surat_permohonan,proposal,nda,cv_portofolio,transkrip_nilai,video_perkenalan',
            ],

            'documents.*.file' => [
                'required_with:documents',
                'file',
                'max:20480',
            ],

            'isDeclared' => [
                'required',
                'accepted',
            ],

            'teamMembers' => ['nullable', 'array'],

            'teamMembers.*.fullName' => [
                'required_with:teamMembers',
                'string',
                'max:255',
            ],

            'teamMembers.*.email' => [
                'nullable',
                'email',
                'max:255',
            ],

            'teamMembers.*.phone' => [
                'nullable',
                'string',
                'max:20',
            ],

            'teamMembers.*.nim' => [
                'nullable',
                'string',
                'max:50',
            ],
        ];
    }
}