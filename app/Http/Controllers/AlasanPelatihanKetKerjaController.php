<?php

namespace App\Http\Controllers;

use App\Models\AlasanPelatihanKetKerja;
use Illuminate\Http\Request;

class AlasanPelatihanKetKerjaController extends Controller
{
    public function index()
    {
        $data = AlasanPelatihanKetKerja::select('id', 'nama')->get();

        return response()->json($data);
    }
}
