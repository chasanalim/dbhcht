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
        Schema::create('verifikasi_dokumen', function (Blueprint $table) {
            $table->id();
            $table->string('pelatihan_type'); // umkm, pertanian, banmod, etc
            $table->unsignedBigInteger('pelatihan_id');
            $table->string('document_type'); // ktp, kk, foto, etc
            $table->boolean('status')->default(0);
            $table->unsignedBigInteger('verified_by');
            $table->timestamp('verified_at');
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->foreign('verified_by')->references('id')->on('users');

            // Prevent duplicate verifications
            $table->unique(['pelatihan_type', 'pelatihan_id', 'document_type'], 'unique_verification');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('verifikasi_dokumen');
    }
};
