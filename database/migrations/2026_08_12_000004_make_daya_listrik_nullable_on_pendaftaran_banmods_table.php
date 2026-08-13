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
        // Kolom listrik dihapus dari form; jadikan nullable agar pendaftaran baru tanpa daya_listrik tetap bisa disimpan
        Schema::table('pendaftaran_banmods', function (Blueprint $table) {
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
            if (Schema::hasColumn('pendaftaran_banmods', 'daya_listrik')) {
                $table->string('daya_listrik')->change();
            }
        });
    }
};
