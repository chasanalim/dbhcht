<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\TrainingType;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Yajra\DataTables\DataTables;

class TipePelatihanController extends Controller
{
    public static function middleware(): array
    {
        return [
            'permission:view-master-banmod',
            // 'role:admin',
        ];
    }
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        if ($request->wantsJson()) {
            $data = TrainingType::query();

            return DataTables::of($data)
                ->addIndexColumn()
                ->addColumn('action', function ($row) {
                    return [
                        'edit_url' => route('admin.pelatihan.edit', $row->id),
                        'delete_url' => route('admin.pelatihan.destroy', $row->id)
                    ];
                })
                ->make(true);
        }

        return Inertia::render('Admin/TipePelatihan/Index', [
            'title' => 'Master Tipe Pelatihan',
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
        return Inertia::render('Admin/TipePelatihan/Create', [
            'title' => 'Tambah Tipe Pelatihan',
            'trainingType' => new TrainingType(),
            'action' => route('admin.pelatihan.store'),
            'method' => 'POST',
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        if ($request->filled('requirements') && is_string($request->requirements)) {
            $request->merge([
                'requirements' => collect(explode("\n", $request->requirements))
                    ->map(fn($item) => trim($item))
                    ->filter()
                    ->values()
                    ->toArray(),
            ]);
        }

        $validated = $request->validate([
            'value' => [
                'required',
                'string',
                'max:255',
                Rule::unique('training_types', 'value'),
            ],
            'label' => ['required', 'string', 'max:255'],
            'title' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'image' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
            'requirements' => ['nullable', 'array'],
            'requirements.*' => ['nullable', 'string', 'max:255'],
            'duration' => ['nullable', 'string', 'max:255'],
            'location' => ['nullable', 'string', 'max:255'],
            'is_disabled' => ['nullable', 'boolean'],
            'coming_soon' => ['nullable', 'boolean'],
            'closed' => ['nullable', 'boolean'],
            'order' => ['nullable', 'integer', 'min:0'],
        ]);

        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('training-types', 'public');
        }

        $validated['requirements'] = $validated['requirements'] ?? [];
        $validated['is_disabled'] = $request->boolean('is_disabled');
        $validated['coming_soon'] = $request->boolean('coming_soon');
        $validated['closed'] = $request->boolean('closed');
        $validated['order'] = $validated['order'] ?? 0;

        TrainingType::create($validated);

        return redirect()
            ->route('admin.pelatihan.index')
            ->with('message', 'Tipe pelatihan berhasil ditambahkan');
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
        $training = TrainingType::findOrFail($id);

        return Inertia::render('Admin/TipePelatihan/Create', [
            'title' => 'Edit Tipe Pelatihan',
            'trainingType' => $training,
            'action' => route('admin.pelatihan.update', $training->id),
            'method' => 'PUT',
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $training = TrainingType::findOrFail($id);

        if ($request->filled('requirements') && is_string($request->requirements)) {
            $request->merge([
                'requirements' => collect(explode("\n", $request->requirements))
                    ->map(fn($item) => trim($item))
                    ->filter()
                    ->values()
                    ->toArray(),
            ]);
        }

        $validated = $request->validate([
            'value' => [
                'required',
                'string',
                'max:255',
                Rule::unique('training_types', 'value')->ignore($training->id),
            ],
            'label' => ['required', 'string', 'max:255'],
            'title' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'image' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
            'requirements' => ['nullable', 'array'],
            'requirements.*' => ['nullable', 'string', 'max:255'],
            'duration' => ['nullable', 'string', 'max:255'],
            'location' => ['nullable', 'string', 'max:255'],
            'is_disabled' => ['nullable', 'boolean'],
            'coming_soon' => ['nullable', 'boolean'],
            'closed' => ['nullable', 'boolean'],
            'order' => ['nullable', 'integer', 'min:0'],
        ]);

        if ($request->hasFile('image')) {
            if ($training->image && Storage::disk('public')->exists($training->image)) {
                Storage::disk('public')->delete($training->image);
            }

            $validated['image'] = $request->file('image')->store('training-types', 'public');
        } else {
            unset($validated['image']);
        }

        $validated['requirements'] = $validated['requirements'] ?? [];
        $validated['is_disabled'] = $request->boolean('is_disabled');
        $validated['coming_soon'] = $request->boolean('coming_soon');
        $validated['closed'] = $request->boolean('closed');
        $validated['order'] = $validated['order'] ?? 0;

        $training->update($validated);

        return redirect()
            ->route('admin.pelatihan.index')
            ->with('message', 'Tipe pelatihan berhasil diperbarui');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $training = TrainingType::findOrFail($id);

        if ($training->image && Storage::disk('public')->exists($training->image)) {
            Storage::disk('public')->delete($training->image);
        }

        $training->delete();

        return redirect()
            ->back()
            ->with('message', 'Tipe pelatihan berhasil dihapus');
    }
}
