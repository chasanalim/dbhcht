<?php

namespace App\Http\Controllers\Admin;

use Inertia\Inertia;
use Illuminate\Http\Request;
use Yajra\DataTables\DataTables;
use App\Models\PendaftaranBanmod;
use App\Http\Controllers\Controller;
use Illuminate\Routing\Controllers\HasMiddleware;

class PendaftaranBanmodController extends Controller implements HasMiddleware
{
    /**
     * Display a listing of the resource.
     */
    public static function middleware(): array
    {
        return [
            'permission:view-banmod',
            // 'role:admin',
        ];
    }
    public function index(Request $request)
    {
        $data = PendaftaranBanmod::with('klasterUsaha', 'kategoriUsaha')->get()->sortByDesc('skor');
        // return response()->json($data);
        if ($request->wantsJson()) {
            return DataTables::of($data)
                ->addIndexColumn()
                ->addColumn('action', function ($row) {
                    return [
                        'edit_url' => route('admin.banmod.edit', $row->id),
                        'delete_url' => route('admin.banmod.destroy', $row->id),
                        'detail_url' => route('admin.banmod.show', $row->id)
                    ];
                })
                ->make(true);
        }
        return Inertia::render('Admin/Banmod/Index', [
            'title' => 'Daftar Peserta Bantuan Modal - Semua Kategori',
            'flash' => [
                'message' => session('message')
            ],
            'dataRoute' => route('admin.banmod.index')
        ]);
    }

    public function buruh_pabrik_rokok(Request $request)
    {

        $data = PendaftaranBanmod::with('klasterUsaha', 'kategoriUsaha')->where('kategori', '1')->get()->sortByDesc('skor');

        if ($request->wantsJson()) {
            return DataTables::of($data)
                ->addIndexColumn()
                ->addColumn('action', function ($row) {
                    return [
                        'edit_url' => route('admin.banmod.edit', $row->id),
                        'delete_url' => route('admin.banmod.destroy', $row->id),
                        'detail_url' => route('admin.banmod.show', $row->id)
                    ];
                })
                ->make(true);
        }

        return Inertia::render('Admin/Banmod/Index', [
            'title' => 'Daftar Peserta Bantuan Modal - Buruh Pabrik Rokok',
            'flash' => [
                'message' => session('message')
            ],
            'dataRoute' => route('admin.banmod.buruh-pabrik-rokok')
        ]);
    }
    public function buruh_tani_tembakau(Request $request)
    {
        $data = PendaftaranBanmod::with('klasterUsaha', 'kategoriUsaha')->where('kategori', '2')->get()->sortByDesc('skor');
        if ($request->wantsJson()) {
            return DataTables::of($data)
                ->addIndexColumn()
                ->addColumn('action', function ($row) {
                    return [
                        'edit_url' => route('admin.banmod.edit', $row->id),
                        'delete_url' => route('admin.banmod.destroy', $row->id),
                        'detail_url' => route('admin.banmod.show', $row->id)
                    ];
                })
                ->make(true);
        }

        return Inertia::render('Admin/Banmod/Index', [
            'title' => 'Pendaftar Bantuan Modal',
            'flash' => [
                'message' => session('message')
            ],
            'dataRoute' => route('admin.banmod.buruh-tani-tembakau')
        ]);
    }
    public function pekerja_pabrik_rokok(Request $request)
    {
        $data = PendaftaranBanmod::with('klasterUsaha', 'kategoriUsaha')->where('kategori', '3')->get()->sortByDesc('skor');
        if ($request->wantsJson()) {
            return DataTables::of($data)
                ->addIndexColumn()
                ->addColumn('action', function ($row) {
                    return [
                        'edit_url' => route('admin.banmod.edit', $row->id),
                        'delete_url' => route('admin.banmod.destroy', $row->id),
                        'detail_url' => route('admin.banmod.show', $row->id)
                    ];
                })
                ->make(true);
        }

        return Inertia::render('Admin/Banmod/Index', [
            'title' => 'Daftar Peserta Bantuan Modal - Pekerja Pabrik Rokok',
            'flash' => [
                'message' => session('message')
            ],
            'dataRoute' => route('admin.banmod.pekerja-pabrik-rokok')
        ]);
    }
    public function ikm(Request $request)
    {
        $data = PendaftaranBanmod::with('klasterUsaha', 'kategoriUsaha')->where('kategori', '4')->get()->sortByDesc('skor');
        if ($request->wantsJson()) {
            return DataTables::of($data)
                ->addIndexColumn()
                ->addColumn('action', function ($row) {
                    return [
                        'edit_url' => route('admin.banmod.edit', $row->id),
                        'delete_url' => route('admin.banmod.destroy', $row->id),
                        'detail_url' => route('admin.banmod.show', $row->id)
                    ];
                })
                ->make(true);
        }

        return Inertia::render('Admin/Banmod/Index', [
            'title' => 'Daftar Peserta Bantuan Modal - Industri Kecil dan Menengah',
            'flash' => [
                'message' => session('message')
            ],
            'dataRoute' => route('admin.banmod.ikm')
        ]);
    }
    public function masyarakat_miskin(Request $request)
    {
        $data = PendaftaranBanmod::with('klasterUsaha', 'kategoriUsaha')->where('kategori', '5')->get()->sortByDesc('skor');
        if ($request->wantsJson()) {
            return DataTables::of($data)
                ->addIndexColumn()
                ->addColumn('action', function ($row) {
                    return [
                        'edit_url' => route('admin.banmod.edit', $row->id),
                        'delete_url' => route('admin.banmod.destroy', $row->id),
                        'detail_url' => route('admin.banmod.show', $row->id)
                    ];
                })
                ->make(true);
        }

        return Inertia::render('Admin/Banmod/Index', [
            'title' => 'Daftar Peserta Bantuan Modal - Masyarakat Miskin',
            'flash' => [
                'message' => session('message')
            ],
            'dataRoute' => route('admin.banmod.masyarakat-miskin')
        ]);
    }



