<?php

namespace App\Traits;

use App\Models\VerifikasiDokumen;

trait HasVerifikasiDokumen
{
    public function documentVerifications()
    {
        return $this->morphMany(VerifikasiDokumen::class, 'verifiable', 'pelatihan_type', 'pelatihan_id');
    }

    public function isDocumentVerified($documentType)
    {
        return $this->documentVerifications()
            ->where('document_type', $documentType)
            ->exists();
    }

    public function verifyDocument($documentType, $notes = null)
    {
        return $this->documentVerifications()->create([
            'document_type' => $documentType,
            'verified_by' => auth()->id(),
            'verified_at' => now(),
            'notes' => $notes
        ]);
    }

    public static function getRequiredDocuments(int $kategori = null): array
    {
        $baseDocuments = ['foto', 'ktp', 'kk', 'nib', 'sku', 'produk', 'lokasi_usaha'];

        $additionalDocuments = [
            1 => array_merge($baseDocuments, [
                'surat_buruh',
            ]),
            2 => array_merge($baseDocuments, [
                'surat_buruh',
            ]),
            3 => array_merge($baseDocuments, [
                'surat_buruh',
            ]),


            // Kategori 6 - Pedagang Kaki Lima
            6 => $baseDocuments,

            // Kategori 4 - IKM
            4 => array_merge($baseDocuments, [
                'siinas',
                'bp',
                'perizinan',
            ]),

            // Kategori 5 - Masyarakat Miskin
            // Kategori 5 - Masyarakat Miskin (tambah sertifikat)
            5 => array_merge($baseDocuments, [
                'surat_miskin',
                'sertifikat_pelatihan'
                
            ]),
    
            // Kategori 7 - Disabilitas
            7 => array_merge($baseDocuments, [
                'surat_disabilitas',
                'sertifikat_pelatihan',
            ]),


            // Default - Semua dokumen
            null => [
                'foto',
                'ktp',
                'kk',
                'nib',
                'sku',
                'produk',
                'lokasi_usaha',
                'perizinan',
                'siinas',
                'bp',
                'surat_disabilitas',
                'sertifikat_pelatihan',
            ]
        ];

        return $additionalDocuments[$kategori] ?? $additionalDocuments[null];
    }
}
