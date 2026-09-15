<?php

namespace Tests\Feature;

use App\Models\Application;
use App\Models\Bidang;
use App\Models\DocumentFile;
use App\Models\Kategori;
use App\Models\Lowongan;
use App\Models\Periode;
use App\Models\TeamMember;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class ApplicationControllerTest extends TestCase
{
    use RefreshDatabase;

    private User $user;
    private Periode $periode;
    private Bidang $bidang;
    private Kategori $kategori;
    private Lowongan $lowongan;

    protected function setUp(): void
    {
        parent::setUp();

        Storage::fake('public');

        $this->user = User::factory()->create([
            'role' => 'applicant',
        ]);

        $this->periode = Periode::factory()->create([
            'is_active' => true,
            'application_sequence' => 0,
        ]);

       $this->bidang = Bidang::factory()->create();

        $this->kategori = Kategori::factory()->create([
            'bidang_id' => $this->bidang->id,
        ]);

        $this->lowongan = Lowongan::factory()->create([
            'periode_id' => $this->periode->id,
            'kategori_id' => $this->kategori->id,
            'is_active' => true,
            'kuota' => 5,
            'filled' => 0,
        ]);
    }

    public function test_user_dapat_melihat_daftar_application_miliknya(): void
    {
        $application = Application::factory()->create([
            'user_id' => $this->user->id,
            'periode_id' => $this->periode->id,
            'bidang_id' => $this->bidang->id,
            'kategori_id' => $this->kategori->id,
            'lowongan_id' => $this->lowongan->id,
            'registration_number' => 'MAG-2026-000001',
            'full_name' => 'Bimo Satrio',
            'status' => 'reviewing',
            'submitted_at' => now(),
        ]);

        $response = $this->actingAs($this->user, 'sanctum')
            ->getJson('/api/applications');

        $response->assertOk()
            ->assertJsonFragment([
                'id' => (string) $application->id,
                'registrationNumber' => 'MAG-2026-000001',
                'applicantName' => 'Bimo Satrio',
                'status' => 'reviewing',
            ]);
    }

    public function test_user_tidak_bisa_melihat_application_milik_user_lain(): void
    {
        $otherUser = User::factory()->create([
            'role' => 'applicant',
        ]);

        $application = Application::factory()->create([
            'user_id' => $otherUser->id,
            'periode_id' => $this->periode->id,
            'bidang_id' => $this->bidang->id,
            'kategori_id' => $this->kategori->id,
            'lowongan_id' => $this->lowongan->id,
            'registration_number' => 'MAG-2026-000001',
            'status' => 'reviewing',
        ]);

        $response = $this->actingAs($this->user, 'sanctum')
            ->getJson('/api/applications');

        $response->assertOk()
            ->assertJsonMissing([
                'registrationNumber' => $application->registration_number,
            ]);
    }

    public function test_user_yang_belum_login_tidak_bisa_mengakses_daftar_application(): void
    {
        $response = $this->getJson('/api/applications');

        $response->assertUnauthorized();
    }

    public function test_user_dapat_membuat_application_baru(): void
    {
        $payload = [
            'applicantName' => 'Bimo Satrio',
            'institution' => 'Universitas Contoh',
            'major' => 'Informatika',
            'nim' => '123456789',
            'phone' => '081234567890',
            'email' => $this->user->email,
            'projectTitle' => 'Sistem Informasi Magang',
            'skills' => 'Laravel, React, Vue',
            'tools' => 'VS Code, Docker',
            'semester' => '6',
            'fieldId' => $this->bidang->id,
            'fieldName' => $this->bidang->name,
            'kategoriName' => $this->kategori->name,
            'lowonganId' => $this->lowongan->id,
            'registrationType' => 'Individu',
            'isDeclared' => true,
        ];

        $response = $this->actingAs($this->user, 'sanctum')
            ->postJson('/api/applications', $payload);

        $response->assertCreated()
            ->assertJsonPath('message', 'Pendaftaran berhasil dikirim.')
            ->assertJsonPath('data.applicantName', 'Bimo Satrio')
            ->assertJsonPath('data.status', 'reviewing')
            ->assertJsonPath('data.registrationType', 'Individu');

        $this->assertDatabaseHas('application', [
            'user_id' => $this->user->id,
            'periode_id' => $this->periode->id,
            'bidang_id' => $this->bidang->id,
            'kategori_id' => $this->kategori->id,
            'lowongan_id' => $this->lowongan->id,
            'full_name' => 'Bimo Satrio',
            'status' => 'reviewing',
        ]);

        $this->assertDatabaseHas('lowongan', [
            'id' => $this->lowongan->id,
            'filled' => 1,
        ]);

        $this->assertEquals(1, $this->periode->fresh()->application_sequence);
    }

    public function test_nomor_pendaftaran_digenerate_secara_otomatis(): void
    {
        $payload = [
            'applicantName' => 'Bimo Satrio',
            'fieldName' => $this->bidang->name,
            'kategoriName' => $this->kategori->name,
            'lowonganId' => $this->lowongan->id,
            'isDeclared' => true,
        ];

        $response = $this->actingAs($this->user, 'sanctum')
            ->postJson('/api/applications', $payload);

        $response->assertCreated();

        $application = Application::where('user_id', $this->user->id)
            ->firstOrFail();

        $this->assertEquals(
            'MAG-' . $this->periode->start_date->format('Y') . '-000001',
            $application->registration_number
        );
    }

    public function test_user_tidak_bisa_mendaftar_lagi_saat_application_masih_reviewing(): void
    {
        Application::factory()->create([
            'user_id' => $this->user->id,
            'registration_number' => 'MAG-2026-000001',
            'status' => 'reviewing',
            'submitted_at' => now(),
        ]);

        $payload = [
            'applicantName' => 'Pendaftaran Kedua',
            'fieldName' => $this->bidang->name,
            'kategoriName' => $this->kategori->name,
            'lowonganId' => $this->lowongan->id,
            'isDeclared' => true,
        ];

        $response = $this->actingAs($this->user, 'sanctum')
            ->postJson('/api/applications', $payload);

        $response->assertUnprocessable()
            ->assertJsonValidationErrors('application');
    }

    public function test_user_tidak_bisa_mendaftar_lagi_saat_masih_menjalani_magang(): void
    {
        Application::factory()->create([
            'user_id' => $this->user->id,
            'registration_number' => 'MAG-2026-000001',
            'status' => 'accepted',
            'internship_end' => now()->addDays(10),
            'submitted_at' => now(),
        ]);

        $payload = [
            'applicantName' => 'Pendaftaran Kedua',
            'fieldName' => $this->bidang->name,
            'kategoriName' => $this->kategori->name,
            'lowonganId' => $this->lowongan->id,
            'isDeclared' => true,
        ];

        $response = $this->actingAs($this->user, 'sanctum')
            ->postJson('/api/applications', $payload);

        $response->assertUnprocessable()
            ->assertJsonValidationErrors('application');
    }

    public function test_user_boleh_mendaftar_lagi_setelah_application_ditolak(): void
    {
        Application::factory()->create([
            'user_id' => $this->user->id,
            'registration_number' => 'MAG-2026-000001',
            'status' => 'rejected',
            'submitted_at' => now()->subDays(10),
        ]);

        $this->periode->update([
            'application_sequence' => 1,
        ]);

        $payload = [
            'applicantName' => 'Pendaftaran Baru',
            'fieldName' => $this->bidang->name,
            'kategoriName' => $this->kategori->name,
            'lowonganId' => $this->lowongan->id,
            'isDeclared' => true,
        ];

        $response = $this->actingAs($this->user, 'sanctum')
            ->postJson('/api/applications', $payload);

        $response->assertCreated();
    }

    public function test_application_dengan_team_members_menyimpan_data_anggota_tim(): void
    {
        $payload = [
            'applicantName' => 'Bimo Satrio',
            'fieldName' => $this->bidang->name,
            'kategoriName' => $this->kategori->name,
            'lowonganId' => $this->lowongan->id,
            'registrationType' => 'Kelompok',
            'isDeclared' => true,
            'teamMembers' => [
                [
                    'fullName' => 'Anggota Satu',
                    'email' => 'anggota1@example.com',
                    'phone' => '081234567890',
                    'nim' => '111111',
                ],
                [
                    'fullName' => 'Anggota Dua',
                    'email' => 'anggota2@example.com',
                    'phone' => '081234567891',
                    'nim' => '222222',
                ],
            ],
        ];

        $response = $this->actingAs($this->user, 'sanctum')
            ->postJson('/api/applications', $payload);

        $response->assertCreated();

        $application = Application::where('user_id', $this->user->id)
            ->firstOrFail();

       $this->assertDatabaseHas('team_member', [
            'application_id' => $application->id,
            'full_name' => 'Anggota Satu',
            'email' => 'anggota1@example.com',
            'nim' => '111111',
        ]);

       $this->assertDatabaseHas('team_member', [
            'application_id' => $application->id,
            'full_name' => 'Anggota Dua',
            'email' => 'anggota2@example.com',
            'nim' => '222222',
        ]);
    }

    public function test_application_dapat_menyimpan_dokumen(): void
    {
        $file = UploadedFile::fake()->create(
            'surat-permohonan.pdf',
            500,
            'application/pdf'
        );

        $payload = [
            'applicantName' => 'Bimo Satrio',
            'fieldName' => $this->bidang->name,
            'kategoriName' => $this->kategori->name,
            'lowonganId' => $this->lowongan->id,
            'isDeclared' => true,
            'documents' => [
                [
                    'document_type' => 'surat_permohonan',
                    'file' => $file,
                ],
            ],
        ];

        $response = $this->actingAs($this->user, 'sanctum')
            ->post('/api/applications', $payload);

        $response->assertCreated();

        $application = Application::where('user_id', $this->user->id)
            ->firstOrFail();

        $document = DocumentFile::where(
            'application_id',
            $application->id
        )->firstOrFail();

        $this->assertEquals(
            'surat_permohonan',
            $document->document_type
        );

       $this->assertTrue(
            Storage::disk('public')->exists($document->file_path)
        );
    }

    public function test_validasi_application_gagal_jika_field_wajib_tidak_lengkap(): void
    {
        $response = $this->actingAs($this->user, 'sanctum')
            ->postJson('/api/applications', []);

        $response->assertUnprocessable()
            ->assertJsonValidationErrors([
                'applicantName',
                'fieldName',
                'kategoriName',
                'lowonganId',
                'isDeclared',
            ]);
    }

    public function test_application_gagal_jika_lowongan_tidak_aktif(): void
    {
        $this->lowongan->update([
            'is_active' => false,
        ]);

        $payload = [
            'applicantName' => 'Bimo Satrio',
            'fieldName' => $this->bidang->name,
            'kategoriName' => $this->kategori->name,
            'lowonganId' => $this->lowongan->id,
            'isDeclared' => true,
        ];

        $response = $this->actingAs($this->user, 'sanctum')
            ->postJson('/api/applications', $payload);

        $response->assertUnprocessable()
            ->assertJsonValidationErrors('lowonganId');
    }

    public function test_application_gagal_jika_kuota_lowongan_sudah_penuh(): void
    {
        $this->lowongan->update([
            'filled' => $this->lowongan->kuota,
        ]);

        $payload = [
            'applicantName' => 'Bimo Satrio',
            'fieldName' => $this->bidang->name,
            'kategoriName' => $this->kategori->name,
            'lowonganId' => $this->lowongan->id,
            'isDeclared' => true,
        ];

        $response = $this->actingAs($this->user, 'sanctum')
            ->postJson('/api/applications', $payload);

        $response->assertUnprocessable()
            ->assertJsonValidationErrors('lowonganId');
    }

    public function test_tracking_application_dapat_ditemukan_dengan_nomor_pendaftaran_dan_email(): void
    {
        $application = Application::factory()->create([
            'user_id' => $this->user->id,
            'periode_id' => $this->periode->id,
            'bidang_id' => $this->bidang->id,
            'kategori_id' => $this->kategori->id,
            'lowongan_id' => $this->lowongan->id,
            'registration_number' => 'MAG-2026-000001',
            'email' => 'bimo@example.com',
            'status' => 'reviewing',
        ]);

        $response = $this->getJson('/api/applications/track?' . http_build_query([
            'registration_number' => $application->registration_number,
            'email' => $application->email,
        ]));

        $response->assertOk()
            ->assertJsonFragment([
                'registrationNumber' => 'MAG-2026-000001',
            ]);
    }

    public function test_tracking_application_gagal_jika_nomor_pendaftaran_atau_email_salah(): void
    {
        Application::factory()->create([
            'user_id' => $this->user->id,
            'registration_number' => 'MAG-2026-000001',
            'email' => 'bimo@example.com',
            'status' => 'reviewing',
        ]);

        $response = $this->getJson('/api/applications/track?' . http_build_query([
            'registration_number' => 'MAG-2026-999999',
            'email' => 'salah@example.com',
        ]));

        $response->assertNotFound()
            ->assertJson([
                'message' => 'Data pendaftaran tidak ditemukan. Periksa kembali nomor pendaftaran dan email Anda.',
            ]);
    }

    public function test_tracking_application_memerlukan_nomor_pendaftaran_dan_email(): void
    {
        $response = $this->getJson('/api/applications/track');

        $response->assertUnprocessable()
            ->assertJsonValidationErrors([
                'registration_number',
                'email',
            ]);
    }
}
