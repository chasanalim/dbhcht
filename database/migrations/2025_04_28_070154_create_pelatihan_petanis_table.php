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
        Schema::create('pelatihan_petanis', function (Blueprint $table) {
            $table->id();

            // A. Data Peserta
            $table->string('nik', 16)->unique();
            $table->string('kk', 16);
            $table->string('jenis_kelamin');
            $table->string('nama_lengkap');
            $table->string('no_hp');
            $table->string('nama_kecamatan');
            $table->string('nama_kelurahan');
            $table->string('nama_rw');
            $table->string('nama_rt');
            $table->string('alamat');
            $table->string("isDomisili")->nullable();
            $table->string("alamat_domisili")->nullable();
            $table->string('tmp_lhr');
            $table->date('tgl_lhr');
            $table->string('pendidikan');
            $table->boolean('is_disabilitas')->default(false);
            $table->json('jenis_disabilitas')->nullable();

            // B. Profil Kelompok
            $table->string('id_kelompok');
            $table->string('tahun_berdiri');
            $table->string('masa_aktif_kelompok');
            $table->string('bidang_usaha_kelompok');
            $table->string('nama_kecamatan_kelompok');
            $table->string('nama_kelurahan_kelompok');
            $table->string('nama_rw_kelompok');
            $table->string('nama_rt_kelompok');
            $table->string('alamat_kelompok');

            // C. Upload Berkas
            $table->string('file_foto');
            $table->string('file_kk');
            $table->string('file_ktp');
            $table->string('file_pernyataan_tidak_mengikuti_pelatihan_lain');
            $table->string('file_pernyataan_kesanggupan_ikut_pelatihan');
            $table->string('file_pengukuhan_penyuluh_swadaya');
            $table->string('file_legalitas_kelompok');
            $table->string('file_rekomendasi_kelompok');

            // D. Kelompok Pelatihan Petani
            $table->string('kategori');
            $table->string('jenis_pelatihan_petani');

            // E. Skoring
            $table->string('alasan');
            $table->integer('status')->default(0); // 0: Menunggu, 1: lolos, 2: Gagal

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pelatihan_petanis');
    }
};
