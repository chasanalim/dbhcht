<?php

namespace App\Http\Controllers\Admin;

use App\Models\User;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Yajra\DataTables\DataTables;
use App\Http\Controllers\Controller;
use Spatie\Permission\Contracts\Role;

class PrivilegesController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $data = User::with('roles')->get();

        if ($request->wantsJson()) {

            return DataTables::of($data)
                ->addIndexColumn()
                ->addColumn('roles', function ($row) {
                    return $row->roles->pluck('name')->implode(', ');
                })
                ->addColumn('action', function ($row) {
                    return [
                        'edit_url' => route('admin.user.edit', $row->id),
                        'delete_url' => route('admin.user.destroy', $row->id)
                    ];
                })
                ->rawColumns(['action', 'roles'])
                ->make(true);
        }

        return Inertia::render('Admin/User/Index', [
            'title' => 'Manajemen User',
            'can' => [
                'create' => auth()->user()->can('add-user', User::class),
                'edit' => auth()->user()->can('edit-user', User::class),
                'delete' => auth()->user()->can('delete-user', User::class),
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
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
