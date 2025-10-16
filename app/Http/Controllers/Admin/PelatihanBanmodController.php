<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;
use App\Models\PelatihanBanmod;
use Yajra\DataTables\DataTables;
use App\Http\Controllers\Controller;
use App\Traits\HasVerifikasiDokumen;
use Illuminate\Routing\Controllers\HasMiddleware;


class PelatihanBanmodController extends Controller implements HasMiddleware
{

    use HasVerifikasiDokumen;

    public function getVerificationType(): string
    {
        return 'PELATIHAN_BANMOD';
    }

    /**
     * Get available document types for this model
     */
    public static function getDocumentTypes(): array
    {
        return [
            'ktp' => 'KTP',
            'kk' => 'Kartu Keluarga',
            'nib' => 'NIB',
            'skd' => 'Surat Keterangan Domisili',

        ];
    }
    /**
     * Display a listing of the resource.
     */

    public static function middleware(): array
    {
        return [
            'permission:view-pelatihan-banmod',
            // 'role:admin',
        ];
    }

    public function index(Request $request)
    {
        if ($request->wantsJson()) {

            $query = PelatihanBanmod::with(['documentVerifications']);

            if ($request->has('jenis_pelatihan_industri') && $request->jenis_pelatihan_industri !== 'Semua Pelatihan') {
                $query->where('jenis_pelatihan_industri', $request->jenis_pelatihan_industri);
            }
            if ($request->has('status') && $request->status !== 'all') {
                $query->where('status', $request->status);
            }
            $data = $query->orderBy('created_at', 'asc')->get()->sortByDesc('skor');

            if ($request->has('verification_status')) {
                $status = $request->verification_status;
                $data = $data->filter(function ($item) use ($status) {
                    $verifications = $item->documentVerifications;
                    $requiredDocs = ['ktp', 'kk', 'nib', 'skd'];
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
                        'edit_url' => route('admin.pelatihan-banmod.edit', $row->id),
                        'delete_url' => route('admin.pelatihan-banmod.destroy', $row->id),
                        'detail_url' => route('admin.pelatihan-banmod.show', $row->id),
                        'status_url' => route('admin.pelatihan-banmod.status', $row->id)
                    ];
                })
                ->addColumn('verifikasi_dokumen', function ($row) {
                    $requiredDocs = ['ktp', 'kk', 'nib', 'skd'];
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

        $pelatihan = [
            ['name' => 'Semua Pelatihan'],
            ['name' => 'Tenun'],
            ['name' => 'Batik/Ecoprint'],
            ['name' => 'Sulam/Bordir'],
            ['name' => 'Rajut'],
            ['name' => 'Aksesoris (Gelang, Kalung)'],
            ['name' => 'Anyaman'],
            ['name' => 'Kerajinan Lainnya'],
            ['name' => 'Penjahitan Pakaian'],
            ['name' => 'Penjahitan Tas, Dompet, dll'],
            ['name' => 'Bengkel'],
            ['name' => 'Makanan (Roti)'],
            ['name' => 'Makanan (Kue Kering)'],
            ['name' => 'Makanan (Kue Basah)'],
            ['name' => 'Makanan (Catering)'],
            ['name' => 'Makanan (Olahan Daging/Ikan)'],
            ['name' => 'Makanan (Keripik, Krupuk, Rempeyek)'],
            ['name' => 'Minuman (Jamu)'],
            ['name' => 'Minuman (Kekinian)'],
            ['name' => 'Fotokopi/Percetakan'],
            ['name' => 'Sablon Kaos'],
        ];

        return inertia('Admin/PelatihanBanmod/Index', [
            'title' => 'Pelatihan Penerima Banmod',
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
        $data = PelatihanBanmod::with(['documentVerifications'])->findOrFail($id);
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

        return inertia('Admin/PelatihanBanmod/Show', [
            'title' => 'Detail Peserta Pelatihan Banmod',
            'data' => [
                'id' => $data->id,
                'tahun_penerimaan' => $data->tahun_penerimaan,
                'nik' => $data->nik,
                'nama_lengkap' => $data->nama_lengkap,
                'no_kk' => $data->no_kk,
                'no_hp' => $data->no_hp,

                // Alamat KTP
                'alamat_ktp' => [
                    'kecamatan' => $data->kecamatan_ktp,
                    'kelurahan' => $data->kelurahan_ktp,
                    'rw' => $data->rw_ktp,
                    'rt' => $data->rt_ktp,
                    'jalan' => $data->jalan_ktp,
                ],

                // Alamat Usaha
                'alamat_usaha' => [
                    'kecamatan' => $data->kecamatan_usaha,
                    'kelurahan' => $data->kelurahan_usaha,
                    'rw' => $data->rw_usaha,
                    'rt' => $data->rt_usaha,
                    'jalan' => $data->jalan_usaha,
                ],

                // Data Pelatihan
                'jenis_pelatihan' => $data->jenis_pelatihan_industri,

                // Data Perkembangan
                'perkembangan' => [
                    'omzet' => $data->perkembangan_omzet,
                    'tenaga_kerja' => $data->perkembangan_tenaga_kerja,
                ],

                // Skor Penilaian
                'skor' => [
                    'ketrampilan' => $data->skor_ketrampilan,
                    'kualitas_produk' => $data->skor_kualitas_produk,
                    'permasalahan_usaha' => $data->skor_permasalahan_usaha,
                    'mengisi_waktu' => $data->skor_mengisi_waktu,
                    'diajak_teman' => $data->skor_diajak_teman,
                ],

                'skor_total' => $data->skor,
                'komitmen' => $data->komitmen,
                'files' => [
                    'ktp' => [
                        'url' => asset('storage/' . $data->file_ktp),
                        'verification' => $verifiedDocuments['ktp'] ?? null
                    ],
                    'kk' => [
                        'url' => asset('storage/' . $data->file_kk),
                        'verification' => $verifiedDocuments['kk'] ?? null
                    ],
                    'nib' => [
                        'url' => asset('storage/' . $data->file_nib),
                        'verification' => $verifiedDocuments['nib'] ?? null
                    ],
                    'skd' => [
                        'url' => asset('storage/' . $data->file_domisili),
                        'verification' => $verifiedDocuments['skd'] ?? null
                    ],
                ],
                'documentTypes' => PelatihanBanmod::getDocumentTypes(),

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
        $data = PelatihanBanmod::findOrFail($id);

        // Validate if document is verified
        $verifications = $data->documentVerifications;
        $requiredDocs = ['ktp', 'kk', 'nib', 'skd'];
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
