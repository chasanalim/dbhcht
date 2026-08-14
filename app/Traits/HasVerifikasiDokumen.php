<?php

namespace App\Traits;

use App\Models\VerifikasiDokumen;

trait HasVerifikasiDokumen
{
    /**
     * Kumpulkan NIK yang pernah menerima pelatihan (lolos) di modul mana pun
     * atau tercatat di Master Pencari Kerja. Dipakai untuk menandai baris pada
     * tabel index yang memiliki pelatihan sebelumnya.
     *
     * @param \Illuminate\Support\Collection $data
     * @return array{0: \Illuminate\Support\Collection, 1: \Illuminate\Support\Collection}
     */
    protected function getNikDenganPelatihanSebelumnya($data): array
    {
        $niks = $data->pluck('nik')->filter()->unique()->values();

        $lolosByNik = collect();
        foreach ([
            \App\Models\PelatihanEkonomiKreatif::class => \App\Models\PelatihanEkonomiKreatif::STATUS_LOLOS,
            \App\Models\PelatihanUmkm::class => 1,
            \App\Models\PelatihanKerjas::class => 1,
            \App\Models\PelatihanBanmod::class => 1,
        ] as $model => $status) {
            $lolosByNik = $lolosByNik->merge(
                $model::whereIn('nik', $niks)
                    ->where('status', $status)
                    ->withoutSelectedYearFilter()
                    ->get(['id', 'nik'])
                    ->map(fn ($row) => ['nik' => $row->nik, 'id' => $row->id])
            );
        }

        $lolosIds = $lolosByNik->groupBy('nik')->map(fn ($group) => $group->pluck('id'));

        $masterNiks = \App\Models\MasterPencariKerja::whereIn('nik', $niks)
            ->pluck('nik')
            ->flip();

        return [$lolosIds, $masterNiks];
    }

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
