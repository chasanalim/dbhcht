<?php

namespace App\Http\Controllers;

use App\Models\KlasterUsaha;
use Illuminate\Http\Request;

class KlasterUsahaController extends Controller
{
    public function index(Request $request)
    {
        $data = KlasterUsaha::select('id', 'nama', 'jenis')->where('jenis', $request->query('kode_jenis'))->get();

        return response()->json($data);
    }
}
