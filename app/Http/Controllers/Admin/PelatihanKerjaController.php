<?php

namespace App\Http\Controllers\Admin;

use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\PelatihanKerjas;
use Yajra\DataTables\DataTables;
use App\Models\PendaftaranBanmod;
use App\Http\Controllers\Controller;
use App\Models\JenisPelatihanKetKerja;
use Illuminate\Routing\Controllers\HasMiddleware;

class PelatihanKerjaController extends Controller implements HasMiddleware
{
    /**
     * Display a listing of the resource.
     */
    public static function middleware(): array
    {
        return [
            'permission:view-pelatihan-kerja',
            // 'role:admin',
        ];
    }
    public function index(Request $request)
    {
        if ($request->wantsJson()) {
            $query = PelatihanKerjas::query();

            if ($request->has('jenis_pelatihan') && $request->jenis_pelatihan !== 'all') {
                $query->where('jenis_pelatihan', $request->jenis_pelatihan);
            }

            return DataTables::of($query)
                ->addIndexColumn()
                ->addColumn('action', function ($row) {
                    return [
                        'edit_url' => route('admin.kerja.edit', $row->id),
                        'delete_url' => route('admin.kerja.destroy', $row->id),
                        'detail_url' => route('admin.kerja.show', $row->id)
                    ];
                })
                ->make(true);
        }
        $categories= JenisPelatihanKetKerja::all();


        // return response()->json($categories);
        return Inertia::render('Admin/PelatihanKerja/Index', [
            'title' => 'Daftar Peserta Pelatihan Pencari Kerja',
            'flash' => [
                'message' => session('message')
            ],
            'dataRoute' => route('admin.banmod.index'),
            'categories' => $categories,
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
