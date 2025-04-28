<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class RegPelatihanKeterampilanKerjaController extends Controller
{
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
            "file_kk" => ['required', 'file']
        ]);
        if ($request->hasFile('file_ktp')) {
            $validated['file_ktp'] = '/storage/pendaftaran-pelatihan-kerja/ktp/' . $request->file('file_ktp')->hashName();
            $request->file('file_ktp')->storeAs('/pendaftaran-pelatihan-kerja/ktp', $request->file('file_ktp')->hashName(), 'public');
        }
        if ($request->hasFile('file_kk')) {
            $validated['file_kk'] = '/storage/pendaftaran-pelatihan-kerja/kk/' . $request->file('file_kk')->hashName();
            $request->file('file_kk')->storeAs('/pendaftaran-pelatihan-kerja/kk', $request->file('file_kk')->hashName(), 'public');
        }
        dd($validated);
    }
}
