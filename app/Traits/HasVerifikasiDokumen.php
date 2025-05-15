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
        $baseDocuments = ['foto', 'ktp', 'kk', 'nib', 'sku', 'skd', 'produk', 'pernyataan'];

        $additionalDocuments = [
            // Kategori 1 - Buruh Pabrik Rokok
            1 => $baseDocuments,

            // Kategori 2 - Buruh Tani Tembakau
            2 => $baseDocuments,

            // Kategori 3 - Pekerja Pabrik Rokok
            3 => $baseDocuments,

            // Kategori 4 - IKM
            4 => array_merge($baseDocuments, [
                'siinas',
                'bp',
                'perizinan',
            ]),

            // Kategori 5 - Masyarakat Miskin
            5 => array_merge($baseDocuments, [
                'sertifikat_pelatihan'
            ]),


            // Default - Semua dokumen
            null => [
                'foto',
                'ktp',
                'kk',
                'nib',
                'sku',
                'skd',
                'produk',
                'perizinan',
                'siinas',
                'bp',
                'sertifikat_pelatihan',
                'pernyataan'
            ]
        ];

        return $additionalDocuments[$kategori] ?? $additionalDocuments[null];
    }
}
