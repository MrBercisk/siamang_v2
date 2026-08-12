<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('jadwal_bimbingan', function (Blueprint $table) {
            $table->id();
            $table->string('title', 500);
            $table->foreignId('student_user_id')->constrained('users');
            $table->string('student_institution')->nullable();
            $table->foreignId('mentor_user_id')->constrained('users');
            $table->date('event_date');
            $table->string('event_time', 50)->nullable();   // e.g. "09:00 - 10:30 WIB"
            $table->string('location', 500)->nullable();
            $table->string('meet_link', 1000)->nullable();
            $table->boolean('google_calendar_synced')->default(false);
            $table->string('google_calendar_event_id')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('jadwal_bimbingan');
    }
};
