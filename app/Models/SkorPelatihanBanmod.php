<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SkorPelatihanBanmod extends Model
{
    use HasFactory;

    protected $table = 'skor_pelatihan_banmod';

    protected $fillable = [
        'kategori',
        'jawaban',
        'skor',
    ];
}
