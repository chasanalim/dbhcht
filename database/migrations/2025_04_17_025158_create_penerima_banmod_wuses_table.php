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
        Schema::create('penerima_banmod_wuses', function (Blueprint $table) {
            $table->id();
            $table->string('nik', 20);
            $table->string('kk', 20);
            $table->string('nama');
            $table->string('jenis_kelamin', 1);
            $table->text('alamat');
            $table->string('kec');
            $table->string('kel');
            $table->string('rt', 5);
            $table->string('rw', 5);
            $table->year('tahun_dapat_bantuan');
            $table->text('jenis_usaha')->nullable();;
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('penerima_banmod_wuses');
    }
};
