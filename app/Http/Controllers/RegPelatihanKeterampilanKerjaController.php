<?php

namespace App\Http\Controllers;

use App\Mail\KirimPendaftar;
use App\Models\PelatihanKerjas;
use App\Traits\GeneralTrait;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;

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
            "file_domisili" => ['required', 'file'],
        ]);
        if ($request->hasFile('file_ktp')) {
            $validated['file_ktp'] = '/storage/pendaftaran-pelatihan-kerja/ktp/' . $request->file('file_ktp')->hashName();
            $request->file('file_ktp')->storeAs('/pendaftaran-pelatihan-kerja/ktp', $request->file('file_ktp')->hashName(), 'public');
        }

        if ($request->hasFile('file_kk')) {
            $validated['file_kk'] = '/storage/pendaftaran-pelatihan-kerja/kk/' . $request->file('file_kk')->hashName();
            $request->file('file_kk')->storeAs('/pendaftaran-pelatihan-kerja/kk', $request->file('file_kk')->hashName(), 'public');
        }

        if ($request->hasFile('file_domisili')) {
            $validated['file_domisili'] = '/storage/pendaftaran-pelatihan-kerja/domisili/' . $request->file('file_domisili')->hashName();
            $request->file('file_domisili')->storeAs('/pendaftaran-pelatihan-kerja/domisili', $request->file('file_domisili')->hashName(), 'public');
        }

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
}
