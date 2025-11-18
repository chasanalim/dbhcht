<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use App\Models\PelatihanEkonomiKreatif;
use App\Traits\GeneralTrait;
use App\Mail\KirimPendaftar;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

class RegPelatihanEkonomiKreatifController extends Controller
{
    use GeneralTrait;

    /**
     * Display the registration form
     */
    public function index()
    {
        return Inertia::render('Pelatihan/Forms/FormEkonomiKreatif', [
            'title' => 'Pendaftaran Pelatihan Ekonomi Kreatif',
            'kategori_options' => PelatihanEkonomiKreatif::getKategoriPendaftar(),
            'jenis_pelatihan_options' => $this->getJenisPelatihanOptions(),
        ]);
    }

    /**
     * Store a newly created resource
     */
    public function store(Request $request)
    {
        try {
            // Validasi data berdasarkan kategori
            $validator = $this->validateByKategori($request);

            if ($validator->fails()) {
                return back()->withErrors($validator)->withInput();
            }

            $validatedData = $validator->validated();

            // ✅ Tambahkan calculated age untuk logging/reporting jika diperlukan
            $birthDate = new \Carbon\Carbon($validatedData['tanggal_lahir']);
            $calculatedAge = $birthDate->age;

            // Validasi ulang usia untuk security
            if ($calculatedAge < 17 || $calculatedAge > 65) {
                return back()->withErrors([
                    'tanggal_lahir' => 'Usia harus antara 17-65 tahun.'
                ])->withInput();
            }

            if (!$request->isDomisili || !$request->filled('isDomisili')) {
                $validatedData['alamat_domisili'] = $validatedData['alamat_ktp'];
                $validatedData['rt_domisili'] = $validatedData['rt_ktp'];
                $validatedData['rw_domisili'] = $validatedData['rw_ktp'];
                $validatedData['kelurahan_domisili'] = $validatedData['kelurahan_ktp'];
                $validatedData['kecamatan_domisili'] = $validatedData['kecamatan_ktp'];
                $validatedData['kode_kelurahan_domisili'] = $validatedData['kode_kelurahan_ktp'];
                $validatedData['kode_kecamatan_domisili'] = $validatedData['kode_kecamatan_ktp'];
            }

            // Check NIK sudah pernah daftar
            $existing = PelatihanEkonomiKreatif::where('nik', $validatedData['nik'])->first();
            if ($existing) {
                return back()->withErrors([
                    'nik' => 'NIK sudah pernah mendaftar pelatihan ekonomi kreatif.'
                ])->withInput();
            }

            // Handle file uploads
            $fileFields = $this->getFileFieldsByKategori($request->kategori_pendaftar);
            foreach ($fileFields as $field) {
                if ($request->hasFile($field)) {
                    $file = $request->file($field);
                    $fileName = time() . '_' . Str::random(10) . '.' . $file->getClientOriginalExtension();
                    $filePath = $file->storeAs('pelatihan-ekonomi-kreatif/' . $field, $fileName, 'public');
                    $validatedData[$field] = $filePath;
                }
            }

            // Create record
            $pelatihan = PelatihanEkonomiKreatif::create($validatedData);

            // Generate nomor pendaftaran
            $nomor_pendaftaran = 'EKRAF-' . date('Y') . '-' . str_pad($pelatihan->id, 6, '0', STR_PAD_LEFT);

            // Send WhatsApp notification (optional)
            if ($request->no_hp) {
                $message = "Pendaftaran Pelatihan Ekonomi Kreatif berhasil!\n";
                $message .= "Nomor Pendaftaran: {$nomor_pendaftaran}\n";
                $message .= "Kategori: {$pelatihan->kategori_text}\n";
                $message .= "Terima kasih telah mendaftar!";

                try {
                    $this->sendWhatsappMessage($message, $request->no_hp);
                } catch (\Exception $e) {
                    Log::error('WhatsApp failed: ' . $e->getMessage());
                }
            }

            return redirect()
                ->route('pelatihan-ekonomi-kreatif.success', $pelatihan->id)
                ->with('success', 'Pendaftaran berhasil! Nomor pendaftaran: ' . $nomor_pendaftaran);
        } catch (\Exception $e) {
            return back()
                ->withErrors(['error' => 'Terjadi kesalahan sistem: ' . $e->getMessage()])
                ->withInput();
        }
    }

    /**
     * Show success page
     */
    public function success($id)
    {
        try {
            $pelatihan = PelatihanEkonomiKreatif::findOrFail($id);

            return Inertia::render('Pelatihan/Success', [
                'meta' => [
                    'title' => 'Pendaftaran Pelatihan Ekonomi Kreatif',
                    'jenis' => 'Pelatihan Ekonomi Kreatif',
                ],
            ]);
        } catch (\Exception $e) {
            Log::error('Success Page Error: ' . $e->getMessage());
            return redirect()->route('pelatihan-ekonomi-kreatif.create')
                ->withErrors(['error' => 'Halaman tidak dapat diakses.']);
        }
    }

