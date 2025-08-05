<?php

namespace App\Http\Controllers;

use App\Models\LampiranFile;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class HomeController extends Controller
{
    public function index()
    {
        return Inertia::render('Home/Index', [
            'meta' => [
                'title' => 'Landing Page',
            ],
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
