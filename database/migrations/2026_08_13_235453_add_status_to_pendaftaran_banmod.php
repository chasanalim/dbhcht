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
            $table->integer('status')->default(0)->nullable()->after('file_surat_buruh');
            $table->string('keterangan')->nullable()->after('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('pendaftaran_banmods', function (Blueprint $table) {
            $table->dropColumn(['status', 'keterangan']);
        });
    }
};
