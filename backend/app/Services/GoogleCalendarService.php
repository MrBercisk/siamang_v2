<?php

namespace App\Services;

use Carbon\CarbonInterface;
use Google\Client as GoogleClient;
use Google\Service\Calendar as GoogleCalendar;
use Google\Service\Calendar\Event;
use Google\Service\Exception as GoogleServiceException;
use RuntimeException;

/**
 * Pembungkus tipis Google Calendar API untuk satu kalender bersama milik instansi.
 *
 * Autentikasi memakai service account: kalender dibagikan ke email service account
 * (izin "Make changes to events"), lalu ID kalender diisi di .env.
 *
 * Catatan: service account biasa TIDAK bisa mengundang tamu (attendees). Undangan ke
 * mahasiswa & mentor baru berfungsi bila domain-wide delegation aktif dan
 * GOOGLE_CALENDAR_IMPERSONATE diisi (lihat canInvite()).
 */
class GoogleCalendarService
{
    private ?GoogleCalendar $calendar = null;

    public function isConfigured(): bool
    {
        $credentials = config('services.google_calendar.credentials');

        return filled(config('services.google_calendar.calendar_id'))
            && filled($credentials)
            && is_file($credentials);
    }

    public function canInvite(): bool
    {
        return filled(config('services.google_calendar.impersonate'));
    }

    public function timezone(): string
    {
        return config('services.google_calendar.timezone', 'Asia/Jakarta');
    }

    /**
     * Semua event pada rentang waktu. Event berulang diurai jadi kejadian tunggal,
     * dan event yang dibatalkan ikut dikembalikan (status "cancelled").
     *
     * @return Event[]
     */
    public function listEvents(CarbonInterface $from, CarbonInterface $to): array
    {
        $events = [];
        $pageToken = null;

        do {
            $params = [
                'timeMin' => $from->toRfc3339String(),
                'timeMax' => $to->toRfc3339String(),
                'singleEvents' => true,
                'showDeleted' => true,
                'orderBy' => 'startTime',
                'maxResults' => 250,
            ];

            if ($pageToken) {
                $params['pageToken'] = $pageToken;
            }

            $result = $this->calendar()->events->listEvents($this->calendarId(), $params);

            foreach ($result->getItems() as $event) {
                $events[] = $event;
            }

            $pageToken = $result->getNextPageToken();
        } while ($pageToken);

        return $events;
    }

    /**
     * @param array{title:string,date:string,startTime:string,endTime:string,location?:?string,description?:?string,attendees?:string[]} $data
     */
    public function createEvent(array $data): Event
    {
        return $this->calendar()->events->insert(
            $this->calendarId(),
            $this->buildEvent($data),
            ['sendUpdates' => 'all']
        );
    }

    /** Patch: field yang tidak dikirim (mis. tamu yang ditambah manual di Google) tidak disentuh. */
    public function updateEvent(string $eventId, array $data): Event
    {
        return $this->calendar()->events->patch(
            $this->calendarId(),
            $eventId,
            $this->buildEvent($data),
            ['sendUpdates' => 'all']
        );
    }

    public function deleteEvent(string $eventId): void
    {
        try {
            $this->calendar()->events->delete($this->calendarId(), $eventId, ['sendUpdates' => 'all']);
        } catch (GoogleServiceException $e) {
            // 404/410 = event sudah tidak ada di Google, anggap berhasil.
            if (! in_array($e->getCode(), [404, 410], true)) {
                throw $e;
            }
        }
    }

    private function buildEvent(array $data): Event
    {
        $timezone = $this->timezone();

        $payload = [
            'summary' => $data['title'],
            // String kosong (bukan null) supaya nilai lama benar-benar terhapus saat patch.
            'location' => $data['location'] ?? '',
            'description' => $data['description'] ?? '',
            'start' => [
                'dateTime' => "{$data['date']}T{$data['startTime']}:00",
                'timeZone' => $timezone,
            ],
            'end' => [
                'dateTime' => "{$data['date']}T{$data['endTime']}:00",
                'timeZone' => $timezone,
            ],
        ];

        if ($this->canInvite() && ! empty($data['attendees'])) {
            $payload['attendees'] = array_map(
                fn (string $email) => ['email' => $email],
                $data['attendees']
            );
        }

        return new Event($payload);
    }

    private function calendarId(): string
    {
        return (string) config('services.google_calendar.calendar_id');
    }

    private function calendar(): GoogleCalendar
    {
        if ($this->calendar) {
            return $this->calendar;
        }

        if (! $this->isConfigured()) {
            throw new RuntimeException('Integrasi Google Calendar belum dikonfigurasi di server.');
        }

        $client = new GoogleClient();
        $client->setApplicationName(config('app.name'));
        $client->setAuthConfig(config('services.google_calendar.credentials'));
        $client->setScopes([GoogleCalendar::CALENDAR]);

        if ($this->canInvite()) {
            $client->setSubject(config('services.google_calendar.impersonate'));
        }

        return $this->calendar = new GoogleCalendar($client);
    }
}