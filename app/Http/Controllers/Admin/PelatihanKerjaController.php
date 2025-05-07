<?php

namespace App\Http\Controllers\Admin;

use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\PelatihanKerjas;
use Yajra\DataTables\DataTables;
use App\Models\PendaftaranBanmod;
use App\Http\Controllers\Controller;
use App\Models\JenisPelatihanKetKerja;
use Illuminate\Routing\Controllers\HasMiddleware;

class PelatihanKerjaController extends Controller implements HasMiddleware
{
    /**
     * Display a listing of the resource.
     */
    public static function middleware(): array
    {
        return [
            'permission:view-pelatihan-kerja',
            // 'role:admin',
        ];
    }
    public function index(Request $request)
    {
        // $query = PelatihanKerjas::with('refPendidikan', 'jenisPelatihan', 'alasanPelatihan')->get();
        // return response()->json($query);
        if ($request->wantsJson()) {
            $query = PelatihanKerjas::with('refPendidikan', 'jenisPelatihan', 'alasanPelatihan');

            if ($request->has('jenis_pelatihan') && $request->jenis_pelatihan !== 'all') {
                $query->where('jenis_pelatihan', $request->jenis_pelatihan);
            }

            return DataTables::of($query)
                ->addIndexColumn()
                ->addColumn('action', function ($row) {
                    return [
                        'edit_url' => route('admin.kerja.edit', $row->id),
                        'delete_url' => route('admin.kerja.destroy', $row->id),
                        'detail_url' => route('admin.kerja.show', $row->id)
                    ];
                })
                ->make(true);
        }
        $categories = JenisPelatihanKetKerja::all()->prepend(['id' => 'all', 'nama' => 'Semua pelatihan']);


        // return response()->json($categories);
        return Inertia::render('Admin/PelatihanKerja/Index', [
            'title' => 'Daftar Peserta Pelatihan Pencari Kerja',
            'flash' => [
                'message' => session('message')
            ],
            'dataRoute' => route('admin.banmod.index'),
            'categories' => $categories,
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
    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $data = PelatihanKerjas::with(['refPendidikan', 'jenisPelatihan', 'alasanPelatihan'])
            ->findOrFail($id);

        return Inertia::render('Admin/PelatihanKerja/Show', [
            'title' => 'Detail Peserta Pelatihan Pencari Kerja',
            'data' => [
                'id' => $data->id,
                'nik' => $data->nik,
                'no_kk' => $data->no_kk,
                'nama_lengkap' => $data->nama_lengkap,
                'tmp_lhr' => $data->tmp_lhr,
                'tgl_lhr' => $data->tgl_lhr,
                'jenis_kelamin' => $data->jenis_kelamin,
                'alamat' => $data->alamat,
                'kecamatan' => [
                    'kode' => $data->kode_kecamatan,
                    'nama' => $data->nama_kecamatan,
                ],
                'kelurahan' => [
                    'kode' => $data->kode_kelurahan,
                    'nama' => $data->nama_kelurahan,
                ],
                'rw' => [
                    'kode' => $data->kode_rw,
                    'nama' => $data->nama_rw,
                ],
                'rt' => [
                    'kode' => $data->kode_rt,
                    'nama' => $data->nama_rt,
                ],
                'phone_number' => $data->phone_number,
                'pendidikan' => [
                    'id' => $data->refPendidikan->id,
                    'nama' => $data->refPendidikan->nama,
                ],
                'jenis_pelatihan' => [
                    'id' => $data->jenisPelatihan->id,
                    'nama' => $data->jenisPelatihan->nama,
                ],
                'alasan_pelatihan' => [
                    'id' => $data->alasanPelatihan->id,
                    'nama' => $data->alasanPelatihan->nama,
                ],
                'file_ktp' => asset('' . $data->file_ktp),
                'file_kk' => asset('' . $data->file_kk),
                'created_at' => $data->created_at->format('d/m/Y H:i'),
                'updated_at' => $data->updated_at->format('d/m/Y H:i'),
            ],
        ]);
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
