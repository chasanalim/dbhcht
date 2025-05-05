<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class KelompokTani extends Model
{
    use HasFactory;

    protected $table = 'kelompok_tanis';

    protected $fillable = [
        'kecamatan',
        'kelurahan',
        'nama_kelompok',
        'no_register',
        'nama_ketua',
        'nik_ketua',
        'nama_anggota',
        'nik_anggota',
        'tahun_berdiri',
        'tingkat_kemampuan',
        'keterangan',
    ];


    public function pelatihanPetani()
    {
        return $this->hasMany(PelatihanPetani::class, 'nama_kelompok', 'id');
    }
}
