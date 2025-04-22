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
        $data = $request->validate([
            'nik' => 'required|numeric|digits:16|unique:pelatihan_umkm,nik',
            'kk' => 'required|numeric|digits:16',
            'nama_lengkap' => 'required|string|max:255',
            'tmp_lhr' => 'required|string|max:100',
            'tgl_lhr' => 'required|date',
            'jenis_kelamin' => 'required|string',
            'no_hp' => 'required|string|min:11|max:14',
            'pendidikan' => 'required|string',
            'is_disabilitas' => 'required|in:ya,tidak',
            'jenis_disabilitas' => 'nullable|array',
            'nama_usaha' => 'required|string|max:255',
            'tahun_berdiri' => 'required|string',
            'bidang_usaha' => 'required|string',
            'alamat' => 'required|string',
            'nama_kecamatan' => 'required|string',
            'nama_kelurahan' => 'required|string',
            'nama_rw' => 'required|string',
            'nama_rt' => 'required|string',
            'nib' => 'required|string',
            'legalitas_status' => 'required|string',
            'legalitas_jenis' => 'nullable|array',
            'modal' => 'required|numeric',
            'omset' => 'required|numeric',
            'kapasitas_jumlah' => 'required|numeric',
            'kapasitas_satuan' => 'required|string',
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
            'file_kk' => 'required|file|mimes:jpg,jpeg,png|max:2048',
            'file_pernyataan' => 'required|file|mimes:pdf|max:2048',
        ]);

        // Simpan file upload
        $data['file_foto'] = $request->file('file_foto')->store('umkm/foto');
        $data['file_ktp'] = $request->file('file_ktp')->store('umkm/ktp');
        $data['file_kk'] = $request->file('file_kk')->store('umkm/kk');
        $data['file_pernyataan'] = $request->file('file_pernyataan')->store('umkm/pernyataan');

        // Format array ke string json (jika dibutuhkan)
        $data['jenis_disabilitas'] = json_encode($data['jenis_disabilitas'] ?? []);
        $data['legalitas_jenis'] = json_encode($data['legalitas_jenis'] ?? []);

        PelatihanUmkm::create($data);

        return redirect()->back()->with('success', 'Pendaftaran berhasil disimpan!');
    }
}
