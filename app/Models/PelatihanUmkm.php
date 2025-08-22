<?php

namespace App\Models;

use App\Traits\HasVerifikasiDokumen;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PelatihanUmkm extends Model
{
    use HasFactory, HasVerifikasiDokumen;

    protected $table = 'pelatihan_umkm';

    protected $fillable = [
        'nik',
        'no_kk',
        'nama_lengkap',
        'tempat_lahir',
        'tgl_lahir',
        'jenis_kelamin',
        'no_hp',
        'jalan',
        'kecamatan',
        'kelurahan',
        'rw',
        'rt',
        'pendidikan',
        'is_disabilitas',
        'jenis_disabilitas',
        'nama_usaha',
        'tahun_berdiri',
        'bidang_usaha',
        'alamat_usaha',
        'kec_usaha',
        'kel_usaha',
        'rw_usaha',
        'rt_usaha',
        'nib',
        'legalitas_status',
        'legalitas_jenis',
        'modal',
        'omset',
        'kapasitas_satuan',
        'kapasitas_jumlah',
        'jangkauan',
        'file_foto',
        'file_ktp',
        'file_kk',
        'file_pernyataan',
        'prioritas_1',
        'prioritas_2',
        'prioritas_3',
        'alasan',
        'kesesuaian',
        'pengalaman',
        'komitmen',
        'status',
    ];

    protected $casts = [
        'jenis_disabilitas' => 'array',
        'legalitas_jenis' => 'array',
    ];

    protected $appends = [
        'skor',
    ];

    public function getSkorAttribute()
    {
        $skor = 0;
        $skor += $this->alasanPelatihan->skor;
        $skor += $this->kesesuaianPelatihan->skor;
        $skor += $this->pengalamanPelatihan->skor;
        return $skor / 9 * 100;
    }

    public function alasanPelatihan()
    {
        return $this->belongsTo(SkorPelatihanUmkm::class, 'alasan', 'id');
    }

    public function kesesuaianPelatihan()
    {
        return $this->belongsTo(SkorPelatihanUmkm::class, 'kesesuaian', 'id');
    }

    public function pengalamanPelatihan()
    {
        return $this->belongsTo(SkorPelatihanUmkm::class, 'pengalaman', 'id');
    }

    public function Refpendidikan()
    {
        return $this->belongsTo(RefPendidikan::class, 'pendidikan', 'id');
    }

    public function getVerificationType(): string
    {
        return 'PELATIHAN_UMKM';
    }

    public static function getDocumentTypes(): array
    {
        return [
            'foto' => 'Pas Foto',
            'ktp' => 'KTP',
            'kk' => 'Kartu Keluarga',
            'pernyataan' => 'Surat Pernyataan'
        ];
    }
}
