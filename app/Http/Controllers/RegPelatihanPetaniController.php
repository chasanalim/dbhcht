<?php

namespace App\Http\Controllers;

use App\Models\JenisPelatihanPetani;
use App\Models\KelompokPelatihanPetani;
use Illuminate\Http\Request;

class RegPelatihanPetaniController extends Controller
{
    public function kelompokpelatihanpetani()
    {
        $data = KelompokPelatihanPetani::select('id', 'nama', 'jenis')->get();

        return response()->json($data);
    }

    public function jenispelatihanpetani1()
    {
        $data = JenisPelatihanPetani::select('id', 'nama', 'jenis')
            ->where('jenis', 1)
            ->get();

        return response()->json($data);
    }

    public function jenispelatihanpetani2()
    {
        $data = JenisPelatihanPetani::select('id', 'nama', 'jenis')
            ->where('jenis', 2)
            ->get();

        return response()->json($data);
    }
}
