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
        Schema::create('banmod_training_options', function (Blueprint $table) {
            $table->id();
            $table->string('value')->unique()->comment('Nilai yang disimpan di jenis_pelatihan_industri');
            $table->string('label')->comment('Label untuk select option');
            $table->boolean('is_active')->default(true)->comment('Status aktif (1 = tampil di form & filter)');
            $table->integer('order')->default(0)->comment('Urutan tampilan');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('banmod_training_options');
    }
};
