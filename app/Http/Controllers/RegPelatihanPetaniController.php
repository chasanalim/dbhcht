<?php

namespace App\Http\Controllers;

use App\Models\JenisPelatihanPetani;
use App\Models\KelompokPelatihanPetani;
use App\Models\PelatihanPetani;
use Illuminate\Http\Request;

class RegPelatihanPetaniController extends Controller
{
    public function kelompokpelatihanpetani()
    {
        $data = KelompokPelatihanPetani::select('id', 'nama', 'jenis')->get();

        return response()->json($data);
    }

    public function jenispelatihanpetani1()
    {
        $data = JenisPelatihanPetani::select('id', 'nama', 'jenis')
            ->where('jenis', 1)
            ->get();

        return response()->json($data);
    }

    public function jenispelatihanpetani2()
    {
        $data = JenisPelatihanPetani::select('id', 'nama', 'jenis')
            ->where('jenis', 2)
            ->get();

        return response()->json($data);
    }

    public function store(Request $request)
    {
        // return response()->json(request()->all());

        $data = $request->validate([
            'nik' => 'required|numeric|digits:16|unique:pelatihan_petanis,nik',
            'kk' => 'required|numeric|digits:16',
            'jenis_kelamin' => 'required|string',
            'nama_lengkap' => 'required|string|max:255',
            'no_hp' => 'required|string|min:11|max:14',
            'kode_kecamatan' => 'required|string',
            'kode_kelurahan' => 'required|string',
            'nama_rw' => 'required|string',
            'nama_rt' => 'required|string',
            'alamat' => 'required|string',
            'alamat_domisili' => ['nullable', 'required_if:isDomisili,true', 'string'],
            'tmp_lhr' => 'required|string|max:100',
            'tgl_lhr' => 'required|date',
            'pendidikan' => 'required|string',
            'is_disabilitas' => 'required',
            'jenis_disabilitas' => 'nullable|array',
            'nama_kelompok' => 'required|string|max:255',
            'tahun_berdiri' => 'required|string',
            'masa_aktif_kelompok' => 'required|string',
            'bidang_usaha_kelompok' => 'required|string',
            'kode_kecamatan_kelompok' => 'required|string',
            'kode_kelurahan_kelompok' => 'required|string',
            'nama_rw_kelompok' => 'required|string',
            'nama_rt_kelompok' => 'required|string',
            'alamat_kelompok' => 'required|string',
            'kategori' => 'required|integer',
            'jenis_pelatihan_petani' => 'required|integer',
            'alasan' => 'required|integer',
            'file_foto' => 'required|file|mimes:jpg,jpeg,png|max:2048',
            'file_ktp' => 'required|file|mimes:jpg,jpeg,png|max:2048',
            'file_pengukuhan_penyuluh_swadaya' => 'required|file|mimes:pdf|max:2048',
            'file_rekomendasi_kelompok' => 'required|file|mimes:pdf|max:2048',
        ]);

        // Simpan file upload
        $data['file_foto'] = $request->file('file_foto')->store('petani/foto');
        $data['file_ktp'] = $request->file('file_ktp')->store('petani/ktp');
        $data['file_pengukuhan_penyuluh_swadaya'] = $request->file('file_pengukuhan_penyuluh_swadaya')->store('petani/file_pengukuhan_penyuluh_swadaya');
        $data['file_rekomendasi_kelompok'] = $request->file('file_rekomendasi_kelompok')->store('petani/file_rekomendasi_kelompok');

        // Format array ke string json (jika dibutuhkan)
        $data['jenis_disabilitas'] = json_encode($data['jenis_disabilitas'] ?? []);

        PelatihanPetani::create($data);

        return redirect()->back()->with('success', 'Pendaftaran berhasil disimpan!');
    }
}
