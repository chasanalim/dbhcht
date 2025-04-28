<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MasaAktifKelompokTani extends Model
{
    use HasFactory;

    protected $table = 'masa_aktif_kelompok_tanis';

    protected $fillable = [
        'kategori',
        'jawaban',
        'skor'
    ];
}
