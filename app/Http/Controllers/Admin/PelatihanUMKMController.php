<?php

namespace App\Http\Controllers\Admin;

use Inertia\Inertia;
use Illuminate\Http\Request;
use Yajra\DataTables\DataTables;
use App\Http\Controllers\Controller;
use App\Models\PelatihanBanmod;
use App\Models\MasterPencariKerja;
use App\Models\PelatihanUmkm;
use App\Traits\HasVerifikasiDokumen;
use Illuminate\Routing\Controllers\HasMiddleware;

use function Pest\Laravel\get;

class PelatihanUMKMController extends Controller implements HasMiddleware
{
    use HasVerifikasiDokumen;

    public function getVerificationType(): string
    {
        return 'PELATIHAN_UMKM';
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
            'surat_kesanggupan' => 'Surat Pernyataan Kesanggupan',
            'nib' => 'NIB',
        ];
    }

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
            $query = PelatihanUmkm::with(['documentVerifications']);

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

            // Jika request untuk stats saja
            if ($request->has('stats') && $request->stats) {
                $data = $query->get();

                if ($request->has('verification_status')) {
                    $status = $request->verification_status;
                    $data = $data->filter(function ($item) use ($status) {
                        $verifications = $item->documentVerifications;
                        $requiredDocs =  ['pasfoto', 'ktp', 'kk', 'surat_pernyataan_tidak_ikut', 'surat_kesanggupan', 'nib'];
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
                    $requiredDocs =  ['pasfoto', 'ktp', 'kk', 'surat_pernyataan_tidak_ikut', 'surat_kesanggupan', 'nib'];
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

            [$lolosIds, $masterNiks] = $this->getNikDenganPelatihanSebelumnya($data);

            return DataTables::of($data)
                ->addIndexColumn()
                ->addColumn('action', function ($row) {
                    return [
                        'edit_url' => route('admin.umkm.edit', $row->id),
                        'delete_url' => route('admin.umkm.destroy', $row->id),
                        'detail_url' => route('admin.umkm.show', $row->id),
                        'status_url' => route('admin.umkm.status', $row->id)
                    ];
                })
                ->addColumn('verifikasi_dokumen', function ($row) {
                    $requiredDocs = ['pasfoto', 'ktp', 'kk', 'surat_pernyataan_tidak_ikut', 'surat_kesanggupan', 'nib'];
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
                ->addColumn('keterangan', function ($row) {
                    // Kirim keterangan untuk tooltip
                    return $row->keterangan ?? null;
                })
                ->addColumn('pelatihan_sebelumnya', function ($row) use ($lolosIds, $masterNiks) {
                    if ($masterNiks->has($row->nik)) {
                        return true;
                    }
                    $ids = $lolosIds->get($row->nik, collect());
                    return $ids->contains(fn ($id) => (int) $id !== (int) $row->id);
                })
                ->rawColumns(['action', 'verifikasi_dokumen'])
                ->make(true);
        }
        // Filter admin membaca nilai prioritas_1 distinct dari data pada tahun
        // yang sedang dipilih, supaya opsi filter selalu relevan dengan tahun.
        $pelatihan = PelatihanUmkm::query()
            ->distinct()
            ->orderBy('prioritas_1')
            ->pluck('prioritas_1')
            ->filter()
            ->values()
            ->prepend('Semua Pelatihan')
            ->map(fn ($name) => ['name' => $name])
            ->values()
            ->all();

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
        $data = PelatihanUmkm::with(['alasanPelatihan', 'kesesuaianPelatihan', 'pengalamanPelatihan', 'documentVerifications.verifier'])->findOrFail($id);

        $pelatihanSebelumnya = collect()
            ->merge(
                PelatihanUmkm::where('nik', $data->nik)
                    ->where('id', '!=', $data->id)
                    ->where('status', 1)
                    ->withoutSelectedYearFilter()
                    ->get(['prioritas_1', 'prioritas_2', 'prioritas_3', 'created_at'])
                    ->map(function ($row) {
                        return [
                            'jenis' => $row->prioritas_1 ?? $row->prioritas_2 ?? $row->prioritas_3 ?? '-',
                            'nama_pelatihan' => 'UMKM',
                            'tahun' => $row->created_at?->format('Y') ?? '-',
                        ];
                    })
            )
            ->merge(
                PelatihanBanmod::where('nik', $data->nik)
                    ->where('status', 1)
                    ->withoutSelectedYearFilter()
                    ->get(['jenis_pelatihan_industri', 'created_at'])
                    ->map(function ($row) {
                        return [
                            'jenis' => $row->jenis_pelatihan_industri,
                            'nama_pelatihan' => 'Penerima Banmod',
                            'tahun' => $row->created_at?->format('Y') ?? '-',
                        ];
                    })
            )
            ->merge(
                MasterPencariKerja::where('nik', $data->nik)
                    ->get(['jenis_pelatihan', 'tahun'])
                    ->map(function ($row) {
                        return [
                            'jenis' => $row->jenis_pelatihan,
                            'nama_pelatihan' => 'Pencari Kerja',
                            'tahun' => $row->tahun ?? '-',
                        ];
                    })
            )
            ->values();

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
        return Inertia::render('Admin/PelatihanUMKM/Show', [
            'title' => 'Detail Peserta Pelatihan UMKM',
            'data' => [
                'id' => $data->id,
                'nik' => $data->nik,
                'no_kk' => $data->no_kk,
                'desil' => $data->desil,
                'name' => $data->nama_lengkap,
                'tempat_lahir' => $data->tempat_lahir,
                'tgl_lahir' => $data->tgl_lahir,
                'jenis_kelamin' => $data->jenis_kelamin,
                'no_hp' => $data->no_hp,
                'pendidikan' => $data->pendidikan,
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
                'alasan' => $data->alasanPelatihan?->jawaban,
                'skor_alasan' => $data->alasanPelatihan?->skor,
                'kesesuaian' => $data->kesesuaianPelatihan?->jawaban,
                'skor_kesesuaian' => $data->kesesuaianPelatihan?->skor,
                'pengalaman' => $data->pengalamanPelatihan?->jawaban,
                'skor_pengalaman' => $data->pengalamanPelatihan?->skor,
                'skor' => $data->skor,
                'komitmen' => $data->komitmen,
                'status' => $data->status,
                'keterangan' => $data->keterangan,
                'pelatihan_sebelumnya' => $pelatihanSebelumnya,

                // Files
                'files' => [
                    'pasfoto' => [
                        'url' => asset($data->file_pasfoto),
                        'verification' => $verifiedDocuments['pasfoto'] ?? null
                    ],
                    'ktp' => [
                        'url' => asset($data->file_ktp),
                        'verification' => $verifiedDocuments['ktp'] ?? null
                    ],
                    'kk' => [
                        'url' => asset($data->file_kk),
                        'verification' => $verifiedDocuments['kk'] ?? null
                    ],
                    'surat_pernyataan_tidak_ikut' => [
                        'url' => asset($data->file_surat_pernyataan_tidak_ikut),
                        'verification' => $verifiedDocuments['surat_pernyataan_tidak_ikut'] ?? null
                    ],
                    'surat_kesanggupan' => [
                        'url' => asset($data->file_surat_kesanggupan),
                        'verification' => $verifiedDocuments['surat_kesanggupan'] ?? null
                    ],
                    'nib' => [
                        'url' => asset($data->file_nib),
                        'verification' => $verifiedDocuments['nib'] ?? null
                    ],
                ],
                'documentTypes' => PelatihanUmkm::getDocumentTypes()
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
     * Update the status of the specified resource.
     */
    public function updateStatus(Request $request, $id)
    {
        $validated = $request->validate(
            [
                'status' => 'required|integer|in:1,2,3,4',
                'notes' => 'required_if:status,2|string|max:500', // Alasan wajib saat menolak/gagal
            ],
            [
                'notes.required_if' => 'Alasan penggagalan wajib diisi.',
            ]
        );


        $data = PelatihanUmkm::findOrFail($id);

        // Validate if document is verified
        $verifications = $data->documentVerifications;
        $requiredDocs = ['pasfoto', 'ktp', 'kk', 'surat_pernyataan_tidak_ikut', 'surat_kesanggupan', 'nib'];
        $allVerified = count($verifications) === count($requiredDocs);
        $allApproved = $verifications->every(fn($v) => $v->status === 1);

        if (!$allVerified ) {
            return response()->json([
                'message' => 'Dokumen belum terverifikasi lengkap'
            ], 422);
        }

        $data->status = $validated['status'];
        // Simpan notes jika ada (untuk blacklist atau status lainnya).
        // Saat status gagal (2), alasan sudah dipastikan terisi oleh
        // required_if:status,2 pada validasi di atas.
        if (!empty($validated['notes'])) {
            $data->keterangan = $validated['notes'];
        }

        $data->save();

        // Tambahkan pesan sesuai status
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
