<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class HomeController extends Controller
{
    public function index()
    {
        return Inertia::render('Home/Index', [
            'meta' => [
                'tit                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 l                                                                        e' => 'Home Page',
            ],
        ]);
    }

    public function file()
    {
        $banmod = [
            [
                'id' => 1,
                'name' => 'Buku Pedoman',
                'file_name' => 'buku-pedoman.pdf',
                'description' => 'Buku Pedoman Banmod 2025.pdf',
                'size' => '2.5 MB',
                'uploaded_at' => '2025-03-10'
            ],
            [
                'id' => 2,
                'name' => 'Surat Pernyataan',
                'file_name' => 'surat-pernyataan.pdf',
                'description' => 'Surat Pernyataan Penerima Banmod 2025.pdf',
                'size' => '1.2 MB',
                'uploaded_at' => '2025-03-12'
            ],
            [
                'id' => 3,
                'name' => 'RAB Banmod',
                'file_name' => 'rab.pdf',
                'description' => 'RAB Banmod 2025.pdf',
                'size' => '3.0 MB',
                'uploaded_at' => '2025-03-15'
            ],
            [
                'id' => 3,
                'name' => 'Pencairan Banmod',
                'file_name' => 'pencairan.pdf',
                'description' => 'Petunjuk Pencairan Banmod 2025.pdf',
                'size' => '3.0 MB',
                'uploaded_at' => '2025-03-15'
            ],
        ];

        $pelatihan = [
            [
                'id' => 1,
                'name' => 'Surat Pernyataan Komitmen',
                'file_name' => 'panduan-pengguna.pdf',
                'description' => 'Format Surat Pernyataan Komitmen.docx',
                'size' => '2.5 MB',
                'uploaded_at' => '2025-03-10'
            ],
            [
                'id' => 2,
                'name' => 'Surat Keterangan Domisili',
                'file_name' => 'manual-instalasi.pdf',
                'description' => 'Format Surat Keterangan Domisili.docx',
                'size' => '1.2 MB',
                'uploaded_at' => '2025-03-12'
            ],
            [
                'id' => 3,
                'name' => 'Surat Keterangan Usaha',
                'file_name' => 'troubleshooting.pdf',
                'description' => 'Format Surat Keterangan Usaha.docx',
                'size' => '3.0 MB',
                'uploaded_at' => '2025-03-15'
            ],
        ];

        return Inertia::render('Home/File', [
            'meta' => [
                'title' => 'Download File',
            ],
            'banmod' => $banmod,
            'pelatihan' => $pelatihan,
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

    public function pelatihan()
    {
        return Inertia::render('Pelatihan/FormPelatihan', [
            'meta' => [
                'title' => 'Form Pendaftaran Pelatihan',
            ],
        ]);
    }
}
