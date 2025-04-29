<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\SkorPelatihanBanmod;
use Illuminate\Http\Request;

class SkorPelatihanBanmodController extends Controller
{
    public function index($kategori)
    {
        $skor = SkorPelatihanBanmod::where('kategori', $kategori)->get();

        return response()->json($skor);
    }

    public function getSkor($kategori)
    {
        $data = SkorPelatihanBanmod::where('kategori', $kategori)->get();

        return response()->json($data);
    }
}
