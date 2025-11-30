<?php

namespace App\Http\Controllers\Admin;

use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\PelatihanKerjas;
use Yajra\DataTables\DataTables;
use App\Models\PendaftaranBanmod;
use App\Http\Controllers\Controller;
use App\Traits\HasVerifikasiDokumen;
use App\Models\JenisPelatihanKetKerja;
use Illuminate\Routing\Controllers\HasMiddleware;

class PelatihanKerjaController extends Controller implements HasMiddleware
{
    use HasVerifikasiDokumen;

    public function getVerificationType(): string
    {
        return 'PELATIHAN_KERJA';
    }

    /**
     * Get available document types for this model
     */
    public static function getDocumentTypes(): array
    {
        return [
            'ktp' => 'KTP',
            'kk' => 'Kartu Keluarga',
            'pasfoto' => 'Pas Foto',
            'surat_pernyataan_tidak_ikut' => 'Surat Pernyataan Tidak Mengikuti Pelatihan Lain',
            'surat_kesanggupan' => 'Surat Kesanggupan Mengikuti Pelatihan',
            'fotokopi_ijazah' => 'Fotokopi Ijazah',
        ];
    }
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

        if ($request->wantsJson()) {
            $query = PelatihanKerjas::with(['refPendidikan', 'jenisPelatihan', 'alasanPelatihan', 'documentVerifications']);

            if ($request->has('jenis_pelatihan') && $request->jenis_pelatihan !== 'all') {
                $query->where('jenis_pelatihan', $request->jenis_pelatihan);
            }
            // Jika request untuk stats saja
            if ($request->has('stats') && $request->stats) {
                $data = $query->get();

                if ($request->has('verification_status')) {
                    $status = $request->verification_status;
                    $data = $data->filter(function ($item) use ($status) {
                        $verifications = $item->documentVerifications;
                        $requiredDocs =  ['ktp', 'kk', 'pasfoto', 'surat_pernyataan_tidak_ikut', 'surat_kesanggupan', 'fotokopi_ijazah'];
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

                return response()->json([
                    'stats' => [
                        'total' => $data->count(),
                        'lolos' => $data->where('status', 1)->count(),
                        'gagal' => $data->where('status', 2)->count(),
                        'blacklist' => $data->where('status', 3)->count(),
                        'lolosLain' => $data->where('status', 4)->count(),
                    ]
                ]);
            }

            if ($request->has('status') && $request->status !== 'all') {
                $query->where('status', $request->status);
            }
            $data = $query->orderBy('created_at', 'asc')->get()->sortByDesc('skor');

            if ($request->has('verification_status')) {
                $status = $request->verification_status;
                $data = $data->filter(function ($item) use ($status) {
                    $verifications = $item->documentVerifications;
                    $requiredDocs = ['ktp', 'kk', 'pasfoto', 'surat_pernyataan_tidak_ikut', 'surat_kesanggupan', 'fotokopi_ijazah'];
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
                        'edit_url' => route('admin.kerja.edit', $row->id),
                        'delete_url' => route('admin.kerja.destroy', $row->id),
                        'detail_url' => route('admin.kerja.show', $row->id),
                        'status_url' => route('admin.kerja.status', $row->id)
                    ];
                })
                ->addColumn('verifikasi_dokumen', function ($row) {
                    $requiredDocs = ['ktp', 'kk', 'pasfoto', 'surat_pernyataan_tidak_ikut', 'surat_kesanggupan', 'fotokopi_ijazah'];
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
        $categories = JenisPelatihanKetKerja::all()->prepend(['id' => 'all', 'nama' => 'Semua pelatihan']);


        // return response()->json($categories);
        return Inertia::render('Admin/PelatihanKerja/Index', [
            'title' => 'Daftar Peserta Pelatihan Pencari Kerja',
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
    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $data = PelatihanKerjas::with(['refPendidikan', 'jenisPelatihan', 'alasanPelatihan', 'documentVerifications.verifier'])
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
                'status' => $data->status,
                'keterangan' => $data->keterangan,
                'skor_total' => $data->skor,
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
                'status_bekerja' => $data->status_bekerja,
                'pernah_pelatihan' => $data->pernah_pelatihan,
                'status_domisili' => $data->status_domisili,
                'files' => [
                    'ktp' => [
                        'url' => asset('' . $data->file_ktp),
                        'verification' => $verifiedDocuments['ktp'] ?? null
                    ],
                    'kk' => [
                        'url' => asset('' . $data->file_kk),
                        'verification' => $verifiedDocuments['kk'] ?? null
                    ],
                    'pasfoto' => [
                        'url' => asset('' . $data->file_pasfoto),
                        'verification' => $verifiedDocuments['pasfoto'] ?? null
                    ],
                    'surat_pernyataan_tidak_ikut' => [
                        'url' => asset('' . $data->file_surat_pernyataan_tidak_ikut),
                        'verification' => $verifiedDocuments['surat_pernyataan_tidak_ikut'] ?? null
                    ],
                    'surat_kesanggupan' => [
                        'url' => asset('' . $data->file_surat_kesanggupan),
                        'verification' => $verifiedDocuments['surat_kesanggupan'] ?? null
                    ],
                    'fotokopi_ijazah' => [
                        'url' => asset('' . $data->file_fotokopi_ijazah),
                        'verification' => $verifiedDocuments['fotokopi_ijazah'] ?? null
                    ],
                ],
                'documentTypes' => PelatihanKerjas::getDocumentTypes()
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

    public function updateStatus(Request $request, $id)
    {
        $validated = $request->validate([
            'status' => 'required|integer|in:1,2,3,4',
            'notes' => 'nullable|string', // Tambah validasi untuk notes
        ]);

        $data = PelatihanKerjas::findOrFail($id);

        // Validate if document is verified
        $verifications = $data->documentVerifications;
        $requiredDocs = ['ktp', 'kk', 'pasfoto', 'surat_pernyataan_tidak_ikut', 'surat_kesanggupan', 'fotokopi_ijazah'];
        $allVerified = count($verifications) === count($requiredDocs);
        $allApproved = $verifications->every(fn($v) => $v->status === 1);

        if (!$allVerified ) {
            return response()->json([
                'message' => 'Dokumen belum terverifikasi lengkap'
            ], 422);
        }


        $data->status = $validated['status'];
        // Simpan notes jika ada (untuk blacklist atau status lainnya)
        if (!empty($validated['notes'])) {
            $data->keterangan = $validated['notes'];
        }

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
