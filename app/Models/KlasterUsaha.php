<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class KlasterUsaha extends Model
{
    protected $fillable = [
        'jenis',
        'nama'
    ];
}
