<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class KelompokPelatihanPetani extends Model
{
    protected $fillable = ['nama'];

    public function pelatihanPetani()
    {
        return $this->hasMany(PelatihanPetani::class, 'kategori', 'id');
    }
}