    /**
     * Show the form for creating a new resource.
     */
    public function create() {}

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request) {}

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $data = PendaftaranBanmod::with([
            'kategoriUsaha',
            'klasterUsaha',
            'tanggunganKeluarga',
            'lamaUsaha',
            'statusTempatTinggal',
            'jumlahTenagaKerja',
            'jumlahLegalitas',
            'jumlahTeknologiDigital',
            'penyerapanTenagaMiskin',
            'brutoPerbulan'
        ])->findOrFail($id);

        // return response()->json($data);

        return Inertia::render('Admin/Banmod/Show', [
            'title' => 'Detail Pendaftar Bantuan Modal',
            'data' => [
                'id' => $data->id,
                'nik' => $data->nik,
                'kk' => $data->kk,
                'name' => $data->name,
                'tmp_lhr' => $data->tmp_lhr,
                'tgl_lhr' => $data->tgl_lhr,
                'alamat' => $data->alamat,
                'jenis_kelamin' => $data->jenis_kelamin,
                'kecamatan' => $data->nama_kecamatan,
                'kelurahan' => $data->nama_kelurahan,
                'rw' => $data->nama_rw,
                'rt' => $data->nama_rt,
                'isDomisili' => $data->isDomisili,
                'alamat_domisili' => $data->alamat_domisili,
                'isUsaha' => $data->isUsaha,
                'alamat_usaha' => $data->alamat_usaha,
                'phone_number' => $data->phone_number,
                'daya_listrik' => $data->daya_listrik,
                'isDisabilitas' => $data->isDisabilitas,
                'disabilitas' => $data->disabilitas,
                'kategori_id' => $data->kategori,
                'kategori' => $data->kategoriUsaha?->nama,
                'klaster_usaha' => $data->klasterUsaha?->nama,
                'tanggungan_keluarga' => $data->tanggunganKeluarga?->nama,
                'skor_tanggungan_keluarga' => $data->tanggunganKeluarga?->skor,
                'lama_usaha' => $data->lamaUsaha?->nama,
                'skor_lama_usaha' => $data->lamaUsaha?->skor,
                'jumlah_tenaga' => $data->jumlahTenagaKerja?->nama,
                'skor_jumlah_tenaga' => $data->jumlahTenagaKerja?->skor,
                'bruto' => $data->brutoPerbulan?->nama,
                'skor_bruto' => $data->brutoPerbulan?->skor,
                'status_tempat_tinggal' => $data->statusTempatTinggal?->nama,
                'skor_status_tempat_tinggal' => $data->statusTempatTinggal?->skor,
                'aset' => $data->aset,
                'hutang' => $data->hutang,
                'skor' => $data->skor,
                'jumlah_legalitas' => $data->jumlahLegalitas?->nama,
                'skor_legalitas' => $data->jumlahLegalitas?->skor,
                'jumlah_teknologi' => $data->jumlahTeknologiDigital?->nama,
                'skor_teknologi' => $data->jumlahTeknologiDigital?->skor,
                'jumlah_penyerapan_naker' => $data->penyerapanTenagaMiskin?->nama,
                'skor_penyerapan_naker' => $data->penyerapanTenagaMiskin?->skor,
                'files' => [
                    'foto' => asset('' . $data->file_foto),
                    'ktp' => asset('' . $data->file_ktp),
                    'kk' => asset('' . $data->file_kk),
                    'nib' => asset('' . $data->file_nib),
                    'sku' => asset('' . $data->file_sku),
                    'skd' => asset('' . $data->file_skd),
                    'produk' => asset('' . $data->file_produk),
                    'pernyataan' => asset('' . $data->file_pernyataan),
                    'perizinan' => $data->file_perizinan ? array_map(fn($file) => asset('' . $file), $data->file_perizinan) : [],
                    'siinas' => asset('' . $data->file_siinas),
                    'bp' => asset('' . $data->file_bp),
                    'sertifikat_pelatihan' => asset('' . $data->file_sertifikat_pelatihan),
                ]
            ]
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id) {}

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
