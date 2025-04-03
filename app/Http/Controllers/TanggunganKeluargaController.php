<?php

namespace App\Http\Controllers;

use App\Models\TanggunganKeluarga;
use Illuminate\Http\Request;

class TanggunganKeluargaController extends Controller
{
    public function index()
    {
        $data = TanggunganKeluarga::select('id', 'nama', 'jenis')->get();

        return response()->json($data);
    }
}
