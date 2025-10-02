<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\LampiranFile;
use Illuminate\Http\Request;
use App\Models\PelatihanUmkm;
use App\Models\PelatihanBanmod;
use App\Models\PelatihanKerjas;
use App\Models\PelatihanPetani;
use App\Models\PendaftaranBanmod;
use Illuminate\Support\Facades\Storage;

class HomeController extends Controller
{
    public function index()
    {
        $banmod = PendaftaranBanmod::count();
        $pelatihanbanmod = PelatihanBanmod::count();
        $pencarikerja = PelatihanKerjas::count();
        $umkm = PelatihanUmkm::count();
        $pertanian = PelatihanPetani::count();


        return Inertia::render('Home/Index', [
            'meta' => [
                'title' => 'Landing Page',
            ],
            'banmod' => $banmod,
            'pelatihanbanmod' => $pelatihanbanmod,
            'pencarikerja' => $pencarikerja,
            'umkm' => $umkm,
            'pertanian' => $pertanian
        ]);
    }

    public function file()
    {

        $banmod = LampiranFile::where('kategori', 'banmod')->get();
        $pelatihanbanmod = LampiranFile::where('kategori', 'pelatihan-banmod')->get();
        $pencarikerja = LampiranFile::where('kategori', 'pencari-kerja')->get();
        $umkm = LampiranFile::where('kategori', 'umkm')->get();
        $pertanian = LampiranFile::where('kategori', 'pertanian')->get();


        return Inertia::render('Home/File', [
            'meta' => [
                'title' => 'Download File',
            ],
            'banmod' => $banmod,
            'pelatihanbanmod' => $pelatihanbanmod,
            'pencarikerja' => $pencarikerja,
            'umkm' => $umkm,
            'pertanian' => $pertanian
        ]);
    }
    public function download($filename)
    {
        // Asumsikan file disimpan di storage/app/public/panduan
        $path = 'template/' . $filename;

        if (Storage::disk('public')->exists($path)) {
            return Storage::disk('public')->download($path);
        }

        return redirect()->back()->with('error', 'File tidak ditemukan');
    }

    public function pelatihan(Request $request)
    {
        return Inertia::render('Pelatihan/FormPelatihan', [
            'meta' => [
                'title' => 'Form Pendaftaran Pelatihan',
            ],
            'jenis' => $request->query('jenis')
        ]);
    }
}
