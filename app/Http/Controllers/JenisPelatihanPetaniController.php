<?php

namespace App\Http\Controllers;

use App\Models\JenisPelatihanPetani;
use Illuminate\Http\Request;

class JenisPelatihanPetaniController extends Controller
{
    public function index()
    {
        $data = JenisPelatihanPetani::select('id', 'nama', 'jenis')->get();

        return response()->json($data);
    }
}
