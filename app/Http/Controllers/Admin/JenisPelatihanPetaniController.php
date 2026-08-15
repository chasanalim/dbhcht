<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\JenisPelatihanPetani;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Yajra\DataTables\DataTables;

class JenisPelatihanPetaniController extends Controller implements HasMiddleware
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
            $data = JenisPelatihanPetani::query();

            return DataTables::of($data)
                ->addIndexColumn()
                ->addColumn('jenis_text', function ($row) {
                    return $row->jenis == 1 ? 'Jenis 1' : 'Jenis 2';
                })
                ->addColumn('action', function ($row) {
                    return [
                        'update_url' => route('admin.jenis-petani.update', $row->id),
                        'delete_url' => route('admin.jenis-petani.destroy', $row->id),
                    ];
                })
                ->rawColumns(['action'])
                ->make(true);
        }

        return Inertia::render('Admin/JenisPelatihanPetani/Index', [
            'title' => 'Jenis Pelatihan Petani',
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
            'jenis' => ['required', 'integer', Rule::in([1, 2])],
            'nama' => ['required', 'string', 'max:255'],
        ]);

        JenisPelatihanPetani::create($validated);

        return back()->with('message', 'Jenis pelatihan petani berhasil ditambahkan');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, int $id)
    {
        $validated = $request->validate([
            'jenis' => ['required', 'integer', Rule::in([1, 2])],
            'nama' => ['required', 'string', 'max:255'],
        ]);

        JenisPelatihanPetani::findOrFail($id)->update($validated);

        return back()->with('message', 'Jenis pelatihan petani berhasil diperbarui');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(int $id)
    {
        JenisPelatihanPetani::findOrFail($id)->delete();

        return back()->with('message', 'Jenis pelatihan petani berhasil dihapus');
    }
}
