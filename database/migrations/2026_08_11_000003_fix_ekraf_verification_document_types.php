<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    /**
     * Perbaiki verifikasi dokumen Ekraf yang tersimpan dengan tipe dokumen
     * yang tidak sesuai peran pendaftar.
     *
     * Sebelum fitur peran (pemilik_usaha/pekerja) dipisah, halaman verifikasi
     * menampilkan NIB dan Surat Keterangan Pekerja sekaligus, sehingga ada
     * record yang memverifikasi dokumen yang tidak relevan dengan perannya,
     * misal record pemilik usaha yang terverifikasi surat_pekerja_ekraf.
     *
     * Aturan:
     * - peran pemilik_usaha: verifikasi surat_pekerja_ekraf -> nib (jika nib belum ada)
     * - peran pekerja: verifikasi nib -> surat_pekerja_ekraf (jika surat_pekerja_ekraf belum ada)
     * - record dengan verifikasi yang benar sudah ada -> dibiarkan (idempoten)
     * - peran NULL (data ambigu) -> dibiarkan, keduanya tetap wajib
     */
    public function up(): void
    {
        $class = 'App\\Models\\PelatihanEkonomiKreatif';

        $rows = DB::table('pelatihan_ekonomi_kreatif')
            ->whereIn('peran_ekraf', ['pemilik_usaha', 'pekerja'])
            ->get(['id', 'peran_ekraf']);

        foreach ($rows as $r) {
            $wrong = $r->peran_ekraf === 'pemilik_usaha' ? 'surat_pekerja_ekraf' : 'nib';
            $right = $r->peran_ekraf === 'pemilik_usaha' ? 'nib' : 'surat_pekerja_ekraf';

            $hasRight = DB::table('verifikasi_dokumen')
                ->where('pelatihan_type', $class)
                ->where('pelatihan_id', $r->id)
                ->where('document_type', $right)
                ->exists();

            if ($hasRight) {
                continue;
            }

            DB::table('verifikasi_dokumen')
                ->where('pelatihan_type', $class)
                ->where('pelatihan_id', $r->id)
                ->where('document_type', $wrong)
                ->update(['document_type' => $right]);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Tidak bisa dibalik dengan aman (nama dokumen yang sudah dikoreksi).
    }
};