    /**
     * Get requirements by category (API endpoint untuk React)
     */
    public function getRequirementsByCategory($kategori)
    {
        $pelatihanTemp = new PelatihanEkonomiKreatif(['kategori_pendaftar' => $kategori]);

        return response()->json([
            'success' => true,
            'data' => [
                'kategori' => $kategori,
                'kategori_text' => PelatihanEkonomiKreatif::getKategoriPendaftar()[$kategori] ?? 'Unknown',
                'required_files' => $pelatihanTemp->getRequiredFiles(),
                'jenis_pelatihan_options' => $this->getJenisPelatihanOptions(),
            ]
        ]);
    }

    /**
     * Validasi data berdasarkan kategori pendaftar
     */
    private function validateByKategori(Request $request)
    {
        $baseRules = [
            'kategori_pendaftar' => 'required|in:' . implode(',', array_keys(PelatihanEkonomiKreatif::getKategoriPendaftar())),
            'nik' => 'required|string|size:16|regex:/^[0-9]{16}$/',
            'no_kk' => 'required|string|size:16|regex:/^[0-9]{16}$/',
            'nama_lengkap' => 'required|string|max:255',
            'tanggal_lahir' => [
                'required',
                'date',
                'before:' . now()->subYears(17)->format('Y-m-d'), // Minimal 17 tahun
                'after:' . now()->subYears(65)->format('Y-m-d'),  // Maksimal 65 tahun
            ],
            'no_hp' => 'required|string|max:20|regex:/^[0-9+\-\s]+$/',

            // Alamat KTP
            'alamat_ktp' => 'required|string|max:500',
            'rt_ktp' => 'required|string|max:5',
            'rw_ktp' => 'required|string|max:5',
            'kelurahan_ktp' => 'required|string|max:100',
            'kecamatan_ktp' => 'required|string|max:100',
            'kode_kelurahan_ktp' => 'nullable|string|max:20',
            'kode_kecamatan_ktp' => 'nullable|string|max:20',

            // ✅ FIX: Alamat Domisili - conditional validation
            'isDomisili' => 'nullable|boolean',
            'alamat_domisili' => 'nullable|string|max:500',
            'rt_domisili' => 'nullable|string|max:5',
            'rw_domisili' => 'nullable|string|max:5',
            'kelurahan_domisili' => 'nullable|string|max:100',
            'kecamatan_domisili' => 'nullable|string|max:100',
            'kode_kelurahan_domisili' => 'nullable|string|max:20',
            'kode_kecamatan_domisili' => 'nullable|string|max:20',

            // Pelatihan
            'jenis_pelatihan' => 'required|string|max:255',

            // Komitmen
            'komitmen' => 'required|boolean|accepted',
        ];

        // ✅ ADD: Conditional validation untuk domisili jika berbeda dengan KTP
        if ($request->isDomisili) {
            $baseRules['alamat_domisili'] = 'required|string|max:500';
            $baseRules['rt_domisili'] = 'required|string|max:5';
            $baseRules['rw_domisili'] = 'required|string|max:5';
            $baseRules['kelurahan_domisili'] = 'required|string|max:100';
            $baseRules['kecamatan_domisili'] = 'required|string|max:100';
        }

        // File validation - base files (required untuk semua kategori)
        $fileRules = [
            'file_ktp' => 'required|file|mimes:jpg,jpeg,png|max:2048',
            'file_kk' => 'required|file|mimes:jpg,jpeg,png|max:2048',
            'file_pasfoto' => 'required|file|mimes:jpg,jpeg,png|max:2048',
            'file_surat_pernyataan' => 'required|file|mimes:pdf|max:2048',
            'file_nib' => 'required|file|mimes:pdf,jpg,jpeg,png|max:2048',
            'file_surat_pekerja_ekraf' => 'required|file|mimes:pdf|max:2048',
        ];

        // Additional file validation berdasarkan kategori
        $kategori = $request->kategori_pendaftar;
        switch ($kategori) {
            case PelatihanEkonomiKreatif::KATEGORI_BURUH_TANI:
                $fileRules['file_surat_pemilik_lahan'] = 'required|file|mimes:pdf,jpg,jpeg,png|max:2048';
                break;
            case PelatihanEkonomiKreatif::KATEGORI_BURUH_PABRIK:
                $fileRules['file_id_card_iht'] = 'required|file|mimes:pdf,jpg,jpeg,png|max:2048';
                break;
            case PelatihanEkonomiKreatif::KATEGORI_BURUH_PHK:
                $fileRules['file_surat_phk'] = 'required|file|mimes:pdf,jpg,jpeg,png|max:2048';
                break;
            case PelatihanEkonomiKreatif::KATEGORI_DISABILITAS:
                $fileRules['file_surat_disabilitas'] = 'required|file|mimes:pdf,jpg,jpeg,png|max:2048';
                break;
            case PelatihanEkonomiKreatif::KATEGORI_PEREMPUAN_KK:
                $fileRules['file_surat_kb'] = 'required|file|mimes:pdf,jpg,jpeg,png|max:2048';
                break;
        }

        $allRules = array_merge($baseRules, $fileRules);

        $messages = [
            'tanggal_lahir.required' => 'Tanggal lahir wajib diisi.',
            'tanggal_lahir.date' => 'Format tanggal lahir tidak valid.',
            'tanggal_lahir.before' => 'Usia minimal 17 tahun.',
            'tanggal_lahir.after' => 'Usia maksimal 65 tahun.',
            'nik.required' => 'NIK wajib diisi.',
            'nik.size' => 'NIK harus 16 digit.',
            'nik.regex' => 'NIK hanya boleh berisi angka.',
            'no_kk.required' => 'Nomor KK wajib diisi.',
            'no_kk.size' => 'Nomor KK harus 16 digit.',
            'usia.min' => 'Usia minimal 17 tahun.',
            'usia.max' => 'Usia maksimal 65 tahun.',
            'komitmen.accepted' => 'Anda harus menyetujui pernyataan komitmen.',

            // ✅ UPDATE: Conditional messages
            'alamat_domisili.required' => 'Alamat domisili wajib diisi jika berbeda dengan alamat KTP.',
            'rt_domisili.required' => 'RT domisili wajib diisi jika berbeda dengan alamat KTP.',
            'rw_domisili.required' => 'RW domisili wajib diisi jika berbeda dengan alamat KTP.',
            'kelurahan_domisili.required' => 'Kelurahan domisili wajib diisi jika berbeda dengan alamat KTP.',
            'kecamatan_domisili.required' => 'Kecamatan domisili wajib diisi jika berbeda dengan alamat KTP.',

            // File messages
            'file_ktp.required' => 'File KTP wajib diupload.',
            'file_kk.required' => 'File KK wajib diupload.',
            'file_pasfoto.required' => 'File pas foto wajib diupload.',
            'file_surat_pernyataan.required' => 'File surat pernyataan wajib diupload.',
            'file_nib.required' => 'File NIB wajib diupload.',
            'file_surat_pekerja_ekraf.required' => 'File surat keterangan pekerja ekonomi kreatif wajib diupload.',
            'file_surat_pemilik_lahan.required' => 'File surat dari pemilik lahan wajib diupload untuk kategori buruh tani tembakau.',
            'file_id_card_iht.required' => 'File ID Card/surat keterangan dari IHT wajib diupload untuk kategori buruh pabrik rokok.',
            'file_surat_phk.required' => 'File surat pemberhentian kerja wajib diupload untuk kategori buruh PHK.',
            'file_surat_disabilitas.required' => 'File surat keterangan disabilitas wajib diupload.',
            'file_surat_kb.required' => 'File surat keterangan dari Dinas KB wajib diupload.',
            '*.max' => 'Ukuran file maksimal 2MB.',
            '*.mimes' => 'Format file tidak didukung.',
        ];

        return Validator::make($request->all(), $allRules, $messages);
    }

