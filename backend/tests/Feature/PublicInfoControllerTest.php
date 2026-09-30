<?php

namespace Tests\Feature;

use Tests\TestCase;

class PublicInfoControllerTest extends TestCase
{
    public function test_persyaratan_pendaftaran_dapat_dibaca_tanpa_login(): void
    {
        $this->getJson('/api/public/requirements')
            ->assertOk()
            ->assertJsonPath('data.documents.0.required', true)
            ->assertJsonPath('data.documents.0.maxSize', '200 KB')
            ->assertJsonPath('data.documents.4.required', false)
            ->assertJsonCount(5, 'data.steps');
    }

    public function test_kontak_resmi_dapat_dibaca_tanpa_login(): void
    {
        $this->getJson('/api/public/contact')
            ->assertOk()
            ->assertJsonPath('data.officePhone', '(0274) 515865')
            ->assertJsonPath('data.email', 'kominfosandi@jogjakota.go.id');
    }
}