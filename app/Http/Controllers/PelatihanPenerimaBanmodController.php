<?php

namespace App\Http\Controllers;

use App\Models\PelatihanBanmod;
use App\Models\PelatihanKerjas;
use App\Models\PelatihanPetani;
use App\Models\PelatihanUmkm;
use App\Models\PenerimaBanmod;
use App\Traits\GeneralTrait;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;
use Intervention\Image\Laravel\Facades\Image;

class PelatihanPenerimaBanmodController extends Controller
{
    use GeneralTrait;

    // Menampilkan form pelatihan banmod
    public function create()
    {
        return inertia('Pelatihan/Forms/FormPenerimaBanmod', [
            'meta' => [
                'title' => 'Pelatihan Keterampilan Penerima Banmod',
            ],
        ]);
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'tahun_penerimaan' => 'required',
                'nik' => 'required|string|size:16',
                'nama_lengkap' => 'required|string|max:255',
                'no_kk' => 'required|string|size:16',
                'no_hp' => 'required|string|min:10|max:15',
                'desil' => 'required|string',

                'kecamatan_ktp' => 'required|string',
                'kelurahan_ktp' => 'required|string',
                'rw_ktp' => 'required|string',
                'rt_ktp' => 'required|string',
                'jalan_ktp' => 'required|string',

                'kecamatan_usaha' => 'required|string',
                'kelurahan_usaha' => 'required|string',
                'rw_usaha' => 'required|string',
                'rt_usaha' => 'required|string',
                'jalan_usaha' => 'required|string',

                'jenis_pelatihan_industri' => 'required|string',
                'perkembangan_omzet' => 'required|integer',
                'perkembangan_tenaga_kerja' => 'required|integer',
                'skor_ketrampilan' => 'required|integer',
                'skor_kualitas_produk' => 'required|integer',
                'skor_permasalahan_usaha' => 'required|integer',
                'skor_mengisi_waktu' => 'required|integer',
                'skor_diajak_teman' => 'required|integer',

                'file_ktp' => 'required|file|mimes:jpg,jpeg,png',
                'file_kk' => 'required|file|mimes:jpg,jpeg,png',
                'file_pasfoto' => 'required|file|mimes:jpg,jpeg,png',
                'file_surat_pernyataan_tidak_ikut' => 'required|file|mimes:pdf|max:2048',
                // 'file_surat_kesanggupan' => 'nullable|file|mimes:pdf|max:2048',
                'file_nib' => 'required|file|mimes:pdf,jpg,jpeg,png|max:2048',

                'komitmen' => 'required|accepted'
            ]);

            // Check NIK sudah pernah daftar di tahun yang sama
            $tahunPendaftaran = date('Y');
            $existing = PelatihanBanmod::where('nik', $validated['nik'])
                ->whereYear('created_at', $tahunPendaftaran)
                ->first();
            if ($existing) {
                throw ValidationException::withMessages([
                    'nik' => "NIK sudah pernah mendaftar pelatihan penerima bantuan modal tahun {$tahunPendaftaran}."
                ]);
            }

            DB::beginTransaction();

            try {
                // Handle file uploads
                $uploadedFiles = $this->handleFileUploads($request);

                // Create record
                $pelatihan = PelatihanBanmod::create(array_merge($validated, $uploadedFiles, [
                    'status' => 0, // Menunggu
                ]));

                // Send WhatsApp notification
                $message = "Terima kasih telah mendaftar Program Pelatihan Penerima Banmod Kota Kediri. "
                    . "Data Anda telah kami terima dan akan diproses lebih lanjut. "
                    . "Mohon menunggu informasi selanjutnya melalui WhatsApp yang telah Anda daftarkan. "
                    . "Jika ada pertanyaan, silakan hubungi kami melalui: " . env('APP_WA_BANMOD');

                $this->sendWhatsappMessage($message, $validated['no_hp']);

                DB::commit();

                return redirect()->route('pelatihan-banmod.success', $pelatihan->id)
                    ->with('success', 'Pendaftaran berhasil disimpan!');
            } catch (\Exception $e) {
                DB::rollBack();
                // Cleanup uploaded files
                if (isset($uploadedFiles)) {
                    $this->cleanupUploadedFiles($uploadedFiles);
                }
                throw $e;
            }
        } catch (ValidationException $e) {
            return back()->withErrors($e->errors())->withInput();
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
            // 'file_surat_kesanggupan' => 'surat-kesanggupan',
            'file_nib' => 'nib',
        ];

        foreach ($fileFields as $field => $folder) {
            if ($request->hasFile($field)) {
                $file = $request->file($field);
                $extension = strtolower($file->getClientOriginalExtension());
                $fileNameWithoutExt = pathinfo($file->hashName(), PATHINFO_FILENAME);

                if (in_array($extension, ['jpg', 'jpeg', 'png'])) {

                    $webpFileName = $fileNameWithoutExt . '.webp';
                    $storagePath = 'pelatihan-banmod/' . $folder . '/' . $webpFileName;

                    $image = Image::read($file)
                        ->encode(new \Intervention\Image\Encoders\WebpEncoder(quality: 80));

                    Storage::disk('public')->put($storagePath, (string)$image);

                    $uploadedFiles[$field] = '/storage/' . $storagePath;
                    continue;
                }

                if ($extension === 'pdf') {

                    $originalName = $fileNameWithoutExt . '.pdf';
                    $storagePath = storage_path('app/public/pelatihan-banmod/' . $folder . '/' . $originalName);

                    $file->storeAs('pelatihan-banmod/' . $folder, $originalName, 'public');

                    $compressedPath = storage_path(
                        'app/public/pelatihan-banmod/' . $folder . '/' . $fileNameWithoutExt . '-compressed.pdf'
                    );

                    // perintah Ghostscript
                    $gsCmd = 'gs -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 -dPDFSETTINGS=/ebook ' .
                        '-dNOPAUSE -dQUIET -dBATCH ' .
                        '-sOutputFile="' . $compressedPath . '" "' . $storagePath . '"';

                    @exec($gsCmd);

                    if (file_exists($compressedPath)) {
                        unlink($storagePath);
                        rename($compressedPath, $storagePath);
                    }

                    $uploadedFiles[$field] = '/storage/pelatihan-banmod/' . $folder . '/' . $originalName;
                    continue;
                }

                $fileName = $file->hashName();
                $storagePath = 'pelatihan-banmod/' . $folder . '/' . $fileName;
                $file->storeAs('pelatihan-banmod/' . $folder, $fileName, 'public');

                $uploadedFiles[$field] = '/storage/' . $storagePath;
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

    public function success($id)
    {
        try {
            $dataPendaftar = PelatihanBanmod::findOrFail($id);

            return inertia('Pelatihan/Success', [
                'meta' => [
                    'title' => 'Pendaftaran Pelatihan Penerima Banmod',
                    'jenis' => 'Pelatihan Penerima Banmod',
                ],
            ]);
        } catch (\Exception $e) {
            Log::error('Success Page Error: ' . $e->getMessage());
            return redirect()->route('pelatihan-banmod.create')
                ->withErrors(['error' => 'Halaman tidak dapat diakses.']);
        }
    }

    // Fungsi untuk mengecek NIK apakah terdaftar sebagai penerima bantuan modal
    public function cekNIK(Request $request, $nik)
    {
        if (strlen($nik) !== 16 || !is_numeric($nik)) {
            return response()->json([
                'success' => false,
                'message' => 'Maaf, format NIK harus 16 digit angka'
            ], 400);
        }

        $tahunSekarang = (int) date('Y');
        $tahunSebelumnya = $tahunSekarang - 1;

        // Cek blacklist dari semua jenis pelatihan (berlaku untuk pendaftaran tahun berikutnya)
        $blacklistModels = [
            \App\Models\PelatihanUmkm::class,
            \App\Models\PelatihanBanmod::class,
            \App\Models\PelatihanKerjas::class,
            \App\Models\PelatihanPetani::class
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

        // Cek sudah pernah ikut pelatihan lain (berlaku hanya di tahun yang sama)
        $doneModels = [
            \App\Models\PelatihanUmkm::class,
            \App\Models\PelatihanKerjas::class,
            \App\Models\PelatihanPetani::class
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
        $data = PenerimaBanmod::where('nik', $nik)->first();

        $response = Http::get(
            'https://api-splp.layanan.go.id:443/t/kedirikota.go.id/walidata/0.1/api/dtks/check?nik=' . $nik
        );

        $dtks = $response->json();


        // Ambil desil jika ada, jika tidak null
        $desil = $dtks['desil'] ?? '>5';

        if ($data) {
            $data->desil = $desil;

            return response()->json([
                'success' => true,
                'blacklisted' => false,
                'data' => $data,
                'message' => 'NIK Valid ✓, Anda terdaftar sebagai penerima Banmod sebelumnya.'
            ]);
        }

        return response()->json([
            'success' => true,
            'data' => [
                'desil' => $desil,
                'tahun_dapat_bantuan' => '-',
            ],
            'message' => 'NIK tidak ditemukan sebagai penerima Banmod sebelumnya, silahkan mengisikan formulir .'
        ]);
    }
}
