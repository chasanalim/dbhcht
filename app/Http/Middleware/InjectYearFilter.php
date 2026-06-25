<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Inertia\Inertia;

class InjectYearFilter
{ 
    public function handle(Request $request, Closure $next)
    {
        $year = $request->query('year');

        if ($year) {
            $year = (int) $year;

            if ($year >= 2024 && $year <= now()->year + 1) {
                $request->session()->put('selected_year', $year);
            }
        }

        if (!$request->session()->has('selected_year')) {
            $request->session()->put('selected_year', now()->year);
        }

        Inertia::share([
            'selected_year' => fn () => $request->session()->get('selected_year', now()->year),
            'available_years' => fn () => range(now()->year, 2024),
        ]);

        return $next($request);
    }
}