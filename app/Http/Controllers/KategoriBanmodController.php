<?php

namespace App\Http\Controllers;

use App\Models\KategoriBanmod;
use Illuminate\Http\Request;

class KategoriBanmodController extends Controller
{

    public function index()
    {
        // Kategori 4 (Industri Kecil Menengah) ditutup untuk pendaftaran publik
        $data = KategoriBanmod::select('id', 'nama', 'jenis')
            ->where('id', '!=', 4)
            ->get();

        return response()->json($data);
    }

}
