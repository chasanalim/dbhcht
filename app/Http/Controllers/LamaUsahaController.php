<?php

namespace App\Http\Controllers;

use App\Models\LamaUsaha;
use Illuminate\Http\Request;

class LamaUsahaController extends Controller
{
    public function index(Request $request)
    {
        $data = LamaUsaha::select('id', 'nama', 'jenis')->where('jenis', $request->query('kode_jenis'))->get();

        return response()->json($data);
    }
}
