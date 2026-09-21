<?php

use App\Models\PelatihanBanmod;
use App\Models\PelatihanEkonomiKreatif;
use App\Models\PelatihanKerjas;
use App\Models\PelatihanPetani;
use App\Models\PelatihanUmkm;
use App\Models\PendaftaranBanmod;
use App\Models\VerifikasiDokumen;
use Illuminate\Support\Collection;

function modelWithDocumentVerifications($model, array $statuses)
{
    $model->setRelation('documentVerifications', new Collection(
        collect($statuses)->map(
            fn ($status, $documentType) => new VerifikasiDokumen([
                'document_type' => $documentType,
                'status' => $status,
            ])
        )->values()->all()
    ));

    return $model;
}

test('semua model ekspor memakai dokumen wajib yang sama dengan modul verifikasi', function () {
    $models = [
        [new PelatihanUmkm(), 6],
        [new PelatihanKerjas(), 6],
        [new PelatihanBanmod(), 5],
        [new PelatihanPetani(), 7],
        [new PelatihanEkonomiKreatif([
            'kategori_pendaftar' => PelatihanEkonomiKreatif::KATEGORI_UMUM,
            'peran_ekraf' => 'pemilik_usaha',
        ]), 5],
        [new PendaftaranBanmod([
            'kategori' => 4,
            'isDomisili' => false,
        ]), 10],
    ];

    foreach ($models as [$model, $requiredDocumentCount]) {
        $requiredDocuments = $model->requiredVerificationDocuments();
        expect($requiredDocuments)->toHaveCount($requiredDocumentCount);
        $approvedDocuments = array_fill_keys($requiredDocuments, 1);

        expect(modelWithDocumentVerifications($model, $approvedDocuments)->getDocumentVerificationStatus())
            ->toBe('verified');

        $rejectedDocuments = $approvedDocuments;
        $rejectedDocuments[$requiredDocuments[0]] = 0;
        expect(modelWithDocumentVerifications($model, $rejectedDocuments)->getDocumentVerificationStatus())
            ->toBe('rejected');

        unset($approvedDocuments[$requiredDocuments[0]]);
        expect(modelWithDocumentVerifications($model, $approvedDocuments)->getDocumentVerificationStatus())
            ->toBe('pending');
    }
});

test('dokumen yang tidak wajib tidak memengaruhi status verifikasi', function () {
    $participant = new PelatihanEkonomiKreatif([
        'kategori_pendaftar' => PelatihanEkonomiKreatif::KATEGORI_UMUM,
        'peran_ekraf' => 'pemilik_usaha',
    ]);
    $approvedDocuments = array_fill_keys($participant->requiredVerificationDocuments(), 1);
    $approvedDocuments['surat_pekerja_ekraf'] = 0;

    modelWithDocumentVerifications($participant, $approvedDocuments);

    expect($participant->getDocumentVerificationStatus())->toBe('verified');
});
