<?php

namespace App\Http\Controllers\Admin;

use Inertia\Inertia;
use Illuminate\Http\Request;
use Yajra\DataTables\DataTables;
use App\Models\PendaftaranBanmod;
use App\Http\Controllers\Controller;
use App\Traits\HasVerifikasiDokumen;
use Illuminate\Routing\Controllers\HasMiddleware;

class PendaftaranBanmodController extends Controller implements HasMiddleware
{
    use HasVerifikasiDokumen;

    public function getVerificationType(): string
    {
        return 'PENDAFTARAN_BANMOD';
    }

    /**
     * Get available document types for this model
     */
    public static function getDocumentTypes(): array
    {
        return [
            'foto' => 'Pas Foto',
            'ktp' => 'KTP',
            'kk' => 'Kartu Keluarga',
            'nib' => 'NIB',
            'sku' => 'SKU',
            'skd' => 'SKD',
            'produk' => 'Produk',
            'lokasi_usaha' => 'Foto Lokasi Usaha',
            'perizinan' => 'Perizinan',
            'siinas' => 'SIINAS',
            'bp' => 'BP',
            'surat_disabilitas' => 'Surat Keterangan Disabilitas',
            'sertifikat_pelatihan' => 'Sertifikat Pelatihan',
        ];
    }
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
        if ($request->wantsJson()) {
            $query = PendaftaranBanmod::with(['documentVerifications', 'klasterUsaha', 'kategoriUsaha']);
            $data = $query->orderBy('created_at', 'asc')->get()->sortByDesc('skor');
            if ($request->has('verification_status')) {
                $status = $request->verification_status;
                $data = $data->filter(function ($item) use ($status) {
                    $verifications = $item->documentVerifications;
                    $requiredDocs = PendaftaranBanmod::getRequiredDocuments($item->kategori);

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
                        'edit_url' => route('admin.banmod.edit', $row->id),
                        'delete_url' => route('admin.banmod.destroy', $row->id),
                        'detail_url' => route('admin.banmod.show', $row->id),
                        'status_url' => route('admin.banmod.status', $row->id)
                    ];
                })
                ->addColumn('verifikasi_dokumen', function ($row) {
                    $requiredDocs = PendaftaranBanmod::getRequiredDocuments($row->kategori);
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
        return Inertia::render('Admin/Banmod/Index', [
            'title' => 'Daftar Peserta Bantuan Modal - Semua Kategori',
            'flash' => [
                'message' => session('message')
            ],
            'dataRoute' => route('admin.banmod.index'),
        ]);
    }

    public function updateStatus(Request $request, $id)
    {
        $validated = $request->validate(
            [
                'status' => 'required|integer|in:1,2,3,4',
                'notes' => 'required_if:status,2|string|max:500',
            ],
            [
                'notes.required_if' => 'Alasan penggagalan wajib diisi.',
            ]
        );

        $data = PendaftaranBanmod::findOrFail($id);

        $requiredDocs = PendaftaranBanmod::getRequiredDocuments($data->kategori);
        $verifications = $data->documentVerifications->whereIn('document_type', $requiredDocs);

        $allVerified = count($verifications) === count($requiredDocs);

        if (!$allVerified) {
            return response()->json([
                'message' => 'Dokumen belum terverifikasi lengkap'
            ], 422);
        }

        $data->status = $validated['status'];

        if (!empty($validated['notes'])) {
            $data->keterangan = $validated['notes'];
        }

        $data->save();

        $statusMessage = match ((int) $request->status) {
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

    public function buruh_pabrik_rokok(Request $request)
    {
        if ($request->wantsJson()) {
            $query = PendaftaranBanmod::with(['documentVerifications', 'klasterUsaha', 'kategoriUsaha'])->where('kategori', '1');
            $data = $query->orderBy('created_at', 'asc')->get()->sortByDesc('skor');

            // return response()->json($data);
            if ($request->has('verification_status')) {
                $status = $request->verification_status;
                $data = $data->filter(function ($item) use ($status) {
                    $verifications = $item->documentVerifications;
                    $requiredDocs = PendaftaranBanmod::getRequiredDocuments(1);
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
                        'edit_url' => route('admin.banmod.edit', $row->id),
                        'delete_url' => route('admin.banmod.destroy', $row->id),
                        'detail_url' => route('admin.banmod.show', $row->id),
                        'status_url' => route('admin.banmod.status', $row->id)
                    ];
                })
                ->addColumn('verifikasi_dokumen', function ($row) {
                    $requiredDocs = PendaftaranBanmod::getRequiredDocuments($row->kategori);
                    $verifications = $row->documentVerifications;

                    $allVerified = count($verifications) === count($requiredDocs);
                    $allApproved = $verifications->every(function ($verification) {
                        return $verification->status === 1;
                    });

                    return [
                        'all_verified' => $allVerified,
                        'all_approved' => $allApproved,
                        'debug' => [
                            'kategori' => $row->kategori,
                            'required_docs' => $requiredDocs,
                            'verifications' => $verifications,
                            'verifications_count' => count($verifications),
                            'required_docs_count' => count($requiredDocs),
                            'verification_statuses' => $verifications->pluck('status')->toArray()
                        ]
                    ];
                })
                ->rawColumns(['action', 'verifikasi_dokumen'])
                ->make(true);
        }
        return Inertia::render('Admin/Banmod/Index', [
            'title' => 'Daftar Peserta Bantuan Modal - Buruh Pabrik Rokok',
            'flash' => [
                'message' => session('message')
            ],
            'dataRoute' => route('admin.banmod.buruh-pabrik-rokok'),
        ]);
    }
    public function buruh_tani_tembakau(Request $request)
    {
        if ($request->wantsJson()) {
            $query = PendaftaranBanmod::with(['documentVerifications', 'klasterUsaha', 'kategoriUsaha'])->where('kategori', '2');
            $data = $query->orderBy('created_at', 'asc')->get()->sortByDesc('skor');
            if ($request->has('verification_status')) {
                $status = $request->verification_status;
                $data = $data->filter(function ($item) use ($status) {
                    $verifications = $item->documentVerifications;
                    $requiredDocs = PendaftaranBanmod::getRequiredDocuments($item->kategori);
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
                        'edit_url' => route('admin.banmod.edit', $row->id),
                        'delete_url' => route('admin.banmod.destroy', $row->id),
                        'detail_url' => route('admin.banmod.show', $row->id),
                        'status_url' => route('admin.banmod.status', $row->id)
                    ];
                })
                ->addColumn('verifikasi_dokumen', function ($row) {
                    $requiredDocs = PendaftaranBanmod::getRequiredDocuments($row->kategori);
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
        return Inertia::render('Admin/Banmod/Index', [
            'title' => 'Daftar Peserta Bantuan Modal - Buruh Tani Tembakau',
            'flash' => [
                'message' => session('message')
            ],
            'dataRoute' => route('admin.banmod.buruh-tani-tembakau'),
        ]);
    }
    public function pekerja_pabrik_rokok(Request $request)
    {
        if ($request->wantsJson()) {
            $query = PendaftaranBanmod::with(['documentVerifications', 'klasterUsaha', 'kategoriUsaha'])->where('kategori', '3');
            $data = $query->orderBy('created_at', 'asc')->get()->sortByDesc('skor');
            if ($request->has('verification_status')) {
                $status = $request->verification_status;
                $data = $data->filter(function ($item) use ($status) {
                    $verifications = $item->documentVerifications;
                    $requiredDocs = PendaftaranBanmod::getRequiredDocuments($item->kategori);
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
                        'edit_url' => route('admin.banmod.edit', $row->id),
                        'delete_url' => route('admin.banmod.destroy', $row->id),
                        'detail_url' => route('admin.banmod.show', $row->id),
                        'status_url' => route('admin.banmod.status', $row->id)
                    ];
                })
                ->addColumn('verifikasi_dokumen', function ($row) {
                    $requiredDocs = PendaftaranBanmod::getRequiredDocuments($row->kategori);
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
        return Inertia::render('Admin/Banmod/Index', [
            'title' => 'Daftar Peserta Bantuan Modal - Pekerja Pabrik Rokok',
            'flash' => [
                'message' => session('message')
            ],
            'dataRoute' => route('admin.banmod.pekerja-pabrik-rokok'),
        ]);
    }
    public function ikm(Request $request)
    {
        if ($request->wantsJson()) {
            $query = PendaftaranBanmod::with(['documentVerifications', 'klasterUsaha', 'kategoriUsaha'])->where('kategori', '4');
            $data = $query->orderBy('created_at', 'asc')->get()->sortByDesc('skor');
            if ($request->has('verification_status')) {
                $status = $request->verification_status;
                $data = $data->filter(function ($item) use ($status) {
                    $verifications = $item->documentVerifications;
                    $requiredDocs = PendaftaranBanmod::getRequiredDocuments($item->kategori);
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
                        'edit_url' => route('admin.banmod.edit', $row->id),
                        'delete_url' => route('admin.banmod.destroy', $row->id),
                        'detail_url' => route('admin.banmod.show', $row->id),
                        'status_url' => route('admin.banmod.status', $row->id)
                    ];
                })
                ->addColumn('verifikasi_dokumen', function ($row) {
                    $requiredDocs = PendaftaranBanmod::getRequiredDocuments($row->kategori);
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
        return Inertia::render('Admin/Banmod/Index', [
            'title' => 'Daftar Peserta Bantuan Modal - IKM',
            'flash' => [
                'message' => session('message')
            ],
            'dataRoute' => route('admin.banmod.ikm'),
        ]);
    }
    public function masyarakat_miskin(Request $request)
    {
        if ($request->wantsJson()) {
            $query = PendaftaranBanmod::with(['documentVerifications', 'klasterUsaha', 'kategoriUsaha'])->where('kategori', '5');
            $data = $query->orderBy('created_at', 'asc')->get()->sortByDesc('skor');
            if ($request->has('verification_status')) {
                $status = $request->verification_status;
                $data = $data->filter(function ($item) use ($status) {
                    $verifications = $item->documentVerifications;
                    $requiredDocs = PendaftaranBanmod::getRequiredDocuments($item->kategori);
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
                        'edit_url' => route('admin.banmod.edit', $row->id),
                        'delete_url' => route('admin.banmod.destroy', $row->id),
                        'detail_url' => route('admin.banmod.show', $row->id),
                        'status_url' => route('admin.banmod.status', $row->id)
                    ];
                })
                ->addColumn('verifikasi_dokumen', function ($row) {
                    $requiredDocs = PendaftaranBanmod::getRequiredDocuments($row->kategori);
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
        return Inertia::render('Admin/Banmod/Index', [
            'title' => 'Daftar Peserta Bantuan Modal - Masyarakat Miskin',
            'flash' => [
                'message' => session('message')
            ],
            'dataRoute' => route('admin.banmod.masyarakat-miskin'),

        ]);
    }
    public function disabilitas(Request $request)
    {
        if ($request->wantsJson()) {
            $query = PendaftaranBanmod::with(['documentVerifications', 'klasterUsaha', 'kategoriUsaha'])->where('kategori', '7');
            $data = $query->orderBy('created_at', 'asc')->get()->sortByDesc('skor');
            if ($request->has('verification_status')) {
                $status = $request->verification_status;
                $data = $data->filter(function ($item) use ($status) {
                    $verifications = $item->documentVerifications;
                    $requiredDocs = PendaftaranBanmod::getRequiredDocuments($item->kategori);
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
                        'edit_url' => route('admin.banmod.edit', $row->id),
                        'delete_url' => route('admin.banmod.destroy', $row->id),
                        'detail_url' => route('admin.banmod.show', $row->id),
                        'status_url' => route('admin.banmod.status', $row->id)
                    ];
                })
                ->addColumn('verifikasi_dokumen', function ($row) {
                    $requiredDocs = PendaftaranBanmod::getRequiredDocuments($row->kategori);
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
        return Inertia::render('Admin/Banmod/Index', [
            'title' => 'Daftar Peserta Bantuan Modal - Disabilitas',
            'flash' => [
                'message' => session('message')
            ],
            'dataRoute' => route('admin.banmod.disabilitas'),

        ]);
    }
    public function pkl(Request $request)
    {
        if ($request->wantsJson()) {
            $query = PendaftaranBanmod::with(['documentVerifications', 'klasterUsaha', 'kategoriUsaha'])->where('kategori', '6');
            $data = $query->orderBy('created_at', 'asc')->get()->sortByDesc('skor');
            if ($request->has('verification_status')) {
                $status = $request->verification_status;
                $data = $data->filter(function ($item) use ($status) {
                    $verifications = $item->documentVerifications;
                    $requiredDocs = PendaftaranBanmod::getRequiredDocuments($item->kategori);
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
                        'edit_url' => route('admin.banmod.edit', $row->id),
                        'delete_url' => route('admin.banmod.destroy', $row->id),
                        'detail_url' => route('admin.banmod.show', $row->id),
                        'status_url' => route('admin.banmod.status', $row->id)
                    ];
                })
                ->addColumn('verifikasi_dokumen', function ($row) {
                    $requiredDocs = PendaftaranBanmod::getRequiredDocuments($row->kategori);
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
        return Inertia::render('Admin/Banmod/Index', [
            'title' => 'Daftar Peserta Bantuan Modal - Pedagang Kaki Lima',
            'flash' => [
                'message' => session('message')
            ],
            'dataRoute' => route('admin.banmod.pkl'),

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
            'brutoPerbulan',
            'documentVerifications.verifier'
        ])->findOrFail($id);

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

        // Get required documents for this category
        $requiredDocs = PendaftaranBanmod::getDocumentTypes($data->kategori);

        // Initialize files array
        $files = [];

        // Add single files only if they exist
        $singleFiles = [
            'foto' => $data->file_foto,
            'ktp' => $data->file_ktp,
            'kk' => $data->file_kk,
            'nib' => $data->file_nib,
            'sku' => $data->file_sku,
            'skd' => $data->file_skd,
            'produk' => $data->file_produk,
            'siinas' => $data->file_siinas,
            'bp' => $data->file_bp,
            'sertifikat_pelatihan' => $data->file_sertifikat_pelatihan,
            'lokasi_usaha' => $data->file_lokasi_usaha,
            'surat_disabilitas' => $data->file_surat_disabilitas,
            'surat_buruh' => $data->file_surat_buruh,
            'surat_miskin' => $data->file_surat_miskin,
        ];

        foreach ($singleFiles as $type => $file) {
            if (!empty($file) && isset($requiredDocs[$type])) {
                $files[$type] = [
                    'url' => asset($file),
                    'verification' => $verifiedDocuments[$type] ?? null
                ];
            }
        }

        // Perbaiki handling multiple perizinan files
        if (!empty($data->file_perizinan) && isset($requiredDocs['perizinan'])) {
            $perizinanArray = [];

            // Handle jika string JSON
            if (is_string($data->file_perizinan)) {
                $decoded = json_decode($data->file_perizinan, true);
                $perizinanArray = is_array($decoded) ? $decoded : [$data->file_perizinan];
            }
            // Handle jika array
            else if (is_array($data->file_perizinan)) {
                $perizinanArray = $data->file_perizinan;
            }
            // Handle jika single string
            else {
                $perizinanArray = [$data->file_perizinan];
            }

            if (!empty($perizinanArray)) {
                $files['perizinan'] = array_map(function ($file) use ($verifiedDocuments) {
                    return [
                        'url' => asset($file),
                        'verification' => $verifiedDocuments['perizinan'] ?? null
                    ];
                }, $perizinanArray);
            }
        }
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
                'desil' => $data->desil,
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

                'files' => $files,
                'documentTypes' => array_intersect_key(
                    PendaftaranBanmod::getDocumentTypes($data->kategori),
                    $files
                )
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
