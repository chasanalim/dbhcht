<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\LampiranFile;
use Illuminate\Http\Request;
use App\Models\PelatihanUmkm;
use App\Models\PelatihanBanmod;
use App\Models\TrainingType;
use App\Models\PelatihanEkonomiKreatif;
use App\Models\PelatihanKerjas;
use App\Models\PelatihanPetani;
use App\Models\PendaftaranBanmod;
use App\Models\Setting;
use Illuminate\Support\Facades\Storage;

class HomeController extends Controller
{
    public function index()
    {
        $banmod = PendaftaranBanmod::whereYear('created_at', now()->year)->count();
        $pelatihanbanmod = PelatihanBanmod::whereYear('created_at', now()->year)->count();
        $pencarikerja = PelatihanKerjas::whereYear('created_at', now()->year)->count();
        $umkm = PelatihanUmkm::whereYear('created_at', now()->year)->count();
        $pertanian = PelatihanPetani::whereYear('created_at', now()->year)->count();
        $ekraf = PelatihanEkonomiKreatif::whereYear('created_at', now()->year)->count();

        // Ambil data training types dari database
        $trainings = TrainingType::orderBy('order')->get()->map(function($training) {
            return [
                'id' => $training->id,
                'title' => $training->title,
                'description' => $training->description,
                'image' => $training->image,
                'requirements' => is_string($training->requirements) 
                    ? json_decode($training->requirements, true) 
                    : $training->requirements,
                'duration' => $training->duration,
                'location' => $training->location,
                'jenis' => $training->value,
                'comingSoon' => $training->coming_soon,
                'closed' => $training->closed,
            ];
        });

        // Ambil options untuk select
        $trainingOptions = TrainingType::orderBy('order')->get()->map(function($training) {
            return [
                'value' => $training->value,
                'label' => $training->label,
                'isDisabled' => $training->is_disabled,
            ];
        });

        return Inertia::render('Home/Index', [
            'meta' => [
                'title' => 'Sultan - Sukses Bantuan Modal UsahaBantuan Modal Usaha dan Pelatihan Kota Kediri ',
            ],
            'banmod' => $banmod,
            'pelatihanbanmod' => $pelatihanbanmod,
            'pencarikerja' => $pencarikerja,
            'umkm' => $umkm,
            'pertanian' => $pertanian,
            'ekraf' => $ekraf,
            'trainings' => $trainings,
            'trainingOptions' => $trainingOptions,
            'banmodOpen' => Setting::boolValue('banmod_registration_open', true),
        ]);
    }

    public function file()
    {

        $banmod = LampiranFile::where('kategori', 'banmod')->get();
        $pelatihanbanmod = LampiranFile::where('kategori', 'pelatihan-banmod')->get();
        $pencarikerja = LampiranFile::where('kategori', 'pencari-kerja')->get();
        $umkm = LampiranFile::where('kategori', 'umkm')->get();
        $pertanian = LampiranFile::where('kategori', 'pertanian')->get();
        $ekraf = LampiranFile::where('kategori', 'ekraf')->get();


        return Inertia::render('Home/File', [
            'meta' => [
                'title' => 'Download File',
            ],
            'banmod' => $banmod,
            'pelatihanbanmod' => $pelatihanbanmod,
            'pencarikerja' => $pencarikerja,
            'umkm' => $umkm,
            'pertanian' => $pertanian,
            'ekraf' => $ekraf
        ]);
    }
    public function download($filename)
    {
        // Asumsikan file disimpan di storage/app/public/panduan
        $path = 'template/' . $filename;

        if (Storage::disk('public')->exists($path)) {
            return Storage::disk('public')->download($path);
        }

        return redirect()->back()->with('error', 'File tidak ditemukan');
    }

    public function pelatihan(Request $request)
    {
        // Ambil options untuk select
        $trainingOptions = TrainingType::orderBy('order')->get()->map(function($training) {
            return [
                'value' => $training->value,
                'label' => $training->label,
                'isDisabled' => $training->is_disabled,
            ];
        });

        // Opsi pilihan pelatihan UMKM dari database (hanya yang aktif)
        $umkmTrainingOptions = \App\Models\UmkmTrainingOption::activeOptions()
            ->map(fn ($option) => [
                'value' => $option->label,
                'label' => $option->label,
            ]);

        // Opsi pilihan pelatihan Ekonomi Kreatif dari database (hanya yang aktif)
        $ekrafTrainingOptions = \App\Models\EkrafTrainingOption::activeOptions()
            ->map(fn ($option) => [
                'value' => $option->value,
                'label' => $option->label,
            ]);

        // return Inertia::render('404/BelumTersedia', [
        return Inertia::render('Pelatihan/FormPelatihan', [
            'meta' => [
                'title' => 'Form Pendaftaran Pelatihan',
            ],
            'jenis' => $request->query('jenis'),
            'trainingOptions' => $trainingOptions,
            'umkmTrainingOptions' => $umkmTrainingOptions,
            'ekrafTrainingOptions' => $ekrafTrainingOptions,
        ]);
    }

