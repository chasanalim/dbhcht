<?php

namespace App\Http\Controllers;

use App\Models\StatusTempatTinggal;
use Illuminate\Http\Request;

class StatusTempatTinggalController extends Controller
{
    public function index()
    {
        $data = StatusTempatTinggal::select('id', 'nama', 'jenis')->get();

        return response()->json($data);
    }
}
