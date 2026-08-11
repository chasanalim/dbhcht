<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     *
     * Menambahkan kolom peran_ekraf (pemilik_usaha / pekerja) ke
     * pelatihan_ekonomi_kreatif, lalu backfill data lama berdasarkan
     * isi berkas yang sudah ada:
     * - file_nib terisi            -> pemilik_usaha
     * - file_surat_pekerja_ekraf terisi -> pekerja
     * - keduanya terisi / kosong    -> tetap NULL (diisi manual oleh admin)
     */
    public function up(): void
    {
        if (!Schema::hasColumn('pelatihan_ekonomi_kreatif', 'peran_ekraf')) {
            Schema::table('pelatihan_ekonomi_kreatif', function (Blueprint $table) {
                $table->enum('peran_ekraf', ['pemilik_usaha', 'pekerja'])
                    ->nullable()
                    ->after('jenis_pelatihan')
                    ->comment('Peran pendaftar: pemilik usaha atau pekerja ekonomi kreatif');

                $table->index('peran_ekraf');
            });
        }

        // Backfill idempoten: hanya record yang masih NULL
        DB::table('pelatihan_ekonomi_kreatif')
            ->whereNull('peran_ekraf')
            ->whereNotNull('file_nib')
            ->where('file_nib', '!=', '')
            ->update(['peran_ekraf' => 'pemilik_usaha']);

        DB::table('pelatihan_ekonomi_kreatif')
            ->whereNull('peran_ekraf')
            ->whereNotNull('file_surat_pekerja_ekraf')
            ->where('file_surat_pekerja_ekraf', '!=', '')
            ->update(['peran_ekraf' => 'pekerja']);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('pelatihan_ekonomi_kreatif', function (Blueprint $table) {
            $table->dropIndex(['peran_ekraf']);
            $table->dropColumn('peran_ekraf');
        });
    }
};