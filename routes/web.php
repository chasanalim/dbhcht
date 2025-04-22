<?php

use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use Illuminate\Foundation\Application;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\BrutoController;
use App\Http\Controllers\BanmodController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\LamaUsahaController;
use App\Http\Controllers\KlasterUsahaController;
use App\Http\Controllers\SkorPelatihanController;
use App\Http\Controllers\KategoriBanmodController;
use App\Http\Controllers\Admin\UserAdminController;
use App\Http\Controllers\JumlahLegalitasController;
use App\Http\Controllers\JumlahTenagaKerjaController;
use App\Http\Controllers\Admin\LampiranFileController;
use App\Http\Controllers\TanggunganKeluargaController;
use App\Http\Controllers\Admin\PelatihanUMKMController;
use App\Http\Controllers\Admin\PendaftaranBanmodController;
use App\Http\Controllers\Admin\PenerimaBanmodLamaController;
use App\Http\Controllers\TanggunganKeluargaController;
use App\Http\Controllers\StatusTempatTinggalController;
use App\Http\Controllers\Admin\PelatihanKerjaController;
use App\Http\Controllers\Admin\PelatihanBanmodController;
use App\Http\Controllers\JumlahTeknologiDigitalController;
use App\Http\Controllers\PenyerapanTenagaMiskinController;
use App\Http\Controllers\Admin\PendaftaranBanmodController;
use App\Http\Controllers\PelatihanPenerimaBanmodController;


Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/download', [HomeController::class, 'file'])->name('download');
Route::get('/download/{file}', [HomeController::class, 'download'])->name('download.file');
Route::get('/pelatihan', [HomeController::class, 'pelatihan'])->name('pelatihan');

Route::prefix('admin')->as('admin.')->middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('/dashboard', function () {
        return Inertia::render('Admin/Dashboard/Dashboard');
    })->name('dashboard');

    Route::resource('downloads', LampiranFileController::class);
    Route::resource('banmod', PendaftaranBanmodController::class);
    Route::resource('umkm', PelatihanUMKMController::class);
    Route::resource('pertanian', PelatihanPertanianController::class);
    Route::resource('pelatihan-banmod', PelatihanBanmodController::class);
    Route::resource('kerja', PelatihanKerjaController::class);
    Route::resource('user', UserAdminController::class);
    Route::resource('banmodlama', PenerimaBanmodLamaController::class);
    Route::resource('banmodwirausaha', PenerimaPelatihanBanmodController::class);
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
    Route::post('/store', [BanmodController::class, 'store'])->name('banmod.store');
    Route::get('/success/{id}', [BanmodController::class, 'success'])->name('banmod.success');
    Route::get('/cek-nik/{nik}', [BanmodController::class, 'ceknik'])->name('banmod.ceknik');
});

Route::prefix('peserta')->group(function () {
    Route::post('/', [BanmodController::class, 'peserta'])->name('peserta');
    Route::get('/', [BanmodController::class, 'peserta'])->name('peserta');
});

Route::prefix('pelatihan/banmod')->group(function () {
    Route::get('/', [PelatihanPenerimaBanmodController::class, 'create'])->name('pelatihan-banmod.create');
    Route::post('/', [PelatihanPenerimaBanmodController::class, 'store'])->name('pelatihan-banmod.store');
    Route::post('/cek-nik', [PelatihanPenerimaBanmodController::class, 'cekNIK'])->name('pelatihan-banmod.cekNIK.post');
    Route::get('/cek-nik/{nik}', [PelatihanPenerimaBanmodController::class, 'cekNIK'])->name('pelatihan-banmod.cekNIK.get');
});

Route::get('/skor/{kategori}', [SkorPelatihanController::class, 'getSkorByKategori']);

Route::prefix('refer')->as('refer.')->group(function () {
    Route::prefix('kategoribanmod')->as('kategoribanmod.')->group(function () {
        Route::get('/', [KategoriBanmodController::class, 'index'])->name('index');
    });
    Route::prefix('klasterusaha')->as('klasterusaha.')->group(function () {
        Route::get('/', [KlasterUsahaController::class, 'index'])->name('index');
    });
    Route::prefix('lamausaha')->as('lamausaha.')->group(function () {
        Route::get('/', [LamaUsahaController::class, 'index'])->name('index');
    });
    Route::prefix('tanggungankeluarga')->as('tanggungankeluarga.')->group(function () {
        Route::get('/', [TanggunganKeluargaController::class, 'index'])->name('index');
    });
    Route::prefix('tenagakerja')->as('tenagakerja.')->group(function () {
        Route::get('/', [JumlahTenagaKerjaController::class, 'index'])->name('index');
    });
    Route::prefix('bruto')->as('bruto.')->group(function () {
        Route::get('/', [BrutoController::class, 'index'])->name('index');
    });
    Route::prefix('tempattinggal')->as('tempattinggal.')->group(function () {
        Route::get('/', [StatusTempatTinggalController::class, 'index'])->name('index');
    });
    Route::prefix('legalitas')->as('legalitas.')->group(function () {
        Route::get('/', [JumlahLegalitasController::class, 'index'])->name('index');
    });
    Route::prefix('teknologi')->as('teknologi.')->group(function () {
        Route::get('/', [JumlahTeknologiDigitalController::class, 'index'])->name('index');
    });
    Route::prefix('penyerapannaker')->as('penyerapannaker.')->group(function () {
        Route::get('/', [PenyerapanTenagaMiskinController::class, 'index'])->name('index');
    });
    Route::prefix('jenispelatihanpetani')->as('jenispelatihanpetani.')->group(function () {
        Route::get('/', [JenisPelatihanPetaniController::class, 'index'])->name('index');
    });
    Route::prefix('skorpelatihanpetani')->as('skorpelatihanpetani.')->group(function () {
        Route::get('/', [SkorPelatihanPetaniController::class, 'index'])->name('index');
    });
});
require __DIR__ . '/auth.php';
