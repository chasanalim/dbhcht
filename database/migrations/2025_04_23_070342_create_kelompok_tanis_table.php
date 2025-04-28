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
        Schema::create('kelompok_tanis', function (Blueprint $table) {
            $table->id();
            $table->string('kecamatan');
            $table->string('kelurahan');
            $table->string('nama_kelompok');
            $table->string('no_register');
            $table->string('nama_ketua');
            $table->string('nik_ketua', 16);
            $table->string('nama_anggota');
            $table->string('nik_anggota', 16);
            $table->year('tahun_berdiri');
            $table->string('tingkat_kemampuan')->nullable();
            $table->text('keterangan')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('kelompok_tanis');
    }
};
