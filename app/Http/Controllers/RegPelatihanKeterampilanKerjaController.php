<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Mail\KirimPendaftar;
use App\Traits\GeneralTrait;
use Illuminate\Http\Request;
use App\Models\PelatihanUmkm;
use App\Models\PelatihanBanmod;
use App\Models\PelatihanKerjas;
use App\Models\PelatihanPetani;
use Illuminate\Support\Facades\Mail;

class RegPelatihanKeterampilanKerjaController extends Controller
{
    use GeneralTrait;

    public function store(Request $request)
    {
        $validated = $request->validate([
            "nik" => ['required', 'size:16', 'string'],
            "no_kk" => ['required', 'size:16', 'string'],
            "nama_lengkap" => ['required', 'string'],
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
            "file_ktp" => ['required', 'image'],
            "file_kk" => ['required', 'file'],
            "phone_number" => ['required', 'numeric', 'digits_between:10,15'],
            "alasan" => ['required', 'string'],
            "pendidikan" => ['required', 'string'],
            "jenis_pelatihan" => ['required', 'string'],
            "file_ktp" => ['required', 'image'],
            "file_kk" => ['required', 'file'],
            "file_pasfoto" => ['nullable', 'image'],
            "file_surat_pernyataan_tidak_ikut" => ['nullable', 'file'],
            "file_surat_kesanggupan" => ['nullable', 'file'],
            "file_fotokopi_ijazah" => ['nullable', 'file'],
        ]);
        if ($request->hasFile('file_ktp')) {
            $validated['file_ktp'] = '/storage/pendaftaran-pelatihan-kerja/ktp/' . $request->file('file_ktp')->hashName();
            $request->file('file_ktp')->storeAs('/pendaftaran-pelatihan-kerja/ktp', $request->file('file_ktp')->hashName(), 'public');
        }

        if ($request->hasFile('file_kk')) {
            $validated['file_kk'] = '/storage/pendaftaran-pelatihan-kerja/kk/' . $request->file('file_kk')->hashName();
            $request->file('file_kk')->storeAs('/pendaftaran-pelatihan-kerja/kk', $request->file('file_kk')->hashName(), 'public');
        }

        if ($request->hasFile('file_pasfoto')) {
            $validated['file_pasfoto'] = '/storage/pendaftaran-pelatihan-kerja/pasfoto/' . $request->file('file_pasfoto')->hashName();
            $request->file('file_pasfoto')->storeAs('/pendaftaran-pelatihan-kerja/pasfoto', $request->file('file_pasfoto')->hashName(), 'public');
        }

        if ($request->hasFile('file_surat_pernyataan_tidak_ikut')) {
            $validated['file_surat_pernyataan_tidak_ikut'] = '/storage/pendaftaran-pelatihan-kerja/surat_pernyataan_tidak_ikut/' . $request->file('file_surat_pernyataan_tidak_ikut')->hashName();
            $request->file('file_surat_pernyataan_tidak_ikut')->storeAs('/pendaftaran-pelatihan-kerja/surat_pernyataan_tidak_ikut', $request->file('file_surat_pernyataan_tidak_ikut')->hashName(), 'public');
        }

        if ($request->hasFile('file_surat_kesanggupan')) {
            $validated['file_surat_kesanggupan'] = '/storage/pendaftaran-pelatihan-kerja/surat_kesanggupan/' . $request->file('file_surat_kesanggupan')->hashName();
            $request->file('file_surat_kesanggupan')->storeAs('/pendaftaran-pelatihan-kerja/surat_kesanggupan', $request->file('file_surat_kesanggupan')->hashName(), 'public');
        }

        if ($request->hasFile('file_fotokopi_ijazah')) {
            $validated['file_fotokopi_ijazah'] = '/storage/pendaftaran-pelatihan-kerja/fotokopi_ijazah/' . $request->file('file_fotokopi_ijazah')->hashName();
            $request->file('file_fotokopi_ijazah')->storeAs('/pendaftaran-pelatihan-kerja/fotokopi_ijazah', $request->file('file_fotokopi_ijazah')->hashName(), 'public');
        }
        $validated['status'] = 0; // Default status is 'Menunggu'

        $storedPendaftaran = PelatihanKerjas::create($validated);
        return to_route('pelatihan.kerja.success', $storedPendaftaran->id)->with('success', 'Pendaftaran Berhasil.');
    }


    public function success($id)
    {
        $dataPendaftar = PelatihanKerjas::find($id);
        // dd($dataPendaftar);

        // Send WhatsApp message
        $message = "Terima kasih telah mendaftar Program Pelatihan Untuk Pencari Kerja Kota Kediri. Data Anda telah kami terima dan akan diproses lebih lanjut. Mohon menunggu informasi selanjutnya melalui WhatsApp yang telah Anda daftarkan. Jika ada pertanyaan, silakan hubungi kami melalui: " . env('APP_WA_BANMOD');;
        $phoneNumber = $dataPendaftar->phone_number;
        $this->sendWhatsappMessage($message, $phoneNumber);

        return Inertia::render('Banmod/Success', [
            'meta' => [
                'title' => 'Pendaftaran Banmod',
                'jenis' => 'Pelatihan Keterampilan Kerja',
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
            PelatihanPetani::class
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

        return response()->json([
            'success' => true,
            'blacklisted' => false,
            'message' => 'NIK tidak ditemukan dalam blacklist.'
        ]);
    }
}
