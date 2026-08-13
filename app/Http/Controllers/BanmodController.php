<?php

namespace App\Http\Controllers;

use App\Mail\KirimPendaftar;
use App\Models\PendaftaranBanmod;
use App\Models\PenerimaBanmod;
use App\Traits\GeneralTrait;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;
use Yajra\DataTables\DataTables;
use App\Models\Pkl;
use App\Models\Setting;

class BanmodController extends Controller
{
    use GeneralTrait;

    public function index()
    {
        if (!Setting::boolValue('banmod_registration_open', true)) {
            return Inertia::render('404/BelumTersedia', [
                'meta' => [
                    'title' => 'Pendaftaran Ditutup',
                ],
            ]);
        }

        return Inertia::render('Banmod/Create', [
            'meta' => [
                'title' => 'Pendaftaran Banmod',
            ],
        ]);
    }

    public function store(Request $request)
    {
        // Cek status pembukaan pendaftaran
        if (!Setting::boolValue('banmod_registration_open', true)) {
            return back()->with('error', 'Pendaftaran Bantuan Modal sedang ditutup.');
        }

        $validated = $request->validate([
            "nik" => ['required', 'size:16', 'string'],
            "kk" => ['required', 'size:16', 'string'],
            "name" => ['required', 'string'],
            "tmp_lhr" => ['required', 'string'],
            "tgl_lhr" => ['required', 'date', 'before:today'],
            "jenis_kelamin" => ['required', 'string'],
            "alamat" => ['required', 'string'],
            "kode_kecamatan" => ['required', 'string'],
            "nama_kecamatan" => ['required', 'string'],
            "kode_kelurahan" => ['required', 'string'],
            "nama_kelurahan" => ['required', 'string'],
            "kode_rw" => ['required', 'string'],
            "nama_rw" => ['required', 'string'],
            "kode_rt" => ['required', 'string'],
            "nama_rt" => ['required', 'string'],
            "isDomisili" => ['nullable', 'boolean'],
            "alamat_domisili" => ['nullable', 'required_if:isDomisili,true', 'string'],
            "isUsaha" => ['nullable', 'boolean'],
            "alamat_usaha" => ['nullable', 'required_if:isUsaha,true', 'string'],
            "phone_number" => ['required', 'numeric', 'digits_between:10,15'],
            "desil" => ['nullable', 'string'],
            "isDisabilitas" => ['nullable', 'boolean'],
            "disabilitas" => ['nullable'],
            "disabilitas.*.value" => ['nullable', 'required_if:isDisabilitas,true', 'string'],
            "disabilitas.*.label" => ['nullable', 'required_if:isDisabilitas,true', 'string'],
            "kategori" => ['required', 'numeric'],
            "jenis_kategori" => ['required', 'numeric'],
            "klaster_usaha" => ['required', 'numeric'],
            "tanggungan_keluarga" => ['nullable', 'required_if:kategori,5,7', 'string'],
            "lama_usaha" => ['required', 'numeric'],
            "jumlah_tenaga" => ['nullable', 'required_if:kategori,1,2,3,4', 'numeric'],
            "bruto" => ['nullable', 'required_if:kategori,1,2,3,4', 'numeric'],
            "status_tempat_tinggal" => ['nullable', 'required_if:kategori,5,7', 'numeric'],
            "aset" => ['required', 'numeric'],
            "hutang" => ['required', 'numeric'],
            "jumlah_legalitas" => ['nullable', 'required_if:kategori,4', 'numeric'],
            "jumlah_teknologi" => ['nullable', 'required_if:kategori,4', 'numeric'],
            "jumlah_penyerapan_naker" => ['nullable', 'required_if:kategori,4', 'numeric'],
            "file_foto" => ['required', 'image'],
            "file_ktp" => ['required', 'image'],
            "file_kk" => ['required', 'file'],
            "file_nib" => ['required', 'file'],
            "file_sku" => ['required', 'file'],
            "file_skd" => ['nullable', 'required_if:isDomisili,true', 'file'],
            "file_produk" => ['required', 'image'],
            "file_lokasi_usaha" => ['required', 'image'],
            "file_pernyataan" => ['required', 'file'],
            "file_perizinan" => ['nullable', 'required_if:kategori,4', 'array'],
            "file_siinas" => ['nullable', 'required_if:kategori,4', 'file'],
            "file_bp" => ['nullable', 'required_if:kategori,4', 'file'],
            "file_surat_disabilitas" => ['nullable', 'required_if:kategori,7', 'file'],
            "file_surat_buruh" => ['nullable', 'required_if:kategori,1,2,3', 'file'],
            "file_surat_miskin" => ['nullable', 'required_if:kategori,5', 'file'],
            "file_sertifikat_pelatihan" => ['nullable', 'required_if:kategori,5,7', 'file']
        ]);

        // Cek 1 KK = 1 penerima (safety net, cek utama ada di ceknik)
        if (PendaftaranBanmod::where('kk', $validated['kk'])->exists()) {
            return back()->with('error', 'No. KK sudah terdaftar. Maksimal 1 penerima dalam 1 KK.')
                ->withErrors(['kk' => 'No. KK sudah terdaftar.']);
        }

        if ($request['file_perizinan']) {
            $file_perizinan = [];
            foreach ($request['file_perizinan'] as $key => $value) {
                array_push($file_perizinan, '/storage/pendaftaran-banmod/perizinan/' . $value->hashName());
                $value->storeAs('/pendaftaran-banmod/perizinan', $value->hashName(), 'public');
            }
            $validated['file_perizinan'] = $file_perizinan;
        }
        if ($request->hasFile('file_foto')) {
            $validated['file_foto'] = '/storage/pendaftaran-banmod/foto/' . $request->file('file_foto')->hashName();
            $request->file('file_foto')->storeAs('/pendaftaran-banmod/foto', $request->file('file_foto')->hashName(), 'public');
        }
        if ($request->hasFile('file_ktp')) {
            $validated['file_ktp'] = '/storage/pendaftaran-banmod/ktp/' . $request->file('file_ktp')->hashName();
            $request->file('file_ktp')->storeAs('/pendaftaran-banmod/ktp', $request->file('file_ktp')->hashName(), 'public');
        }
        if ($request->hasFile('file_kk')) {
            $validated['file_kk'] = '/storage/pendaftaran-banmod/kk/' . $request->file('file_kk')->hashName();
            $request->file('file_kk')->storeAs('/pendaftaran-banmod/kk', $request->file('file_kk')->hashName(), 'public');
        }
        if ($request->hasFile('file_nib')) {
            $validated['file_nib'] = '/storage/pendaftaran-banmod/nib/' . $request->file('file_nib')->hashName();
            $request->file('file_nib')->storeAs('/pendaftaran-banmod/nib', $request->file('file_nib')->hashName(), 'public');
        }
        if ($request->hasFile('file_sku')) {
            $validated['file_sku'] = '/storage/pendaftaran-banmod/sku/' . $request->file('file_sku')->hashName();
            $request->file('file_sku')->storeAs('/pendaftaran-banmod/sku', $request->file('file_sku')->hashName(), 'public');
        }
        if ($request->hasFile('file_skd')) {
            $validated['file_skd'] = '/storage/pendaftaran-banmod/skd/' . $request->file('file_skd')->hashName();
            $request->file('file_skd')->storeAs('/pendaftaran-banmod/skd', $request->file('file_skd')->hashName(), 'public');
        }
        if ($request->hasFile('file_produk')) {
            $validated['file_produk'] = '/storage/pendaftaran-banmod/produk/' . $request->file('file_produk')->hashName();
            $request->file('file_produk')->storeAs('/pendaftaran-banmod/produk', $request->file('file_produk')->hashName(), 'public');
        }
        if ($request->hasFile('file_lokasi_usaha')) {
            $validated['file_lokasi_usaha'] = '/storage/pendaftaran-banmod/lokasi-usaha/' . $request->file('file_lokasi_usaha')->hashName();
            $request->file('file_lokasi_usaha')->storeAs('/pendaftaran-banmod/lokasi-usaha', $request->file('file_lokasi_usaha')->hashName(), 'public');
        }
        if ($request->hasFile('file_surat_disabilitas')) {
            $validated['file_surat_disabilitas'] = '/storage/pendaftaran-banmod/surat-disabilitas/' . $request->file('file_surat_disabilitas')->hashName();
            $request->file('file_surat_disabilitas')->storeAs('/pendaftaran-banmod/surat-disabilitas', $request->file('file_surat_disabilitas')->hashName(), 'public');
        }
        if ($request->hasFile('file_pernyataan')) {
            $validated['file_pernyataan'] = '/storage/pendaftaran-banmod/pernyataan/' . $request->file('file_pernyataan')->hashName();
            $request->file('file_pernyataan')->storeAs('/pendaftaran-banmod/pernyataan', $request->file('file_pernyataan')->hashName(), 'public');
        }
        if ($request->hasFile('file_siinas')) {
            $validated['file_siinas'] = '/storage/pendaftaran-banmod/siinas/' . $request->file('file_siinas')->hashName();
            $request->file('file_siinas')->storeAs('/pendaftaran-banmod/siinas', $request->file('file_siinas')->hashName(), 'public');
        }
        if ($request->hasFile('file_bp')) {
            $validated['file_bp'] = '/storage/pendaftaran-banmod/bp/' . $request->file('file_bp')->hashName();
            $request->file('file_bp')->storeAs('/pendaftaran-banmod/bp', $request->file('file_bp')->hashName(), 'public');
        }
        if ($request->hasFile('file_sertifikat_pelatihan')) {
            $validated['file_sertifikat_pelatihan'] = '/storage/pendaftaran-banmod/pelatihan/' . $request->file('file_sertifikat_pelatihan')->hashName();
            $request->file('file_sertifikat_pelatihan')->storeAs('/pendaftaran-banmod/pelatihan', $request->file('file_sertifikat_pelatihan')->hashName(), 'public');
        }
        if ($request->hasFile('file_surat_buruh')) {
            $validated['file_surat_buruh'] = '/storage/pendaftaran-banmod/surat-buruh/' . $request->file('file_surat_buruh')->hashName();
            $request->file('file_surat_buruh')->storeAs('/pendaftaran-banmod/surat-buruh', $request->file('file_surat_buruh')->hashName(), 'public');
        }
        if ($request->hasFile('file_surat_miskin')) {
            $validated['file_surat_miskin'] = '/storage/pendaftaran-banmod/surat-miskin/' . $request->file('file_surat_miskin')->hashName();
            $request->file('file_surat_miskin')->storeAs('/pendaftaran-banmod/surat-miskin', $request->file('file_surat_miskin')->hashName(), 'public');
        }
        $storedPendaftaran = PendaftaranBanmod::create($validated);
        return to_route('banmod.success', $storedPendaftaran->id)->with('success', 'Pendaftaran Berhasil.');
    }

