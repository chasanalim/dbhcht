<?php

namespace App\Http\Controllers;

use App\Models\PelatihanUmkm;
use App\Models\SkorPelatihanUmkm;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class PelatihanUmkmController extends Controller
{
    public function store(Request $request)
    {
        // Validasi form
        $validator = Validator::make($request->all(), [
            'nik' => 'required|unique:pelatihan_umkm,nik',
            'no_kk' => 'required',
            'jenis_kelamin' => 'required',
            'nama_lengkap' => 'required',
            'no_hp' => 'required',
            'jalan' => 'required',
            'kecamatan' => 'required',
            'kelurahan' => 'required',
            'rt' => 'required',
            'rw' => 'required',
            'tempat_lahir' => 'required',
            'tgl_lahir' => 'required|date',
            'pendidikan' => 'required',
            'is_disabilitas' => 'boolean',
            'jenis_disabilitas' => 'nullable|json',
            'prioritas_1' => 'required',
            'prioritas_2' => 'nullable',
            'prioritas_3' => 'nullable',
            'alasan' => 'required',
            'kesesuaian' => 'required',
            'pengalaman' => 'required',
            'komitmen' => 'required',
            'file_foto' => 'required|file|mimes:jpeg,png,jpg',
            'file_ktp' => 'required|file|mimes:jpeg,png,jpg,pdf',
            'file_kk' => 'required|file|mimes:jpeg,png,jpg,pdf',
            'file_pernyataan' => 'required|file|mimes:pdf',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Simpan data ke database
        $pelatihan = new PelatihanUmkm;
        $pelatihan->nik = $request->nik;
        $pelatihan->no_kk = $request->no_kk;
        $pelatihan->jenis_kelamin = $request->jenis_kelamin;
        $pelatihan->nama_lengkap = $request->nama_lengkap;
        $pelatihan->no_hp = $request->no_hp;
        $pelatihan->jalan = $request->jalan;
        $pelatihan->kecamatan = $request->kecamatan;
        $pelatihan->kelurahan = $request->kelurahan;
        $pelatihan->rt = $request->rt;
        $pelatihan->rw = $request->rw;
        $pelatihan->tempat_lahir = $request->tempat_lahir;
        $pelatihan->tgl_lahir = $request->tgl_lahir;
        $pelatihan->pendidikan = $request->pendidikan;
        $pelatihan->is_disabilitas = $request->is_disabilitas;
        $pelatihan->jenis_disabilitas = $request->jenis_disabilitas;
        $pelatihan->prioritas_1 = $request->prioritas_1;
        $pelatihan->prioritas_2 = $request->prioritas_2;
        $pelatihan->prioritas_3 = $request->prioritas_3;
        $pelatihan->alasan = $request->alasan;
        $pelatihan->kesesuaian = $request->kesesuaian;
        $pelatihan->pengalaman = $request->pengalaman;
        $pelatihan->komitmen = $request->komitmen;

        // Upload file
        if ($request->hasFile('file_foto')) {
            $pelatihan->file_foto = $request->file('file_foto')->store('uploads');
        }
        if ($request->hasFile('file_ktp')) {
            $pelatihan->file_ktp = $request->file('file_ktp')->store('uploads');
        }
        if ($request->hasFile('file_kk')) {
            $pelatihan->file_kk = $request->file('file_kk')->store('uploads');
        }
        if ($request->hasFile('file_pernyataan')) {
            $pelatihan->file_pernyataan = $request->file('file_pernyataan')->store('uploads');
        }

        // Simpan ke database
        $pelatihan->save();

        return response()->json(['message' => 'Data berhasil disimpan', 'data' => $pelatihan], 201);
    }
}
