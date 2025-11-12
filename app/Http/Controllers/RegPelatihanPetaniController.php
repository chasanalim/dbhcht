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
        // return response()->json(request()->all());

        $data = $request->validate([
            'nik' => 'required|numeric|digits:16|unique:pelatihan_petanis,nik',
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
            'file_pengukuhan_penyuluh_swadaya' => 'required|file|mimes:pdf|max:2048',
            'file_legalitas_kelompok' => 'required|file|mimes:pdf|max:2048',
            'file_rekomendasi_kelompok' => 'required|file|mimes:pdf|max:2048',
            'file_legalitas_usaha' => 'required|file|mimes:pdf|max:2048',
        ]);

        // Simpan file upload
        $data['file_foto'] = $request->file('file_foto')->store('petani/foto');
        $data['file_kk'] = $request->file('file_kk')->store('petani/foto_kk');
        $data['file_ktp'] = $request->file('file_ktp')->store('petani/ktp');
        $data['file_pernyataan_tidak_mengikuti_pelatihan_lain'] = $request->file('file_pernyataan_tidak_mengikuti_pelatihan_lain')->store('petani/file_pernyataan_tidak_mengikuti_pelatihan_lain');
        $data['file_pernyataan_kesanggupan_ikut_pelatihan'] = $request->file('file_pernyataan_kesanggupan_ikut_pelatihan')->store('petani/file_pernyataan_kesanggupan_ikut_pelatihan');
        $data['file_pengukuhan_penyuluh_swadaya'] = $request->file('file_pengukuhan_penyuluh_swadaya')->store('petani/file_pengukuhan_penyuluh_swadaya');
        $data['file_legalitas_kelompok'] = $request->file('file_legalitas_kelompok')->store('petani/file_legalitas_kelompok');
        $data['file_rekomendasi_kelompok'] = $request->file('file_rekomendasi_kelompok')->store('petani/file_rekomendasi_kelompok');
        $data['file_legalitas_usaha'] = $request->file('file_legalitas_usaha')->store('petani/file_legalitas_usaha');

        // Format array ke string json (jika dibutuhkan)
        $data['jenis_disabilitas'] = json_encode($data['jenis_disabilitas'] ?? []);
        $data['status'] = 0; // Default status is 'Menunggu'

        $storedPetani = PelatihanPetani::create($data);
        // PelatihanPetani::create($data);

        // return redirect()->back()->with('success', 'Pendaftaran berhasil disimpan!');

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

        // Cek blacklist dari semua jenis pelatihan
        $blacklistModels = [
            PelatihanUmkm::class,
            PelatihanBanmod::class,
            PelatihanKerjas::class,
            PelatihanPetani::class
        ];

        foreach ($blacklistModels as $model) {
            $blacklisted = $model::where('status', 3)
                ->where('nik', $nik)
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
                'message' => 'NIK ditemukan sebagai Kelompok Tani.'
            ]);
        }

        return response()->json([
            'success' => false,
            'blacklisted' => false,
            'message' => 'NIK tidak ditemukan sebagai Kelompok Tani.'
        ], 404);
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

            $message = "Terima kasih telah mendaftar Program Pelatihan Petani Kota Kediri. "
                . "Data Anda telah kami terima dan akan diproses lebih lanjut. "
                . "Mohon menunggu informasi selanjutnya melalui WhatsApp yang telah Anda daftarkan. "
                . "Jika ada pertanyaan, silakan hubungi kami melalui: " . env('APP_WA_PELATIHAN');

            $this->sendWhatsappMessage($message, $dataPendaftar->no_hp);

            return Inertia::render('Pelatihan/Success', [
                'meta' => [
                    'title' => 'Pendaftaran Pelatihan Petani',
                    'jenis' => 'Pelatihan Petani',
                ],
            ]);
        } catch (\Exception $e) {
            Log::error('Success Page Error: ' . $e->getMessage());
            return redirect()->route('pelatihan.petani.index')
                ->withErrors(['error' => 'Halaman tidak dapat diakses.']);
        }
    }
}
