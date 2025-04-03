<?php

namespace App\Http\Controllers;

use App\Models\JumlahLegalitas;
use Illuminate\Http\Request;

class JumlahLegalitasController extends Controller
{
    public function index()
    {
        $data = JumlahLegalitas::select('id', 'nama', 'jenis')->get();

        return response()->json($data);
    }
}
