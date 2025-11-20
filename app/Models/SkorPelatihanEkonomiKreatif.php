<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SkorPelatihanEkonomiKreatif extends Model
{
    use HasFactory;

    protected $table = 'skor_pelatihan_ekonomi_kreatif';

    protected $fillable = [
        'jawaban',
        'skor'
    ];

    public function pelatihanEkonomiKreatif()
    {
        return $this->hasMany(PelatihanEkonomiKreatif::class, 'alasan');
    }
}
