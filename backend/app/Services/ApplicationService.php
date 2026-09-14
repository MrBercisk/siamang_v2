<?php

namespace App\Services;

use App\Models\Application;
use App\Models\Bidang;
use App\Models\DocumentFile;
use App\Models\Kategori;
use App\Models\Lowongan;
use App\Models\Periode;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;
use Illuminate\Http\Request;

class ApplicationService
{
    public function getUserApplications(User $user)
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

    private function generateRegistrationNumber(Periode $periode): string
    {
        $periode = Periode::where('id', $periode->id)
            ->lockForUpdate()
            ->firstOrFail();

        $periode->increment('application_sequence');

        $sequence = $periode->application_sequence;

        $year = $periode->start_date->format('Y');

        return sprintf(
            'MAG-%s-%06d',
            $year,
            $sequence
        );
    }

    /**
     * Mencegah user mendaftar lagi kalau aplikasi terakhirnya:
     * - masih menunggu review ('reviewing' — status default saat submit), atau
     * - sudah 'accepted' tapi periode magangnya belum lewat (masih berjalan).
     *
     * Dipanggil di awal create() sebagai pengaman di sisi server — terlepas
     * dari gating yang sudah ada di UI (ReviewSidebar/PendaftarReviewDashboard),
     * karena UI lock saja bisa dilewati lewat request langsung ke API.
     */
    private function assertUserCanApply(User $user): void
    {
        $latest = $user->applications()
            ->latest('submitted_at')
            ->first();

        if (! $latest) {
            return; // belum pernah mendaftar sama sekali
        }

        if ($latest->status === 'reviewing') {
            throw ValidationException::withMessages([
                'application' => [
                    'Anda masih memiliki pendaftaran magang (' . $latest->registration_number . ') yang sedang menunggu proses peninjauan. Mohon tunggu hasilnya terlebih dahulu sebelum mendaftar kembali.'
                ],
            ]);
        }

        if ($latest->status === 'accepted') {
            $stillOngoing = ! $latest->internship_end
                || $latest->internship_end->isFuture()
                || $latest->internship_end->isToday();

            if ($stillOngoing) {
                throw ValidationException::withMessages([
                    'application' => [
                        'Anda sedang menjalani program magang (' . $latest->registration_number . ') dan belum dapat mendaftar kembali hingga periode magang Anda selesai.'
                    ],
                ]);
            }
        }

        // status 'rejected', atau 'accepted' dengan internship_end sudah
        // lewat → boleh mendaftar lagi, tidak perlu dilempar exception.
    }

    public function create(User $user, array $validated, Request $request): Application
    {
        $this->assertUserCanApply($user);

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

            $this->storeProfilePhoto(
                $user,
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
        User $user,
        array $validated,
        Periode $periode,
        Bidang $bidang,
        Kategori $kategori,
        Lowongan $lowongan
    ): Application {
        $registrationNumber = $this->generateRegistrationNumber($periode);

        $application = $user->applications()->create([
            'registration_number' => $registrationNumber,
            'periode_id' => $periode->id,
            'lowongan_id' => $lowongan->id,
            'bidang_id' => $bidang->id,
            'kategori_id' => $kategori->id,
            'full_name' => $validated['applicantName'],
            'email' => $validated['email'] ?? $user->email,
            'phone' => $validated['phone'] ?? null,

            'university' => $validated['institution'] ?? null,
            'major' => $validated['major'] ?? null,
            'nim' => $validated['nim'] ?? null,
            'skills' => $validated['skills'] ?? null,
            'tools' => $validated['tools'] ?? null,
            'semester' => $validated['semester'] ?? null,
            'project_title' => $validated['projectTitle'] ?? null,
            'registration_type' =>
                $validated['registrationType'] ?? 'Individu',
            'internship_start' => $periode->start_date,
            'internship_end' => $periode->end_date,
            'status' => 'reviewing',
            'submitted_at' => now(),
            'declared_at' => now(),
        ]);

        $lowongan->increment('filled');

        return $application;
    }

    private function storeDocuments(
        Application $application,
        Request $request
    ): void {
        $directory = 'applications/' . $application->registration_number . '/documents';

        foreach ($request->file('documents', []) as $index => $document) {
            $file = $document['file'] ?? null;

            if (! $file instanceof UploadedFile) {
                continue;
            }

            $path = $file->store($directory, 'public');

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

    private function storeProfilePhoto(
        User $user,
        Application $application,
        Request $request
    ): void {
        $photo = $request->file('photo');

        if (! $photo instanceof UploadedFile) {
            return;
        }

        // Hapus foto lama user (kalau ada) supaya tidak menumpuk file yatim
        // di storage setiap kali user mendaftar ulang/upload foto baru.
        if ($user->avatar_url) {
            Storage::disk('public')->delete($user->avatar_url);
        }

        $directory = 'applications/' . $application->registration_number . '/profile';

        // Disimpan di folder yang sama dengan berkas dokumen lainnya untuk
        // aplikasi ini, konsisten dengan storeDocuments().
        $path = $photo->store($directory, 'public');

        // Hanya PATH yang disimpan ke kolom users.avatar_url — bukan file
        // binernya. File asli tetap berada di storage/app/public/{$path}.
        $user->update(['avatar_url' => $path]);
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

    private function syncUserProfile(User $user, array $validated): void
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

        if (empty($user->semester) && ! empty($validated['semester'])) {
            $updates['semester'] = $validated['semester'];
        }

        if (empty($user->skills) && ! empty($validated['skills'])) {
            $updates['skills'] = $validated['skills'];
        }
        if (empty($user->tools) && ! empty($validated['tools'])) {
            $updates['tools'] = $validated['tools'];
        }

        if (! empty($updates)) {
            $user->update($updates);
        }
    }
    public function findForTracking(string $registrationNumber, string $email): ?Application
    {
        return Application::where('registration_number', $registrationNumber)
            ->where('email', $email)
            ->with(['periode', 'bidang', 'kategori', 'lowongan'])
            ->first();
    }
}