<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');

            // Role & profil SI AMANG
            // 'alumni' = pernah diterima magang & sudah selesai, boleh daftar periode baru lagi.
            // Disinkronkan otomatis oleh ApplicationObserver & BimbinganObserver
            $table->enum('role', ['applicant', 'intern', 'admin', 'mentor', 'alumni'])->default('applicant');
            $table->string('nim', 50)->nullable();          // NIM mahasiswa/siswa
            $table->string('institution')->nullable();       // Asal kampus/sekolah
            $table->string('major')->nullable();              // Jurusan
            $table->string('phone', 20)->nullable();          // Nomor HP
            $table->text('address')->nullable();               // Alamat lengkap
            $table->string('avatar_url', 500)->nullable();    // URL foto profil
            $table->string('semester', 10)->nullable();       // Semester aktif
            $table->decimal('ipk', 3, 2)->nullable();          // IPK
            $table->text('skills')->nullable();                 // Keahlian
            $table->text('tools')->nullable();                  // Tools yang dikuasai
            $table->string('nip', 30)->nullable();             // NIP (mentor/pegawai)

            $table->rememberToken();
            $table->timestamps();
        });

        Schema::create('password_reset_tokens', function (Blueprint $table) {
            $table->string('email')->primary();
            $table->string('token');
            $table->timestamp('created_at')->nullable();
        });

        Schema::create('sessions', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->foreignId('user_id')->nullable()->index();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->longText('payload');
            $table->integer('last_activity')->index();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
        Schema::dropIfExists('password_reset_tokens');
        Schema::dropIfExists('sessions');
    }
};
