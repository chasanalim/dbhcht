<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\UmkmTrainingOption;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Yajra\DataTables\DataTables;

class UmkmTrainingOptionController extends Controller implements HasMiddleware
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
            $data = UmkmTrainingOption::query();

            return DataTables::of($data)
                ->addIndexColumn()
                ->addColumn('action', function ($row) {
                    return [
                        'toggle_url' => route('admin.umkm-options.toggle', $row->id),
                        'delete_url' => route('admin.umkm-options.destroy', $row->id),
                    ];
                })
                ->make(true);
        }

        return Inertia::render('Admin/UmkmTrainingOption/Index', [
            'title' => 'Opsi Pelatihan UMKM',
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
            'label' => [
                'required',
                'string',
                'max:255',
                Rule::unique('umkm_training_options', 'label'),
            ],
            'order' => ['nullable', 'integer', 'min:0'],
            'is_active' => ['nullable', 'boolean'],
        ]);

        UmkmTrainingOption::create([
            'label' => $validated['label'],
            'order' => $validated['order'] ?? UmkmTrainingOption::max('order') + 1,
            'is_active' => $request->boolean('is_active', true),
        ]);

        return back()->with('message', 'Opsi pelatihan UMKM berhasil ditambahkan');
    }

    /**
     * Toggle active status.
     */
    public function toggle(Request $request, int $id)
    {
        $option = UmkmTrainingOption::findOrFail($id);
        $option->update([
            'is_active' => !$option->is_active,
        ]);

        return back()->with(
            'message',
            $option->is_active
                ? "Opsi \"{$option->label}\" diaktifkan"
                : "Opsi \"{$option->label}\" dinonaktifkan"
        );
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(int $id)
    {
        UmkmTrainingOption::findOrFail($id)->delete();

        return back()->with('message', 'Opsi pelatihan UMKM berhasil dihapus');
    }
}
