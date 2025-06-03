<?php

namespace App\Http\Controllers;

use App\Models\PelatihanUmkm;
use App\Models\SkorPelatihanUmkm;
use App\Traits\GeneralTrait;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;
use App\Mail\KirimPendaftar;

class RegPelatihanUmkmController extends Controller
{
    use GeneralTrait;

    public function store(Request $request)
    {
        $data = $request->validate([
            'nik' => 'required|numeric|digits:16|unique:pelatihan_umkm,nik',
            'no_kk' => 'required|numeric|digits:16',
            'nama_lengkap' => 'required|string|max:255',
            'tempat_lahir' => 'required|string|max:100',
            'tgl_lahir' => 'required|date',
            'jenis_kelamin' => 'required|string',
            'no_hp' => 'required|string|min:11|max:14',
            'pendidikan' => 'required|string',
            'is_disabilitas' => 'required',
            'jenis_disabilitas' => 'nullable|array',
            'jalan' => 'required|string|max:255',
            'kecamatan' => 'required|string',
            'kelurahan' => 'required|string',
            'rw' => 'required|string',
            'rt' => 'required|string',
            'nama_usaha' => 'required|string|max:255',
            'tahun_berdiri' => 'required|string',
            'bidang_usaha' => 'required|string',
            'alamat_usaha' => 'required|string',
            'kec_usaha' => 'required|string',
            'kel_usaha' => 'required|string',
            'rw_usaha' => 'required|string',
            'rt_usaha' => 'required|string',
            'nib' => 'required|string',
            'legalitas_status' => 'required|string',
            'legalitas_jenis' => 'nullable|array',
            'modal' => 'required|numeric',
            'omset' => 'required|numeric',
            'kapasitas_satuan' => 'required|string',
            'kapasitas_jumlah' => 'required|numeric',
            'jangkauan' => 'required|string',
            'prioritas_1' => 'required|string',
            'prioritas_2' => 'required|string',
            'prioritas_3' => 'required|string',
            'alasan' => 'required|integer',
            'kesesuaian' => 'required|integer',
            'pengalaman' => 'required|integer',
            'komitmen' => 'required|boolean',
            'file_foto' => 'required|file|mimes:jpg,jpeg,png|max:2048',
            'file_ktp' => 'required|file|mimes:jpg,jpeg,png|max:2048',
            'file_kk' => 'required|file',
            'file_pernyataan' => 'required|file|mimes:pdf|max:2048',
        ]);

        // Simpan file upload
        $data['file_foto'] = $request->file('file_foto')->store('umkm/foto');
        $data['file_ktp'] = $request->file('file_ktp')->store('umkm/ktp');
        $data['file_kk'] = $request->file('file_kk')->store('umkm/kk');
        $data['file_pernyataan'] = $request->file('file_pernyataan')->store('umkm/pernyataan');

        // Format array ke string json
        $data['jenis_disabilitas'] = json_encode($data['jenis_disabilitas'] ?? []);
        $data['legalitas_jenis'] = json_encode($data['legalitas_jenis'] ?? []);

        // Create and get the stored data
        $storedPendaftaran = PelatihanUmkm::create($data);

        // Send WhatsApp notification
        $message = "Terima kasih telah mendaftar Program Pelatihan UMKM Kota Kediri. Data Anda telah kami terima dan akan diproses lebih lanjut. Mohon menunggu informasi selanjutnya melalui WhatsApp yang telah Anda daftarkan.";
        $phoneNumber = $data['no_hp'];
        $this->sendWhatsappMessage($message, $phoneNumber);

        return to_route('pelatihan.umkm.success', $storedPendaftaran->id)
            ->with('success', 'Pendaftaran berhasil disimpan!');
    }

    public function success($id)
    {
        $dataPendaftar = PelatihanUmkm::find($id);

        // Send WhatsApp message
        $message = "Terima kasih telah mendaftar Program Bantuan Modal Kota Kediri. Data Anda telah kami terima dan akan diproses lebih lanjut. Mohon menunggu informasi selanjutnya melalui WhatsApp yang telah Anda daftarkan. Jika ada pertanyaan, silakan hubungi kami melalui: " . env('APP_WA_BANMOD');;
        $phoneNumber = $dataPendaftar->phone_number;
        $this->sendWhatsappMessage($message, $phoneNumber);

        return Inertia::render('Pelatihan/Success', [
            'meta' => [
                'title' => 'Pendaftaran Pelatihan UMKM',
                'jenis' => 'Pelatihan UMKM',
            ],
        ]);
    }
}
