<?php

namespace App\Http\Controllers\Admin;

use Inertia\Inertia;
use Illuminate\Http\Request;
use Yajra\DataTables\DataTables;
use App\Http\Controllers\Controller;
use App\Models\PelatihanUmkm;
use Illuminate\Routing\Controllers\HasMiddleware;

class PelatihanUMKMController extends Controller implements HasMiddleware
{
    /**
     * Display a listing of the resource.
     */
    
    public static function middleware(): array
    {
        return [
            'permission:view-pelatihan-umkm',
            // 'role:admin',
        ];
    }
    public function index(Request $request)
    {
        if ($request->wantsJson()) {
            $query = PelatihanUmkm::query();

            // Check prioritas_1
            if ($request->has('prioritas_1') && $request->prioritas_1 !== 'Semua Pelatihan') {

                $query->where('prioritas_1', $request->prioritas_1);

            }
            // Check prioritas_2 only if prioritas_1 is not set
            if (
                $request->has('prioritas_2') && $request->prioritas_2 !== 'Semua Pelatihan'
            ) {
                $query->where('prioritas_2', $request->prioritas_2);


            }
            // Check prioritas_3 only if prioritas_1 and prioritas_2 are not set
            if (
                $request->has('prioritas_3') && $request->prioritas_3 !== 'Semua Pelatihan'
            ) {
                $query->where('prioritas_3', $request->prioritas_3);
            }


            return DataTables::of($query)
                ->addIndexColumn()
                ->addColumn('action', function ($row) {
                    return [
                        'edit_url' => route('admin.umkm.edit', $row->id),
                        'delete_url' => route('admin.umkm.destroy', $row->id)
                    ];
                })
                ->make(true);
        }
        $pelatihan = [
            ['name' => 'Semua Pelatihan'],
            ['name' => 'Pelatihan Kurasi Produk'],
            ['name' => 'Pelatihan Konten Kreator'],
            ['name' => 'Pelatihan Desain Grafis'],
            ['name' => 'Pelatihan Manajemen Usaha dan Keuangan'],
            ['name' => 'Pelatihan Media Sosial dan E-Commerce'],
            ['name' => 'Pelatihan Peningkatan Kualitas SDM Pelaku Usaha'],
            ['name' => 'Pelatihan Strategi Foto Produk'],
            ['name' => 'Pelatihan Peningkatan Kualitas Produk Bakery'],
            ['name' => 'Pelatihan Barista'],
            ['name' => 'Pelatihan Bakery'],
            ['name' => 'Pelatihan Desain Kemasan dan Packaging'],
            ['name' => 'Pelatihan Produk Desain Motif Tenun/Batik'],
            ['name' => 'Pelatihan Produk Handicraft'],
            ['name' => 'Pelatihan Jajanan Kekinian'],
            ['name' => 'Pelatihan Korean Food'],
            ['name' => 'Pelatihan Reparasi Resep Masakan dan Kue Tradisional'],
        ];

        return Inertia::render('Admin/PelatihanUMKM/Index', [
            'title' => 'Pelatihan UMKM',
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
