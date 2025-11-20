<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;
use Yajra\DataTables\DataTables;
use App\Http\Controllers\Controller;
use App\Traits\HasVerifikasiDokumen;
use App\Models\PelatihanEkonomiKreatif;
use Illuminate\Routing\Controllers\HasMiddleware;

class PelatihanEkrafController extends Controller implements HasMiddleware
{
    use HasVerifikasiDokumen;

    public function getVerificationType(): string
    {
        return 'PELATIHAN_EKRAF';
    }

    public static function getDocumentTypes(): array
    {
        return [
            'pasfoto' => 'Pas Foto',
            'ktp' => 'KTP',
            'kk' => 'Kartu Keluarga',
            'surat_pernyataan' => 'Surat Pernyataan Komitmen',
            'surat_pekerja_ekraf' => 'Surat Keterangan Pekerja Ekonomi Kreatif',
            'nib' => 'NIB',
            'surat_pemilik_lahan' => 'Surat Keterangan Pemilik Lahan',
            'id_card_iht' => 'ID Card / Surat Keterangan dari IHT',
            'surat_phk' => 'Surat Pemberhentian Kerja / sejenisnya dari IHT',
            'surat_disabilitas' => 'Surat Keterangan Disabilitas dari Kelurahan',
            'surat_kb' => 'Surat Keterangan Dinas KB',
        ];
    }

    public static function middleware(): array
    {
        return [
            'permission:view-pelatihan-banmod',
        ];
    }

