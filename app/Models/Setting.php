<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Setting extends Model
{
    protected $fillable = [
        'key',
        'value',
    ];

    public static function boolValue(string $key, bool $default = false): bool
    {
        return (bool) filter_var(
            static::where('key', $key)->value('value') ?? ($default ? '1' : '0'),
            FILTER_VALIDATE_BOOLEAN
        );
    }
}