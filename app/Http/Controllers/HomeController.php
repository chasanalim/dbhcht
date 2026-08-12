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
        $banmod = PendaftaranBanmod::count();
        $pelatihanbanmod = PelatihanBanmod::count();
        $pencarikerja = PelatihanKerjas::count();
        $umkm = PelatihanUmkm::count();
        $pertanian = PelatihanPetani::count();
        $ekraf = PelatihanEkonomiKreatif::count();

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

        // return Inertia::render('404/BelumTersedia', [
        return Inertia::render('Pelatihan/FormPelatihan', [
            'meta' => [
                'title' => 'Form Pendaftaran Pelatihan',
            ],
            'jenis' => $request->query('jenis'),
            'trainingOptions' => $trainingOptions
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
            $data = $model::where('nik', $nik)->first();

            if ($data) {
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

                $results[] = [
                    'jenis_pelatihan' => $type,
                    'nama' => $data->nama_lengkap ?? $data->name,
                    'nik' => $data->nik,
                    'status' => $this->getStatus($data->status),
                    'created_at' => $data->created_at->format('d-m-Y') ?? 'NULL',
                    'catatan' => $notes,
                    'status_code' => $data->status,
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
            0 => 'Menunggu Verifikasi',
            1 => 'Lolos',
            2 => 'Tidak Lolos',
            3 => 'Blacklist',
            4 => 'Ditolak - Lolos di Pelatihan Lain',
            default => 'Menunggu Verifikasi',
        };
    }
}
