<?php

namespace App\Http\Controllers;

use App\Models\MasaAktifKelompokTani;
use App\Models\SkorPelatihanPetani;
use Illuminate\Http\Request;

class RegSkorPelatihanPetaniController extends Controller
{
    public function skorpelatihanpetani()
    {
        $data = SkorPelatihanPetani::select('id', 'kategori', 'jawaban', 'skor')->get();

        return response()->json($data);
    }

    public function masaaktifkelompoktani()
    {
        $data = MasaAktifKelompokTani::select('id', 'kategori', 'jawaban', 'skor')->get();

        return response()->json($data);
    }
}