    public function success($id)
    {
        $dataPendaftar = PendaftaranBanmod::find($id);
        // dd($dataPendaftar);
        // Mail::to(env('APP_EMAIL_BANMOD'))->send(new KirimPendaftar($dataPendaftar));

        // Send WhatsApp message
        $message = "Terima kasih telah mendaftar Program Bantuan Modal Kota Kediri. Data Anda telah kami terima dan akan diproses lebih lanjut. Mohon menunggu informasi selanjutnya melalui WhatsApp yang telah Anda daftarkan. Jika ada pertanyaan, silakan hubungi kami melalui: " . env('APP_WA_BANMOD');;
        $phoneNumber = $dataPendaftar->phone_number;
        $this->sendWhatsappMessage($message, $phoneNumber);

        return Inertia::render('Banmod/Success', [
            'meta' => [
                'title' => 'Pendaftaran Banmod',
                'jenis' => 'Bantuan Modal',
            ],
        ]);
    }

    // public function ceknik($nik)
    // {
    //     $data = PenerimaBanmod::where('nik', $nik)->first();

    //     if ($data) {
    //         return response()->json([
    //             'success' => false,
    //             'message' => 'NIK Anda ditemukan dan pernah terdaftar sebagai penerima bantuan modal.',
    //         ]);
    //     } else {
    //         return response()->json([
    //             'success' => true,
    //             'data' => $data,
    //         ]);
    //     }
    // }

