<?php

namespace App\Http\Controllers\Admin;

use Inertia\Inertia;
use Illuminate\Http\Request;
use Yajra\DataTables\DataTables;
use App\Models\PendaftaranBanmod;
use App\Http\Controllers\Controller;
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
            $query = PendaftaranBanmod::query();

            if ($request->has('kategori') && $request->kategori !== 'all') {
                $query->where('kategori', $request->kategori);
            }

            return DataTables::of($query)
                ->addIndexColumn()
                ->addColumn('action', function ($row) {
                    return [
                        'edit_url' => route('admin.banmod.edit', $row->id),
                        'delete_url' => route('admin.banmod.destroy', $row->id)
                    ];
                })
                ->make(true);
        }
        $categories = [
            ['id' => 'all', 'name' => 'Semua Kategori'],
            ['id' => '1', 'name' => 'Buruh Pabrik Rokok'],
            ['id' => '2', 'name' => 'Buruh Tani Tembakau'],
            ['id' => '3', 'name' => 'Pekerja Pabrik Rokok'],
            ['id' => '4', 'name' => 'IKM'],
            ['id' => '5', 'name' => 'Masyarakat Miskin'],
        ];

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
