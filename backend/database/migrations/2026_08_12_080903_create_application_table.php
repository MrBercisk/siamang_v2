<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('application', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('periode_id')->constrained('periode');
            $table->foreignId('lowongan_id')->nullable()->constrained('lowongan')->nullOnDelete();
            $table->foreignId('bidang_id')->constrained('bidang');
            $table->foreignId('kategori_id')->constrained('kategori');

            // Biodata Pengisi (Step 1)
            $table->string('full_name');
            $table->string('email');
            $table->string('phone', 20)->nullable();
            $table->text('address')->nullable();
            $table->string('university')->nullable();
            $table->string('major')->nullable();
            $table->string('semester', 10)->nullable();
            $table->string('nim', 50)->nullable();
            $table->decimal('ipk', 3, 2)->nullable();
            $table->text('skills')->nullable();
            $table->text('tools')->nullable();
            $table->string('project_title', 500)->nullable();

            // Step 2: Tipe Pendaftaran
            $table->enum('registration_type', ['Individu', 'Kelompok'])->default('Individu');

            // Jadwal Magang (opsional)
            $table->date('internship_start')->nullable();
            $table->date('internship_end')->nullable();

            // Status
            $table->enum('status', ['pending', 'reviewing', 'accepted', 'rejected'])->default('pending');
            $table->text('admin_notes')->nullable();
            $table->foreignId('mentor_id')->nullable()->constrained('users')->nullOnDelete();

            // Timestamps proses
            $table->timestamp('submitted_at')->nullable();
            $table->timestamp('reviewed_at')->nullable();
            $table->timestamp('accepted_at')->nullable();

            $table->timestamps();

            // Satu user hanya boleh punya 1 application per periode (boleh daftar lagi di periode lain).
            $table->unique(['user_id', 'periode_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('application');
    }
};
