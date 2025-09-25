<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Pkl extends Model
{
    use HasFactory;

    protected $table = 'pkl';

    protected $fillable = [
        'lokasi',
        'nama',
        'nik',
        'alamat',
        'kel',
        'kec',
        'no_hp',
        'jenis_usaha',
    ];
}
