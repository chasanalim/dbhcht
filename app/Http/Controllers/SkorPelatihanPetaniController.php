<?php

namespace App\Http\Controllers;

use App\Models\SkorPelatihanPetani;
use Illuminate\Http\Request;

class SkorPelatihanPetaniController extends Controller
{
    public function index()
    {
        $data = SkorPelatihanPetani::select('id', 'nama', 'jenis', 'skor')->get();

        return response()->json($data);
    }
}
