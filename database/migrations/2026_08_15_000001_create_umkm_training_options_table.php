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
        Schema::create('umkm_training_options', function (Blueprint $table) {
            $table->id();
            $table->string('label')->unique()->comment('Nama pilihan pelatihan UMKM (disimpan di prioritas_1)');
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
        Schema::dropIfExists('umkm_training_options');
    }
};
