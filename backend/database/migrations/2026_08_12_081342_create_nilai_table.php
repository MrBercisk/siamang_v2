<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('nilai', function (Blueprint $table) {
            $table->id();
            $table->foreignId('bimbingan_id')->unique()->constrained('bimbingan')->cascadeOnDelete();
            $table->decimal('kehadiran', 4, 1)->default(0);
            $table->decimal('kemampuan_kerja', 4, 1)->default(0);
            $table->decimal('kualitas_kerja', 4, 1)->default(0);
            $table->decimal('kerjasama', 4, 1)->default(0);
            $table->decimal('inisiatif_kreativitas', 4, 1)->default(0);
            $table->decimal('disiplin', 4, 1)->default(0);

            // Kolom generated (rata-rata otomatis dihitung DB).
            // Catatan: generated column butuh dukungan driver (MySQL 5.7+/8, PostgreSQL 12+).
            $table->decimal('rata_rata', 4, 1)
                ->storedAs('(kehadiran + kemampuan_kerja + kualitas_kerja + kerjasama + inisiatif_kreativitas + disiplin) / 6');

            $table->string('predikat', 30)->nullable();
            $table->boolean('is_published')->default(false);
            $table->string('surat_keterangan_path', 1000)->nullable();
            $table->string('surat_keterangan_name', 500)->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('nilai');
    }
};
