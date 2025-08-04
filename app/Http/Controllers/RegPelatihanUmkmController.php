<?php

namespace App\Http\Controllers;

use App\Models\PelatihanUmkm;
use App\Models\SkorPelatihanUmkm;
use App\Traits\GeneralTrait;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use App\Mail\KirimPendaftar;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Str;


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
            'file_foto' => 'required|file|mimes:jpg,jpeg,png|max:2048',
            'file_ktp' => 'required|file|mimes:jpg,jpeg,png|max:2048',
            'file_kk' => 'required|file|mimes:jpg,jpeg,png,pdf|max:2048',
            'file_pernyataan' => 'required|file|mimes:pdf|max:2048',
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

            try {
                $uploadedFiles = $this->handleFileUploads($request);
                $data = array_merge($data, $uploadedFiles);

                $data['jenis_disabilitas'] = $data['jenis_disabilitas'] ?? [];
                $data['legalitas_jenis'] = $data['legalitas_jenis'] ?? [];

                $storedPendaftaran = PelatihanUmkm::create($data);

                // $this->sendNotifications($data['no_hp']);

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
        $fileFields = ['file_foto', 'file_ktp', 'file_kk', 'file_pernyataan'];

        foreach ($fileFields as $field) {
            if ($request->hasFile($field)) {
                $uploadedFiles[$field] = $request->file($field)->store('umkm/' . str_replace('file_', '', $field));
            }
        }

        return $uploadedFiles;
    }
    protected function cleanupUploadedFiles(array $files)
    {
        foreach ($files as $path) {
            Storage::delete($path);
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
}
