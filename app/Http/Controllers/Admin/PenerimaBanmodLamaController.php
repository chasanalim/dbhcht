<?php

namespace App\Http\Controllers\Admin;

use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\PenerimaBanmod;
use Yajra\DataTables\DataTables;
use App\Http\Controllers\Controller;

class PenerimaBanmodLamaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        if ($request->wantsJson()) {
            $data = PenerimaBanmod::query();

            return DataTables::of($data)
                ->addIndexColumn()
                ->addColumn('action', function ($row) {
                    return [
                        'edit_url' => route('admin.banmodlama.edit', $row->id),
                        // 'delete_url' => route('admin.banmodwirausaha.destroy', $row->id)
                    ];
                })
                ->make(true);
        }

        return Inertia::render('Admin/PenerimaBanmodLama/Index', [
            'title' => 'Penerima Banmod Lama',
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
        $banmod = PenerimaBanmod::findOrFail($id);

        return Inertia::render('Admin/PenerimaBanmodLama/Create', [
            'title' => 'Edit Penerima Banmod Lama',
            'banmod' => $banmod,
            'action' => route('admin.banmodlama.update', $banmod->id),
            'method' => 'PUT',
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $banmod = PenerimaBanmod::find($id);

        $request->validate([
            'nama' => ['required', 'string', 'max:255'],
            'nik' => ['required', 'numeric', 'digits:16', 'unique:penerima_banmods,nik,' . $id],
            'nik' => ['required', 'numeric', 'digits:16', 'unique:penerima_banmods,kk,' . $id],
        ]);

        $banmod->update([
            'nik' => $request->nik,
            'kk' => $request->kk,
            'nama' => $request->nama,
        ]);

        return redirect()->route('admin.banmodlama.index')->with('message', 'Penerima Banmod Lama updated successfully');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
