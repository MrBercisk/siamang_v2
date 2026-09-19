<?php

namespace App\Notifications;

use App\Models\Application;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ApplicationStatusUpdated extends Notification
{
    use Queueable;

    public function __construct(private Application $application) {}

    public function via($notifiable): array
    {
        return ['mail'];
    }

    public function toMail($notifiable): MailMessage
    {
        return match ($this->application->status) {
            'accepted' => $this->acceptedMail(),
            'rejected' => $this->rejectedMail(),
            default => $this->genericMail(),
        };
    }

    private function acceptedMail(): MailMessage
    {
        $app = $this->application;
        $frontendUrl = rtrim(config('app.frontend_url'), '/');

        $mail = (new MailMessage)
            ->subject('Pemberitahuan Hasil Seleksi Magang - DISKOMINFOSAN Kota Yogyakarta')
            ->greeting('Yth. Sdr/i ' . $app->full_name . ',')
            ->line('Sehubungan dengan proses seleksi penerimaan peserta magang pada Dinas Komunikasi, Informatika, dan Persandian (DISKOMINFOSAN) Kota Yogyakarta, dengan ini kami sampaikan bahwa pendaftaran Saudara/i dengan nomor registrasi **' . $app->registration_number . '** dinyatakan **DITERIMA**.')
            ->line('Berikut kami sampaikan rincian penempatan magang Saudara/i:')
            ->line('Kategori Bidang Magang: ' . ($app->kategori->name ?? '-'))
            ->line('Periode Pelaksanaan: ' . optional($app->internship_start)->format('d F Y') . ' s.d. ' . optional($app->internship_end)->format('d F Y'));

        if ($app->bimbingan && $app->bimbingan->mentor) {
            $mail->line('Mentor Pembimbing: ' . $app->bimbingan->mentor->name);
        }

        if ($app->admin_notes) {
            $mail->line('Catatan dari Panitia: ' . $app->admin_notes);
        }

        return $mail
            ->line('Informasi lebih lanjut mengenai jadwal orientasi dan kelengkapan administrasi akan disampaikan melalui dashboard akun SIAMANG Saudara/i. Kami mohon agar Saudara/i secara berkala memeriksa dashboard tersebut.')
            ->action('Buka Dashboard SIAMANG', $frontendUrl . '/dashboard')
            ->salutation('Hormat kami,  
                Panitia Penerimaan Magang  
                DISKOMINFOSAN Kota Yogyakarta');
    }

    private function rejectedMail(): MailMessage
    {
        $app = $this->application;
        $frontendUrl = rtrim(config('app.frontend_url'), '/');

        $mail = (new MailMessage)
            ->subject('Pemberitahuan Hasil Seleksi Magang - DISKOMINFOSAN Kota Yogyakarta')
            ->greeting('Yth. Sdr/i ' . $app->full_name . ',')
            ->line('Sehubungan dengan proses seleksi penerimaan peserta magang pada Dinas Komunikasi, Informatika, dan Persandian(DISKOMINFOSAN) Kota Yogyakarta, dengan ini kami sampaikan bahwa pendaftaran Saudara/i dengan nomor registrasi **' . $app->registration_number . '** belum dapat kami setujui pada periode ini.');

        if ($app->admin_notes) {
            $mail->line('Catatan dari Panitia: ' . $app->admin_notes);
        }

        return $mail
            ->line('Keputusan ini diambil berdasarkan pertimbangan kuota, kesesuaian bidang, dan hasil seleksi administrasi yang telah dilakukan oleh panitia. Kami mengapresiasi minat dan kesediaan Saudara/i untuk bergabung dalam program magang ini, dan Saudara/i tetap berkesempatan untuk mendaftar kembali pada pembukaan periode magang berikutnya.')
            ->action('Lihat Informasi Pendaftaran', $frontendUrl . '/dashboard')
            ->salutation('Hormat kami,  
                Panitia Penerimaan Magang  
                DISKOMINFOSAN Kota Yogyakarta');
    }

    private function genericMail(): MailMessage
    {
        $app = $this->application;

        return (new MailMessage)
            ->subject('Pemberitahuan Perubahan Status Pendaftaran - DISKOMINFOSAN Kota Yogyakarta')
            ->greeting('Yth. Sdr/i ' . $app->full_name . ',')
            ->line('Status pendaftaran magang Saudara/i dengan nomor registrasi **' . $app->registration_number . '** telah diperbarui menjadi: ' . $app->status . '.')
            ->salutation('Hormat kami,  
                    Panitia Penerimaan Magang  
                    DISKOMINFOSAN Kota Yogyakarta');
    }
}