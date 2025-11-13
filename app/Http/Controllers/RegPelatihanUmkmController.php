<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Support\Str;
use App\Mail\KirimPendaftar;
use App\Traits\GeneralTrait;
use Illuminate\Http\Request;
use App\Models\PelatihanUmkm;
use App\Models\PelatihanBanmod;
use App\Models\PelatihanKerjas;
use App\Models\PelatihanPetani;
use App\Models\SkorPelatihanUmkm;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;


class RegPelatihanUmkmController extends Controller
{
    use GeneralTrait;

    protected function getValidationRules()
    {
        return [
            'nik' => 'required|numeric|digits:16',
            'no_kk' => 'required|numeric|digits:16',
            'nama_lengkap' => 'required|string|max:255',
            'tempat_lahir' => 'required|string|max:100',
            'tgl_lahir' => 'required|date|before:today|after:1900-01-01',
            'jenis_kelamin' => 'required|string',
            'no_hp' => ['required', 'string', 'regex:/^(62)[0-9]{9,12}$/', 'min:11', 'max:14'],
            'pendidikan' => 'required|string',
            'is_disabilitas' => 'required|boolean',
            'jenis_disabilitas' => 'nullable|array',
            'jenis_disabilitas.*' => 'required|string',
            'jalan' => 'required|string|max:255',
            'kecamatan' => 'required|string',
            'kelurahan' => 'required|string',
            'rw' => 'required|string',
            'rt' => 'required|string',
            'nama_usaha' => 'required|string|max:255',
            'tahun_berdiri' => 'required|numeric|min:1900|max:' . date('Y'),
            'bidang_usaha' => 'required|string',
            'alamat_usaha' => 'required|string',
            'kec_usaha' => 'required|string',
            'kel_usaha' => 'required|string',
            'rw_usaha' => 'required|string',
            'rt_usaha' => 'required|string',
            'nib' => 'required|string',
            'legalitas_status' => 'required',
            'legalitas_jenis' => 'nullable|array',
            'legalitas_jenis.*' => 'required|string',
            'modal' => 'required|numeric|min:0',
            'omset' => 'required|numeric|min:0',
            'kapasitas_satuan' => 'required|string',
            'kapasitas_jumlah' => 'required|numeric|min:1',
            'jangkauan' => 'required|string',
            'prioritas_1' => 'required|string|different:prioritas_2,prioritas_3',
            'prioritas_2' => 'required|string|different:prioritas_1,prioritas_3',
            'prioritas_3' => 'required|string|different:prioritas_1,prioritas_2',
            'alasan' => 'required|integer',
            'kesesuaian' => 'required|integer',
            'pengalaman' => 'required|integer',
            'komitmen' => 'required|boolean|accepted',
            'file_ktp' => 'required|file|mimes:jpg,jpeg,png|max:2048',
            'file_kk' => 'required|file|mimes:jpg,jpeg,png|max:2048',
            'file_pasfoto' => 'required|file|mimes:jpg,jpeg,png|max:2048',
            'file_surat_pernyataan_tidak_ikut' => 'nullable|file|mimes:pdf|max:2048',
            'file_surat_kesanggupan' => 'required|file|mimes:pdf|max:2048',
            'file_nib' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:2048',
        ];
    }

    public function store(Request $request)
    {
        try {
            if (Str::startsWith($request->no_hp, '08')) {
                $request->merge([
                    'no_hp' => '62' . substr($request->no_hp, 1)
                ]);
            }

            $data = $request->validate($this->getValidationRules());

            DB::beginTransaction();

            $data['status'] = 0; // Menunggu

            try {
                $uploadedFiles = $this->handleFileUploads($request);
                $data = array_merge($data, $uploadedFiles);

                $data['jenis_disabilitas'] = $data['jenis_disabilitas'] ?? [];
                $data['legalitas_jenis'] = $data['legalitas_jenis'] ?? [];

                $storedPendaftaran = PelatihanUmkm::create($data);

                DB::commit();

                return to_route('pelatihan.umkm.success', $storedPendaftaran->id)
                    ->with('success', 'Pendaftaran berhasil disimpan!');
            } catch (\Exception $e) {
                DB::rollBack();
                $this->cleanupUploadedFiles($uploadedFiles ?? []);
                throw $e;
            }
        } catch (ValidationException $e) {
            return back()
                ->withInput()
                ->withErrors($e->errors());
        } catch (\Exception $e) {
            Log::error('Registration Error: ' . $e->getMessage());
            return back()
                ->withInput()
                ->withErrors(['error' => 'Terjadi kesalahan sistem: ' . $e->getMessage()]);
        }
    }

    protected function handleFileUploads(Request $request)
    {
        $uploadedFiles = [];
        $fileFields = [
            'file_ktp' => 'ktp',
            'file_kk' => 'kk',
            'file_pasfoto' => 'pasfoto',
            'file_surat_pernyataan_tidak_ikut' => 'surat-pernyataan-tidak-ikut',
            'file_surat_kesanggupan' => 'surat-kesanggupan',
            'file_nib' => 'nib',
        ];

        foreach ($fileFields as $field => $folder) {
            if ($request->hasFile($field)) {
                $fileName = $request->file($field)->hashName();
                $uploadedFiles[$field] = '/storage/pendaftaran-pelatihan-umkm/' . $folder . '/' . $fileName;
                $request->file($field)->storeAs('pendaftaran-pelatihan-umkm/' . $folder, $fileName, 'public');
            }
        }

        return $uploadedFiles;
    }

    protected function cleanupUploadedFiles(array $files)
    {
        foreach ($files as $path) {
            $cleanPath = str_replace('/storage/', '', $path);
            Storage::disk('public')->delete($cleanPath);
        }
    }

    protected function sendNotifications($phoneNumber)
    {
        $message = "Terima kasih telah mendaftar Program Pelatihan UMKM Kota Kediri. "
            . "Data Anda telah kami terima dan akan diproses lebih lanjut. "
            . "Mohon menunggu informasi selanjutnya melalui WhatsApp yang telah Anda daftarkan.";

        $this->sendWhatsappMessage($message, $phoneNumber);
    }

    public function success($id)
    {
        try {
            $dataPendaftar = PelatihanUmkm::findOrFail($id);

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

    public function cekNIK(Request $request, $nik)
    {
        if (strlen($nik) !== 16 || !is_numeric($nik)) {
            return response()->json([
                'success' => false,
                'message' => 'Maaf, format NIK harus 16 digit angka'
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
            PelatihanBanmod::class,
            PelatihanKerjas::class,
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
