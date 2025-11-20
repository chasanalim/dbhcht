<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('skor_pelatihan_ekonomi_kreatif', function (Blueprint $table) {
            $table->id();
            $table->text('jawaban')->comment('Text pilihan jawaban alasan mengikuti pelatihan');
            $table->integer('skor')->comment('Nilai skor untuk jawaban ini');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('skor_pelatihan_ekonomi_kreatif');
    }
};
