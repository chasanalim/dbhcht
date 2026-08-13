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
            $table->string('desil', 10)->nullable()->after('kk');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('pendaftaran_banmods', function (Blueprint $table) {
            if (Schema::hasColumn('pendaftaran_banmods', 'desil')) {
                $table->dropColumn('desil');
            }
        });
    }
};
