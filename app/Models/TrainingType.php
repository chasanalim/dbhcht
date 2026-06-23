<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TrainingType extends Model
{
    protected $fillable = [
        'value',
        'label',
        'title',
        'description',
        'image',
        'requirements',
        'duration',
        'location',
        'is_disabled',
        'coming_soon',
        'closed',
        'order',
    ];

    protected $casts = [
        'requirements' => 'array',
        'is_disabled' => 'boolean',
        'coming_soon' => 'boolean',
        'closed' => 'boolean',
    ];
}
