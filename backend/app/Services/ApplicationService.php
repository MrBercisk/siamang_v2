<?php

namespace App\Services;

use App\Models\Application;
use App\Models\Bidang;
use App\Models\DocumentFile;
use App\Models\Kategori;
use App\Models\Lowongan;
use App\Models\Periode;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class ApplicationService
{
    public function getUserApplications($user)
    {
        return $user->applications()
            ->with([
                'periode',
                'bidang',
                'kategori',
                'lowongan',
                'documentFiles',
                'teamMembers',
            ])
            ->latest('submitted_at')
            ->get();
    }

    public function create($user, array $validated, $request): Application
    {
        $periode = $this->getActivePeriod();

        $bidang = $this->resolveBidang($validated);

        $kategori = $this->resolveKategori(
            $validated['kategoriName'],
            $bidang
        );

        return DB::transaction(function () use (
            $user,
            $validated,
            $request,
            $periode,
            $bidang,
            $kategori
        ) {
            $lowongan = $this->getAvailableLowongan(
                $validated['lowonganId'],
                $periode,
                $kategori
            );

            $application = $this->createApplication(
                $user,
                $validated,
                $periode,
                $bidang,
                $kategori,
                $lowongan
            );

            $this->storeDocuments(
                $application,
                $request
            );

            $this->storeTeamMembers(
                $application,
                $validated['teamMembers'] ?? []
            );
            
            $this->syncUserProfile($user, $validated);

            return $application->load([
                'periode',
                'bidang',
                'kategori',
                'lowongan',
                'documentFiles',
                'teamMembers',
            ]);
        });
    }

    private function getActivePeriod(): Periode
    {
        $periode = Periode::where('is_active', true)->first();

        if (! $periode) {
            throw ValidationException::withMessages([
                'periode' => [
                    'Belum ada periode magang yang aktif.'
                ],
            ]);
        }

        return $periode;
    }

    private function resolveBidang(array $validated): Bidang
    {
        $bidang = is_numeric($validated['fieldId'] ?? null)
            ? Bidang::find($validated['fieldId'])
            : Bidang::where(
                'name',
                $validated['fieldName']
            )->first();

        if (! $bidang) {
            throw ValidationException::withMessages([
                'fieldName' => [
                    'Bidang magang tidak ditemukan.'
                ],
            ]);
        }

        return $bidang;
    }

    private function resolveKategori(
        string $name,
        Bidang $bidang
    ): Kategori {
        $kategori = Kategori::where('name', $name)->first();

        if (! $kategori || $kategori->bidang_id !== $bidang->id) {
            throw ValidationException::withMessages([
                'kategoriName' => [
                    'Kategori magang tidak ditemukan pada bidang yang dipilih.'
                ],
            ]);
        }

        return $kategori;
    }

    private function getAvailableLowongan(
        int $lowonganId,
        Periode $periode,
        Kategori $kategori
    ): Lowongan {
        $lowongan = Lowongan::where('id', $lowonganId)
            ->where('periode_id', $periode->id)
            ->where('kategori_id', $kategori->id)
            ->where('is_active', true)
            ->lockForUpdate()
            ->first();

        if (! $lowongan) {
            throw ValidationException::withMessages([
                'lowonganId' => [
                    'Lowongan magang tidak ditemukan atau sudah tidak aktif.'
                ],
            ]);
        }

        if ($lowongan->filled >= $lowongan->kuota) {
            throw ValidationException::withMessages([
                'lowonganId' => [
                    'Kuota lowongan magang sudah penuh.'
                ],
            ]);
        }

        return $lowongan;
    }

    private function createApplication(
        $user,
        array $validated,
        Periode $periode,
        Bidang $bidang,
        Kategori $kategori,
        Lowongan $lowongan
    ): Application {
        $application = $user->applications()->create([
            'periode_id' => $periode->id,
            'lowongan_id' => $lowongan->id,
            'bidang_id' => $bidang->id,
            'kategori_id' => $kategori->id,

            'full_name' => $validated['applicantName'],
            'email' => $validated['email'] ?? $user->email,
            'phone' => $validated['phone'] ?? null,
            'address' => $validated['address'] ?? null,
            'university' => $validated['institution'] ?? null,
            'major' => $validated['major'] ?? null,
            'nim' => $validated['nim'] ?? null,

            'skills' => $validated['skills'] ?? null,
            'tools' => $validated['tools'] ?? null,
            'semester' => $validated['semester'] ?? null,
            'project_title' => $validated['projectTitle'] ?? null,

            'registration_type' =>
                $validated['registrationType'] ?? 'Individu',

            'internship_start' =>
                $validated['startDate'] ?? null,

            'internship_end' =>
                $validated['endDate'] ?? null,

            'status' => 'reviewing',
            'submitted_at' => now(),
            'declared_at' => now(),
        ]);

        $lowongan->increment('filled');

        return $application;
    }

    private function storeDocuments(
        Application $application,
        $request
    ): void {
        foreach ($request->file('documents', []) as $index => $document) {
            $file = $document['file'] ?? null;

            if (! $file instanceof UploadedFile) {
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
    }

    private function storeTeamMembers(
        Application $application,
        array $members
    ): void {
        foreach ($members as $member) {
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
    }
    private function syncUserProfile($user, array $validated): void
    {
        $updates = [];

        if (empty($user->nim) && ! empty($validated['nim'])) {
            $updates['nim'] = $validated['nim'];
        }

        if (empty($user->institution) && ! empty($validated['institution'])) {
            $updates['institution'] = $validated['institution'];
        }

        if (empty($user->major) && ! empty($validated['major'])) {
            $updates['major'] = $validated['major'];
        }

        if (empty($user->phone) && ! empty($validated['phone'])) {
            $updates['phone'] = $validated['phone'];
        }

        if (! empty($updates)) {
            $user->update($updates);
        }
    }
}