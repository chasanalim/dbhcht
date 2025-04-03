<?php

namespace App\Http\Controllers;

use App\Models\JumlahTenagaKerja;
use Illuminate\Http\Request;

class JumlahTenagaKerjaController extends Controller
{
    public function index(Request $request)
    {
        $data = JumlahTenagaKerja::select('id', 'nama', 'jenis')->where('jenis', $request->query('kode_jenis'))->get();

        return response()->json($data);
    }
}
