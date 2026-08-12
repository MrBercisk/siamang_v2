<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('periode', function (Blueprint $table) {
            $table->id();
            $table->string('name', 100)->nullable();       // e.g. "Periode 2 - 2026"
            $table->date('start_date');                     // Buka pendaftaran
            $table->date('end_date');                        // Tutup pendaftaran
            $table->date('announcement_date');               // Tanggal pengumuman
            $table->date('internship_start')->nullable();    // Mulai magang
            $table->date('internship_end')->nullable();      // Akhir magang
            $table->string('duration_info', 100)->nullable(); // e.g. "2 - 6 Bulan"
            $table->string('system_type', 50)->nullable();    // e.g. "Hybrid / Onsite"
            $table->boolean('is_active')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('periode');
    }
};
