<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PelatihanBanmod extends Model
{
    use HasFactory;

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

        'komitmen',
    ];
}
