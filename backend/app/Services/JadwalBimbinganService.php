<?php

namespace App\Services;

use App\Models\Application;
use App\Models\JadwalBimbingan;
use App\Models\User;
use Illuminate\Support\Collection;

class JadwalBimbinganService
{
    public function list(array $filters = []): Collection
    {
        $query = JadwalBimbingan::with(['student', 'mentor']);

        if (! empty($filters['year'])) {
            $query->whereYear('event_date', $filters['year']);
        }

        if (! empty($filters['month'])) {
            $query->whereMonth('event_date', $filters['month']);
        }

        if (! empty($filters['student_user_id'])) {
            $query->where('student_user_id', $filters['student_user_id']);
        }

        if (! empty($filters['mentor_user_id'])) {
            $query->where('mentor_user_id', $filters['mentor_user_id']);
        }

        return $query
            ->orderBy('event_date')
            ->orderBy('event_time')
            ->get();
    }

    /**
     * Mahasiswa = user yang pendaftarannya sudah 'accepted' (mentor_id ikut
     * dikirim supaya form bisa otomatis memilih mentor yang sudah ditugaskan).
     * Mentor = mentor berstatus Aktif, sama seperti getAvailableMentors().
     */
    public function options(): array
    {
        $students = Application::where('status', 'accepted')
            ->latest('submitted_at')
            ->get()
            ->unique('user_id')
            ->values()
            ->map(fn (Application $application) => [
                'userId' => $application->user_id,
                'name' => $application->full_name,
                'institution' => $application->university,
                'mentorId' => $application->mentor_id,
            ]);

        $mentors = User::mentors()
            ->where('status', 'Aktif')
            ->orderBy('name')
            ->get(['id', 'name'])
            ->map(fn (User $mentor) => [
                'id' => $mentor->id,
                'name' => $mentor->name,
            ]);

        return [
            'students' => $students,
            'mentors' => $mentors,
        ];
    }

    public function create(array $validated): JadwalBimbingan
    {
        $jadwal = JadwalBimbingan::create([
            'title' => $validated['title'],
            'student_user_id' => $validated['studentUserId'],
            'student_institution' => $this->resolveInstitution((int) $validated['studentUserId']),
            'mentor_user_id' => $validated['mentorUserId'],
            'event_date' => $validated['date'],
            'event_time' => $validated['time'],
            'location' => $validated['location'] ?? null,
            'meet_link' => $validated['meetLink'] ?? null,
            'notes' => $validated['notes'] ?? null,
            'google_calendar_synced' => false,
            'google_calendar_event_id' => null,
        ]);

        // TODO Google Calendar: bila $validated['syncGoogleCalendar'] true,
        // kirim event ke Google Calendar (sebaiknya lewat queued job supaya
        // request admin tidak menunggu Google API), lalu simpan:
        //   $jadwal->update([
        //       'google_calendar_synced' => true,
        //       'google_calendar_event_id' => $event->id,
        //       'meet_link' => $event->hangoutLink ?? $jadwal->meet_link,
        //   ]);

        return $jadwal->load(['student', 'mentor']);
    }

    public function update(JadwalBimbingan $jadwal, array $validated): JadwalBimbingan
    {
        $studentChanged = (int) $validated['studentUserId'] !== (int) $jadwal->student_user_id;

        $jadwal->update([
            'title' => $validated['title'],
            'student_user_id' => $validated['studentUserId'],
            'student_institution' => $studentChanged
                ? $this->resolveInstitution((int) $validated['studentUserId'])
                : $jadwal->student_institution,
            'mentor_user_id' => $validated['mentorUserId'],
            'event_date' => $validated['date'],
            'event_time' => $validated['time'],
            'location' => $validated['location'] ?? null,
            'meet_link' => $validated['meetLink'] ?? null,
            'notes' => $validated['notes'] ?? null,
        ]);

        // TODO Google Calendar: bila $jadwal->google_calendar_event_id terisi,
        // perbarui event yang sama di Google Calendar.

        return $jadwal->fresh(['student', 'mentor']);
    }

    public function delete(JadwalBimbingan $jadwal): void
    {
        // TODO Google Calendar: bila $jadwal->google_calendar_event_id terisi,
        // hapus event di Google Calendar sebelum record ini dihapus.

        $jadwal->delete();
    }

    /**
     * Institusi diambil dari pendaftaran terbaru mahasiswa, lalu dari profil user.
     */
    private function resolveInstitution(int $userId): string
    {
        $fromApplication = Application::where('user_id', $userId)
            ->latest('submitted_at')
            ->value('university');

        if ($fromApplication) {
            return $fromApplication;
        }

        return User::whereKey($userId)->value('institution') ?? '';
    }
}