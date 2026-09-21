<?php

namespace App\Services;

use App\Models\Application;
use App\Models\JadwalBimbingan;
use App\Models\User;
use Carbon\CarbonImmutable;
use Google\Service\Calendar\Event;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use RuntimeException;
use Throwable;

class JadwalBimbinganService
{
    public function __construct(
        private GoogleCalendarService $google
    ) {}

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

        if (! empty($validated['syncGoogleCalendar'])) {
            $this->pushToGoogle($jadwal);
        }

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

        $jadwal = $jadwal->fresh(['student', 'mentor']);

        $this->pushUpdateToGoogle($jadwal);

        return $jadwal;
    }

    public function delete(JadwalBimbingan $jadwal): void
    {
        // Sengaja TIDAK di-try/catch: bila event gagal dihapus di Google, record lokal
        // dipertahankan. Kalau tidak, sync berikutnya akan menarik event itu kembali.
        if ($jadwal->google_calendar_event_id && $this->google->isConfigured()) {
            $this->google->deleteEvent($jadwal->google_calendar_event_id);
        }

        $jadwal->delete();
    }

    // =========================================================================
    // Google Calendar -> SIAMANG (tombol "Tarik dari Google Calendar")
    // =========================================================================

    /**
     * Tarik event dari Google Calendar lalu upsert ke tabel jadwal_bimbingan
     * berdasarkan google_calendar_event_id. Idempoten: aman dijalankan berulang.
     *
     * @return array{created:int,updated:int,deleted:int,skipped:array<int,array{title:string,reason:string}>}
     *
     * @throws RuntimeException bila integrasi belum dikonfigurasi
     * @throws \Google\Service\Exception bila Google API menolak (kalender tidak dibagikan, dll.)
     */
    public function syncFromGoogle(): array
    {
        if (! $this->google->isConfigured()) {
            throw new RuntimeException('Integrasi Google Calendar belum dikonfigurasi di server.');
        }

        $from = now()->subDays((int) config('services.google_calendar.sync_past_days', 30))->startOfDay();
        $to = now()->addDays((int) config('services.google_calendar.sync_future_days', 180))->endOfDay();

        $summary = ['created' => 0, 'updated' => 0, 'deleted' => 0, 'skipped' => []];

        foreach ($this->google->listEvents($from, $to) as $event) {
            [$action, $reason] = $this->importGoogleEvent($event);

            if ($action === 'skipped') {
                $summary['skipped'][] = [
                    'title' => $event->getSummary() ?: '(Tanpa judul)',
                    'reason' => $reason,
                ];
            } elseif ($action !== 'ignored') {
                $summary[$action]++;
            }
        }

        return $summary;
    }

    /**
     * @return array{0:string,1:?string} [aksi, alasan]; aksi = created|updated|deleted|skipped|ignored
     *   - skipped : event bimbingan yang tidak bisa dimasukkan (perlu tindakan admin)
     *   - ignored : bukan urusan bimbingan / tidak ada perubahan
     */
    private function importGoogleEvent(Event $event): array
    {
        $existing = JadwalBimbingan::where('google_calendar_event_id', $event->getId())->first();

        // Dihapus/dibatalkan di Google -> hapus juga di sini (model tidak memakai SoftDeletes).
        if ($event->getStatus() === 'cancelled') {
            if (! $existing) {
                return ['ignored', null];
            }

            $existing->delete();

            return ['deleted', null];
        }

        $schedule = $this->parseGoogleSchedule($event);

        // Event seharian / lintas hari (mis. hari libur) bukan jadwal bimbingan.
        if ($schedule === null) {
            return ['ignored', null];
        }

        [$studentId, $mentorId] = $this->matchParticipants($event);

        $attributes = [
            'title' => Str::limit($event->getSummary() ?: '(Tanpa judul)', 250, ''),
            'event_date' => $schedule['date'],
            'event_time' => $schedule['time'],
            'location' => $event->getLocation() ?: null,
            'meet_link' => $event->getHangoutLink() ?: $existing?->meet_link,
            'notes' => $this->cleanDescription($event->getDescription()),
            'google_calendar_synced' => true,
        ];

        if ($existing) {
            // Peserta hanya diganti bila kedua-duanya berhasil dicocokkan; kalau tidak,
            // data peserta yang sudah tersimpan dibiarkan.
            if ($studentId && $mentorId) {
                $attributes['student_user_id'] = $studentId;
                $attributes['mentor_user_id'] = $mentorId;

                if ($studentId !== (int) $existing->student_user_id) {
                    $attributes['student_institution'] = $this->resolveInstitution($studentId);
                }
            }

            $existing->fill($attributes);

            if (! $existing->isDirty()) {
                return ['ignored', null];
            }

            $existing->save();

            return ['updated', null];
        }

        if (! $studentId || ! $mentorId) {
            return ['skipped', 'Mahasiswa/mentor tidak dikenali. Tambahkan email mereka sebagai tamu event.'];
        }

        JadwalBimbingan::create($attributes + [
            'student_user_id' => $studentId,
            'student_institution' => $this->resolveInstitution($studentId),
            'mentor_user_id' => $mentorId,
            'google_calendar_event_id' => $event->getId(),
        ]);

        return ['created', null];
    }

    /**
     * Ubah waktu event Google ke zona waktu aplikasi dan format tabel ("HH:MM - HH:MM").
     * Null untuk event seharian atau yang melewati tengah malam.
     *
     * @return array{date:string,time:string}|null
     */
    private function parseGoogleSchedule(Event $event): ?array
    {
        $startRaw = $event->getStart()?->getDateTime();
        $endRaw = $event->getEnd()?->getDateTime();

        if (! $startRaw || ! $endRaw) {
            return null;
        }

        $timezone = $this->google->timezone();
        $start = CarbonImmutable::parse($startRaw)->setTimezone($timezone);
        $end = CarbonImmutable::parse($endRaw)->setTimezone($timezone);

        if (! $start->isSameDay($end)) {
            return null;
        }

        return [
            'date' => $start->format('Y-m-d'),
            'time' => $start->format('H:i') . ' - ' . $end->format('H:i'),
        ];
    }

    /**
     * Cocokkan email tamu event dengan user sistem.
     *  - Mahasiswa = tamu yang punya application 'accepted' (sama seperti options()).
     *  - Mentor    = tamu ber-role mentor; bila tidak ada, pakai mentor yang sudah
     *                ditugaskan di application mahasiswa (sama seperti auto-pilih di form).
     *
     * @return array{0:?int,1:?int} [studentUserId, mentorUserId]
     */
    private function matchParticipants(Event $event): array
    {
        $emails = collect($event->getAttendees() ?? [])
            ->map(fn ($attendee) => strtolower(trim((string) $attendee->getEmail())))
            ->filter()
            ->unique()
            ->values();

        if ($emails->isEmpty()) {
            return [null, null];
        }

        $users = User::whereIn(DB::raw('LOWER(email)'), $emails->all())->get();

        $application = Application::where('status', 'accepted')
            ->whereIn('user_id', $users->pluck('id'))
            ->latest('submitted_at')
            ->first();

        $studentId = $application?->user_id;
        $mentorId = $users->firstWhere('role', 'mentor')?->id ?? $application?->mentor_id;

        return [
            $studentId ? (int) $studentId : null,
            $mentorId ? (int) $mentorId : null,
        ];
    }

    /** Deskripsi Google bisa berisi HTML; simpan sebagai teks biasa. */
    private function cleanDescription(?string $description): ?string
    {
        if (! $description) {
            return null;
        }

        $text = preg_replace('/<br\s*\/?>/i', "\n", $description);
        $text = trim(html_entity_decode(strip_tags($text)));

        return $text !== '' ? $text : null;
    }

    // =========================================================================
    // SIAMANG -> Google Calendar (checkbox "Sinkronkan ke Google Calendar")
    // =========================================================================

    /**
     * Kegagalan Google tidak menggagalkan penyimpanan jadwal: record tetap tersimpan
     * dengan google_calendar_synced = false, dan frontend memberi tahu admin.
     * Bila ingin tidak menunggu Google API, pindahkan ke queued job.
     */
    private function pushToGoogle(JadwalBimbingan $jadwal): void
    {
        if (! $this->google->isConfigured()) {
            return;
        }

        try {
            $event = $this->google->createEvent($this->toGooglePayload($jadwal));

            $jadwal->update([
                'google_calendar_synced' => true,
                'google_calendar_event_id' => $event->getId(),
            ]);
        } catch (Throwable $e) {
            report($e);
        }
    }

    private function pushUpdateToGoogle(JadwalBimbingan $jadwal): void
    {
        if (! $jadwal->google_calendar_event_id || ! $this->google->isConfigured()) {
            return;
        }

        try {
            $this->google->updateEvent(
                $jadwal->google_calendar_event_id,
                $this->toGooglePayload($jadwal)
            );
        } catch (Throwable $e) {
            report($e);
        }
    }

    private function toGooglePayload(JadwalBimbingan $jadwal): array
    {
        $jadwal->loadMissing(['student', 'mentor']);

        [$startTime, $endTime] = explode(' - ', $jadwal->event_time);

        return [
            'title' => $jadwal->title,
            'date' => $jadwal->event_date->format('Y-m-d'),
            'startTime' => $startTime,
            'endTime' => $endTime,
            'location' => $jadwal->location,
            'description' => $jadwal->notes,
            'attendees' => array_values(array_filter([
                $jadwal->student?->email,
                $jadwal->mentor?->email,
            ])),
        ];
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