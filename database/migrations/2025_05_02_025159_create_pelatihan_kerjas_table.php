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
        Schema::create('pelatihan_kerjas', function (Blueprint $table) {
            $table->id();
            $table->char('nik', 16)->unique();
            $table->char('no_kk', 16);
            $table->string('nama_lengkap');
            $table->string('tmp_lhr');
            $table->date('tgl_lhr');
            $table->string('jenis_kelamin');
            $table->text('alamat');
            $table->string('kode_kecamatan');
            $table->string('nama_kecamatan');
            $table->string('kode_kelurahan');
            $table->string('nama_kelurahan');
            $table->string('kode_rw');
            $table->string('nama_rw');
            $table->string('kode_rt');
            $table->string('nama_rt');
            $table->string('file_ktp');
            $table->string('file_kk');
            $table->string('phone_number');
            $table->string('alasan');
            $table->string('pendidikan');
            $table->string('jenis_pelatihan');
            $table->integer('status')->default(0); // 0: Menunggu, 1: lolos, 2: Gagal , 3: Blacklist
            $table->timestamps();
        });
    }


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pelatihan_kerjas');
    }
};
