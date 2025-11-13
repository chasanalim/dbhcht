<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('pelatihan_umkm', function (Blueprint $table) {
            $table->id();

            // A. Data Peserta
            $table->string('nik', 16)->unique();
            $table->string('no_kk', 16);
            $table->string('jenis_kelamin');
            $table->string('nama_lengkap');
            $table->string('no_hp');
            $table->string('jalan');
            $table->string('kecamatan');
            $table->string('kelurahan');
            $table->string('rw');
            $table->string('rt');
            $table->string('tempat_lahir');
            $table->date('tgl_lahir');
            $table->string('pendidikan');
            $table->boolean('is_disabilitas')->default(false);
            $table->json('jenis_disabilitas')->nullable();

            // B. Profil Usaha
            $table->string('nama_usaha');
            $table->string('tahun_berdiri');
            $table->string('bidang_usaha');
            $table->string('alamat_usaha');
            $table->string('kec_usaha');
            $table->string('kel_usaha');
            $table->string('rw_usaha');
            $table->string('rt_usaha');
            $table->string('nib')->nullable();
            $table->boolean('legalitas_status')->default(false);
            $table->json('legalitas_jenis')->nullable();
            $table->string('modal');
            $table->string('omset');
            $table->string('kapasitas_satuan');
            $table->string('kapasitas_jumlah');
            $table->string('jangkauan');

            // C. Upload Berkas
            $table->string('file_ktp');
            $table->string('file_kk');
            $table->string('file_pasfoto');
            $table->string('file_surat_pernyataan_tidak_ikut')->nullable();
            $table->string('file_surat_kesanggupan');
            $table->string('file_nib')->nullable();

            // D. Prioritas Pelatihan
            $table->string('prioritas_1');
            $table->string('prioritas_2')->nullable();
            $table->string('prioritas_3')->nullable();

            // E. Skoring
            $table->string('alasan');
            $table->string('kesesuaian');
            $table->string('pengalaman');
            $table->string('komitmen');
            $table->integer('status')->default(0); // 0: Menunggu, 1: lolos, 2: Gagal , 3: Blacklist

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pelatihan_umkm');
    }
};
