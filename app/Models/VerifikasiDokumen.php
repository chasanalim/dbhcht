<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class VerifikasiDokumen extends Model
{
    protected $table = 'verifikasi_dokumen';

    protected $fillable = [
        'pelatihan_type',
        'pelatihan_id',
        'document_type',
        'status',
        'verified_by',
        'verified_at',
        'notes'
    ];

    protected $casts = [
        'verified_at' => 'datetime'
    ];

    public function verifier()
    {
        return $this->belongsTo(User::class, 'verified_by');
    }

    public function verifiable()
    {
        return $this->morphTo(__FUNCTION__, 'pelatihan_type', 'pelatihan_id');
    }
}
