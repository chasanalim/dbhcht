<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('master_pencari_kerja', function (Blueprint $table) {
            $table->id();

            $table->string('nik', 16)->comment('Nomor Induk Kependudukan');
            $table->string('nama')->comment('Nama lengkap');
            $table->string('tempat_lahir')->nullable()->comment('Tempat lahir');
            $table->date('tanggal_lahir')->nullable()->comment('Tanggal lahir');
            $table->string('jenis_kelamin', 20)->nullable()->comment('Jenis kelamin');
            $table->text('alamat')->nullable()->comment('Alamat lengkap');
            $table->string('rt', 5)->nullable()->comment('RT');
            $table->string('rw', 5)->nullable()->comment('RW');
            $table->string('kelurahan', 100)->nullable()->comment('Kelurahan');
            $table->string('kecamatan', 100)->nullable()->comment('Kecamatan');
            $table->string('jenis_pelatihan')->nullable()->comment('Jenis pelatihan pencari kerja');
            $table->string('tahun', 4)->nullable()->comment('Tahun pelaksanaan');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('master_pencari_kerja');
    }
};
