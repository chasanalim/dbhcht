<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\PelatihanBanmod;
use App\Models\PenerimaBanmod;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use App\Traits\GeneralTrait;

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

    // Menyimpan data pelatihan banmod
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'tahun_penerimaan' => 'required',
                'nik' => 'required',
                'nama_lengkap' => 'required',
                'no_kk' => 'required',
                'no_hp' => 'required',

                // Alamat KTP
                'kecamatan_ktp' => 'required',
                'kelurahan_ktp' => 'required',
                'rw_ktp' => 'required',
                'rt_ktp' => 'required',
                'jalan_ktp' => 'required',

                // Alamat Usaha
                'kecamatan_usaha' => 'required',
                'kelurahan_usaha' => 'required',
                'rw_usaha' => 'required',
                'rt_usaha' => 'required',
                'jalan_usaha' => 'required',

                // Pelatihan
                'jenis_pelatihan_industri' => 'required',
                'perkembangan_omzet' => 'required',
                'perkembangan_tenaga_kerja' => 'required',
                'skor_ketrampilan' => 'required',
                'skor_kualitas_produk' => 'required',
                'skor_permasalahan_usaha' => 'required',
                'skor_mengisi_waktu' => 'required',
                'skor_diajak_teman' => 'required',

                // Files
                'file_ktp' => 'required|file|mimes:jpg,jpeg,png',
                'file_kk' => 'required|file|mimes:pdf',
                'file_nib' => 'required|file|mimes:pdf',
                'file_domisili' => 'required|file|mimes:pdf',

                'komitmen' => 'required|accepted'
            ]);

            DB::beginTransaction();

            try {
                // Handle file uploads
                if ($request->hasFile('file_ktp')) {
                    $file_ktp = $request->file('file_ktp')->store('pelatihan-banmod/ktp');
                }
                if ($request->hasFile('file_kk')) {
                    $file_kk = $request->file('file_kk')->store('pelatihan-banmod/kk');
                }
                if ($request->hasFile('file_nib')) {
                    $file_nib = $request->file('file_nib')->store('pelatihan-banmod/nib');
                }
                if ($request->hasFile('file_domisili')) {
                    $file_domisili = $request->file('file_domisili')->store('pelatihan-banmod/domisili');
                }

                // Create record
                $pelatihan = PelatihanBanmod::create([
                    'tahun_penerimaan' => $validated['tahun_penerimaan'],
                    'nik' => $validated['nik'],
                    'nama_lengkap' => $validated['nama_lengkap'],
                    'no_kk' => $validated['no_kk'],
                    'no_hp' => $validated['no_hp'],

                    // Alamat KTP
                    'kecamatan_ktp' => $validated['kecamatan_ktp'],
                    'kelurahan_ktp' => $validated['kelurahan_ktp'],
                    'rw_ktp' => $validated['rw_ktp'],
                    'rt_ktp' => $validated['rt_ktp'],
                    'jalan_ktp' => $validated['jalan_ktp'],

                    // Alamat Usaha
                    'kecamatan_usaha' => $validated['kecamatan_usaha'],
                    'kelurahan_usaha' => $validated['kelurahan_usaha'],
                    'rw_usaha' => $validated['rw_usaha'],
                    'rt_usaha' => $validated['rt_usaha'],
                    'jalan_usaha' => $validated['jalan_usaha'],

                    // Pelatihan
                    'jenis_pelatihan_industri' => $validated['jenis_pelatihan_industri'],
                    'perkembangan_omzet' => $validated['perkembangan_omzet'],
                    'perkembangan_tenaga_kerja' => $validated['perkembangan_tenaga_kerja'],
                    'skor_ketrampilan' => $validated['skor_ketrampilan'],
                    'skor_kualitas_produk' => $validated['skor_kualitas_produk'],
                    'skor_permasalahan_usaha' => $validated['skor_permasalahan_usaha'],
                    'skor_mengisi_waktu' => $validated['skor_mengisi_waktu'],
                    'skor_diajak_teman' => $validated['skor_diajak_teman'],

                    // Files
                    'file_ktp' => $file_ktp ?? null,
                    'file_kk' => $file_kk ?? null,
                    'file_nib' => $file_nib ?? null,
                    'file_domisili' => $file_domisili ?? null,
                    'status' => 0, // Menunggu

                ]);

                // Send WhatsApp notification
                $message = "Terima kasih telah mendaftar Program Pelatihan Penerima Banmod Kota Kediri. "
                    . "Data Anda telah kami terima dan akan diproses lebih lanjut. "
                    . "Mohon menunggu informasi selanjutnya melalui WhatsApp yang telah Anda daftarkan.";

                $this->sendWhatsappMessage($message, $validated['no_hp']);

                DB::commit();

                return redirect()->route('pelatihan-banmod.success', $pelatihan->id)
                    ->with('success', 'Pendaftaran berhasil disimpan!');
            } catch (\Exception $e) {
                DB::rollBack();
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
        $data = PenerimaBanmod::where('nik', $nik)->first();

        if ($data) {
            return response()->json([
                'success' => true,
                'data' => $data,
            ]);
        } else {
            return response()->json([
                'success' => false,
                'message' => 'NIK tidak ditemukan sebagai penerima bantuan modal.',
            ]);
        }
    }
}
