<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('laporan', function (Blueprint $table) {
            $table->id();
            $table->foreignId('bimbingan_id')->constrained('bimbingan')->cascadeOnDelete();
            $table->string('judul_laporan', 500);
            $table->string('file_laporan', 1000)->nullable();
            $table->string('file_laporan_name', 500)->nullable();
            $table->string('link_google_drive', 1000)->nullable();
            $table->string('form_nilai', 1000)->nullable();
            $table->string('form_nilai_name', 500)->nullable();
            $table->enum('status', ['pending', 'ditolak', 'diterima'])->default('pending');
            $table->text('catatan_reject')->nullable();
            $table->timestamp('tanggal_upload')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('laporan');
    }
};
