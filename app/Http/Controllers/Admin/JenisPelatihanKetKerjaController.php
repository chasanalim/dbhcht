<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\JenisPelatihanKetKerja;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Inertia\Inertia;
use Yajra\DataTables\DataTables;

class JenisPelatihanKetKerjaController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            'permission:view-master-banmod',
        ];
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        if ($request->wantsJson()) {
            $data = JenisPelatihanKetKerja::query();

            return DataTables::of($data)
                ->addIndexColumn()
                ->addColumn('action', function ($row) {
                    return [
                        'update_url' => route('admin.jenis-keterampilan.update', $row->id),
                        'delete_url' => route('admin.jenis-keterampilan.destroy', $row->id),
                    ];
                })
                ->make(true);
        }

        return Inertia::render('Admin/JenisPelatihanKetKerja/Index', [
            'title' => 'Jenis Pelatihan Keterampilan (Pencari Kerja)',
            'flash' => [
                'message' => session('message'),
            ],
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama' => ['required', 'string', 'max:255'],
            'pendidikan' => ['required', 'integer', 'min:0'],
            'usia' => ['required', 'integer', 'min:0'],
        ]);

        JenisPelatihanKetKerja::create($validated);

        return back()->with('message', 'Jenis pelatihan keterampilan berhasil ditambahkan');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, int $id)
    {
        $validated = $request->validate([
            'nama' => ['required', 'string', 'max:255'],
            'pendidikan' => ['required', 'integer', 'min:0'],
            'usia' => ['required', 'integer', 'min:0'],
        ]);

        JenisPelatihanKetKerja::findOrFail($id)->update($validated);

        return back()->with('message', 'Jenis pelatihan keterampilan berhasil diperbarui');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(int $id)
    {
        JenisPelatihanKetKerja::findOrFail($id)->delete();

        return back()->with('message', 'Jenis pelatihan keterampilan berhasil dihapus');
    }
}