    /**
     * Get required documents berdasarkan kategori pendaftar
     */
    private function getRequiredDocumentsByKategori($kategori)
    {
        $baseDocuments = [
            'pasfoto',
            'ktp',
            'kk',
            'surat_pernyataan',
            'surat_pekerja_ekraf',
            'nib'
        ];

        $additionalDocuments = [
            'buruh_tani_tembakau' => ['surat_pemilik_lahan'],
            'buruh_pabrik_rokok' => ['id_card_iht'],
            'buruh_phk' => ['surat_phk'],
            'disabilitas' => ['surat_disabilitas'],
            'perempuan_kk' => ['surat_kb'],
        ];

        return array_merge(
            $baseDocuments,
            $additionalDocuments[$kategori] ?? []
        );
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        if ($request->wantsJson()) {
            $query = PelatihanEkonomiKreatif::with(['documentVerifications']);

            if ($request->has('jenis_pelatihan') && $request->jenis_pelatihan !== 'Semua Pelatihan') {
                $query->where('jenis_pelatihan', $request->jenis_pelatihan);
            }

            // Jika request untuk stats saja
            if ($request->has('stats') && $request->stats) {
                $data = $query->get();

                if ($request->has('verification_status')) {
                    $status = $request->verification_status;
                    $data = $data->filter(function ($item) use ($status) {
                        $requiredDocs = $this->getRequiredDocumentsByKategori($item->kategori_pendaftar);
                        $verifications = $item->documentVerifications->whereIn('document_type', $requiredDocs);

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

            // Original DataTable logic
            if ($request->has('status') && $request->status !== 'all') {
                $query->where('status', $request->status);
            }

            $data = $query->orderBy('created_at', 'asc')->get()->sortByDesc('skor');;

            if ($request->has('verification_status')) {
                $status = $request->verification_status;
                $data = $data->filter(function ($item) use ($status) {
                    $requiredDocs = $this->getRequiredDocumentsByKategori($item->kategori_pendaftar);
                    $verifications = $item->documentVerifications->whereIn('document_type', $requiredDocs);

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
                        'edit_url' => route('admin.ekraf.edit', $row->id),
                        'delete_url' => route('admin.ekraf.destroy', $row->id),
                        'detail_url' => route('admin.ekraf.show', $row->id),
                        'status_url' => route('admin.ekraf.status', $row->id)
                    ];
                })
                ->addColumn('verifikasi_dokumen', function ($row) {
                    $requiredDocs = $this->getRequiredDocumentsByKategori($row->kategori_pendaftar);
                    $verifications = $row->documentVerifications->whereIn('document_type', $requiredDocs);

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
            ['name' => 'fotografi'],
            ['name' => 'videografi'],
        ];

        return inertia('Admin/PelatihanEkraf/Index', [
            'title' => 'Pelatihan Ekonomi Kreatif',
            'flash' => [
                'message' => session('message')
            ],
            'pelatihan' => $pelatihan,
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $data = PelatihanEkonomiKreatif::with(['documentVerifications'])->findOrFail($id);

        // Ambil dokumen yang diperlukan berdasarkan kategori
        $requiredDocs = $this->getRequiredDocumentsByKategori($data->kategori_pendaftar);

        $verifiedDocuments = $data->documentVerifications
            ->whereIn('document_type', $requiredDocs)
            ->groupBy('document_type')
            ->map(function ($verifications) {
                $verification = $verifications->first();
                return [
                    'verified' => true,
                    'status' => $verification->status,
                    'verified_by' => $verification->verifier->name ?? 'Unknown',
                    'verified_at' => $verification->verified_at?->format('d/m/Y H:i') ?? '-',
                    'notes' => $verification->notes
                ];
            })
            ->toArray();

        // Map file fields
        $fileMapping = [
            'pasfoto' => 'file_pasfoto',
            'ktp' => 'file_ktp',
            'kk' => 'file_kk',
            'surat_pernyataan' => 'file_surat_pernyataan',
            'surat_pekerja_ekraf' => 'file_surat_pekerja_ekraf',
            'nib' => 'file_nib',
            'surat_pemilik_lahan' => 'file_surat_pemilik_lahan',
            'id_card_iht' => 'file_id_card_iht',
            'surat_phk' => 'file_surat_phk',
            'surat_disabilitas' => 'file_surat_disabilitas',
            'surat_kb' => 'file_surat_kb',
        ];

        // Build files array hanya untuk dokumen yang diperlukan
        $files = [];
        foreach ($requiredDocs as $doc) {
            $fileField = $fileMapping[$doc];
            if ($data->$fileField) {
                $files[$doc] = [
                    'url' => asset('/storage/' . $data->$fileField),
                    'verification' => $verifiedDocuments[$doc] ?? null
                ];
            }
        }

        return inertia('Admin/PelatihanEkraf/Show', [
            'title' => 'Detail Peserta Pelatihan Ekonomi Kreatif',
            'data' => [
                'id' => $data->id,
                'nik' => $data->nik,
                'nama_lengkap' => $data->nama_lengkap,
                'no_kk' => $data->no_kk,
                'no_hp' => $data->no_hp,
                'tanggal_lahir' => $data->tanggal_lahir,
                'umur' => \Carbon\Carbon::parse($data->tanggal_lahir)->diffInYears(now()),

                // Alamat KTP
                'alamat_ktp' => [
                    'kecamatan' => $data->kecamatan_ktp,
                    'kelurahan' => $data->kelurahan_ktp,
                    'rw' => $data->rw_ktp,
                    'rt' => $data->rt_ktp,
                    'alamat' => $data->alamat_ktp,
                ],

                // Alamat Domisili
                'alamat_domisili' => [
                    'kecamatan' => $data->kecamatan_domisili,
                    'kelurahan' => $data->kelurahan_domisili,
                    'rw' => $data->rw_domisili,
                    'rt' => $data->rt_domisili,
                    'alamat' => $data->alamat_domisili,
                ],

                'status' => $data->status,
                'keterangan' => $data->keterangan,

                // Data Pelatihan
                'jenis_pelatihan' => $data->jenis_pelatihan,
                'kategori_pendaftar' => $data->kategori_pendaftar,
                'skor_total' => $data->skor ?? 0,
                'komitmen' => $data->komitmen,
                'files' => $files,
                'requiredDocs' => $requiredDocs,
            ]
        ]);
    }

    public function updateStatus(Request $request, $id)
    {
        $validated = $request->validate([
            'status' => 'required|integer|in:1,2,3,4',
            'notes' => 'nullable|string', // Tambah validasi untuk notes
        ]);

        $data = PelatihanEkonomiKreatif::findOrFail($id);

        // Validate if document is verified sesuai kategori
        $requiredDocs = $this->getRequiredDocumentsByKategori($data->kategori_pendaftar);
        $verifications = $data->documentVerifications->whereIn('document_type', $requiredDocs);

        $allVerified = count($verifications) === count($requiredDocs);
        $allApproved = $verifications->every(fn($v) => $v->status === 1);

        if (!$allVerified && $validated['status'] === 1) {
            return response()->json([
                'message' => 'Dokumen belum lengkap. Diperlukan ' . count($requiredDocs) . ' dokumen untuk kategori ' . $this->getCategoryLabel($data->kategori_pendaftar)
            ], 422);
        }

        if (!$allApproved && $validated['status'] === 1) {
            return response()->json([
                'message' => 'Semua dokumen harus disetujui sebelum peserta dapat diloloskan'
            ], 422);
        }

        $data->status = $validated['status'];

        // Simpan notes jika ada (untuk blacklist atau status lainnya)
        if (!empty($validated['notes'])) {
            $data->keterangan = $validated['notes'];
        }

        $data->save();

        $statusMessage = match ($validated['status']) {
            1 => 'Peserta berhasil diloloskan',
            2 => 'Peserta telah ditolak',
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
     * Helper function untuk mendapatkan kategori label
     */
    private function getCategoryLabel($kategori)
    {
        $categories = [
            'umum' => 'Umum',
            'buruh_tani_tembakau' => 'Buruh Tani Tembakau',
            'buruh_pabrik_rokok' => 'Buruh Pabrik Rokok',
            'buruh_phk' => 'Buruh yang Terkena PHK',
            'disabilitas' => 'Disabilitas',
            'perempuan_kk' => 'Perempuan Kepala Keluarga'
        ];
        return $categories[$kategori] ?? $kategori;
    }

    public function create() {}
    public function store(Request $request) {}
    public function edit(string $id) {}
    public function update(Request $request, string $id) {}
    public function destroy(string $id) {}

    /**
     * Reset verifikasi dokumen
     */

}
