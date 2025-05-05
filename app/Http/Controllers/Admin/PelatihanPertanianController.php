<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;
use Yajra\DataTables\DataTables;
use App\Http\Controllers\Controller;
use App\Models\PelatihanPetani;
use Illuminate\Routing\Controllers\HasMiddleware;

class PelatihanPertanianController extends Controller implements HasMiddleware
{
    /**
     * Display a listing of the resource.
     */
    public static function middleware(): array
    {
        return [
            'permission:view-pelatihan-pertanian',
            // 'role:admin',
        ];
    }
    public function index(Request $request)
    {
        // $query = PelatihanPetani::with('kelompokTani', 'jenisPelatihanPetani', 'kategori')->get();
        // return response()->json($query);

        if ($request->wantsJson()) {

            $query = PelatihanPetani::with('kelompokTani', 'jenisPelatihanPetani', 'kategori')->get();

            return DataTables::of($query)
                ->addIndexColumn()
                ->addColumn('action', function ($row) {
                    return [
                        'edit_url' => route('admin.pertanian.edit', $row->id),
                        'delete_url' => route('admin.pertanian.destroy', $row->id),
                        'detail_url' => route('admin.pertanian.show', $row->id)
                    ];
                })
                ->make(true);
        }

        return inertia('Admin/PelatihanPertanian/Index', [
            'title' => 'Pelatihan Pertanian',
            'flash' => [
                'message' => session('message')
            ],
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
