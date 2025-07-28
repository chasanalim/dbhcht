<?php

namespace App\Http\Controllers;

use App\Models\JenisPelatihanPetani;
use App\Models\KelompokPelatihanPetani;
use App\Models\KelompokTani;
use App\Models\PelatihanPetani;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

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
            'file_ktp' => 'required|file|mimes:jpg,jpeg,png|max:2048',
            'file_pengukuhan_penyuluh_swadaya' => 'required|file|mimes:pdf|max:2048',
            'file_rekomendasi_kelompok' => 'required|file|mimes:pdf|max:2048',
        ]);

        // Simpan file upload
        $data['file_foto'] = $request->file('file_foto')->store('petani/foto');
        $data['file_ktp'] = $request->file('file_ktp')->store('petani/ktp');
        $data['file_pengukuhan_penyuluh_swadaya'] = $request->file('file_pengukuhan_penyuluh_swadaya')->store('petani/file_pengukuhan_penyuluh_swadaya');
        $data['file_rekomendasi_kelompok'] = $request->file('file_rekomendasi_kelompok')->store('petani/file_rekomendasi_kelompok');

        // Format array ke string json (jika dibutuhkan)
        $data['jenis_disabilitas'] = json_encode($data['jenis_disabilitas'] ?? []);

        $storedPetani = PelatihanPetani::create($data);
        // PelatihanPetani::create($data);

        // return redirect()->back()->with('success', 'Pendaftaran berhasil disimpan!');

        return to_route('pelatihan.petani.success', $storedPetani->id)
            ->with('success', 'Pendaftaran berhasil disimpan!');
    }

    // Fungsi untuk mengecek NIK apakah terdaftar sebagai kelompok tani
    public function cekNIK(Request $request, $nik)
    {
        $data = KelompokTani::where('nik_anggota', $nik)->first();

        if ($data) {
            return response()->json([
                'success' => true,
                'data' => $data,
            ]);
        } else {
            return response()->json([
                'success' => false,
                'message' => 'NIK tidak ditemukan sebagai kelompok tani.',
            ]);
        }
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

            $message = "Terima kasih telah mendaftar Program Pelatihan UMKM Kota Kediri. "
                . "Data Anda telah kami terima dan akan diproses lebih lanjut. "
                . "Mohon menunggu informasi selanjutnya melalui WhatsApp yang telah Anda daftarkan. "
                . "Jika ada pertanyaan, silakan hubungi kami melalui: " . env('APP_WA_PELATIHAN');

            $this->sendWhatsappMessage($message, $dataPendaftar->no_hp);

            return Inertia::render('Pelatihan/Success', [
                'meta' => [
                    'title' => 'Pendaftaran Pelatihan UMKM',
                    'jenis' => 'Pelatihan UMKM',
                ],
            ]);
        } catch (\Exception $e) {
            Log::error('Success Page Error: ' . $e->getMessage());
            return redirect()->route('pelatihan.umkm.index')
                ->withErrors(['error' => 'Halaman tidak dapat diakses.']);
        }
    }
}
