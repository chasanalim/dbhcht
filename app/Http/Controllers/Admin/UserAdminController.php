<?php

namespace App\Http\Controllers\Admin;

use App\Models\User;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Yajra\DataTables\DataTables;
use Spatie\Permission\Models\Role;
use App\Http\Controllers\Controller;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Support\Facades\Hash;

class UserAdminController extends Controller implements HasMiddleware
{
    /**
     * Display a listing of the resource.
     */

    public static function middleware(): array
    {
        return [
            'permission:view-user',
        ];
    }

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
        return Inertia::render('Admin/User/Create', [
            'title' => 'Tambah User',
            'user' => new User(),
            'roles' => Role::all(),
            'action' => route('admin.user.store'),
            'method' => 'POST',
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // return response()->json($request->all());
        $inputNoHp = $request->phone_number;

        // Menghapus awalan 0 atau menggantinya dengan 62
        if (substr($inputNoHp, 0, 1) === '0') {
            $formattedNoHp = '62' . substr($inputNoHp, 1);
        } elseif (substr($inputNoHp, 0, 2) === '62') {
            $formattedNoHp = $inputNoHp;
        } else {
            // Format nomor WA tidak valid
            return redirect()->back()->with('error', 'Format nomor WhatsApp tidak valid.');
        }

        // Lakukan validasi menggunakan nomor yang sudah diformat
        $request->merge(['phone_number' => $formattedNoHp]);

        $request->validate([
            'role' => ['required'],
            'name' => ['required', 'string', 'max:255'],
            'phone_number' => ['required', 'numeric', 'digits_between:10,13', 'unique:users,phone_number'],
            'nik' => ['required', 'numeric', 'digits:16', 'unique:users,nik'],
            'email' => ['required', 'string', 'lowercase', 'email', 'max:255', 'unique:' . User::class],
            'password' => [
                'required',
                'string',
                'min:8', // minimal 8 karakter
                'regex:/[A-Z]/', // harus ada huruf kapital
                'regex:/[0-9]/', // harus ada angka
                // 'regex:/[!@#$%^&*(),.?":{}|<>]/',
                'confirmed',
            ],
        ]);

        $user = User::create([
            'nik' => $request->nik,
            'name' => $request->name,
            'email' => $request->email,
            'phone_number' => $formattedNoHp,
            'password' => Hash::make($request->password),
        ]);

        $user->assignRole($request->role);

        return redirect()->route('admin.user.index')->with('message', 'User created successfully');
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
        $user = User::with('roles')->findOrFail($id);

        return Inertia::render('Admin/User/Create', [
            'title' => 'Edit User',
            'user' => $user,
            'roles' => Role::all(),
            'selectedRole' => $user->roles->first()?->name,
            'action' => route('admin.user.update', $user->id),
            'method' => 'PUT',
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        // return response()->json($request->all());
        $user = User::find($id);

        $inputNoHp = $request->phone_number;

        // Menghapus awalan 0 atau menggantinya dengan 62
        if (substr($inputNoHp, 0, 1) === '0') {
            $formattedNoHp = '62' . substr($inputNoHp, 1);
        } elseif (substr($inputNoHp, 0, 2) === '62') {
            $formattedNoHp = $inputNoHp;
        } else {
            // Format nomor WA tidak valid
            return redirect()->back()->with('error', 'Format nomor WhatsApp tidak valid.');
        }
        // return response()->json($request);
        if ($request->password == null) {
            $request->validate([
                'role' => ['required'],
                'name' => ['required', 'string', 'max:255'],
                'nik' => ['required', 'numeric', 'digits:16', 'unique:users,nik,' . $id],
                'phone_number' => [
                    'required',
                    'numeric',
                    'digits_between:10,13',
                    Rule::unique('users', 'phone_number')->ignore($id),
                ],
                'email' => ['required', 'string', 'lowercase', 'email', 'max:255', 'unique:users,email,' . $id],
            ]);
        } else {
            $request->validate([
                'role' => ['required'],
                'name' => ['required', 'string', 'max:255'],
                'nik' => ['required', 'numeric', 'digits:16', 'unique:users,nik,' . $id],
                'phone_number' => [
                    'required',
                    'numeric',
                    'digits_between:10,13',
                    Rule::unique('users', 'phone_number')->ignore($id),
                ],
                'email' => ['required', 'string', 'lowercase', 'email', 'max:255', 'unique:users,email,' . $id],
                'password' => [
                    'required',
                    'string',
                    'min:8', // minimal 8 karakter
                    'regex:/[A-Z]/', // harus ada huruf kapital
                    'regex:/[0-9]/', // harus ada angka
                    // 'regex:/[!@#$%^&*(),.?":{}|<>]/',
                    'confirmed',
                ],
            ]);
        }

        if ($request->password == null) {
            $user->update([
                'role' => $request->role,
                'nik' => $request->nik,
                'name' => $request->name,
                'phone_number' => $formattedNoHp,
                'email' => $request->email,
            ]);
        } else {
            $user->update([
                'role' => $request->role,
                'nik' => $request->nik,
                'nip' => $request->nip,
                'name' => $request->name,
                'phone_number' => $formattedNoHp,
                'email' => $request->email,
                'password' => Hash::make($request->password),
            ]);
        }

        $user->syncRoles($request->role);

        return redirect()->route('admin.user.index')->with('message', 'User updated successfully');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $user = User::findOrFail($id);
        $user->delete();

        return redirect()->route('admin.user.index')->with('message', 'User deleted successfully');
    }
}
