<?php

use App\Ekports\BanmodExport;
use App\Ekports\EkrafExport;
use App\Ekports\KerjaExport;
use App\Ekports\PelBanmodExport;
use App\Ekports\PertanianExport;
use App\Ekports\UmkmExport;
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

test('kolom status verifikasi pada seluruh excel sesuai status dokumen', function () {
    $banmod = new class(['kategori' => 6, 'isDomisili' => false]) extends PendaftaranBanmod
    {
        public function getSkorAttribute()
        {
            return 0;
        }
    };
    $banmod->setRelation('kategoriUsaha', null);
    $banmod->setRelation('klasterUsaha', null);

    $kerja = new PelatihanKerjas();
    $kerja->setRelation('refPendidikan', null);
    $kerja->setRelation('jenisPelatihan', null);

    $pertanian = new class extends PelatihanPetani
    {
        public function getSkorAttribute()
        {
            return 0;
        }
    };
    $pertanian->setRelation('kelompokTani', null);
    $pertanian->setRelation('jenisPelatihanPetani', null);

    $cases = [
        [BanmodExport::class, $banmod],
        [UmkmExport::class, new class extends PelatihanUmkm
        {
            public function getSkorAttribute()
            {
                return 0;
            }
        }],
        [KerjaExport::class, $kerja],
        [PelBanmodExport::class, new class extends PelatihanBanmod
        {
            public function getSkorAttribute()
            {
                return 0;
            }
        }],
        [PertanianExport::class, $pertanian],
        [EkrafExport::class, new class([
            'kategori_pendaftar' => PelatihanEkonomiKreatif::KATEGORI_UMUM,
            'peran_ekraf' => 'pemilik_usaha',
        ]) extends PelatihanEkonomiKreatif
        {
            public function getSkorAttribute()
            {
                return 0;
            }
        }],
    ];

    foreach ($cases as [$exportClass, $model]) {
        $model->row_num = 1;
        $approvedDocuments = array_fill_keys($model->requiredVerificationDocuments(), 1);
        modelWithDocumentVerifications($model, $approvedDocuments);

        $export = new $exportClass(collect([$model]));
        $exportedRow = $export->collection()->first();
        $headingRow = $export->headings()[3];

        expect(array_values($exportedRow)[count($exportedRow) - 1])->toBe('Terverifikasi')
            ->and($headingRow[count($headingRow) - 1])->toBe('STATUS VERIFIKASI')
            ->and($headingRow)->toHaveCount(count($exportedRow));
    }
});
