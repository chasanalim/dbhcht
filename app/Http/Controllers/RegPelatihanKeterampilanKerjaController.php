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
use Illuminate\Support\Facades\Storage;
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
            "file_ktp" => ['required', 'file'],
            "file_kk" => ['required', 'file'],
            "phone_number" => ['required', 'numeric', 'digits_between:10,15'],
            "alasan" => ['required', 'string'],
            "pendidikan" => ['required', 'string'],
            "jenis_pelatihan" => ['required', 'string'],
            // Tambah validasi field baru
            "status_bekerja" => ['required', 'integer', 'in:1,2,3'],
            "pernah_pelatihan" => ['required', 'integer', 'in:1,3'],
            "status_domisili" => ['required', 'integer', 'in:1,2,3'],
            "file_pasfoto" => ['required', 'file'],
            "file_surat_pernyataan_tidak_ikut" => ['required', 'file'],
            "file_surat_kesanggupan" => ['required', 'file'],
            "file_fotokopi_ijazah" => ['required', 'file'],
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
