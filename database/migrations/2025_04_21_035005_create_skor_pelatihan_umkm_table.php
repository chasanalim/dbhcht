<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSkorPelatihanUmkmTable extends Migration
{
    public function up()
    {
        Schema::create('skor_pelatihan_umkm', function (Blueprint $table) {
            $table->id();
            $table->string('kategori');
            $table->string('jawaban');
            $table->integer('skor');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('skor_pelatihan_umkm');
    }
}
