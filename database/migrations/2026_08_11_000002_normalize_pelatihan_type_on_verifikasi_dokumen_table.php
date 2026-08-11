<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Standarisasi kolom pelatihan_type pada tabel verifikasi_dokumen.
     *
     * Sebelumnya controller menyimpan label ('PELATIHAN_EKRAF', 'PELATIHAN_UMKM', dst)
     * secara eksplisit, sedangkan relation morphMany pada trait HasVerifikasiDokumen
     * menggunakan kolom tersebut sebagai morph type yang mengharapkan nama class
     * ('App\Models\PelatihanEkonomiKreatif', dst). Akibatnya query morphMany
     * (index verifikasi, dashboard) tidak pernah match dengan baris yang ada.
     *
     * Migrasi ini mengonversi nilai yang tersimpan ke nama class penuh agar
     * konsisten dengan morphMany dan dengan data yang ditulis Laravel otomatis.
     */
    public function up(): void
    {
        $map = [
            'PENDAFTARAN_BANMOD' => 'App\\Models\\PendaftaranBanmod',
            'PELATIHAN_UMKM' => 'App\\Models\\PelatihanUmkm',
            'PELATIHAN_KERJA' => 'App\\Models\\PelatihanKerjas',
            'PELATIHAN_BANMOD' => 'App\\Models\\PelatihanBanmod',
            'PELATIHAN_PERTANIAN' => 'App\\Models\\PelatihanPetani',
            'PELATIHAN_EKRAF' => 'App\\Models\\PelatihanEkonomiKreatif',
        ];

        // Konversi label -> nama class hanya untuk baris yang masih menyimpan label.
        // Baris yang sudah menyimpan nama class (ditulis otomatis Laravel) dibiarkan.
        foreach ($map as $label => $class) {
            $affected = DB::table('verifikasi_dokumen')
                ->where('pelatihan_type', $label)
                ->update(['pelatihan_type' => $class]);

            if ($affected > 0) {
                \Illuminate\Support\Facades\Log::info(
                    "verifikasi_dokumen migrate: {$affected} rows {$label} -> {$class}"
                );
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        $map = [
            'App\\Models\\PendaftaranBanmod' => 'PENDAFTARAN_BANMOD',
            'App\\Models\\PelatihanUmkm' => 'PELATIHAN_UMKM',
            'App\\Models\\PelatihanKerjas' => 'PELATIHAN_KERJA',
            'App\\Models\\PelatihanBanmod' => 'PELATIHAN_BANMOD',
            'App\\Models\\PelatihanPetani' => 'PELATIHAN_PERTANIAN',
            'App\\Models\\PelatihanEkonomiKreatif' => 'PELATIHAN_EKRAF',
        ];

        foreach ($map as $class => $label) {
            DB::table('verifikasi_dokumen')
                ->where('pelatihan_type', $class)
                ->update(['pelatihan_type' => $label]);
        }
    }
};