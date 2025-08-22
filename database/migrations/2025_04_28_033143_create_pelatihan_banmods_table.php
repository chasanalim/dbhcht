<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('pelatihan_banmod', function (Blueprint $table) {
            $table->id();
            $table->year('tahun_penerimaan');
            $table->string('nik', 16)->unique();
            $table->string('nama_lengkap');
            $table->string('no_kk', 16);
            $table->string('kecamatan_ktp');
            $table->string('kelurahan_ktp');
            $table->string('rw_ktp');
            $table->string('rt_ktp');
            $table->text('jalan_ktp');
            $table->string('no_hp');

            $table->string('kecamatan_usaha');
            $table->string('kelurahan_usaha');
            $table->string('rw_usaha');
            $table->string('rt_usaha');
            $table->text('jalan_usaha');

            $table->string('jenis_pelatihan_industri');

            $table->enum('perkembangan_omzet', ['meningkat', 'tetap', 'turun']);
            $table->enum('perkembangan_tenaga_kerja', ['bertambah', 'tetap', 'berkurang']);

            // Untuk survey motivasi
            $table->unsignedBigInteger('skor_ketrampilan')->nullable();
            $table->unsignedBigInteger('skor_kualitas_produk')->nullable();
            $table->unsignedBigInteger('skor_permasalahan_usaha')->nullable();
            $table->unsignedBigInteger('skor_mengisi_waktu')->nullable();
            $table->unsignedBigInteger('skor_diajak_teman')->nullable();

            // Upload File
            $table->string('file_ktp');
            $table->string('file_kk');
            $table->string('file_nib');

            // Komitmen
            $table->boolean('komitmen')->default(0);

            $table->integer('status')->default(0); // 0: Menunggu, 1: lolos, 2: Gagal

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pelatihan_banmods');
    }
};
