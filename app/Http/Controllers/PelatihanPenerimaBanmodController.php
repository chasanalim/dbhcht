<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\PenerimaBanmod;

class PelatihanPenerimaBanmodController extends Controller
{
    // Menampilkan form pelatihan banmod
    public function create()
    {
        return inertia('Pelatihan/Forms/FormPenerimaBanmod', [
            'meta' => [
                'title' => 'Pelatihan Keterampilan Penerima Banmod',
            ],
        ]);
    }

    // Menyimpan data pelatihan banmod
    public function store(Request $request)
    {
        // Validasi dan simpan data di sini...
    }

    // Fungsi untuk mengecek NIK apakah terdaftar sebagai penerima bantuan modal
    public function cekNIK(Request $request, $nik)
    {
        $data = PenerimaBanmod::where('nik', $nik)->first();

        if ($data) {
            return response()->json([
                'success' => true,
                'data' => $data,
            ]);
        } else {
            return response()->json([
                'success' => false,
                'message' => 'NIK tidak ditemukan sebagai penerima bantuan modal.',
            ]);
        }
    }
}
