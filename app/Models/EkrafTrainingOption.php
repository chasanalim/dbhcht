<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EkrafTrainingOption extends Model
{
    protected $fillable = [
        'value',
        'label',
        'is_active',
        'order',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'order' => 'integer',
    ];

    /**
     * Ambil opsi pelatihan Ekraf yang aktif, diurutkan sesuai order.
     */
    public static function activeOptions()
    {
        return self::where('is_active', true)
            ->orderBy('order')
            ->orderBy('label')
            ->get();
    }
}
