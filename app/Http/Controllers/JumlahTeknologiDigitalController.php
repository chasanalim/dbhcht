<?php

namespace App\Http\Controllers;

use App\Models\JumlahTeknologiDigital;
use Illuminate\Http\Request;

class JumlahTeknologiDigitalController extends Controller
{
    public function index()
    {
        $data = JumlahTeknologiDigital::select('id', 'nama', 'jenis')->get();

        return response()->json($data);
    }
}
