<?php

namespace App\Http\Controllers\Admin;

use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\PenerimaBanmod;
use Yajra\DataTables\DataTables;
use App\Http\Controllers\Controller;

class PenerimaBanmodLamaController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request)
    {
        if ($request->wantsJson()) {
            $data = PenerimaBanmod::query();

            return DataTables::of($data)
                ->addIndexColumn()
                ->make(true);
        }

        return Inertia::render('Admin/PenerimaBanmodLama/Index', [
            'title' => 'Penerima Banmod Lama',
            'flash' => [
                'message' => session('message')
            ],
        ]);
    }
}
