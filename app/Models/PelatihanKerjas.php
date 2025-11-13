<?php

namespace App\Models;

use App\Traits\HasVerifikasiDokumen;
use Illuminate\Database\Eloquent\Model;

class PelatihanKerjas extends Model
{
    use HasVerifikasiDokumen;
    protected $fillable = [
        "nik",
        "no_kk",
        "nama_lengkap",
        "tmp_lhr",
        "tgl_lhr",
        "jenis_kelamin",
        "alamat",
        "kode_kecamatan",
        "nama_kecamatan",
        "kode_kelurahan",
        "nama_kelurahan",
        "kode_rw",
        "nama_rw",
        "kode_rt",
        "nama_rt",
        "file_ktp",
        "file_kk",
        "file_pasfoto",
        "file_surat_pernyataan_tidak_ikut",
        "file_surat_kesanggupan",
        "file_fotokopi_ijazah",
        "phone_number",
        "alasan",
        "pendidikan",
        "jenis_pelatihan",
        'status'
    ];

    public function refPendidikan()
    {
        return $this->belongsTo(RefPendidikan::class, 'pendidikan', 'id');
    }
    public function jenisPelatihan()
    {
        return $this->belongsTo(JenisPelatihanKetKerja::class, 'jenis_pelatihan', 'id');
    }
    public function alasanPelatihan()
    {
        return $this->belongsTo(AlasanPelatihanKetKerja::class, 'alasan', 'id');
    }

    public function getVerificationType(): string
    {
        return 'PELATIHAN_KERJA';
    }

    public static function getDocumentTypes(): array
    {
        return [
            'ktp' => 'KTP',
            'kk' => 'Kartu Keluarga',
            'pasfoto' => 'Pas Foto',
            'surat_pernyataan_tidak_ikut' => 'Surat Pernyataan Tidak Mengikuti Pelatihan Lain',
            'surat_kesanggupan' => 'Surat Kesanggupan Mengikuti Pelatihan',
            'fotokopi_ijazah' => 'Fotokopi Ijazah',
        ];
    }

    public function getJenisPelatihan()
    {
        return ' Pencari Kerja';
    }
}
