<?php

namespace App\Http\Controllers\Admin;

use Inertia\Inertia;
use Illuminate\Http\Request;
use Yajra\DataTables\DataTables;
use App\Http\Controllers\Controller;
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
                ->rawColumns(['action', 'verifikasi_dokumen'])
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
        $data = PelatihanUmkm::with(['alasanPelatihan', 'kesesuaianPelatihan', 'pengalamanPelatihan', 'documentVerifications.verifier'])->findOrFail($id);
        // return response()->json($data);
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
        $validated = $request->validate([
            'status' => 'required|integer|in:1,2,3,4',
            'notes' => 'nullable|string', // Tambah validasi untuk notes
        ]);


        $data = PelatihanUmkm::findOrFail($id);

        // Validate if document is verified
        $verifications = $data->documentVerifications;
        $requiredDocs = ['pasfoto', 'ktp', 'kk', 'surat_pernyataan_tidak_ikut', 'surat_kesanggupan', 'nib'];
        $allVerified = count($verifications) === count($requiredDocs);
        $allApproved = $verifications->every(fn($v) => $v->status === 1);

        if (!$allVerified || !$allApproved) {
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
