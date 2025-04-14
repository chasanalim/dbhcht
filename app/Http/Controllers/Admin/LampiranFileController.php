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
            $data = LampiranFile::latest();
            return DataTables::of($data)
                ->addIndexColumn()
                ->addColumn('action', function ($row) {
                    return [
                        'edit_url' => route('admin.downloads.edit', $row->id),
                        'delete_url' => route('admin.downloads.destroy', $row->id),
                    ];
                })
                ->toJson();
        }

        return Inertia::render('Admin/File/Index', [
            'title' => 'Lampiran File'
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Admin/File/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'file' => 'required|file|max:2048',
        ]);

        $file = $request->file('file');
        $filename = time() . '_' . $file->getClientOriginalName();
        $path = $file->storeAs('public/files', $filename);

        LampiranFile::create([
            'name' => $request->name,
            'file_path' => $filename,
        ]);

        return redirect()->back()->with('message', 'File uploaded successfully');
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
        return response()->json($file);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'file' => 'nullable|file|max:2048',
        ]);

        $file = LampiranFile::findOrFail($id);
        $file->name = $request->name;

        if ($request->hasFile('file')) {
            // Delete old file
            Storage::delete('public/files/' . $file->file_path);

            // Store new file
            $newFile = $request->file('file');
            $filename = time() . '_' . $newFile->getClientOriginalName();
            $newFile->storeAs('public/files', $filename);
            $file->file_path = $filename;
        }

        $file->save();

        return redirect()->back()->with('message', 'File updated successfully');
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
