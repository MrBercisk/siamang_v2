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
        Schema::dropIfExists('logbooks');
    }

    public function down(): void
    {
        Schema::create('logbooks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->date('log_date');
            $table->text('activity');
            $table->string('status')->default('pending');
            $table->text('reviewer_notes')->nullable();
            $table->timestamps();
        });
    }
};