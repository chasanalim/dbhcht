<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class JenisPelatihanPetani extends Model
{
    protected $fillable = ['nama'];

    public function pelatihanPetani()
    {
        return $this->hasMany(PelatihanPetani::class, 'jenis_pelatihan_petani', 'id');
    }
}


