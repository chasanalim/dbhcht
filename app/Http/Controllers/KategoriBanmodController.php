<?php

namespace App\Http\Controllers;

use App\Models\KategoriBanmod;
use Illuminate\Http\Request;

class KategoriBanmodController extends Controller
{

    public function index()
    {
        $data = KategoriBanmod::select('id', 'nama', 'jenis')->get();

        return response()->json($data);
    }

}