    public function ceknik(Request $request, $nik, $kategori)
    {
        // Cek status pembukaan pendaftaran
        if (!Setting::boolValue('banmod_registration_open', true)) {
            return response()->json([
                'success' => false,
                'message' => 'Pendaftaran sedang ditutup.'
            ], 403);
        }

        // Validasi format NIK
        if (strlen($nik) != 16) {
            return response()->json([
                'success' => false,
                'message' => 'Maaf, format NIK harus 16 digit'
            ], 400);
        }

        // Cek 1 KK = 1 penerima (KK sudah pernah mendaftar di banmod)
        $kk = $request->query('kk');
        if (is_string($kk) && strlen($kk) === 16 && PendaftaranBanmod::where('kk', $kk)->exists()) {
            return response()->json([
                'success' => false,
                'message' => 'No. KK sudah terdaftar sebagai pendaftar. Maksimal 1 penerima dalam 1 KK.'
            ], 400);
        }

        // Kategori 5 Masyarakat Miskin & 7 Disabilitas = NIK selalu valid
        if ($kategori == 5 || $kategori == 7) {
            // lanjut ke pengecekan data DTKS/desil di bawah
        }

        // Kategori 6 PKL = NIK harus ada di tabel pkl
        if ($kategori == 6) {
            $pklData = Pkl::where('nik', $nik)->first();

            if (!$pklData) {
                return response()->json([
                    'success' => false,
                    'message' => 'Maaf, NIK tidak terdaftar sebagai Pedagang Kaki Lima di database kami'
                ], 404);
            }

            // lanjut ke pengecekan data DTKS/desil di bawah
        }

        // Untuk kategori lainnya (1,2,3,4) - cek apakah sudah pernah daftar
        if (!in_array($kategori, [5, 6, 7])) {
            $existingBanmod = PenerimaBanmod::where('nik', $nik)->first();

            if ($existingBanmod) {
                return response()->json([
                    'success' => false,
                    'message' => 'NIK Anda sudah pernah terdaftar sebagai penerima bantuan modal'
                ], 403);
            }
        }

        // Ambil data DTKS/desil
        try {
            $response = Http::withoutVerifying()->get('https://10.100.200.3/api/dtks/check?nik=' . $nik);
            $dtks = $response->json();
        } catch (\Exception $e) {
            $dtks = [];
            Log::error('DTKS check failed for NIK ' . $nik . ': ' . $e->getMessage());
        }

        $desil = $dtks['desil'] ?? '>5';
        $foundInDesil = !empty($dtks['nama']);

        return response()->json([
            'success' => true,
            'foundInDesil' => $foundInDesil,
            'desil' => $desil,
            'data' => $foundInDesil ? [
                'nik' => $nik,
                'kk' => $dtks['no_kk'] ?? null,
                'nama' => $dtks['nama'],
                // 'alamat' => $dtks['alamat'] ?? null,
            ] : null,
            'message' => $foundInDesil
                ? 'NIK valid, data ditemukan di data DTKS.'
                : 'NIK tidak ditemukan di data desil. Silakan isi data secara manual.',
        ]);
    }

    public function peserta(Request $request)
    {
        if ($request->wantsJson()) {
            $data = PendaftaranBanmod::query();

            return DataTables::of($data)
                ->addIndexColumn()
                ->make(true);
        }

        return Inertia::render('Banmod/Peserta', [
            'meta' => [
                'title' => 'Pendaftar Bantuan Modal',
                'flash' => [
                    'message' => session('message')
                ],
            ],
        ]);
    }
}
