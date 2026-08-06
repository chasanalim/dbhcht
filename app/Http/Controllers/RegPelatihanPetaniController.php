<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\KelompokTani;
use Illuminate\Http\Request;
use App\Models\PelatihanUmkm;
use App\Models\PelatihanBanmod;
use App\Models\PelatihanKerjas;
use App\Models\PelatihanPetani;
use Illuminate\Support\Facades\Log;
use App\Models\JenisPelatihanPetani;
use App\Models\KelompokPelatihanPetani;
use Intervention\Image\Laravel\Facades\Image;
use Illuminate\Support\Facades\Storage;

class RegPelatihanPetaniController extends Controller
{
    public function kelompokpelatihanpetani()
    {
        $data = KelompokPelatihanPetani::select('id', 'nama', 'jenis')->get();

        return response()->json($data);
    }

    public function jenispelatihanpetani1()
    {
        $data = JenisPelatihanPetani::select('id', 'nama', 'jenis')
            ->where('jenis', 1)
            ->get();

        return response()->json($data);
    }

    public function jenispelatihanpetani2()
    {
        $data = JenisPelatihanPetani::select('id', 'nama', 'jenis')
            ->where('jenis', 2)
            ->get();

        return response()->json($data);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'nik' => 'required|numeric|digits:16',
            'kk' => 'required|numeric|digits:16',
            'jenis_kelamin' => 'required|string',
            'nama_lengkap' => 'required|string|max:255',
            'no_hp' => 'required|string|min:11|max:14',
            'nama_kecamatan' => 'required|string',
            'nama_kelurahan' => 'required|string',
            'nama_rw' => 'required|string',
            'nama_rt' => 'required|string',
            'alamat' => 'required|string',
            'alamat_domisili' => ['nullable', 'required_if:isDomisili,true', 'string'],
            'tmp_lhr' => 'required|string|max:100',
            'tgl_lhr' => 'required|date',
            'pendidikan' => 'required|string',
            'is_disabilitas' => 'required',
            'jenis_disabilitas' => 'nullable|array',
            'id_kelompok' => 'required|integer',
            'tahun_berdiri' => 'required|string',
            'masa_aktif_kelompok' => 'required|string',
            'bidang_usaha_kelompok' => 'required|string',
            'nama_kecamatan_kelompok' => 'required|string',
            'nama_kelurahan_kelompok' => 'required|string',
            'nama_rw_kelompok' => 'required|string',
            'nama_rt_kelompok' => 'required|string',
            'alamat_kelompok' => 'required|string',
            'kategori' => 'required|integer',
            'jenis_pelatihan_petani' => 'required|integer',
            'alasan' => 'required|integer',
            'file_foto' => 'required|file|mimes:jpg,jpeg,png|max:2048',
            'file_kk' => 'required|file|mimes:jpg,jpeg,png|max:2048',
            'file_ktp' => 'required|file|mimes:jpg,jpeg,png|max:2048',
            'file_pernyataan_tidak_mengikuti_pelatihan_lain' => 'required|file|mimes:pdf|max:2048',
            'file_pernyataan_kesanggupan_ikut_pelatihan' => 'required|file|mimes:pdf|max:2048',
            'file_pengukuhan_penyuluh_swadaya' => 'nullable|file|mimes:pdf|max:2048',
            'file_legalitas_kelompok' => 'nullable|file|mimes:pdf|max:2048',
            'file_rekomendasi_kelompok' => 'required|file|mimes:pdf|max:2048',
        ]);

        // === Handle IMAGE as WEBP ===
        $data['file_foto'] = $this->saveImageAsWebp($request->file('file_foto'), 'petani/foto');
        $data['file_kk'] = $this->saveImageAsWebp($request->file('file_kk'), 'petani/foto_kk');
        $data['file_ktp'] = $this->saveImageAsWebp($request->file('file_ktp'), 'petani/ktp');

        // === Handle PDF (compress for Linux) ===
        $data['file_pernyataan_tidak_mengikuti_pelatihan_lain'] =
            $this->saveAndCompressPdf($request->file('file_pernyataan_tidak_mengikuti_pelatihan_lain'), 'petani/file_pernyataan_tidak_mengikuti_pelatihan_lain');

        $data['file_pernyataan_kesanggupan_ikut_pelatihan'] =
            $this->saveAndCompressPdf($request->file('file_pernyataan_kesanggupan_ikut_pelatihan'), 'petani/file_pernyataan_kesanggupan_ikut_pelatihan');

        $data['file_pengukuhan_penyuluh_swadaya'] =
            $request->hasFile('file_pengukuhan_penyuluh_swadaya')
                ? $this->saveAndCompressPdf($request->file('file_pengukuhan_penyuluh_swadaya'), 'petani/file_pengukuhan_penyuluh_swadaya')
                : null;

        $data['file_legalitas_kelompok'] =
            $request->hasFile('file_legalitas_kelompok')
                ? $this->saveAndCompressPdf($request->file('file_legalitas_kelompok'), 'petani/file_legalitas_kelompok')
                : null;

        $data['file_rekomendasi_kelompok'] =
            $this->saveAndCompressPdf($request->file('file_rekomendasi_kelompok'), 'petani/file_rekomendasi_kelompok');

        // Check NIK sudah pernah daftar di tahun yang sama
        $tahunPendaftaran = date('Y');
        $existing = PelatihanPetani::where('nik', $data['nik'])
            ->whereYear('created_at', $tahunPendaftaran)
            ->first();
        if ($existing) {
            return back()
                ->withInput()
                ->withErrors([
                    'nik' => "NIK sudah pernah mendaftar pelatihan pertanian tahun {$tahunPendaftaran}."
                ]);
        }

        // Format array ke json
        $data['jenis_disabilitas'] = json_encode($data['jenis_disabilitas'] ?? []);
        $data['status'] = 0;

        $storedPetani = PelatihanPetani::create($data);

        return to_route('pelatihan.petani.success', $storedPetani->id)
            ->with('success', 'Pendaftaran berhasil disimpan!');
    }

    // Fungsi untuk mengecek NIK apakah terdaftar sebagai kelompok tani
    public function cekNIK(Request $request, $nik)
    {
        if (strlen($nik) != 16) {
            return response()->json([
                'success' => false,
                'message' => 'Maaf, format NIK harus 16 digit'
            ], 400);
        }

        $tahunSekarang = (int) date('Y');
        $tahunSebelumnya = $tahunSekarang - 1;

        // Cek blacklist dari semua jenis pelatihan (berlaku untuk pendaftaran tahun berikutnya)
        $blacklistModels = [
            PelatihanUmkm::class,
            PelatihanBanmod::class,
            PelatihanKerjas::class,
            PelatihanPetani::class
        ];

        foreach ($blacklistModels as $model) {
            $blacklisted = $model::where('status', 3)
                ->where('nik', $nik)
                ->whereYear('created_at', $tahunSebelumnya)
                ->exists();

            if ($blacklisted) {
                return response()->json([
                    'success' => false,
                    'blacklisted' => true,
                    'message' => 'NIK Anda telah dimasukkan blacklist dalam pelatihan karena melanggar ketentuan yang berlaku.'
                ], 403);
            }
        }

        $doneModels = [
            PelatihanUmkm::class,
            PelatihanBanmod::class,
            PelatihanKerjas::class
        ];

        foreach ($doneModels as $model) {
            $done = $model::where('status', 1)
                ->where('nik', $nik)
                ->whereYear('created_at', $tahunSekarang)
                ->exists();

            if ($done) {
                $jenisPelatihan = (new $model)->getJenisPelatihan();
                return response()->json([
                    'success' => false,
                    'blacklisted' => true,
                    'message' => "Mohon maaf, NIK Anda telah menerima pelatihan {$jenisPelatihan} pada periode tahun ini."
                ], 403);
            }
        }

        // Cek apakah terdaftar sebagai penerima banmod
        $data = KelompokTani::where('nik_anggota', $nik)->first();

        if ($data) {
            return response()->json([
                'success' => true,
                'blacklisted' => false,
                'data' => $data,
                'message' => 'NIK ditemukan sebagai Kelompok Tani / PWT / Komunitas.'
            ]);
        }

        return response()->json([
            'success' => true,
            'blacklisted' => false,
            'message' => 'NIK tidak ditemukan sebagai Kelompok Tani / PWT / Komunitas. Silahkan mengisikan formulir pendaftaran pelatihan petani.'
        ]);
    }

    protected function sendNotifications($phoneNumber)
    {
        $message = "Terima kasih telah mendaftar Program Pelatihan Petani Kota Kediri. "
            . "Data Anda telah kami terima dan akan diproses lebih lanjut. "
            . "Mohon menunggu informasi selanjutnya melalui WhatsApp yang telah Anda daftarkan.";

        $this->sendWhatsappMessage($message, $phoneNumber);
    }

    /**
     * Send WhatsApp message to the given phone number.
     * You should implement the actual sending logic here.
     */
    protected function sendWhatsappMessage($message, $phoneNumber)
    {
        // Example: Log the message instead of sending
        Log::info("WhatsApp message to {$phoneNumber}: {$message}");

        // TODO: Integrate with WhatsApp API provider here
    }

    public function success($id)
    {
        try {
            $dataPendaftar = PelatihanPetani::findOrFail($id);

            // $message = "Terima kasih telah mendaftar Program Pelatihan Petani Kota Kediri. "
            //     . "Data Anda telah kami terima dan akan diproses lebih lanjut. "
            //     . "Mohon menunggu informasi selanjutnya melalui WhatsApp yang telah Anda daftarkan. "
            //     . "Jika ada pertanyaan, silakan hubungi kami melalui: " . env('APP_WA_PELATIHAN');

            // $this->sendWhatsappMessage($message, $dataPendaftar->no_hp);

            return Inertia::render('Pelatihan/Success', [
                'meta' => [
                    'title' => 'Pendaftaran Pelatihan Petani',
                    'jenis' => 'Pelatihan Pertanian',
                ],
            ]);
        } catch (\Exception $e) {
            Log::error('Success Page Error: ' . $e->getMessage());
            return redirect()->route('pelatihan.petani.index')
                ->withErrors(['error' => 'Halaman tidak dapat diakses.']);
        }
    }

    protected function saveImageAsWebp($file, $folder)
    {
        $hash = pathinfo($file->hashName(), PATHINFO_FILENAME);
        $webpName = $hash . '.webp';

        // Pastikan folder dibuat di storage/app/public/<folder>
        Storage::disk('public')->makeDirectory($folder);

        // Convert ke webp menggunakan Intervention Image
        $image = Image::read($file)->toWebp(80);

        // Simpan ke storage/app/public/<folder>/<hash>.webp
        Storage::disk('public')->put("$folder/$webpName", (string) $image);

        // URL yang bisa diakses browser → public/storage/<folder>/<hash>.webp
        return "storage/$folder/$webpName";
    }

    protected function saveAndCompressPdf($file, $folder)
    {
        $fileName = $file->hashName();
        $storagePath = storage_path("app/public/$folder/$fileName");

        // Simpan original dulu
        $file->storeAs($folder, $fileName, 'public');

        // Jika di Windows => langsung return original (tidak compress)
        if (strtoupper(substr(PHP_OS, 0, 3)) === 'WIN') {
            return "storage/$folder/$fileName";
        }

        // Path untuk compressed PDF
        $compressed = storage_path("app/public/$folder/compressed-$fileName");

        // Perintah Ghostscript
        $cmd = 'gs -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 -dPDFSETTINGS=/ebook '
            . '-dNOPAUSE -dQUIET -dBATCH '
            . '-sOutputFile="' . $compressed . '" "' . $storagePath . '"';

        @exec($cmd);

        // Jika compress sukses → replace file asli
        if (file_exists($compressed)) {
            unlink($storagePath);
            rename($compressed, $storagePath);
        }

        return "storage/$folder/$fileName";
    }


}
