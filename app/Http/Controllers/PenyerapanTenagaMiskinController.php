<?php

namespace App\Http\Controllers;

use App\Models\PenyerapanTenagaMiskin;
use Illuminate\Http\Request;

class PenyerapanTenagaMiskinController extends Controller
{
    public function index()
    {
        $data = PenyerapanTenagaMiskin::select('id', 'nama', 'jenis')->get();

        return response()->json($data);
    }
}
