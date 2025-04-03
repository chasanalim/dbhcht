<?php

namespace App\Http\Controllers;

use App\Models\Bruto;
use Illuminate\Http\Request;

class BrutoController extends Controller
{
    public function index(Request $request)
    {
        $data = Bruto::select('id', 'nama', 'jenis')->where('jenis', $request->query('kode_jenis'))->get();

        return response()->json($data);
    }
}
