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
        Schema::create('pelatihan_ekonomi_kreatif', function (Blueprint $table) {
            $table->id();

            // Kategori Pendaftar
            $table->enum('kategori_pendaftar', [
                'umum',
                'buruh_tani_tembakau',
                'buruh_pabrik_rokok',
                'buruh_phk',
                'disabilitas',
                'perempuan_kk'
            ])->comment('Kategori pendaftar pelatihan ekonomi kreatif');

            // Data Dasar Pendaftar
            $table->string('nik', 16)->unique()->comment('Nomor Induk Kependudukan');
            $table->string('no_kk', 16)->comment('Nomor Kartu Keluarga');
            $table->string('nama_lengkap')->comment('Nama lengkap pendaftar');
            $table->date('tanggal_lahir')->comment('Tanggal lahir pendaftar');
            $table->string('no_hp', 20)->comment('Nomor HP/WhatsApp');

            // Alamat KTP
            $table->text('alamat_ktp')->comment('Alamat lengkap sesuai KTP');
            $table->string('rt_ktp', 5)->comment('RT sesuai KTP');
            $table->string('rw_ktp', 5)->comment('RW sesuai KTP');
            $table->string('kelurahan_ktp', 100)->comment('Kelurahan sesuai KTP');
            $table->string('kecamatan_ktp', 100)->comment('Kecamatan sesuai KTP');
            $table->string('kode_kelurahan_ktp', 20)->nullable()->comment('Kode kelurahan KTP');
            $table->string('kode_kecamatan_ktp', 20)->nullable()->comment('Kode kecamatan KTP');

            // Alamat Domisili
            $table->text('alamat_domisili')->comment('Alamat lengkap domisili saat ini');
            $table->string('rt_domisili', 5)->comment('RT domisili');
            $table->string('rw_domisili', 5)->comment('RW domisili');
            $table->string('kelurahan_domisili', 100)->comment('Kelurahan domisili');
            $table->string('kecamatan_domisili', 100)->comment('Kecamatan domisili');
            $table->string('kode_kelurahan_domisili', 20)->nullable()->comment('Kode kelurahan domisili');
            $table->string('kode_kecamatan_domisili', 20)->nullable()->comment('Kode kecamatan domisili');

            // Data Pelatihan
            $table->string('jenis_pelatihan')->comment('Jenis pelatihan ekonomi kreatif yang dipilih');

            // Upload Files Wajib (untuk semua kategori)
            $table->string('file_ktp')->nullable()->comment('File foto KTP');
            $table->string('file_kk')->nullable()->comment('File foto Kartu Keluarga');
            $table->string('file_pasfoto')->nullable()->comment('File pas foto pendaftar');
            $table->string('file_surat_pernyataan')->nullable()->comment('File surat pernyataan komitmen');
            $table->string('file_nib')->nullable()->comment('File NIB (Nomor Induk Berusaha)');
            $table->string('file_surat_pekerja_ekraf')->nullable()->comment('File surat keterangan pekerja ekonomi kreatif');

            // Upload Files Khusus per Kategori (semua nullable)
            $table->string('file_surat_pemilik_lahan')->nullable()->comment('File surat dari pemilik lahan (untuk buruh tani tembakau)');
            $table->string('file_id_card_iht')->nullable()->comment('File ID Card/surat keterangan dari IHT (untuk buruh pabrik rokok)');
            $table->string('file_surat_phk')->nullable()->comment('File surat pemberhentian kerja (untuk buruh PHK)');
            $table->string('file_surat_disabilitas')->nullable()->comment('File surat keterangan disabilitas dari kelurahan');
            $table->string('file_surat_kb')->nullable()->comment('File surat keterangan dari Dinas KB (untuk perempuan kepala keluarga)');

            // Status & Komitmen
            $table->boolean('komitmen')->default(false)->comment('Persetujuan komitmen pendaftar');
            $table->integer('status')->default(0)->comment('0: Menunggu, 1: Lolos, 2: Gagal, 3: Blacklist');

            // Audit Trail
            $table->string('created_by')->nullable()->comment('User yang menginput data');
            $table->string('updated_by')->nullable()->comment('User yang mengupdate data terakhir');

            $table->timestamps();

            // Index untuk performa
            $table->index(['kategori_pendaftar', 'status']);
            $table->index(['nik', 'status']);
            $table->index('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pelatihan_ekonomi_kreatif');
    }
};
