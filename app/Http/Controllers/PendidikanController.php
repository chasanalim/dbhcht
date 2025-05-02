<?php

namespace App\Http\Controllers;

use App\Models\RefPendidikan;
use Illuminate\Http\Request;

class PendidikanController extends Controller
{
    public function index()
    {
        $data = RefPendidikan::select('id', 'nama')->get();

        return response()->json($data);
    }
}
