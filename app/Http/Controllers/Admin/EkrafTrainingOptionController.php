<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\EkrafTrainingOption;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Yajra\DataTables\DataTables;

class EkrafTrainingOptionController extends Controller implements HasMiddleware
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
            $data = EkrafTrainingOption::query();

            return DataTables::of($data)
                ->addIndexColumn()
                ->addColumn('action', function ($row) {
                    return [
                        'toggle_url' => route('admin.ekraf-options.toggle', $row->id),
                        'delete_url' => route('admin.ekraf-options.destroy', $row->id),
                    ];
                })
                ->make(true);
        }

        return Inertia::render('Admin/EkrafTrainingOption/Index', [
            'title' => 'Opsi Pelatihan Ekonomi Kreatif',
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
            'value' => [
                'required',
                'string',
                'max:255',
                Rule::unique('ekraf_training_options', 'value'),
            ],
            'label' => ['required', 'string', 'max:255'],
            'order' => ['nullable', 'integer', 'min:0'],
            'is_active' => ['nullable', 'boolean'],
        ]);

        EkrafTrainingOption::create([
            'value' => $validated['value'],
            'label' => $validated['label'],
            'order' => $validated['order'] ?? EkrafTrainingOption::max('order') + 1,
            'is_active' => $request->boolean('is_active', true),
        ]);

        return back()->with('message', 'Opsi pelatihan Ekraf berhasil ditambahkan');
    }

    /**
     * Toggle active status.
     */
    public function toggle(Request $request, int $id)
    {
        $option = EkrafTrainingOption::findOrFail($id);
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
        EkrafTrainingOption::findOrFail($id)->delete();

        return back()->with('message', 'Opsi pelatihan Ekraf berhasil dihapus');
    }
}
