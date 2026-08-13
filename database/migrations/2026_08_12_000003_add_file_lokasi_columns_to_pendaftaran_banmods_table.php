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
        Schema::table('pendaftaran_banmods', function (Blueprint $table) {
            if (!Schema::hasColumn('pendaftaran_banmods', 'file_lokasi_usaha')) {
                $table->string('file_lokasi_usaha')->nullable()->after('file_sertifikat_pelatihan');
            }
            if (!Schema::hasColumn('pendaftaran_banmods', 'file_surat_disabilitas')) {
                $table->string('file_surat_disabilitas')->nullable()->after('file_lokasi_usaha');
            }
            // Kolom listrik dihapus dari form; jadikan nullable agar pendaftaran baru tanpa daya_listrik tetap bisa disimpan
            if (Schema::hasColumn('pendaftaran_banmods', 'daya_listrik')) {
                $table->string('daya_listrik')->nullable()->change();
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('pendaftaran_banmods', function (Blueprint $table) {
            foreach (['file_lokasi_usaha', 'file_surat_disabilitas'] as $column) {
                if (Schema::hasColumn('pendaftaran_banmods', $column)) {
                    $table->dropColumn($column);
                }
            }
        });
    }
};
