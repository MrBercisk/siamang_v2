<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('progress_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('bimbingan_id')->constrained('bimbingan')->cascadeOnDelete();
            $table->string('judul_project', 500)->nullable();
            $table->date('tanggal_bimbingan');
            $table->text('pencapaian');
            $table->text('catatan')->nullable();          // Catatan/feedback mentor
            $table->string('file_presentasi', 1000)->nullable();
            $table->string('file_name', 500)->nullable();
            $table->timestamp('tanggal_upload')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('progress_items');
    }
};
