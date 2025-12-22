<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\PelatihanLolosController;

// Route::get('/user', function (Request $request) {
//     return $request->user();
// })->middleware('auth:sanctum');

Route::prefix('v1')->group(function () {
    Route::get('/dashboard/pelatihan', [DashboardController::class, 'index'])->name('api.dashboard');
    
    // Pelatihan Lolos (Status = 1)
    Route::get('/pelatihan-lolos', [PelatihanLolosController::class, 'index'])->name('api.pelatihan-lolos');
    Route::get('/pelatihan-lolos/{type}', [PelatihanLolosController::class, 'getByType'])->name('api.pelatihan-lolos.by-type');
});
