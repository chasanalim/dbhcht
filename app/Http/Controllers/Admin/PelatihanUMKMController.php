<?php

namespace App\Http\Controllers\Admin;

use Inertia\Inertia;
use Illuminate\Http\Request;
use Yajra\DataTables\DataTables;
use App\Http\Controllers\Controller;
use App\Models\PelatihanUmkm;
use Illuminate\Routing\Controllers\HasMiddleware;

class PelatihanUMKMController extends Controller implements HasMiddleware
{
    /**
     * Display a listing of the resource.
     */

    public static function middleware(): array
    {
        return [
            'permission:view-pelatihan-umkm',
            // 'role:admin',
        ];
    }
    public function index(Request $request)
    {
        if ($request->wantsJson()) {
            $query = PelatihanUmkm::query();

            // Check prioritas_1
            if ($request->has('prioritas_1') && $request->prioritas_1 !== 'Semua Pelatihan') {

                $query->where('prioritas_1', $request->prioritas_1);
            }
            // Check prioritas_2 only if prioritas_1 is not set
            if (
                $request->has('prioritas_2') && $request->prioritas_2 !== 'Semua Pelatihan'
            ) {
                $query->where('prioritas_2', $request->prioritas_2);
            }
            // Check prioritas_3 only if prioritas_1 and prioritas_2 are not set
            if (
                $request->has('prioritas_3') && $request->prioritas_3 !== 'Semua Pelatihan'
            ) {
                $query->where('prioritas_3', $request->prioritas_3);
            }


            return DataTables::of($query)
                ->addIndexColumn()
                ->addColumn('action', function ($row) {
                    return [
                        'edit_url' => route('admin.umkm.edit', $row->id),
                        'delete_url' => route('admin.umkm.destroy', $row->id),
                        'detail_url' => route('admin.umkm.show', $row->id)
                    ];
                })
                ->make(true);
        }
        $pelatihan = [
            ['name' => 'Semua Pelatihan'],
            ['name' => 'Pelatihan Kurasi Produk'],
            ['name' => 'Pelatihan Konten Kreator'],
            ['name' => 'Pelatihan Desain Grafis'],
            ['name' => 'Pelatihan Manajemen Usaha dan Keuangan'],
            ['name' => 'Pelatihan Media Sosial dan E-Commerce'],
            ['name' => 'Pelatihan Peningkatan Kualitas SDM Pelaku Usaha'],
            ['name' => 'Pelatihan Strategi Foto Produk'],
            ['name' => 'Pelatihan Peningkatan Kualitas Produk Bakery'],
            ['name' => 'Pelatihan Barista'],
            ['name' => 'Pelatihan Bakery'],
            ['name' => 'Pelatihan Desain Kemasan dan Packaging'],
            ['name' => 'Pelatihan Produk Desain Motif Tenun/Batik'],
            ['name' => 'Pelatihan Produk Handicraft'],
            ['name' => 'Pelatihan Jajanan Kekinian'],
            ['name' => 'Pelatihan Korean Food'],
            ['name' => 'Pelatihan Reparasi Resep Masakan dan Kue Tradisional'],
        ];

        return Inertia::render('Admin/PelatihanUMKM/Index', [
            'title' => 'Pelatihan UMKM',
            'flash' => [
                'message' => session('message')
            ],
            'pelatihan' => $pelatihan,
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
        $data = PelatihanUmkm::with('Refpendidikan')->findOrFail($id);
        // return response()->json($data);
        return Inertia::render('Admin/PelatihanUMKM/Show', [
            'title' => 'Detail Peserta Pelatihan UMKM',
            'data' => [
                'id' => $data->id,
                'nik' => $data->nik,
                'no_kk' => $data->no_kk,
                'name' => $data->nama_lengkap,
                'tempat_lahir' => $data->tempat_lahir,
                'tgl_lahir' => $data->tgl_lahir,
                'jenis_kelamin' => $data->jenis_kelamin,
                'no_hp' => $data->no_hp,
                'pendidikan' => $data->Refpendidikan->nama,
                'is_disabilitas' => $data->is_disabilitas,
                'jenis_disabilitas' => $data->jenis_disabilitas,

                // Alamat
                'alamat' => $data->jalan,
                'rt' => $data->rt,
                'rw' => $data->rw,
                'kelurahan' => $data->kelurahan,
                'kecamatan' => $data->kecamatan,

                // Data Usaha
                'nama_usaha' => $data->nama_usaha,
                'tahun_berdiri' => $data->tahun_berdiri,
                'bidang_usaha' => $data->bidang_usaha,
                'alamat_usaha' => $data->alamat_usaha,
                'rt_usaha' => $data->rt_usaha,
                'rw_usaha' => $data->rw_usaha,
                'kelurahan_usaha' => $data->kel_usaha,
                'kecamatan_usaha' => $data->kec_usaha,
                'nib' => $data->nib,
                'legalitas_status' => $data->legalitas_status,
                'legalitas_jenis' => $data->legalitas_jenis,
                'modal' => $data->modal,
                'omset' => $data->omset,
                'kapasitas_produksi' => $data->kapasitas_jumlah . ' ' . $data->kapasitas_satuan,
                'jangkauan' => $data->jangkauan,

                // Data Pelatihan
                'prioritas_1' => $data->prioritas_1,
                'prioritas_2' => $data->prioritas_2,
                'prioritas_3' => $data->prioritas_3,
                'alasan' => $data->alasan,
                'kesesuaian' => $data->kesesuaian,
                'pengalaman' => $data->pengalaman,
                'komitmen' => $data->komitmen,

                // Files
                'files' => [
                    'foto' => asset('storage/' . $data->file_foto),
                    'ktp' => asset('storage/' . $data->file_ktp),
                    'kk' => asset('storage/' . $data->file_kk),
                    'pernyataan' => asset('storage/' . $data->file_pernyataan),
                ]
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
