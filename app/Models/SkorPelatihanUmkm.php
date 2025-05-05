<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SkorPelatihanUmkm extends Model
{
    use HasFactory;

    protected $table = 'skor_pelatihan_umkm';

    protected $fillable = [
        'kategori',
        'jawaban',
        'skor'
    ];

    public function pelatihanUmkm()
    {
        return $this->belongsTo(PelatihanUmkm::class);
    }

    
}
