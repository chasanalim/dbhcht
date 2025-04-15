<?php

namespace App\Http\Controllers\Admin;

use Inertia\Inertia;
use App\Models\LampiranFile;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Yajra\DataTables\DataTables;
use Illuminate\Support\Facades\Storage;

class LampiranFileController extends Controller
{
    /**
     * Display a listing of the resource.
     */


    public function index(Request $request)
    {
        if ($request->wantsJson()) {
            $data = LampiranFile::query();

            return DataTables::of($data)
                ->addIndexColumn()
                ->addColumn('file_download', function ($row) {
                    return asset('storage/files/' . $row->file_name);
                })
                ->addColumn('action', function ($row) {
                    return [
                        'edit_url' => route('admin.downloads.edit', $row->id),
                        'delete_url' => route('admin.downloads.destroy', $row->id)
                    ];
                })
                ->rawColumns(['file_download'])
                ->make(true);
        }

        return Inertia::render('Admin/File/Index', [
            'title' => 'Data Lampiran File',
            'can' => [
                'create' => auth()->user()->can('create', LampiranFile::class),
                'edit' => auth()->user()->can('edit', LampiranFile::class),
                'delete' => auth()->user()->can('delete', LampiranFile::class),
            ],
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
        return Inertia::render('Admin/File/Create', [
            'title' => 'Tambah File',
            'file' => new LampiranFile(),
            'action' => route('admin.downloads.store'),
            'method' => 'POST',
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // dd($request->all());
        $request->validate([
            'nama' => 'required|string|max:255',
            'deskripsi' => 'required|string|max:255',
            'kategori' => 'required',
            'file_name' => 'nullable|file|mimes:pdf,doc,docx|max:2048',
        ]);

        $file = $request->file('file_name');
        Storage::putFileAs('files', $file, $file->hashName());
        // $file->storeAs('public/files', $file->hashName());

        LampiranFile::create([
            'nama' => $request->nama,
            'deskripsi' => $request->deskripsi,
            'kategori' => $request->kategori,
            'file_name' => $file->hashName(),
        ]);


        return redirect()->route('admin.downloads.index')->with('message', 'File uploaded successfully');
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
    public function edit($id)
    {
        $file = LampiranFile::findOrFail($id);

        return Inertia::render('Admin/File/Create', [
            'title' => 'Edit File',
            'file' => $file,
            'action' => route('admin.downloads.update', $file->id),
            'method' => 'PUT',
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $request->validate([
            'nama' => 'required|string|max:255',
            'deskripsi' => 'required|string|max:255',
            'kategori' => 'required',
            'file_name' => 'nullable|file|mimes:pdf,doc,docx|max:2048',
        ]);

        $file = LampiranFile::findOrFail($id);

        $file->nama = $request->nama;
        $file->deskripsi = $request->deskripsi;
        $file->kategori = $request->kategori;

        if ($request->hasFile('file_name')) {
            // Delete old file
            Storage::delete('public/files/' . $file->file_name);

            // Store new file
            $newFile = $request->file('file_name');
            $filename = $newFile->hashName();
            $newFile->storeAs('public/files', $filename);
            $file->file_name = $filename;
        }

        $file->save();

        return redirect()->route('admin.downloads.index')
            ->with('message', 'File berhasil diperbarui');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $file = LampiranFile::findOrFail($id);
        Storage::delete('public/files/' . $file->file_path);
        $file->delete();

        return redirect()->back()->with('message', 'File deleted successfully');
    }
}
