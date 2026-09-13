<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Nama kolom enum yang diubah, disimpan sebagai konstanta supaya
     * up() dan down() selalu konsisten kalau daftar dokumen berubah lagi nanti.
     */
    private const TABLE = 'document_files';
    private const COLUMN = 'document_type';

    private const OLD_VALUES = [
        'pas_foto',
        'berkas_persyaratan',
        'surat_permohonan',
        'proposal',
        'nda',
        'cv_portofolio',
        'transkrip_nilai',
    ];

    private const NEW_VALUES = [
        'pas_foto',
        'berkas_persyaratan',
        'surat_permohonan',
        'proposal',
        'nda',
        'cv_portofolio',
        'transkrip_nilai',
        'video_perkenalan',
    ];

    public function up(): void
    {
        // Laravel/Doctrine tidak punya cara native untuk ALTER kolom ENUM,
        // jadi kita pakai raw SQL. MODIFY COLUMN aman untuk MySQL/MariaDB
        // karena tidak mengubah data yang sudah ada, hanya menambah pilihan.
        $enumList = $this->buildEnumList(self::NEW_VALUES);

        DB::statement(
            "ALTER TABLE `" . self::TABLE . "` MODIFY COLUMN `" . self::COLUMN . "` ENUM($enumList) NOT NULL"
        );
    }

    public function down(): void
    {
        // Sebelum menyempitkan enum lagi, pastikan tidak ada baris yang
        // sudah memakai nilai 'video_perkenalan' — kalau ada, migration
        // down ini akan gagal (sengaja, supaya tidak diam-diam kehilangan data).
        $stillUsed = DB::table(self::TABLE)
            ->where(self::COLUMN, 'video_perkenalan')
            ->exists();

        if ($stillUsed) {
            throw new \RuntimeException(
                "Tidak bisa rollback: masih ada baris document_files dengan document_type = 'video_perkenalan'. " .
                'Hapus atau ubah data tersebut terlebih dahulu.'
            );
        }

        $enumList = $this->buildEnumList(self::OLD_VALUES);

        DB::statement(
            "ALTER TABLE `" . self::TABLE . "` MODIFY COLUMN `" . self::COLUMN . "` ENUM($enumList) NOT NULL"
        );
    }

    private function buildEnumList(array $values): string
    {
        return collect($values)
            ->map(fn (string $value) => "'" . addslashes($value) . "'")
            ->implode(',');
    }
};