<?php

namespace App\Http\Controllers\Admin;

use Inertia\Inertia;
use Illuminate\Http\Request;
use Yajra\DataTables\DataTables;
use App\Models\PendaftaranBanmod;
use App\Http\Controllers\Controller;
use Illuminate\Routing\Controllers\HasMiddleware;

class PendaftaranBanmodController extends Controller implements HasMiddleware
{
    /**
     * Display a listing of the resource.
     */
    public static function middleware(): array
    {
        return [
            'permission:view-banmod',
            // 'role:admin',
        ];
    }
    public function index(Request $request)
    {
        $data = PendaftaranBanmod::all();
        if ($request->wantsJson()) {
            return DataTables::of($data)
                ->addIndexColumn()
                ->addColumn('action', function ($row) {
                    return [
                        'edit_url' => route('admin.banmod.edit', $row->id),
                        'delete_url' => route('admin.banmod.destroy', $row->id)
                    ];
                })
                ->make(true);
        }
        return Inertia::render('Admin/Banmod/Index', [
            'title' => 'Daftar Peserta Bantuan Modal - Semua Kategori',
            'flash' => [
                'message' => session('message')
            ],
            'dataRoute' => route('admin.banmod.index')
        ]);
    }

    public function buruh_pabrik_rokok(Request $request)
    {

        $data = PendaftaranBanmod::where('kategori', '1')->get();

        if ($request->wantsJson()) {
            return DataTables::of($data)
                ->addIndexColumn()
                ->addColumn('action', function ($row) {
                    return [
                        'edit_url' => route('admin.banmod.edit', $row->id),
                        'delete_url' => route('admin.banmod.destroy', $row->id)
                    ];
                })
                ->make(true);
        }

        return Inertia::render('Admin/Banmod/Index', [
            'title' => 'Daftar Peserta Bantuan Modal - Buruh Pabrik Rokok',
            'flash' => [
                'message' => session('message')
            ],
            'dataRoute' => route('admin.banmod.buruh-pabrik-rokok')
        ]);
    }
    public function buruh_tani_tembakau(Request $request)
    {
        $data = PendaftaranBanmod::where('kategori', '2')->get();
        if ($request->wantsJson()) {
            return DataTables::of($data)
                ->addIndexColumn()
                ->addColumn('action', function ($row) {
                    return [
                        'edit_url' => route('admin.banmod.edit', $row->id),
                        'delete_url' => route('admin.banmod.destroy', $row->id)
                    ];
                })
                ->make(true);
        }

        return Inertia::render('Admin/Banmod/Index', [
            'title' => 'Pendaftar Bantuan Modal',
            'flash' => [
                'message' => session('message')
            ],
            'dataRoute' => route('admin.banmod.buruh-tani-tembakau')
        ]);
    }
    public function pekerja_pabrik_rokok(Request $request)
    {
        $data = PendaftaranBanmod::where('kategori', '3')->get();
        if ($request->wantsJson()) {
            return DataTables::of($data)
                ->addIndexColumn()
                ->addColumn('action', function ($row) {
                    return [
                        'edit_url' => route('admin.banmod.edit', $row->id),
                        'delete_url' => route('admin.banmod.destroy', $row->id)
                    ];
                })
                ->make(true);
        }

        return Inertia::render('Admin/Banmod/Index', [
            'title' => 'Daftar Peserta Bantuan Modal - Pekerja Pabrik Rokok',
            'flash' => [
                'message' => session('message')
            ],
            'dataRoute' => route('admin.banmod.pekerja-pabrik-rokok')
        ]);
    }
    public function ikm(Request $request)
    {
        $data = PendaftaranBanmod::where('kategori', '4')->get();
        if ($request->wantsJson()) {
            return DataTables::of($data)
                ->addIndexColumn()
                ->addColumn('action', function ($row) {
                    return [
                        'edit_url' => route('admin.banmod.edit', $row->id),
                        'delete_url' => route('admin.banmod.destroy', $row->id)
                    ];
                })
                ->make(true);
        }

        return Inertia::render('Admin/Banmod/Index', [
            'title' => 'Daftar Peserta Bantuan Modal - Industri Kecil dan Menengah',
            'flash' => [
                'message' => session('message')
            ],
            'dataRoute' => route('admin.banmod.ikm')
        ]);
    }
    public function masyarakat_miskin(Request $request)
    {
        $data = PendaftaranBanmod::where('kategori', '5')->get();
        if ($request->wantsJson()) {
            return DataTables::of($data)
                ->addIndexColumn()
                ->addColumn('action', function ($row) {
                    return [
                        'edit_url' => route('admin.banmod.edit', $row->id),
                        'delete_url' => route('admin.banmod.destroy', $row->id)
                    ];
                })
                ->make(true);
        }

        return Inertia::render('Admin/Banmod/Index', [
            'title' => 'Daftar Peserta Bantuan Modal - Masyarakat Miskin',
            'flash' => [
                'message' => session('message')
            ],
            'dataRoute' => route('admin.banmod.masyarakat-miskin')
        ]);
    }



    /**
     * Show the form for creating a new resource.
     */
    public function create() {}

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request) {}

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
    public function edit(string $id) {}

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