    /**
     * Get file fields berdasarkan kategori
     */
    private function getFileFieldsByKategori($kategori)
    {
        $baseFields = [
            'file_ktp',
            'file_kk',
            'file_pasfoto',
            'file_surat_pernyataan',
            'file_nib',
            'file_surat_pekerja_ekraf'
        ];

        $additionalFields = [];
        switch ($kategori) {
            case PelatihanEkonomiKreatif::KATEGORI_BURUH_TANI:
                $additionalFields[] = 'file_surat_pemilik_lahan';
                break;
            case PelatihanEkonomiKreatif::KATEGORI_BURUH_PABRIK:
                $additionalFields[] = 'file_id_card_iht';
                break;
            case PelatihanEkonomiKreatif::KATEGORI_BURUH_PHK:
                $additionalFields[] = 'file_surat_phk';
                break;
            case PelatihanEkonomiKreatif::KATEGORI_DISABILITAS:
                $additionalFields[] = 'file_surat_disabilitas';
                break;
            case PelatihanEkonomiKreatif::KATEGORI_PEREMPUAN_KK:
                $additionalFields[] = 'file_surat_kb';
                break;
        }

        return array_merge($baseFields, $additionalFields);
    }

    /**
     * Get jenis pelatihan options
     */
    private function getJenisPelatihanOptions()
    {
        return [
            'fashion_design' => 'Fashion Design',
            'craft_handmade' => 'Kerajinan Tangan (Craft)',
            'digital_marketing' => 'Digital Marketing',
            'photography' => 'Photography & Videography',
            'culinary_arts' => 'Culinary Arts',
            'music_production' => 'Produksi Musik',
            'graphic_design' => 'Desain Grafis',
            'animation' => 'Animasi & Motion Graphics',
            'game_development' => 'Game Development',
            'content_creation' => 'Content Creation',
            'e_commerce' => 'E-Commerce Management',
            'interior_design' => 'Interior Design',
        ];
    }
}
