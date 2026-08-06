<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class MasterPencariKerja extends Model
{
    use HasFactory;

    protected $table = 'master_pencari_kerja';

    protected $fillable = [
        'nik',
        'nama',
        'tempat_lahir',
        'tanggal_lahir',
        'jenis_kelamin',
        'alamat',
        'rt',
        'rw',
        'kelurahan',
        'kecamatan',
        'jenis_pelatihan',
        'tahun',
    ];
}
