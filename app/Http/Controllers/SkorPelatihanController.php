<?php

namespace App\Http\Controllers;

use App\Models\SkorPelatihanUmkm;

class SkorPelatihanController extends Controller
{
    public function getSkorByKategori($kategori)
    {
        // Query the database for data in the specified category
        $skorData = SkorPelatihanUmkm::where('kategori', $kategori)
            ->get(['id', 'jawaban', 'skor']); // Fetch jawaban and skor columns

        // Return the data as JSON
        return response()->json($skorData);
    }
}
