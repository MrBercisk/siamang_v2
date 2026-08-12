<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('document_files', function (Blueprint $table) {
            $table->id();
            $table->foreignId('application_id')->constrained('application')->cascadeOnDelete();
            $table->enum('document_type', [
                'pas_foto',           // Pas Foto 3x4
                'berkas_persyaratan', // Gabungan semua berkas (PDF)
                'surat_permohonan',   // Surat pengantar dari kampus
                'proposal',           // Proposal/rencana magang
                'nda',                // NDA
                'cv_portofolio',      // CV & Portofolio
                'transkrip_nilai',    // Transkrip/KHS
            ]);
            $table->string('original_name', 500)->nullable();
            $table->string('file_path', 1000);
            $table->integer('file_size')->nullable();  // bytes
            $table->string('mime_type', 100)->nullable();
            $table->enum('status', ['uploaded', 'verified', 'rejected'])->default('uploaded');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('document_files');
    }
};
