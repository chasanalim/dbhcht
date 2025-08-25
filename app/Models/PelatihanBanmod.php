<?php

namespace App\Models;

use App\Traits\HasVerifikasiDokumen;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class PelatihanBanmod extends Model
{
    use HasFactory,
        HasVerifikasiDokumen;

    protected $table = 'pelatihan_banmod';

    protected $fillable = [
        'tahun_penerimaan',
        'nik',
        'nama_lengkap',
        'no_kk',
        'kecamatan_ktp',
        'kelurahan_ktp',
        'rw_ktp',
        'rt_ktp',
        'jalan_ktp',
        'no_hp',

        'kecamatan_usaha',
        'kelurahan_usaha',
        'rw_usaha',
        'rt_usaha',
        'jalan_usaha',

        'jenis_pelatihan_industri',

        'perkembangan_omzet',
        'perkembangan_tenaga_kerja',

        'skor_ketrampilan',
        'skor_kualitas_produk',
        'skor_permasalahan_usaha',
        'skor_mengisi_waktu',
        'skor_diajak_teman',

        'file_ktp',
        'file_kk',
        'file_nib',
        'file_domisili',

        'komitmen',
        'status',
    ];

    protected $appends = [
        'skor',
    ];

    public function getSkorAttribute()
    {
        $skor = 0;
        $skor += $this->skor_ketrampilan ?? 0;
        $skor += $this->skor_kualitas_produk ?? 0;
        $skor += $this->skor_permasalahan_usaha ?? 0;
        $skor += $this->skor_mengisi_waktu ?? 0;
        $skor += $this->skor_diajak_teman ?? 0;
        if ($this->perkembangan_omzet == 'Meningkat') {
            $skor += 3;
        } else if ($this->perkembangan_omzet == 'Tetap') {
            $skor += 2;
        } else if ($this->perkembangan_omzet == 'Menurun') {
            $skor += 1;
        }
        if ($this->perkembangan_tenaga_kerja == 'Meningkat') {
            $skor += 3;
        } else if ($this->perkembangan_tenaga_kerja == 'Tetap') {
            $skor += 2;
        } else if ($this->perkembangan_tenaga_kerja == 'Menurun') {
            $skor += 1;
        }

        if ($skor === 0) {
            return 0;
        }
        return $skor / 21 * 100;
    }


    public function getVerificationType(): string
    {
        return 'PELATIHAN_BANMOD';
    }

    public static function getDocumentTypes(): array
    {
        return [
            'ktp' => 'KTP',
            'kk' => 'Kartu Keluarga',
            'nib' => 'NIB',
            'domisili' => 'Surat Keterangan Domisili',
        ];
    }
}
