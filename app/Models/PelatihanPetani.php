<?php

namespace App\Models;

use App\Traits\HasVerifikasiDokumen;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class PelatihanPetani extends Model
{
    use HasFactory,
        HasVerifikasiDokumen;

    protected $table = 'pelatihan_petanis';

    protected $fillable = [
        'nik',
        'kk',
        'jenis_kelamin',
        'nama_lengkap',
        'no_hp',
        'nama_kecamatan',
        'nama_kelurahan',
        'nama_rw',
        'nama_rt',
        'alamat',
        'alamat_domisili',
        'tmp_lhr',
        'tgl_lhr',
        'pendidikan',
        'is_disabilitas',
        'jenis_disabilitas',
        'id_kelompok',
        'tahun_berdiri',
        'masa_aktif_kelompok',
        'bidang_usaha_kelompok',
        'nama_kecamatan_kelompok',
        'nama_kelurahan_kelompok',
        'nama_rw_kelompok',
        'nama_rt_kelompok',
        'alamat_kelompok',
        'file_foto',
        'file_ktp',
        'file_pengukuhan_penyuluh_swadaya',
        'file_rekomendasi_kelompok',
        'file_domisili',
        'kategori',
        'jenis_pelatihan_petani',
        'alasan',
        'status',
    ];

    protected $appends = [
        'skor',
    ];

    public function getSkorAttribute()
    {
        $skor = 0;
        $skor += $this->masaAktifKelompok->skor ?? 0;
        $skor += $this->alasanPelatihan->skor ?? 0;

        if ($skor === 0) {
            return 0;
        }
        return $skor / 6 * 100;
    }


    public function kelompokTani()
    {
        return $this->belongsTo(KelompokTani::class, 'id_kelompok', 'id');
    }

    public function kategoriKelompok()
    {
        return $this->belongsTo(KelompokPelatihanPetani::class, 'kategori', 'id');
    }

    public function jenisPelatihanPetani()
    {
        return $this->belongsTo(JenisPelatihanPetani::class, 'jenis_pelatihan_petani', 'id');
    }

    public function alasanPelatihan()
    {
        return $this->belongsTo(SkorPelatihanPetani::class, 'alasan', 'id');
    }

    public function masaAktifKelompok()
    {
        return $this->belongsTo(MasaAktifKelompokTani::class, 'masa_aktif_kelompok', 'id');
    }

    public function getVerificationType(): string
    {
        return 'PELATIHAN_PERTANIAN';
    }

    public static function getDocumentTypes(): array
    {
        return [
            'foto' => 'Pas Foto',
            'ktp' => 'KTP',
            'pengukuhan_penyuluh_swadaya' => 'SK Pengukuhan Penyuluh Swadaya',
            'rekomendasi_kelompok' => 'Surat Rekomendasi Kelompok',
            'skd' => 'Surat Keterangan Domisili',
        ];
    }
}
