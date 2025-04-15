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
        Schema::create('penerima_banmods', function (Blueprint $table) {
            $table->id();
            $table->string('nik', 20);
            $table->string('no_kk', 20);
            $table->string('nama_lengkap');
            $table->string('jenis_kelamin', 1);
            $table->string('kecamatan_ktp');
            $table->string('kelurahan_ktp');
            $table->string('rt', 5);
            $table->string('rw', 5);
            $table->text('alamat_ktp');
            $table->year('tahun_dapat_bantuan');
            $table->text('jenis_usaha');
            $table->timestamps();
        });
    }


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('penerima_banmods');
    }
};
