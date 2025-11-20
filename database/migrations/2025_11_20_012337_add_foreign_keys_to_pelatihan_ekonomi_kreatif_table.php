<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('pelatihan_ekonomi_kreatif', function (Blueprint $table) {
            $table->foreign('alasan')->references('id')->on('skor_pelatihan_ekonomi_kreatif')->onDelete('set null');
        });
    }

    public function down()
    {
        Schema::table('pelatihan_ekonomi_kreatif', function (Blueprint $table) {
            $table->dropForeign(['alasan']);
        });
    }
};
