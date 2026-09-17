<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * ASUMSI: kolom nip, position, status BELUM ada di tabel `users`.
 * Migration ini pakai Schema::hasColumn() supaya aman dijalankan meskipun
 * ternyata sebagian kolom sudah ada — kolom yang sudah ada akan dilewati.
 * Kalau nama kolom aslinya beda (mis. sudah ada `jabatan` bukan `position`),
 * sesuaikan dulu sebelum migrate, dan sesuaikan juga MentorController &
 * frontend types/mentor.ts.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            if (! Schema::hasColumn('users', 'position')) {
                $table->string('position')->nullable()->after('nip');
            }
            if (! Schema::hasColumn('users', 'status')) {
                $table->string('status')->default('Aktif')->after('position');
            }
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            foreach (['position', 'status'] as $column) {
                if (Schema::hasColumn('users', $column)) {
                    $table->dropColumn($column);
                }
            }
        });
    }
};