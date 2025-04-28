<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class JenisPelatihanKetKerja extends Model
{
    protected $fillable = [
        'nama',
        'pendidikan',
        'usia'
    ];
}
