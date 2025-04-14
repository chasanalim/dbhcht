<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LampiranFile extends Model
{
    protected $table = 'lampiran_file';

    protected $fillable = [
        'nama',
        'deskripsi',
        'file_name',
        'kategori',
    ];

    
}
