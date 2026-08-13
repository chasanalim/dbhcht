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

            if (!Schema::hasColumn('pendaftaran_banmods', 'file_surat_buruh')) {
                $table->string('file_surat_buruh')->nullable()->after('file_surat_disabilitas');
            }
            if (!Schema::hasColumn('pendaftaran_banmods', 'file_surat_miskin')) {
                $table->string('file_surat_miskin')->nullable()->after('file_surat_disabilitas');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('pendaftaran_banmods', function (Blueprint $table) {
            foreach (['file_surat_buruh', 'file_surat_miskin'] as $column) {
                if (Schema::hasColumn('pendaftaran_banmods', $column)) {
                    $table->dropColumn($column);
                }
            }
        });
    }
};
