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
                        'edit_url' => route('admin.kelompoktani.edit', $row->id)
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
        return Inertia::render('Admin/MasterKelompokTani/Create', [
            'title' => 'Tambah Master Kelompok Tani',
            'kelompokTani' => null,
            'action' => route('admin.kelompoktani.store'),
            'method' => 'POST',
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'kecamatan' => ['nullable', 'string', 'max:255'],
            'kelurahan' => ['nullable', 'string', 'max:255'],
            'nama_kelompok' => ['required', 'string', 'max:255'],
            'no_register' => ['nullable', 'string', 'max:255'],
            'nik_ketua' => ['nullable', 'numeric', 'digits:16', 'unique:kelompok_tanis,nik_ketua'],
            'nama_ketua' => ['nullable', 'string', 'max:255'],
            'nik_anggota' => ['required', 'numeric', 'digits:16', 'unique:kelompok_tanis,nik_anggota'],
            'nama_anggota' => ['required', 'string', 'max:255'],
            'tahun_berdiri' => ['nullable', 'digits:4', 'integer', 'min:1900', 'max:' . date('Y')],
            'tingkat_kemampuan' => ['nullable', 'string', 'max:255'],
            'keterangan' => ['nullable', 'string'],
        ]);

        KelompokTani::create([
            'kecamatan' => $request->kecamatan,
            'kelurahan' => $request->kelurahan,
            'nama_kelompok' => $request->nama_kelompok,
            'no_register' => $request->no_register,
            'nik_ketua' => $request->nik_ketua,
            'nama_ketua' => $request->nama_ketua,
            'nik_anggota' => $request->nik_anggota,
            'nama_anggota' => $request->nama_anggota,
            'tahun_berdiri' => $request->tahun_berdiri,
            'tingkat_kemampuan' => $request->tingkat_kemampuan,
            'keterangan' => $request->keterangan,
        ]);

        return redirect()->route('admin.kelompoktani.index')->with('message', 'Master Kelompok Tani berhasil ditambahkan');
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
        $kelompokTani = KelompokTani::findOrFail($id);

        $request->validate([
            'kecamatan' => ['nullable', 'string', 'max:255'],
            'kelurahan' => ['nullable', 'string', 'max:255'],
            'nama_kelompok' => ['required', 'string', 'max:255'],
            'no_register' => ['nullable', 'string', 'max:255'],
            'nik_ketua' => ['nullable', 'numeric', 'digits:16', 'unique:kelompok_tanis,nik_ketua,' . $id],
            'nama_ketua' => ['nullable', 'string', 'max:255'],
            'nik_anggota' => ['required', 'numeric', 'digits:16', 'unique:kelompok_tanis,nik_anggota,' . $id],
            'nama_anggota' => ['required', 'string', 'max:255'],
            'tahun_berdiri' => ['nullable', 'digits:4', 'integer', 'min:1900', 'max:' . date('Y')],
            'tingkat_kemampuan' => ['nullable', 'string', 'max:255'],
            'keterangan' => ['nullable', 'string'],
        ]);

        $kelompokTani->update([
            'kecamatan' => $request->kecamatan,
            'kelurahan' => $request->kelurahan,
            'nama_kelompok' => $request->nama_kelompok,
            'no_register' => $request->no_register,
            'nik_ketua' => $request->nik_ketua,
            'nama_ketua' => $request->nama_ketua,
            'nik_anggota' => $request->nik_anggota,
            'nama_anggota' => $request->nama_anggota,
            'tahun_berdiri' => $request->tahun_berdiri,
            'tingkat_kemampuan' => $request->tingkat_kemampuan,
            'keterangan' => $request->keterangan,
        ]);

        return redirect()->route('admin.kelompoktani.index')->with('message', 'Master Kelompok Tani berhasil diperbarui');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $kelompokTani = KelompokTani::findOrFail($id);
        $kelompokTani->delete();

        return redirect()->route('admin.kelompoktani.index')->with('message', 'Master Kelompok Tani berhasil dihapus');
    }
}
