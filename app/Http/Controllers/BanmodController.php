<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class BanmodController extends Controller
{
    public function index()
    {
        return Inertia::render('Banmod/Create', [
            'meta' => [
                'title' => 'Pendaftaran Banmod',
            ],
        ]);
    }

    public function store(Request $request)
    {
        dd($request->all());
        $validated = $request->validate([
            'name' => ['required'],
        ]);

        return to_route('banmod')->with('success', 'Aduan berhasil dikirim.');
    }
}
