<?php

namespace App\Http\Controllers\Admin;

use Inertia\Inertia;
use Illuminate\Http\Request;
use Yajra\DataTables\DataTables;
use App\Models\PenerimaBanmodWus;
use App\Http\Controllers\Controller;

class PenerimaPelatihanBanmodController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        if ($request->wantsJson()) {
            $data = PenerimaBanmodWus::query();

            return DataTables::of($data)
                ->addIndexColumn()
                ->addColumn('action', function ($row) {
                    return [
                        'edit_url' => route('admin.banmodwirausaha.edit', $row->id),
                        // 'delete_url' => route('admin.banmodwirausaha.destroy', $row->id)
                    ];
                })
                ->make(true);
        }

        return Inertia::render('Admin/PenerimaPelatihanBanmod/Index', [
            'title' => 'Penerima Pelatihan Banmod',
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
        $banmod = PenerimaBanmodWus::findOrFail($id);

        return Inertia::render('Admin/PenerimaPelatihanBanmod/Create', [
            'title' => 'Edit Penerima Pelatihan Banmod',
            'banmod' => $banmod,
            'action' => route('admin.banmodwirausaha.update', $banmod->id),
            'method' => 'PUT',
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $banmod = PenerimaBanmodWus::find($id);

        $request->validate([
            'nama' => ['required', 'string', 'max:255'],
            'nik' => ['required', 'numeric', 'digits:16', 'unique:penerima_banmod_wuses,nik,' . $id],
            'nik' => ['required', 'numeric', 'digits:16', 'unique:penerima_banmod_wuses,kk,' . $id],
        ]);

        $banmod->update([
            'nik' => $request->nik,
            'kk' => $request->kk,
            'nama' => $request->nama,
        ]);

        return redirect()->route('admin.banmodwirausaha.index')->with('message', 'Penerima Pelatihan Banmod updated successfully');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
