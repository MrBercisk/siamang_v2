<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Application;
use App\Models\Bidang;
use App\Models\DocumentFile;
use App\Models\Kategori;
use App\Models\Lowongan;
use App\Models\Periode;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class ApplicationController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $applications = $request->user()
            ->applications()
            ->with([
                'periode',
                'bidang',
                'kategori',
                'lowongan',
                'documentFiles',
                'teamMembers',
            ])
            ->latest('submitted_at')
            ->get()
            ->map(fn (Application $application) => $this->payload($application));

        return response()->json(['data' => $applications]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
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
            'startDate' => ['nullable', 'date', 'after_or_equal:today'],
            'endDate' => ['nullable', 'date', 'after_or_equal:startDate'],
            'fieldId' => ['nullable'],
            'fieldName' => ['required', 'string', 'max:255'],
            'kategoriName' => ['required', 'string', 'max:255'],
            'lowonganId' => ['required', 'integer', 'exists:lowongan,id'],
            'registrationType' => ['nullable', 'in:Individu,Kelompok'],
            'documents' => ['nullable', 'array'],
            'documents.*.document_type' => [
                'required_with:documents',
                'string',
                'in:pas_foto,berkas_persyaratan,surat_permohonan,proposal,nda,cv_portofolio,transkrip_nilai,video_perkenalan',
            ],
            'isDeclared' => ['required', 'accepted'],
            'documents.*.file' => ['required_with:documents', 'file', 'max:20480'], // 20MB
            'teamMembers' => ['nullable', 'array'],
            'teamMembers.*.fullName' => ['required_with:teamMembers', 'string', 'max:255'],
            'teamMembers.*.email' => ['nullable', 'email', 'max:255'],
            'teamMembers.*.phone' => ['nullable', 'string', 'max:20'],
            'teamMembers.*.nim' => ['nullable', 'string', 'max:50'],
        ]);

        $periode = Periode::where('is_active', true)->first();
        if (! $periode) {
            throw ValidationException::withMessages([
                'periode' => ['Belum ada periode magang yang aktif.'],
            ]);
        }

        $bidang = is_numeric($validated['fieldId'] ?? null)
            ? Bidang::find($validated['fieldId'])
            : Bidang::where('name', $validated['fieldName'])->first();
        $kategori = Kategori::where('name', $validated['kategoriName'])->first();

        if (! $bidang) {
            throw ValidationException::withMessages([
                'fieldName' => ['Bidang magang tidak ditemukan.'],
            ]);
        }

        if (! $kategori || $kategori->bidang_id !== $bidang->id) {
            throw ValidationException::withMessages([
                'kategoriName' => ['Kategori magang tidak ditemukan pada bidang yang dipilih.'],
            ]);
        }
        $application = DB::transaction(function () use (
            $request,
            $validated,
            $periode,
            $bidang,
            $kategori
        ) {
            $lowongan = Lowongan::where('id', $validated['lowonganId'])
                ->where('periode_id', $periode->id)
                ->where('kategori_id', $kategori->id)
                ->where('is_active', true)
                ->lockForUpdate()
                ->first();

            if (! $lowongan) {
                throw ValidationException::withMessages([
                    'lowonganId' => ['Lowongan magang tidak ditemukan atau sudah tidak aktif.'],
                ]);
            }

            if ($lowongan->filled >= $lowongan->kuota) {
                throw ValidationException::withMessages([
                    'lowonganId' => ['Kuota lowongan magang sudah penuh.'],
                ]);
            }

            $application = $request->user()->applications()->create([
                'periode_id' => $periode->id,
                'lowongan_id' => $lowongan->id,
                'bidang_id' => $bidang->id,
                'kategori_id' => $kategori->id,
                'full_name' => $validated['applicantName'],
                'email' => $validated['email'] ?? $request->user()->email,
                'phone' => $validated['phone'] ?? null,
                'address' => $validated['address'] ?? null,
                'university' => $validated['institution'] ?? null,
                'major' => $validated['major'] ?? null,
                'nim' => $validated['nim'] ?? null,
                'skills' => $validated['skills'] ?? null,
                'tools' => $validated['tools'] ?? null,
                'semester' => $validated['semester'] ?? null,
                'project_title' => $validated['projectTitle'] ?? null,
                'registration_type' => $validated['registrationType'] ?? 'Individu',
                'internship_start' => $validated['startDate'] ?? null,
                'internship_end' => $validated['endDate'] ?? null,
                'status' => 'reviewing',
                'submitted_at' => now(),
                'declared_at' => now(),
            ]);

            $lowongan->increment('filled');

            foreach ($request->file('documents', []) as $index => $docFiles) {
                $file = $docFiles['file'] ?? null;

                if (! $file) {
                    continue;
                }

                $path = $file->store(
                    'documents/' . $application->id,
                    'public'
                );

                DocumentFile::create([
                    'application_id' => $application->id,
                    'document_type' => $request->input(
                        "documents.$index.document_type"
                    ),
                    'original_name' => $file->getClientOriginalName(),
                    'file_path' => $path,
                    'file_size' => $file->getSize(),
                    'mime_type' => $file->getClientMimeType(),
                    'status' => 'uploaded',
                ]);
            }

            foreach ($request->input('teamMembers', []) as $member) {
                if (empty($member['fullName'])) {
                    continue;
                }

                $application->teamMembers()->create([
                    'full_name' => $member['fullName'],
                    'email' => $member['email'] ?? '',
                    'phone' => $member['phone'] ?? null,
                    'nim' => $member['nim'] ?? null,
                ]);
            }

            return $application;
        });
        return response()->json([
            'message' => 'Pendaftaran berhasil dikirim.',
            'data' => $this->payload($application->load(['periode', 'bidang', 'kategori',  'lowongan', 'documentFiles', 'teamMembers'])),
        ], 201);
    }

    private function payload(Application $application): array
    {
        return [
            'id' => (string) $application->id,
            'applicantName' => $application->full_name,
            'institution' => $application->university,
            'major' => $application->major,
            'nim' => $application->nim,
            'phone' => $application->phone,
            'email' => $application->email,
            'address' => $application->address,
            'projectTitle' => $application->project_title,
            'skills' => $application->skills,
            'tools' => $application->tools,
            'semester' => $application->semester,
            'startDate' => $application->internship_start?->toDateString(),
            'endDate' => $application->internship_end?->toDateString(),
            'fieldId' => (string) $application->bidang_id,
            'fieldName' => $application->bidang?->name,
            'kategoriName' => $application->kategori?->name,
            'lowonganId' => $application->lowongan_id,
            'lowongan' => $application->lowongan?->project,
            'registrationType' => $application->registration_type,
            'status' => $application->status,
            'submittedAt' => $application->submitted_at?->toIso8601String(),
            'declaredAt' => $application->declared_at?->toIso8601String(),
            'reviewedAt' => $application->reviewed_at?->toIso8601String(), 
            'acceptedAt' => $application->accepted_at?->toIso8601String(),
            'notes' => $application->admin_notes,
            'periode' => $application->periode?->name,
            'periodeStart' => $application->periode?->start_date?->toDateString(),
            'periodeEnd' => $application->periode?->end_date?->toDateString(),
            'documents' => $application->documentFiles->map(fn (DocumentFile $doc) => [
                'id' => $doc->id,
                'documentType' => $doc->document_type,
                'originalName' => $doc->original_name,
                'filePath' => $doc->file_path,
                'status' => $doc->status,
            ]),
            'teamMembers' => $application->teamMembers->map(fn ($member) => [
                'id' => $member->id,
                'fullName' => $member->full_name,
                'email' => $member->email,
                'phone' => $member->phone,
                'nim' => $member->nim,
            ]),
        ];
    }
}