    public function cekStatus()
    {
        return Inertia::render('Home/Status', [
            'meta' => [
                'title' => 'Cek Status Pendaftaran Banmod dan Pelatihan',
            ],
        ]);
    }
    public function cekNIK(Request $request, $nik)
    {
        if (strlen($nik) != 16) {
            return response()->json([
                'success' => false,
                'message' => 'Maaf, format NIK harus 16 digit'
            ], 400);
        }

        $results = [];

        // Mapping tipe dokumen -> label yang mudah dibaca di halaman cek-status
        $docLabels = [
            'foto' => 'Pas Foto',
            'pasfoto' => 'Pas Foto',
            'ktp' => 'KTP',
            'kk' => 'Kartu Keluarga',
            'nib' => 'NIB',
            'sku' => 'SKU',
            'skd' => 'SKD',
            'produk' => 'Produk',
            'lokasi_usaha' => 'Foto Lokasi Usaha',
            'perizinan' => 'Perizinan',
            'siinas' => 'SIINAS',
            'bp' => 'Business Plan',
            'surat_buruh' => 'Surat Komitmen Buruh',
            'surat_miskin' => 'Surat Keterangan Miskin',
            'surat_disabilitas' => 'Surat Komitmen Disabilitas',
            'sertifikat_pelatihan' => 'Sertifikat Pelatihan',
            'surat_pernyataan' => 'Surat Pernyataan',
            'surat_pernyataan_tidak_ikut' => 'Surat Pernyataan Tidak Ikut',
            'surat_pekerja_ekraf' => 'Surat Pekerja Ekonomi Kreatif',
            'surat_phk' => 'Surat PHK',
            'surat_pemilik_lahan' => 'Surat Pemilik Lahan',
            'fotokopi_ijazah' => 'Fotokopi Ijazah',
            'surat_kesanggupan' => 'Surat Kesanggupan',
            'kesanggupan' => 'Kesanggupan',
            'legalitas_kelompok' => 'Legalitas Kelompok',
            'pengukuhan_penyuluh_swadaya' => 'Pengukuhan Penyuluh Swadaya',
            'pernyataan' => 'Pernyataan',
            'rekomendasi_kelompok' => 'Rekomendasi Kelompok',
        ];

        // Check in all models
        $models = [
            'Pelatihan UMKM' => PelatihanUmkm::class,
            'Pelatihan Penerima Banmod' => PelatihanBanmod::class,
            'Pelatihan Pencari Kerja' => PelatihanKerjas::class,
            'Pelatihan Pertanian' => PelatihanPetani::class,
            'Bantuan Modal Usaha' => PendaftaranBanmod::class,
            'Pelatihan Ekonomi Kreatif' => PelatihanEkonomiKreatif::class,
        ];

        foreach ($models as $type => $model) {
            $dataCollection = $model::where('nik', $nik)->get();

            foreach ($dataCollection as $data) {
                $notes = null;
                if ($data->status == 2) {
                    $notes = [];

                    // Alasan dari dokumen yang ditolak admin (verifikasi_dokumen.notes)
                    $verifications = $data->documentVerifications()
                        ->where('status', 0)
                        ->whereNotNull('notes')
                        ->get();
                    if ($verifications->isNotEmpty()) {
                        $notes = array_merge(
                            $notes,
                            $verifications->pluck('notes')->unique()->values()->toArray()
                        );
                    }

                    // Alasan penggagalan dari kolom keterangan record
                    // (diisi wajib saat admin klik Gagal via updateStatus).
                    if (!empty($data->keterangan)) {
                        $notes[] = $data->keterangan;
                    }

                    // Gabungkan dan dedup, null jika tidak ada alasan sama sekali
                    $notes = array_values(array_unique($notes));
                    if (empty($notes)) {
                        $notes = null;
                    }
                }

                // Status verifikasi dokumen (verifikasi_dokumen)
                $docVerifs = $data->documentVerifications()->get();
                $docTotal = $docVerifs->count();
                $docVerified = $docVerifs->where('status', 1)->count();
                $docRejected = $docVerifs->where('status', 0)->count();

                if ($docTotal === 0) {
                    $verifikasiStatus = 'Belum Diverifikasi';
                } elseif ($docRejected > 0) {
                    $verifikasiStatus = 'Dokumen Ditolak';
                } elseif ($docVerified === $docTotal) {
                    $verifikasiStatus = 'Terverifikasi';
                } else {
                    $verifikasiStatus = 'Proses Verifikasi';
                }

                $dokumen = $docVerifs->map(function ($v) use ($docLabels) {
                    return [
                        'document_type' => $v->document_type,
                        'document_label' => $docLabels[$v->document_type] ?? ucwords(str_replace('_', ' ', $v->document_type)),
                        'status' => (int) $v->status,
                        'notes' => $v->notes,
                    ];
                })->values()->toArray();

                $results[] = [
                    'jenis_pelatihan' => $type,
                    'nama' => $data->nama_lengkap ?? $data->name,
                    'nik' => $data->nik,
                    'status' => $this->getStatus($data->status),
                    'created_at' => $data->created_at->format('d-m-Y') ?? 'NULL',
                    'catatan' => $notes,
                    'status_code' => $data->status,
                    'verifikasi_status' => $verifikasiStatus,
                    'dokumen' => $dokumen,
                ];
            }
        }

        if (count($results) > 0) {
            return response()->json([
                'success' => true,
                'data' => $results,
                'message' => 'Data ditemukan'
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'NIK tidak ditemukan'
        ], 404);
    }

    private function getStatus($status)
    {
        return match($status) {
            0 => '-',
            1 => 'Lolos',
            2 => 'Tidak Lolos',
            3 => 'Blacklist',
            4 => 'Ditolak - Lolos di Pelatihan Lain',
            default => 'Proses Verifikasi',
        };
    }
}
