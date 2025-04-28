<?php

namespace App\Http\Controllers\Admin;

use App\Models\User;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Yajra\DataTables\DataTables;
use Spatie\Permission\Models\Role;
use App\Http\Controllers\Controller;
use Illuminate\Routing\Controllers\HasMiddleware;
use Spatie\Permission\Models\Permission;
use Illuminate\Support\Facades\Validator;

class PrivilegesController extends Controller implements HasMiddleware
{
    /**
     * Display a listing of the resource.
     */
    public static function middleware(): array
    {
        return [
            'permission:view-role',
            // 'role:admin',
        ];
    }
    public function index(Request $request)
    {
        $roles = Role::with('permissions')->get();

        if ($request->wantsJson()) {
            return DataTables::of($roles)
                ->addIndexColumn()
                ->addColumn('permissions', function ($row) {
                    return $row->permissions->pluck('name')->implode(', ');
                })
                ->addColumn('action', function ($row) {
                    return [
                        'edit_url' => route('admin.privileges.edit', $row->id),
                        'delete_url' => route('admin.privileges.destroy', $row->id)
                    ];
                })
                ->rawColumns(['action', 'permissions'])
                ->make(true);
        }

        return Inertia::render('Admin/Privileges/Index', [
            'title' => 'Manajemen Role & Permission',
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
        $permissions = Permission::all();

        return Inertia::render('Admin/Privileges/Create', [
            'title' => 'Tambah Role',
            'permissions' => $permissions->map(fn($permission) => [
                'value' => $permission->id,
                'label' => $permission->name
            ])
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|unique:roles,name',
            'permissions' => 'required|array'
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        $role = Role::create(['name' => $request->name]);
        $role->syncPermissions($request->permissions);

        return redirect()
            ->route('admin.privileges.index')
            ->with('message', 'Role berhasil ditambahkan');
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
        $role = Role::with('permissions')->findOrFail($id);
        $permissions = Permission::all();

        return Inertia::render('Admin/Privileges/Create', [
            'title' => 'Edit Role',
            'role' => [
                'id' => $role->id,
                'name' => $role->name,
                'permissions' => $role->permissions->pluck('id')->toArray()
            ],
            'permissions' => $permissions->map(fn($permission) => [
                'value' => $permission->id,
                'label' => $permission->name
            ])
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|unique:roles,name,' . $id,
            'permissions' => 'required|array'
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        $role = Role::findOrFail($id);
        $role->update(['name' => $request->name]);
        $role->syncPermissions($request->permissions);

        return redirect()
            ->route('admin.privileges.index')
            ->with('message', 'Role berhasil diupdate');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $role = Role::findOrFail($id);
        $role->delete();

        return back()->with('message', 'Role berhasil dihapus');
    }
}
