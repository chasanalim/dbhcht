<?php

namespace App\Http\Controllers\Admin;

use App\Models\MasterPencariKerja;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Yajra\DataTables\DataTables;
use App\Http\Controllers\Controller;

class MasterPencariKerjaController extends Controller
{
    public static function middleware(): array
    {
        return [
            'permission:view-master-pencari-kerja',
        ];
    }

    public function index(Request $request)
    {
        if ($request->wantsJson()) {
            $data = MasterPencariKerja::query();

            return DataTables::of($data)
                ->addIndexColumn()
                ->addColumn('action', function ($row) {
                    return [
                        'edit_url' => route('admin.master-pencari-kerja.edit', $row->id),
                    ];
                })
                ->make(true);
        }

        return Inertia::render('Admin/MasterPencariKerja/Index', [
            'title' => 'Master Data Pelatihan Pencari Kerja',
            'flash' => [
                'message' => session('message')
            ],
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/MasterPencariKerja/Create', [
            'title' => 'Tambah Master Data Pelatihan Pencari Kerja',
            'master' => null,
            'action' => route('admin.master-pencari-kerja.store'),
            'method' => 'POST',
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nik' => ['required', 'numeric', 'digits:16'],
            'nama' => ['required', 'string', 'max:255'],
        ]);

        MasterPencariKerja::create($request->all());

        return redirect()->route('admin.master-pencari-kerja.index')->with('message', 'Data berhasil ditambahkan');
    }

    public function show(string $id)
    {
        //
    }

    public function edit(string $id)
    {
        $master = MasterPencariKerja::findOrFail($id);

        return Inertia::render('Admin/MasterPencariKerja/Create', [
            'title' => 'Edit Master Data Pelatihan Pencari Kerja',
            'master' => $master,
            'action' => route('admin.master-pencari-kerja.update', $master->id),
            'method' => 'PUT',
        ]);
    }

    public function update(Request $request, string $id)
    {
        $master = MasterPencariKerja::findOrFail($id);

        $request->validate([
            'nik' => ['required', 'numeric', 'digits:16'],
            'nama' => ['required', 'string', 'max:255'],
        ]);

        $master->update($request->all());

        return redirect()->route('admin.master-pencari-kerja.index')->with('message', 'Data berhasil diperbarui');
    }

    public function destroy(string $id)
    {
        //
    }
}
