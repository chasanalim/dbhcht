<?php

namespace App\Http\Controllers\Admin;

use Inertia\Inertia;
use App\Models\KelompokTani;
use Illuminate\Http\Request;
use Yajra\DataTables\DataTables;
use App\Http\Controllers\Controller;

class MasterKelompokTaniController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        if ($request->wantsJson()) {
            $data = KelompokTani::query();

            return DataTables::of($data)
                ->addIndexColumn()
                ->addColumn('action', function ($row) {
                    return [
                        'edit_url' => route('admin.kelompoktani.edit', $row->id),
                    ];
                })
                ->make(true);
        }

        return Inertia::render('Admin/MasterKelompokTani/Index', [
            'title' => 'Master Kelompok Tani',
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
        $kelompokTani = KelompokTani::findOrFail($id);

        return Inertia::render('Admin/MasterKelompokTani/Create', [
            'title' => 'Edit Master Kelompok Tani',
            'kelompokTani' => $kelompokTani,
            'action' => route('admin.kelompoktani.update', $kelompokTani->id),
            'method' => 'PUT',
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $kelompokTani = KelompokTani::find($id);

        $request->validate([
            'nik_anggota' => ['required', 'numeric', 'digits:16', 'unique:kelompok_tanis,nik_anggota,' . $id],
        ]);

        $kelompokTani->update([
            'nik_anggota' => $request->nik_anggota,

        ]);

        return redirect()->route('admin.kelompoktani.index')->with('message', 'Master Kelompok Tani updated successfully');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
