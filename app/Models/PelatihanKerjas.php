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
        // Field baru untuk scoring
        "status_bekerja",
        "pernah_pelatihan",
        "status_domisili",
        'status',
        'keterangan'
    ];

    // Tambah appends untuk skor
    protected $appends = [
        'skor',
    ];

    // Method untuk menghitung skor
    public function getSkorAttribute()
    {
        $skor = 0;

        // Skor dari alasan pelatihan (relasi)
        $skor += $this->alasanPelatihan->skor ?? 0;

        // Skor status bekerja (1-3)
        $skor += $this->status_bekerja ?? 0;

        // Skor pernah pelatihan (1 atau 3)
        $skor += $this->pernah_pelatihan ?? 0;

        // Skor status domisili (1-3)
        $skor += $this->status_domisili ?? 0;

        if ($skor === 0) {
            return 0;
        }

        // Total maksimal = 4 (alasan) + 3 (status_bekerja) + 3 (pernah) + 3 (domisili) = 13
        return ($skor / 12) * 100;
    }

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
