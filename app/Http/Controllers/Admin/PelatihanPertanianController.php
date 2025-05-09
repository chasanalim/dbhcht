<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;
use Yajra\DataTables\DataTables;
use App\Http\Controllers\Controller;
use App\Models\PelatihanPetani;
use Illuminate\Routing\Controllers\HasMiddleware;

class PelatihanPertanianController extends Controller implements HasMiddleware
{


    /**
     * Display a listing of the resource.
     */
    public static function middleware(): array
    {
        return [
            'permission:view-pelatihan-pertanian',
            // 'role:admin',
        ];
    }
    public function index(Request $request)
    {
        $query = PelatihanPetani::with('kelompokTani', 'jenisPelatihanPetani', 'kategoriKelompok')->get();
        // return response()->json($query);

        if ($request->wantsJson()) {

            $query = PelatihanPetani::with('kelompokTani', 'jenisPelatihanPetani', 'kategoriKelompok')->get();

            return DataTables::of($query)
                ->addIndexColumn()
                ->addColumn('action', function ($row) {
                    return [
                        'edit_url' => route('admin.pertanian.edit', $row->id),
                        'delete_url' => route('admin.pertanian.destroy', $row->id),
                        'detail_url' => route('admin.pertanian.show', $row->id)
                    ];
                })
                ->make(true);
        }

        return inertia('Admin/PelatihanPertanian/Index', [
            'title' => 'Pelatihan Pertanian',
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
        $data = PelatihanPetani::with(['kelompokTani', 'kategoriKelompok', 'jenisPelatihanPetani', 'alasanPelatihan','masaAktifKelompok'])
            ->findOrFail($id);

        // return response()->json($data);
        return inertia('Admin/PelatihanPertanian/Show', [
            'title' => 'Detail Peserta Pelatihan Pertanian',
            'data' => [
                'id' => $data->id,
                'nik' => $data->nik,
                'kk' => $data->kk,
                'nama_lengkap' => $data->nama_lengkap,
                'jenis_kelamin' => $data->jenis_kelamin,
                'no_hp' => $data->no_hp,
                'tmp_lhr' => $data->tmp_lhr,
                'tgl_lhr' => $data->tgl_lhr,
                'pendidikan' => $data->pendidikan,

                // Data Alamat
                'alamat' => $data->alamat,
                'isDomisili' => $data->isDomisili,
                'alamat_domisili' => $data->alamat_domisili,
                'nama_kecamatan' => $data->nama_kecamatan,
                'nama_kelurahan' => $data->nama_kelurahan,
                'nama_rw' => $data->nama_rw,
                'nama_rt' => $data->nama_rt,

                // Data Disabilitas
                'is_disabilitas' => $data->is_disabilitas,
                'jenis_disabilitas' => $data->jenis_disabilitas,

                // Data Kelompok Tani
                'kelompok_tani' => [
                    'id' => $data->kelompokTani->id,
                    'nama' => $data->kelompokTani->nama_kelompok,
                    'tahun_berdiri' => $data->tahun_berdiri,
                    'masa_aktif' => $data->masaAktifKelompok->jawaban,
                    'bidang_usaha' => $data->bidang_usaha_kelompok,
                    'alamat' => $data->alamat_kelompok,
                    'kecamatan' => $data->nama_kecamatan_kelompok,
                    'kelurahan' => $data->nama_kelurahan_kelompok,
                    'rw' => $data->nama_rw_kelompok,
                    'rt' => $data->nama_rt_kelompok,
                ],

                // Data Pelatihan
                'kategori' => [
                    'id' => $data->kategoriKelompok->id,
                    'nama' => $data->kategoriKelompok->nama,
                ],

                'jenis_pelatihan' => [
                    'id' => $data->jenisPelatihanPetani->id,
                    'nama' => $data->jenisPelatihanPetani->nama,
                ],
                'alasan' => $data->alasanPelatihan->jawaban,

                // Files
                'file_foto' => asset('storage/' . $data->file_foto),
                'file_ktp' => asset('storage/' . $data->file_ktp),
                'file_pengukuhan' => asset('storage/' . $data->file_pengukuhan_penyuluh_swadaya),
                'file_rekomendasi' => asset('storage/' . $data->file_rekomendasi_kelompok),

            ]
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
