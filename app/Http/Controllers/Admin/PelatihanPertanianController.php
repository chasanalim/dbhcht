<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;
use App\Models\PelatihanPetani;
use Yajra\DataTables\DataTables;
use App\Http\Controllers\Controller;
use App\Models\JenisPelatihanPetani;
use App\Traits\HasVerifikasiDokumen;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Support\Facades\Storage;

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
            'kk' => 'Kartu Keluarga',
            'pernyataan' => 'Surat Pernyataan Tidak Mengikuti Pelatihan Lain',
            'kesanggupan' => 'Surat Pernyataan Kesanggupan Mengikuti Pelatihan Secara Penuh',
            // 'pengukuhan_penyuluh_swadaya' => 'SK Pengukuhan Penyuluh Swadaya',
            'legalitas_kelompok' => 'Surat Legalitas Kelompok Tani',
            'rekomendasi_kelompok' => 'Surat Rekomendasi Ketua Kelompok Tani',
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
            // Jika request untuk stats saja
            if ($request->has('stats') && $request->stats) {
                $data = $query->get();

                if ($request->has('verification_status')) {
                    $status = $request->verification_status;
                    $data = $data->filter(function ($item) use ($status) {
                        $verifications = $item->documentVerifications;
                        $requiredDocs = ['foto', 'ktp', 'kk', 'pernyataan', 'kesanggupan', 'legalitas_kelompok', 'rekomendasi_kelompok'];
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
            $data = $query->orderBy('created_at', 'asc')->get();
            if ($request->has('verification_status')) {
                $status = $request->verification_status;
                $data = $data->filter(function ($item) use ($status) {
                    $verifications = $item->documentVerifications;
                    $requiredDocs = ['foto', 'ktp', 'kk', 'pernyataan', 'kesanggupan', 'legalitas_kelompok', 'rekomendasi_kelompok'];
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
                ->addColumn('tanggal_pendaftaran', function ($row) {
                    return $row->created_at ? $row->created_at->format('d/m/Y H:i') : '-';
                })
                ->addColumn('action', function ($row) {
                    return [
                        'edit_url' => route('admin.pertanian.edit', $row->id),
                        'delete_url' => route('admin.pertanian.destroy', $row->id),
                        'detail_url' => route('admin.pertanian.show', $row->id),
                        'status_url' => route('admin.pertanian.status', $row->id)
                    ];
                })
                ->addColumn('verifikasi_dokumen', function ($row) {
                    $requiredDocs = ['foto', 'ktp', 'kk', 'pernyataan', 'kesanggupan', 'legalitas_kelompok', 'rekomendasi_kelompok'];
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
                'status' => $data->status,
                'keterangan' => $data->keterangan,

                'files' => [
                    'foto' => [
                        'url' => asset($data->file_foto),
                        'verification' => $verifiedDocuments['foto'] ?? null
                    ],
                    'ktp' => [
                        'url' => asset($data->file_ktp),
                        'verification' => $verifiedDocuments['ktp'] ?? null
                    ],
                    'kk' => [
                        'url' => asset($data->file_kk),
                        'verification' => $verifiedDocuments['kk'] ?? null
                    ],
                    'pernyataan' => [
                        'url' => asset($data->file_pernyataan_tidak_mengikuti_pelatihan_lain),
                        'verification' => $verifiedDocuments['pernyataan'] ?? null
                    ],
                    'kesanggupan' => [
                        'url' => asset($data->file_pernyataan_kesanggupan_ikut_pelatihan),
                        'verification' => $verifiedDocuments['kesanggupan'] ?? null
                    ],
                    // 'pengukuhan_penyuluh_swadaya' => [
                    //     'url' => asset($data->file_pengukuhan_penyuluh_swadaya),
                    //     'verification' => $verifiedDocuments['pengukuhan_penyuluh_swadaya'] ?? null
                    // ],
                    'legalitas_kelompok' => [
                        'url' => asset($data->file_legalitas_kelompok),
                        'verification' => $verifiedDocuments['legalitas_kelompok'] ?? null
                    ],
                    'rekomendasi_kelompok' => [
                        'url' => asset($data->file_rekomendasi_kelompok),
                        'verification' => $verifiedDocuments['rekomendasi_kelompok'] ?? null
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
        $validated = $request->validate(
            [
                'status' => 'required|integer|in:1,2,3,4',
                'notes' => 'required_if:status,2|string|max:500', // Alasan wajib saat menolak/gagal
            ],
            [
                'notes.required_if' => 'Alasan penggagalan wajib diisi.',
            ]
        );
        $data = PelatihanPetani::findOrFail($id);

        // Validate if document is verified
        $verifications = $data->documentVerifications;
        $requiredDocs = ['foto', 'ktp', 'kk', 'pernyataan', 'kesanggupan', 'legalitas_kelompok', 'rekomendasi_kelompok'];
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

    /**
     * Replace document file for a participant (Pertanian role only).
     */
    public function replaceDocument(Request $request, string $id)
    {
        $request->validate([
            'document_type' => 'required|string|in:foto,ktp,kk,pernyataan,kesanggupan,pengukuhan_penyuluh_swadaya,legalitas_kelompok,rekomendasi_kelompok',
            'file' => 'required|file|mimes:jpg,jpeg,png,pdf|max:5120',
        ]);

        $data = PelatihanPetani::findOrFail($id);

        $documentType = $request->document_type;
        $file = $request->file('file');

        // Mapping document_type ke kolom database
        $columnMap = [
            'foto' => 'file_foto',
            'ktp' => 'file_ktp',
            'kk' => 'file_kk',
            'pernyataan' => 'file_pernyataan_tidak_mengikuti_pelatihan_lain',
            'kesanggupan' => 'file_pernyataan_kesanggupan_ikut_pelatihan',
            // 'pengukuhan_penyuluh_swadaya' => 'file_pengukuhan_penyuluh_swadaya',
            'legalitas_kelompok' => 'file_legalitas_kelompok',
            'rekomendasi_kelompok' => 'file_rekomendasi_kelompok',
        ];

        $column = $columnMap[$documentType];
        $isImage = in_array($documentType, ['foto', 'ktp', 'kk']);
        $folder = $isImage ? "petani/{$documentType}" : "petani/file_{$documentType}";

        // Hapus file lama dari storage
        $oldFile = $data->$column;
        if ($oldFile && Storage::disk('public')->exists(str_replace('storage/', '', $oldFile))) {
            Storage::disk('public')->delete(str_replace('storage/', '', $oldFile));
        }

        // Simpan file baru
        if ($isImage) {
            $webpName = pathinfo($file->hashName(), PATHINFO_FILENAME) . '.webp';
            Storage::disk('public')->makeDirectory($folder);
            $image = \Intervention\Image\Laravel\Facades\Image::read($file)->toWebp(80);
            Storage::disk('public')->put("$folder/$webpName", (string) $image);
            $data->$column = "storage/$folder/$webpName";
        } else {
            $fileName = $file->hashName();
            $file->storeAs($folder, $fileName, 'public');
            $data->$column = "storage/$folder/$fileName";
        }

        $data->save();

        // Reset verifikasi dokumen agar perlu diverifikasi ulang
        $data->documentVerifications()
            ->where('document_type', $documentType)
            ->delete();

        return redirect()->back()->with('message', 'Dokumen berhasil diganti');
    }
}
