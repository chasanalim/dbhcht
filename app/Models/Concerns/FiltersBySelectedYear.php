<?php

namespace App\Models\Concerns;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;

trait FiltersBySelectedYear
{
    protected static function bootFiltersBySelectedYear(): void
    {
        static::addGlobalScope('selected_year', function (Builder $builder) {
            if (app()->runningInConsole()) {
                return;
            }

            $request = request();

            // Filter hanya untuk panel admin
            if (!$request->routeIs('admin.*') && !$request->is('admin/*')) {
                return;
            }

            // Bypass kalau suatu saat butuh semua tahun
            if ($request->boolean('without_year_filter')) {
                return;
            }

            $year = (int) session('selected_year', now()->year);

            if ($year < 2024 || $year > now()->year + 1) {
                $year = now()->year;
            }

            $table = $builder->getModel()->getTable();

            $start = Carbon::create($year, 1, 1, 0, 0, 0)->startOfYear();
            $end = Carbon::create($year, 12, 31, 23, 59, 59)->endOfYear();

            $builder->whereBetween("{$table}.created_at", [$start, $end]);
        });
    }

    public function scopeWithoutSelectedYearFilter(Builder $query): Builder
    {
        return $query->withoutGlobalScope('selected_year');
    }
}