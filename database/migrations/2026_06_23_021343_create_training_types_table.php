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
        Schema::create('training_types', function (Blueprint $table) {
            $table->id();
            $table->string('value')->unique()->comment('Jenis pelatihan (slug)');
            $table->string('label')->comment('Label untuk select option');
            $table->string('title')->comment('Judul pelatihan');
            $table->text('description')->comment('Deskripsi pelatihan');
            $table->string('image')->nullable()->comment('URL gambar');
            $table->json('requirements')->nullable()->comment('Requirements array');
            $table->string('duration')->default('-')->comment('Durasi pelatihan');
            $table->string('location')->comment('Lokasi pelatihan');
            $table->boolean('is_disabled')->default(false)->comment('Disable di select option');
            $table->boolean('coming_soon')->default(false)->comment('Status coming soon');
            $table->boolean('closed')->default(false)->comment('Status pendaftaran ditutup');
            $table->integer('order')->default(0)->comment('Urutan tampilan');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('training_types');
    }
};
