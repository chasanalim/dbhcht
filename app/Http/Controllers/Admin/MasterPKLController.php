<?php

namespace App\Http\Controllers\Admin;

use App\Models\Pkl;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Yajra\DataTables\DataTables;
use App\Http\Controllers\Controller;

class MasterPKLController extends Controller
{
    public static function middleware(): array
    {
        return [
            'permission:view-master-banmod',
            // 'role:admin',
        ];
    }
    public function index(Request $request)
    {
        if ($request->wantsJson()) {
            $data = Pkl::query();

            return DataTables::of($data)
                ->addIndexColumn()
                ->addColumn('action', function ($row) {
                    return [
                        'edit_url' => route('admin.pkl.edit', $row->id),
                        // 'delete_url' => route('admin.pkl.destroy', $row->id)
                    ];
                })
                ->make(true);
        }

        return Inertia::render('Admin/PKL/Index', [
            'title' => 'Master Data PKL',
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
        $banmod = Pkl::findOrFail($id);

        return Inertia::render('Admin/PKL/Create', [
            'title' => 'Edit Master Data PKL',
            'banmod' => $banmod,
            'action' => route('admin.pkl.update', $banmod->id),
            'method' => 'PUT',
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $banmod = Pkl::find($id);

        $request->validate([
            'nama' => ['required', 'string', 'max:255'],
            'nik' => ['required', 'numeric', 'digits:16', 'unique:penerima_banmod_wuses,nik,' . $id],
        ]);

        $banmod->update([
            'nik' => $request->nik,
            'nama' => $request->nama,
        ]);

        return redirect()->route('admin.pkl.index')->with('message', 'Master PKL updated successfully');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
