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
        Schema::create('pendaftaran_banmods', function (Blueprint $table) {
            $table->id();
            $table->char('nik', 16)->unique();
            $table->char('kk', 16);
            $table->string("name");
            $table->string("tmp_lhr");
            $table->date("tgl_lhr");
            $table->string("alamat");
            $table->string("jenis_kelamin");
            $table->string("kode_kecamatan");
            $table->string("nama_kecamatan");
            $table->string("kode_kelurahan");
            $table->string("nama_kelurahan");
            $table->string("kode_rw");
            $table->string("nama_rw");
            $table->string("kode_rt");
            $table->string("nama_rt");
            $table->string("isDomisili")->nullable();
            $table->string("alamat_domisili")->nullable();
            $table->string("isUsaha")->nullable();
            $table->string("alamat_usaha")->nullable();
            $table->string("phone_number");
            $table->string("daya_listrik");
            $table->string("isDisabilitas")->nullable();
            $table->json("disabilitas")->nullable();
            $table->string("kategori");
            $table->string("jenis_kategori");
            $table->string("klaster_usaha");
            $table->string("tanggungan_keluarga")->nullable();
            $table->string("lama_usaha");
            $table->string("jumlah_tenaga")->nullable();
            $table->string("bruto")->nullable();
            $table->string("status_tempat_tinggal")->nullable();
            $table->string("aset");
            $table->string("hutang");
            $table->string("jumlah_legalitas")->nullable();
            $table->string("jumlah_teknologi")->nullable();
            $table->string("jumlah_penyerapan_naker")->nullable();
            $table->string("file_foto")->nullable();
            $table->string("file_ktp")->nullable();
            $table->string("file_kk")->nullable();
            $table->string("file_nib")->nullable();
            $table->string("file_sku")->nullable();
            $table->string("file_skd")->nullable();
            $table->string("file_produk")->nullable();
            $table->string("file_pernyataan")->nullable();
            $table->json("file_perizinan")->nullable();
            $table->string("file_siinas")->nullable();
            $table->string("file_bp")->nullable();
            $table->string("file_sertifikat_pelatihan")->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pendaftaran_banmods');
    }
};
