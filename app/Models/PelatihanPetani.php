<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PelatihanPetani extends Model
{
    use HasFactory;

    protected $table = 'pelatihan_petanis';

    protected $fillable = [
        'nik',
        'kk',
        'jenis_kelamin',
        'nama_lengkap',
        'no_hp',
        'kode_kecamatan',
        'kode_kelurahan',
        'nama_rw',
        'nama_rt',
        'alamat',
        'alamat_domisili',
        'tmp_lhr',
        'tgl_lhr',
        'pendidikan',
        'is_disabilitas',
        'jenis_disabilitas',
        'nama_kelompok',
        'tahun_berdiri',
        'masa_aktif_kelompok',
        'bidang_usaha_kelompok',
        'kode_kecamatan_kelompok',
        'kode_kelurahan_kelompok',
        'nama_rw_kelompok',
        'nama_rt_kelompok',
        'alamat_kelompok',
        'file_foto',
        'file_ktp',
        'file_pengukuhan_penyuluh_swadaya',
        'file_rekomendasi_kelompok',
        'kategori',
        'jenis_pelatihan_petani',
        'alasan',
    ];
}
