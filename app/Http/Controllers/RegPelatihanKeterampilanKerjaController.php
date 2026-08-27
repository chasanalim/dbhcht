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
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Http;
use Intervention\Image\Laravel\Facades\Image;
use Intervention\Image\Encoders\WebpEncoder;

class RegPelatihanKeterampilanKerjaController extends Controller
{
    use GeneralTrait;

    public function store(Request $request)
    {
        $validated = $request->validate([
            "nik" => ['required', 'size:16', 'string'],
            "no_kk" => ['required', 'size:16', 'string'],
            "desil" => ['nullable', 'string', 'max:10'],
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
            "file_ktp" => ['required', 'file','mimes:pdf,jpg,jpeg,png', 'max:2048'],
            "file_kk" => ['required', 'file','mimes:pdf,jpg,jpeg,png', 'max:2048'],
            "phone_number" => ['required', 'numeric', 'digits_between:10,15'],
            "alasan" => ['required', 'string'],
            "pendidikan" => ['required', 'string'],
            "jenis_pelatihan" => ['required', 'string'],
            // Tambah validasi field baru
            "status_bekerja" => ['required', 'integer', 'in:1,2,3'],
            "pernah_pelatihan" => ['required', 'integer', 'in:1,3'],
            "status_domisili" => ['required', 'integer', 'in:1,2,3'],
            "file_pasfoto" => ['required', 'file','mimes:pdf,jpg,jpeg,png', 'max:2048'],
            "file_surat_pernyataan_tidak_ikut" => ['required', 'file','mimes:pdf,jpg,jpeg,png', 'max:2048'],
            "file_surat_kesanggupan" => ['required', 'file','mimes:pdf,jpg,jpeg,png', 'max:2048'],
            "file_fotokopi_ijazah" => ['required', 'file','mimes:pdf,jpg,jpeg,png', 'max:2048'],
        ]);

        $fileFields = [
            'file_ktp' => 'ktp',
            'file_kk' => 'kk',
            'file_pasfoto' => 'pasfoto',
            'file_surat_pernyataan_tidak_ikut' => 'surat_pernyataan_tidak_ikut',
            'file_surat_kesanggupan' => 'surat_kesanggupan',
            'file_fotokopi_ijazah' => 'fotokopi_ijazah',
        ];

        foreach ($fileFields as $field => $folder) {
            if ($request->hasFile($field)) {

                $file = $request->file($field);
                $extension = strtolower($file->getClientOriginalExtension());
                $fileNameWithoutExt = pathinfo($file->hashName(), PATHINFO_FILENAME);
                $storageFolder = 'pendaftaran-pelatihan-kerja/' . $folder;

                if (in_array($extension, ['jpg', 'jpeg', 'png'])) {

                    $webpFileName = $fileNameWithoutExt . '.webp';
                    $storagePath = $storageFolder . '/' . $webpFileName;

                    $image = Image::read($file)->encode(new WebpEncoder(quality: 80));

                    Storage::disk('public')->put($storagePath, (string) $image);
                    $validated[$field] = '/storage/' . $storagePath;

                    continue;
                }

                if ($extension === 'pdf') {

                    $originalName = $fileNameWithoutExt . '.pdf';
                    $originalPath = storage_path("app/public/$storageFolder/$originalName");

                    $file->storeAs($storageFolder, $originalName, 'public');

                    // path PDF hasil compress
                    $compressedPath = storage_path("app/public/$storageFolder/{$fileNameWithoutExt}_compressed.pdf");

                    // perintah Ghostscript
                    $gsCmd = 'gs -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 ' .
                        '-dPDFSETTINGS=/ebook -dNOPAUSE -dQUIET -dBATCH ' .
                        '-sOutputFile="' . $compressedPath . '" "' . $originalPath . '"';

                    @exec($gsCmd);

                    if (file_exists($compressedPath)) {
                        unlink($originalPath);
                        rename($compressedPath, $originalPath);
                    }

                    $validated[$field] = '/storage/' . $storageFolder . '/' . $originalName;

                    continue;
                }

                $fileName = $file->hashName();
                $storagePath = $storageFolder . '/' . $fileName;

                $file->storeAs($storageFolder, $fileName, 'public');
                $validated[$field] = '/storage/' . $storagePath;
            }
        }

        // Check NIK sudah pernah daftar di tahun yang sama
        $tahunPendaftaran = date('Y');
        $existing = PelatihanKerjas::where('nik', $validated['nik'])
            ->whereYear('created_at', $tahunPendaftaran)
            ->first();
        if ($existing) {
            return back()
                ->withInput()
                ->withErrors([
                    'nik' => "NIK sudah pernah mendaftar pelatihan keterampilan kerja tahun {$tahunPendaftaran}."
                ]);
        }

        $validated['status'] = 0;

        $storedPendaftaran = PelatihanKerjas::create($validated);

        return to_route('pelatihan.kerja.success', $storedPendaftaran->id)
            ->with('success', 'Pendaftaran Berhasil.');
    }


    public function success($id)
    {
        $dataPendaftar = PelatihanKerjas::find($id);
        // dd($dataPendaftar);

        // Send WhatsApp message
        // $message = "Terima kasih telah mendaftar Program Pelatihan Untuk Pencari Kerja Kota Kediri. Data Anda telah kami terima dan akan diproses lebih lanjut. Mohon menunggu informasi selanjutnya melalui WhatsApp yang telah Anda daftarkan. Jika ada pertanyaan, silakan hubungi kami melalui: " . env('APP_WA_BANMOD');;
        // $phoneNumber = $dataPendaftar->phone_number;
        // $this->sendWhatsappMessage($message, $phoneNumber);

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
            PelatihanPetani::class
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

        // Cek DTKS untuk mendapatkan data desil
        $desil = '>5';
        try {
            $response = Http::withoutVerifying()->get(
                'https://10.100.200.3/api/dtks/check?nik=' . $nik
            );
            $dtks = $response->json();
            $desil = $dtks['desil'] ?? '>5';
        } catch (\Exception $e) {
            Log::error('DTKS check failed for NIK ' . $nik . ': ' . $e->getMessage());
        }

        return response()->json([
            'success' => true,
            'blacklisted' => false,
            'desil' => $desil,
            'message' => 'NIK tidak ditemukan dalam blacklist.'
        ]);
    }
}
