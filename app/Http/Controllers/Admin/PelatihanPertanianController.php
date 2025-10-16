<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;
use App\Models\PelatihanPetani;
use Yajra\DataTables\DataTables;
use App\Http\Controllers\Controller;
use App\Models\JenisPelatihanPetani;
use App\Traits\HasVerifikasiDokumen;
use Illuminate\Routing\Controllers\HasMiddleware;

class PelatihanPertanianController extends Controller implements HasMiddleware
{

    use HasVerifikasiDokumen;

    public function getVerificationType(): string
    {
        return 'PELATIHAN_PERTANIAN';
    }

    /**
     * Get available document types for this model
     */
    public static function getDocumentTypes(): array
    {
        return [
            'foto' => 'Pas Foto',
            'ktp' => 'KTP',
            'pengukuhan_penyuluh_swadaya' => 'SK Pengukuhan Penyuluh Swadaya',
            'rekomendasi_kelompok' => 'Surat Rekomendasi Kelompok Tani',
            'skd' => 'Surat Keterangan Domisili',
        ];
    }
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
        if ($request->wantsJson()) {

            $query = PelatihanPetani::with('kelompokTani', 'jenisPelatihanPetani', 'kategoriKelompok', 'alasanPelatihan', 'masaAktifKelompok', 'documentVerifications');
            if ($request->has('jenis_pelatihan_petani') && $request->jenis_pelatihan_petani !== 'all') {
                $query->where('jenis_pelatihan_petani', $request->jenis_pelatihan_petani);
            }
            if ($request->has('status') && $request->status !== 'all') {
                $query->where('status', $request->status);
            }
            $data = $query->orderBy('created_at', 'asc')->get()->sortByDesc('skor');
            if ($request->has('verification_status')) {
                $status = $request->verification_status;
                $data = $data->filter(function ($item) use ($status) {
                    $verifications = $item->documentVerifications;
                    $requiredDocs = ['ktp', 'kk', 'pengukuhan_penyuluh_swadaya', 'rekomendasi_kelompok', 'skd'];
                    $allVerified = count($verifications) === count($requiredDocs);
                    $allApproved = $verifications->every(function ($verification) {
                        return $verification->status === 1;
                    });
                    switch ($status) {
                        case 'verified':
                            return $allVerified && $allApproved;
                        case 'rejected':
                            return $allVerified && !$allApproved;
                        case 'pending':
                            return !$allVerified;
                        default:
                            return true;
                    }
                });
            }

            return DataTables::of($data)
                ->addIndexColumn()
                ->addColumn('action', function ($row) {
                    return [
                        'edit_url' => route('admin.pertanian.edit', $row->id),
                        'delete_url' => route('admin.pertanian.destroy', $row->id),
                        'detail_url' => route('admin.pertanian.show', $row->id),
                        'status_url' => route('admin.pertanian.status', $row->id)
                    ];
                })
                ->addColumn('verifikasi_dokumen', function ($row) {
                    $requiredDocs = ['ktp', 'kk', 'pengukuhan_penyuluh_swadaya', 'rekomendasi_kelompok', 'skd'];
                    $verifications = $row->documentVerifications;

                    $allVerified = count($verifications) === count($requiredDocs);
                    $allApproved = $verifications->every(function ($verification) {
                        return $verification->status === 1;
                    });

                    return [
                        'all_verified' => $allVerified,
                        'all_approved' => $allApproved
                    ];
                })
                ->rawColumns(['action', 'verifikasi_dokumen'])
                ->make(true);
        }
        $categories = JenisPelatihanPetani::all()->prepend(['id' => 'all', 'nama' => 'Semua pelatihan']);

        return inertia('Admin/PelatihanPertanian/Index', [
            'title' => 'Pelatihan Pertanian',
            'flash' => [
                'message' => session('message')
            ],
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

    public function show(string $id)
    {
        $data = PelatihanPetani::with(['kelompokTani', 'kategoriKelompok', 'jenisPelatihanPetani', 'alasanPelatihan', 'masaAktifKelompok', 'documentVerifications'])
            ->findOrFail($id);

        $verifiedDocuments = $data->documentVerifications
            ->groupBy('document_type')
            ->map(function ($verifications) {
                $verification = $verifications->first();
                return [
                    'verified' => true,
                    'status' => $verification->status,
                    'verified_by' => $verification->verifier->name,
                    'verified_at' => $verification->verified_at->format('d/m/Y H:i'),
                    'notes' => $verification->notes
                ];
            })
            ->toArray();

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
                    'skor_masa_aktif' => $data->masaAktifKelompok->skor,
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
                'skor' => $data->skor,
                'alasan' => $data->alasanPelatihan?->jawaban,
                'skor_alasan' => $data->alasanPelatihan?->skor,

                'files' => [
                    'ktp' => [
                        'url' => asset('storage/' . $data->file_ktp),
                        'verification' => $verifiedDocuments['ktp'] ?? null
                    ],
                    'foto' => [
                        'url' => asset('storage/' . $data->file_foto),
                        'verification' => $verifiedDocuments['foto'] ?? null
                    ],
                    'pengukuhan_penyuluh_swadaya' => [
                        'url' => asset('storage/' . $data->file_pengukuhan_penyuluh_swadaya),
                        'verification' => $verifiedDocuments['pengukuhan_penyuluh_swadaya'] ?? null
                    ],
                    'rekomendasi_kelompok' => [
                        'url' => asset('storage/' . $data->file_rekomendasi_kelompok),
                        'verification' => $verifiedDocuments['rekomendasi_kelompok'] ?? null
                    ],
                    'skd' => [
                        'url' => asset('storage/' . $data->file_domisili),
                        'verification' => $verifiedDocuments['skd'] ?? null
                    ],
                ],
                'documentTypes' => PelatihanPetani::getDocumentTypes()
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


    public function updateStatus(Request $request, $id)
    {
        $data = PelatihanPetani::findOrFail($id);

        // Validate if document is verified
        $verifications = $data->documentVerifications;
        $requiredDocs = ['ktp', 'kk', 'pengukuhan_penyuluh_swadaya', 'rekomendasi_kelompok', 'skd'];
        $allVerified = count($verifications) === count($requiredDocs);
        $allApproved = $verifications->every(fn($v) => $v->status === 1);

        if (!$allVerified || !$allApproved) {
            return response()->json([
                'message' => 'Dokumen belum terverifikasi lengkap'
            ], 422);
        }

        $data->status = $request->status;
        $data->save();

        $statusMessage = match ($request->status) {
            1 => 'Peserta berhasil diloloskan',
            2 => 'Peserta telah digagalkan',
            3 => 'Peserta telah dimasukkan ke blacklist',
            4 => 'Peserta ditolak karena sudah lolos di pelatihan lain',
            default => 'Status berhasil diperbarui'
        };

        return response()->json([
            'success' => true,
            'message' => $statusMessage,
            'current_id' => $id,
            'nik' => $data->nik
        ]);
    }
    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
