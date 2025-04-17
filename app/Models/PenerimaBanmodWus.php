<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PenerimaBanmodWus extends Model
{
    use HasFactory;

    protected $table = 'penerima_banmod_wuses';

    protected $fillable = [
        'nik',
        'kk',
        'nama',
        'jenis_kelamin',
        'alamat',
        'kec',
        'kel',
        'rt',
        'rw',
        'tahun_dapat_bantuan',
        'jenis_usaha',
    ];
}
