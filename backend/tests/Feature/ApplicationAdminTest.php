<?php

namespace Tests\Feature;

use App\Models\Application;
use App\Models\Bimbingan;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ApplicationAdminTest extends TestCase
{
    use RefreshDatabase;

    private User $admin;
    private User $mentor;
    private User $pendaftar;
    private Application $application;

    protected function setUp(): void
    {
        parent::setUp();

        $this->admin = User::factory()->create(['role' => 'admin']);
        $this->mentor = User::factory()->create(['role' => 'mentor']);
        $this->pendaftar = User::factory()->create(['role' => 'applicant']);

        $this->application = Application::factory()->create([
            'user_id' => $this->pendaftar->id,
            'status' => 'reviewing',
            'mentor_id' => null,
        ]);
    }

    public function test_admin_dapat_melihat_daftar_mentor_yang_tersedia(): void
    {
        $response = $this->actingAs($this->admin, 'sanctum')
            ->getJson("/api/admin/applications/{$this->application->id}/available-mentors");

        $response->assertOk()
            ->assertJsonFragment([
                'id' => $this->mentor->id,
            ]);
    }

    public function test_admin_dapat_assign_mentor_ke_application(): void
    {
        $response = $this->actingAs($this->admin, 'sanctum')
            ->patchJson("/api/admin/applications/{$this->application->id}/mentor", [
                'mentor_id' => $this->mentor->id,
            ]);

        $response->assertOk();

        $this->assertDatabaseHas('application', [
            'id' => $this->application->id,
            'mentor_id' => $this->mentor->id,
        ]);
    }

    public function test_assign_mentor_gagal_kalau_user_yang_dipilih_bukan_role_mentor(): void
    {
        $bukanMentor = User::factory()->create(['role' => 'applicant']);

        $response = $this->actingAs($this->admin, 'sanctum')
            ->patchJson("/api/admin/applications/{$this->application->id}/mentor", [
                'mentor_id' => $bukanMentor->id,
            ]);

        $response->assertUnprocessable()
            ->assertJsonValidationErrors('mentor_id');

        $this->assertDatabaseMissing('application', [
            'id' => $this->application->id,
            'mentor_id' => $bukanMentor->id,
        ]);
    }

    public function test_status_tidak_bisa_diubah_ke_accepted_tanpa_mentor_id(): void
    {
        // application belum punya mentor_id sama sekali (lihat setUp)
        $response = $this->actingAs($this->admin, 'sanctum')
            ->patchJson("/api/admin/applications/{$this->application->id}/status", [
                'status' => 'accepted',
            ]);

        $response->assertUnprocessable()
            ->assertJsonValidationErrors('mentor_id');

        $this->application->refresh();

        $this->assertEquals('reviewing', $this->application->status);
        $this->assertDatabaseMissing('bimbingan', [
            'application_id' => $this->application->id,
        ]);
    }

    public function test_status_accepted_dengan_mentor_id_membuat_bimbingan_otomatis(): void
    {
        $response = $this->actingAs($this->admin, 'sanctum')
            ->patchJson("/api/admin/applications/{$this->application->id}/status", [
                'status' => 'accepted',
                'mentor_id' => $this->mentor->id,
            ]);

        $response->assertOk();

        $this->application->refresh();

        $this->assertEquals('accepted', $this->application->status);
        $this->assertNotNull($this->application->accepted_at);

        $this->assertDatabaseHas('bimbingan', [
            'application_id' => $this->application->id,
            'mentor_id' => $this->mentor->id,
            'status' => 'On Progress',
        ]);
    }

    public function test_role_user_pendaftar_berubah_jadi_intern_setelah_accepted(): void
    {
        $this->actingAs($this->admin, 'sanctum')
            ->patchJson("/api/admin/applications/{$this->application->id}/status", [
                'status' => 'accepted',
                'mentor_id' => $this->mentor->id,
            ]);

        $this->pendaftar->refresh();

        $this->assertEquals('intern', $this->pendaftar->role);
    }

    public function test_role_user_kembali_ke_applicant_setelah_ditolak_dan_tidak_ada_acceptance_lain(): void
    {
        // Set intern dulu (simulasikan sudah pernah diterima sebelumnya)
        $this->pendaftar->update(['role' => 'intern']);

        $response = $this->actingAs($this->admin, 'sanctum')
            ->patchJson("/api/admin/applications/{$this->application->id}/status", [
                'status' => 'rejected',
            ]);

        $response->assertOk();

        $this->pendaftar->refresh();

        $this->assertEquals('applicant', $this->pendaftar->role);
    }

    public function test_non_admin_tidak_bisa_akses_endpoint_admin(): void
    {
        $response = $this->actingAs($this->pendaftar, 'sanctum')
            ->getJson('/api/admin/applications');

        $response->assertForbidden();
    }

    public function test_bimbingan_tidak_dibuat_dua_kali_kalau_status_diubah_berkali_kali(): void
    {
        $this->actingAs($this->admin, 'sanctum')
            ->patchJson("/api/admin/applications/{$this->application->id}/status", [
                'status' => 'accepted',
                'mentor_id' => $this->mentor->id,
            ]);

        // Update lagi (misal ganti admin_notes) tanpa ganti status sebenarnya
        $this->actingAs($this->admin, 'sanctum')
            ->patchJson("/api/admin/applications/{$this->application->id}/status", [
                'status' => 'accepted',
                'mentor_id' => $this->mentor->id,
                'admin_notes' => 'Catatan tambahan',
            ]);

        $this->assertEquals(
            1,
            Bimbingan::where('application_id', $this->application->id)->count()
        );
    }
}