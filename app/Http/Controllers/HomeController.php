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
        // return Inertia::render('404/BelumTersedia', [
        return Inertia::render('Pelatihan/FormPelatihan', [
            'meta' => [
                'title' => 'Form Pendaftaran Pelatihan',
            ],
            'jenis' => $request->query('jenis')
        ]);
    }

    public function cekStatus()
    {
        return Inertia::render('Home/Status', [
            'meta' => [
                'title' => 'Cek Status Pendaftaran Banmod dan Pelatihan',
            ],
        ]);
    }
    public function cekNIK(Request $request, $nik)
    {
        if (strlen($nik) != 16) {
            return response()->json([
                'success' => false,
                'message' => 'Maaf, format NIK harus 16 digit'
            ], 400);
        }

        $results = [];

        // Check in all models
        $models = [
            'Pelatihan UMKM' => PelatihanUmkm::class,
            'Pelatihan Penerima Banmod' => PelatihanBanmod::class,
            'Pelatihan Pencari Kerja' => PelatihanKerjas::class,
            'Pelatihan Pertanian' => PelatihanPetani::class,
            'Bantuan Modal Usaha' => PendaftaranBanmod::class
        ];

        foreach ($models as $type => $model) {
            $data = $model::where('nik', $nik)->first();

            if ($data) {
                $results[] = [
                    'jenis_pelatihan' => $type,
                    'nama' => $data->nama_lengkap ?? $data->name,
                    'nik' => $data->nik,
                    // 'verifikasi_dokumen' => $data->documentVerifications()->count(),
                    'status' => $this->getStatus($data->status),
                    'created_at' => $data->created_at->format('d-m-Y') ?? 'NULL',
                ];
            }
        }

        if (count($results) > 0) {
            return response()->json([
                'success' => true,
                'data' => $results,
                'message' => 'Data ditemukan'
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'NIK tidak ditemukan'
        ], 404);
    }

    private function getStatus($status)
    {
        return match($status) {
            0 => 'Menunggu Verifikasi',
            1 => 'Lolos',
            2 => 'Tidak Lolos',
            3 => 'Blacklist',
            4 => 'Ditolak - Lolos di Pelatihan Lain',
            default => 'Menunggu Verifikasi',
        };
    }
}
