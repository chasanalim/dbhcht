<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PenerimaBanmod extends Model
{
    use HasFactory;

    protected $table = 'penerima_banmods';

    protected $fillable = [
        'nik',
        'no_kk',
        'nama_lengkap',
        'jenis_kelamin',
        'kecamatan_ktp',
        'kelurahan_ktp',
        'rt',
        'rw',
        'alamat_ktp',
        'tahun_dapat_bantuan',
        'jenis_usaha',
    ];
}
