<?php

use App\Http\Controllers\BanmodController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\UserController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;


Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/download', [HomeController::class, 'file'])->name('download');
Route::get('/download/{file}', [HomeController::class, 'download'])->name('download.file');
Route::get('/pelatihan', [HomeController::class, 'pelatihan'])->name('pelatihan');



Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('/dashboard', function () {
        return Inertia::render('Admin/Dashboard');
    })->name('dashboard');
    Route::get('/downloads', function () {
        return Inertia::render('Admin/File/Index');
    })->name('admin.downloads');
});

Route::prefix('users')->as('users.')->group(function () {
    Route::get('/', [UserController::class, 'index'])->middleware(['auth', 'verified'])->name('index');
    // Route::get('/profile', [AuthController::class, 'profile'])->name('profile');
    // Route::post('/', [UserController::class, 'store'])->middleware(['auth', 'verified'])->name('store');
    // Route::put('/{id}', [UserController::class, 'update'])->middleware(['auth', 'verified'])->name('update');
    // Route::put('/{id}/restore', [UserController::class, 'restore'])->middleware(['auth', 'verified'])->name('restore');
    // Route::delete('/{id}/archive', [UserController::class, 'archive'])->middleware(['auth', 'verified'])->name('archive');
});

Route::prefix('banmod')->group(function () {
    Route::get('/', [BanmodController::class, 'index'])->name('banmod');
    Route::get('/store', [BanmodController::class, 'store'])->name('banmod.store');
});
require __DIR__ . '/auth.php';
