<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('bimbingan', function (Blueprint $table) {
            $table->id();
            $table->foreignId('application_id')->constrained('application')->cascadeOnDelete();
            $table->foreignId('mentor_id')->constrained('users');
            $table->string('judul_project', 500)->nullable();
            $table->enum('tipe_pendaftaran', ['Individu', 'Kelompok'])->default('Individu');
            $table->enum('status', ['On Progress', 'Selesai'])->default('On Progress');
            $table->integer('progress_percent')->default(0); // 0-100
            $table->timestamp('last_update')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('bimbingan');
    }
};
