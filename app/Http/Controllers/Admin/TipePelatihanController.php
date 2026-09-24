<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\TrainingType;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Yajra\DataTables\DataTables;

class TipePelatihanController extends Controller implements HasMiddleware
{
    private const MANAGERS = [
        'dinkop' => 'Dinkop',
        'disperindag' => 'Disperindag',
        'pertanian' => 'Pertanian',
    ];

    private const ADMIN_ROLE_MANAGERS = [
        'admin dinkop' => 'dinkop',
        'admin disperindag' => 'disperindag',
        'admin pertanian' => 'pertanian',
    ];

    public static function middleware(): array
    {
        return [
            'role_or_permission:admin|manage-tipe-pelatihan',
        ];
    }

    private function allowedManagers(Request $request): array
    {
        if ($request->user()->hasRole('admin')) {
            return array_keys(self::MANAGERS);
        }

        return collect(self::ADMIN_ROLE_MANAGERS)
            ->filter(fn (string $manager, string $role) => $request->user()->hasRole($role))
            ->values()
            ->all();
    }

    private function managerOptions(Request $request): array
    {
        return collect(self::MANAGERS)
            ->only($this->allowedManagers($request))
            ->all();
    }

    private function scopedTrainingTypes(Request $request): Builder
    {
        $query = TrainingType::query();

        if ($request->user()->hasRole('admin')) {
            return $query;
        }

        $managers = $this->allowedManagers($request);
        abort_if($managers === [], 403);

        return $query->whereIn('managed_by', $managers);
    }

    private function prepareManager(Request $request): array
    {
        $managers = $this->allowedManagers($request);
        abort_if($managers === [], 403);

        if (count($managers) === 1) {
            $request->merge(['managed_by' => $managers[0]]);
        }

        return $managers;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        if ($request->wantsJson()) {
            $data = $this->scopedTrainingTypes($request);

            return DataTables::of($data)
                ->addIndexColumn()
                ->addColumn('action', function ($row) {
                    return [
                        'edit_url' => route('admin.pelatihan.edit', $row->id),
                        'delete_url' => route('admin.pelatihan.destroy', $row->id),
                    ];
                })
                ->make(true);
        }

        return Inertia::render('Admin/TipePelatihan/Index', [
            'title' => 'Master Tipe Pelatihan',
            'flash' => [
                'message' => session('message'),
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
            'trainingType' => new TrainingType,
            'action' => route('admin.pelatihan.store'),
            'method' => 'POST',
            'managerOptions' => $this->managerOptions(request()),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $managers = $this->prepareManager($request);

        if ($request->filled('requirements') && is_string($request->requirements)) {
            $request->merge([
                'requirements' => collect(explode("\n", $request->requirements))
                    ->map(fn ($item) => trim($item))
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
            'managed_by' => ['required', Rule::in($managers)],
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
        $training = $this->scopedTrainingTypes(request())->findOrFail($id);

        return Inertia::render('Admin/TipePelatihan/Create', [
            'title' => 'Edit Tipe Pelatihan',
            'trainingType' => $training,
            'action' => route('admin.pelatihan.update', $training->id),
            'method' => 'PUT',
            'managerOptions' => $this->managerOptions(request()),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $training = $this->scopedTrainingTypes($request)->findOrFail($id);
        $managers = $this->prepareManager($request);

        if ($request->filled('requirements') && is_string($request->requirements)) {
            $request->merge([
                'requirements' => collect(explode("\n", $request->requirements))
                    ->map(fn ($item) => trim($item))
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
            'managed_by' => ['required', Rule::in($managers)],
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
    public function destroy(Request $request, string $id)
    {
        $training = $this->scopedTrainingTypes($request)->findOrFail($id);

        if ($training->image && Storage::disk('public')->exists($training->image)) {
            Storage::disk('public')->delete($training->image);
        }

        $training->delete();

        return redirect()
            ->back()
            ->with('message', 'Tipe pelatihan berhasil dihapus');
    }
}
