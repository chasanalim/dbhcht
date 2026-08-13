<?php

namespace App\Models;

use App\Models\Concerns\FiltersBySelectedYear;
use App\Traits\HasVerifikasiDokumen;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PendaftaranBanmod extends Model
{
    use HasFactory, HasVerifikasiDokumen,FiltersBySelectedYear;

    protected $fillable = [
        "nik",
        "kk",
        "name",
        "tmp_lhr",
        "tgl_lhr",
        "alamat",
        "jenis_kelamin",
        "kode_kecamatan",
        "nama_kecamatan",
        "kode_kelurahan",
        "nama_kelurahan",
        "kode_rw",
        "nama_rw",
        "kode_rt",
        "nama_rt",
        "isDomisili",
        "alamat_domisili",
        "isUsaha",
        "alamat_usaha",
        "phone_number",
        "desil",
        "isDisabilitas",
        "disabilitas",
        "kategori",
        "jenis_kategori",
        "klaster_usaha",
        "tanggungan_keluarga",
        "lama_usaha",
        "jumlah_tenaga",
        "bruto",
        "status_tempat_tinggal",
        "aset",
        "hutang",
        "jumlah_legalitas",
        "jumlah_teknologi",
        "jumlah_penyerapan_naker",
        "file_foto",
        "file_ktp",
        "file_kk",
        "file_nib",
        "file_sku",
        "file_skd",
        "file_produk",
        "file_pernyataan",
        "file_perizinan",
        "file_siinas",
        "file_bp",
        "file_sertifikat_pelatihan",
        "file_lokasi_usaha",
        "file_surat_disabilitas",
        "file_surat_buruh",
        "file_surat_miskin",
    ];

    protected $casts = [
        'file_perizinan' => 'array'
    ];

    protected function casts(): array
    {
        return [
            'file_perizinan' => 'array',
            'disabilitas' => 'array',
        ];
    }

    protected $appends = [
        'skor',
    ];

    public function getSkorAttribute()
    {
        $skor = 0;
        if ($this->kategori == 1 || $this->kategori == 2 || $this->kategori == 3 || $this->kategori == 6) {
            $skor += (($this->lamaUsaha->skor / 4) * 0.25);
            $skor += (($this->jumlahTenagaKerja->skor / 4) * 0.35);
            $skor += (($this->brutoPerbulan->skor / 4) * 0.2);
            if ($this->aset > $this->hutang) {
                $skor += (3 / 3 * 0.05);
            } else if ($this->aset == $this->hutang) {
                $skor += (2 / 3 * 0.05);
            } else {
                $skor += (1 / 3 * 0.05);
            }

            if ($this->isDomisili == 0 && $this->isUsaha == 0) {
                $skor += (4 / 4 * 0.15);
            } else if ($this->isDomisili == 0 && $this->isUsaha == 1) {
                $skor += (3 / 4 * 0.15);
            } else if ($this->isDomisili == 1 && $this->isUsaha == 0) {
                $skor += (2 / 4 * 0.15);
            } else {
                $skor += (1 / 4 * 0.15);
            }

            if ($this->isDisabilitas == 1 || $this->kategori == 1) {
                return ($skor * 100) + 5;
            } else {
                return $skor * 100;
            }
        } else if ($this->kategori == 4) {
            $skor += (($this->lamaUsaha->skor / 4) * 0.1);
            $skor += (($this->jumlahTenagaKerja->skor / 4) * 0.1);
            $skor += (($this->brutoPerbulan->skor / 4) * 0.05);
            if ($this->aset > $this->hutang) {
                $skor += (3 / 3 * 0.05);
            } else if ($this->aset == $this->hutang) {
                $skor += (2 / 3 * 0.05);
            } else {
                $skor += (1 / 3 * 0.05);
            }

            $skor += (($this->jumlahLegalitas->skor / 3) * 0.1);
            $skor += (($this->jumlahTeknologiDigital->skor / 3) * 0.1);
            $skor += (($this->penyerapanTenagaMiskin->skor / 3) * 0.2);
            if ($this->isDomisili == 0 && $this->isUsaha == 0) {
                $skor += (4 / 4 * 0.05);
            } else if ($this->isDomisili == 0 && $this->isUsaha == 1) {
                $skor += (3 / 4 * 0.05);
            } else if ($this->isDomisili == 1 && $this->isUsaha == 0) {
                $skor += (2 / 4 * 0.05);
            } else {
                $skor += (1 / 4 * 0.05);
            }
            return $skor;
        } else {
            $skor += (($this->tanggunganKeluarga->skor / 3) * 0.2);
            $skor += (($this->lamaUsaha->skor / 4) * 0.15);
            if ($this->aset > $this->hutang) {
                $skor += (3 / 3 * 0.1);
            } else if ($this->aset == $this->hutang) {
                $skor += (2 / 3 * 0.1);
            } else {
                $skor += (1 / 3 * 0.1);
            }

            $skor += (($this->statusTempatTinggal->skor / 3) * 0.2);

            if ($this->isDomisili == 0 && $this->isUsaha == 0) {
                $skor += (4 / 4 * 0.1);
            } else if ($this->isDomisili == 0 && $this->isUsaha == 1) {
                $skor += (3 / 4 * 0.1);
            } else if ($this->isDomisili == 1 && $this->isUsaha == 0) {
                $skor += (2 / 4 * 0.1);
            } else {
                $skor += (1 / 4 * 0.1);
            }
            return $skor;
        }
    }

    public function kategoriUsaha(): BelongsTo
    {
        return $this->belongsTo(KategoriBanmod::class, 'kategori');
    }
    public function klasterUsaha(): BelongsTo
    {
        return $this->belongsTo(KlasterUsaha::class, 'klaster_usaha');
    }
    public function tanggunganKeluarga(): BelongsTo
    {
        return $this->belongsTo(TanggunganKeluarga::class, 'tanggungan_keluarga');
    }
    public function lamaUsaha(): BelongsTo
    {
        return $this->belongsTo(LamaUsaha::class, 'lama_usaha');
    }
    public function statusTempatTinggal(): BelongsTo
    {
        return $this->belongsTo(StatusTempatTinggal::class, 'status_tempat_tinggal');
    }
    public function jumlahTenagaKerja(): BelongsTo
    {
        return $this->belongsTo(JumlahTenagaKerja::class, 'jumlah_tenaga');
    }
    public function jumlahLegalitas(): BelongsTo
    {
        return $this->belongsTo(JumlahLegalitas::class, 'jumlah_legalitas');
    }
    public function jumlahTeknologiDigital(): BelongsTo
    {
        return $this->belongsTo(JumlahTeknologiDigital::class, 'jumlah_teknologi');
    }
    public function penyerapanTenagaMiskin(): BelongsTo
    {
        return $this->belongsTo(PenyerapanTenagaMiskin::class, 'jumlah_penyerapan_naker');
    }
    public function brutoPerbulan(): BelongsTo
    {
        return $this->belongsTo(Bruto::class, 'bruto');
    }

    public function getVerificationType(): string
    {
        return 'PENDAFTARAN_BANMOD';
    }


    public static function getDocumentTypes(int $kategori = null): array
    {
        $baseDocuments = [
            'foto' => 'Pas Foto',
            'ktp' => 'KTP',
            'kk' => 'Kartu Keluarga',
            'nib' => 'NIB',
            'sku' => 'SKU',
            'skd' => 'SKD',
            'produk' => 'Produk',
            'lokasi_usaha' => 'Foto Lokasi Usaha',
            'pernyataan' => 'Surat Pernyataan'
        ];

        $additionalDocuments = [
            // Kategori 1,2,3,6 - Dokumen dasar
            1 => array_merge($baseDocuments, [
                'surat_buruh' => 'Surat Keterangan Buruh',
            ]),
            2 => array_merge($baseDocuments, [
                'surat_buruh' => 'Surat Keterangan Buruh',
            ]),
            3 => array_merge($baseDocuments, [
                'surat_buruh' => 'Surat Keterangan Buruh',
            ]),
            6 => $baseDocuments,

            // Kategori 4 - IKM (tambah perizinan, siinas, bp)
            4 => array_merge($baseDocuments, [
                'perizinan' => 'Perizinan',
                'siinas' => 'SIINAS',
                'bp' => 'Bussiness Plan'
            ]),

            // Kategori 5 - Masyarakat Miskin (tambah sertifikat)
            5 => array_merge($baseDocuments, [
                'surat_miskin' => 'Surat Keterangan Miskin',
                'sertifikat_pelatihan' => 'Sertifikat Pelatihan'
                
            ]),

            // Kategori 7 - Disabilitas (tambah surat disabilitas + sertifikat)
            7 => array_merge($baseDocuments, [
                'surat_disabilitas' => 'Surat Keterangan Disabilitas',
                'sertifikat_pelatihan' => 'Sertifikat Pelatihan'
            ]),

            // Default - Semua dokumen
            null => [
                'foto' => 'Pas Foto',
                'ktp' => 'KTP',
                'kk' => 'Kartu Keluarga',
                'nib' => 'NIB',
                'sku' => 'SKU',
                'skd' => 'SKD',
                'produk' => 'Produk',
                'lokasi_usaha' => 'Foto Lokasi Usaha',
                'pernyataan' => 'Surat Pernyataan',
                'perizinan' => 'Perizinan',
                'siinas' => 'SIINAS',
                'bp' => 'Bussiness Plan',
                'surat_disabilitas' => 'Surat Keterangan Disabilitas',
                'sertifikat_pelatihan' => 'Sertifikat Pelatihan'
            ]
        ];

        return $additionalDocuments[$kategori] ?? $additionalDocuments[null];
    }

    public static function getRequiredDocuments(int $kategori = null): array
    {
        $baseDocuments = ['foto', 'ktp', 'kk', 'nib', 'sku', 'produk', 'lokasi_usaha', 'pernyataan'];

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
                'pernyataan',
                'perizinan',
                'siinas',
                'bp',
                'surat_disabilitas',
                'sertifikat_pelatihan',
            ]
        ];

        return $additionalDocuments[$kategori] ?? $additionalDocuments[null];
    }

    public static function getKategoriName($kategori)
    {
        $categories = [
            1 => 'Buruh Pabrik Rokok',
            2 => 'Buruh Tani Tembakau',
            3 => 'Pekerja Pabrik Rokok',
            4 => 'Industri Kecil Menengah (IKM)',
            5 => 'Masyarakat Miskin',
            6 => 'Pedagang Kaki Lima',
            7 => 'Disabilitas'
        ];

        return $categories[$kategori] ?? 'Semua Kategori';
    }
}
