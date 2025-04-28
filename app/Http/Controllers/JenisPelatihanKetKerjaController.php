<?php

namespace App\Http\Controllers;

use App\Models\JenisPelatihanKetKerja;
use Illuminate\Http\Request;

class JenisPelatihanKetKerjaController extends Controller
{
    public function index(Request $request)
    {
        $data = JenisPelatihanKetKerja::select('id', 'nama', 'pendidikan', 'usia')->where('pendidikan', '<=', $request->query('pendidikan'))->where('usia', '>=', $request->query('usia'))->get();

        return response()->json($data);
    }
}
