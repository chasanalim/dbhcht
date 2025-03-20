<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index(Request $request)
    {
        if (! $request->user()->can('read users')) {
            return abort(403);
        }

        $data = User::withTrashed()->with(['skpd'])
            ->where('id', '!=', Auth::id())
            ->orderBy('created_at', 'DESC')
            ->paginate();

        $roles = DB::table('roles')->get();

        return Inertia::render('User/Index', [
            'meta' => (object)[
                'title' => 'Manage Users',
            ],
            'data' => $data,
            'roles' => $roles,
        ]);
    }
}
