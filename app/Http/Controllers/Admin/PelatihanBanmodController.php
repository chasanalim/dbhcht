<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;
use App\Models\PelatihanBanmod;
use Yajra\DataTables\DataTables;
use App\Http\Controllers\Controller;
use Illuminate\Routing\Controllers\HasMiddleware;


class PelatihanBanmodController extends Controller implements HasMiddleware
{
    /**
     * Display a listing of the resource.
     */

    public static function middleware(): array
    {
        return [
            'permission:view-pelatihan-banmod',
            // 'role:admin',
        ];
    }

    public function index(Request $request)
    {
        // $query = PelatihanBanmod::get();
        // return response()->json($query);
        if ($request->wantsJson()) {

            $query = PelatihanBanmod::query();

            if ($request->has('jenis_pelatihan_industri') && $request->jenis_pelatihan_industri !== 'Semua Pelatihan') {
                $query->where('jenis_pelatihan_industri', $request->jenis_pelatihan_industri);
            }

            return DataTables::of($query)
                ->addIndexColumn()
                ->addColumn('action', function ($row) {
                    return [
                        'edit_url' => route('admin.pelatihan-banmod.edit', $row->id),
                        'delete_url' => route('admin.pelatihan-banmod.destroy', $row->id),
                        'detail_url' => route('admin.pelatihan-banmod.show', $row->id)
                    ];
                })
                ->make(true);
        }

        $pelatihan = [
            ['name' => 'Semua Pelatihan'],
            ['name' => 'Tenun'],
            ['name' => 'Batik/Ecoprint'],
            ['name' => 'Sulam/Bordir'],
            ['name' => 'Rajut'],
            ['name' => 'Aksesoris (Gelang, Kalung)'],
            ['name' => 'Anyaman'],
            ['name' => 'Kerajinan Lainnya'],
            ['name' => 'Penjahitan Pakaian'],
            ['name' => 'Penjahitan Tas, Dompet, dll'],
            ['name' => 'Bengkel'],
            ['name' => 'Makanan (Roti)'],
            ['name' => 'Makanan (Kue Kering)'],
            ['name' => 'Makanan (Kue Basah)'],
            ['name' => 'Makanan (Catering)'],
            ['name' => 'Makanan (Olahan Daging/Ikan)'],
            ['name' => 'Makanan (Keripik, Krupuk, Rempeyek)'],
            ['name' => 'Minuman (Jamu)'],
            ['name' => 'Minuman (Kekinian)'],
            ['name' => 'Fotokopi/Percetakan'],
            ['name' => 'Sablon Kaos'],
        ];

        return inertia('Admin/PelatihanBanmod/Index', [
            'title' => 'Pelatihan Penerima Banmod',
            'flash' => [
                'message' => session('message')
            ],
            'pelatihan' => $pelatihan,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
