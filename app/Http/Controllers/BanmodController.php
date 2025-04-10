<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class BanmodController extends Controller
{
    public function index()
    {
        return Inertia::render('Banmod/Create', [
            'meta' => [
                'title' => 'Pendaftaran Banmod',
            ],
        ]);
    }

    public function store(Request $request)
    {
        // dd($request->all());
        $validated = $request->validate([
            "nik" => ['required', 'size:16', 'string'],
            "kk" => ['required', 'size:16', 'string'],
            "name" => ['required', 'string'],
            "tmp_lhr" => ['required', 'string'],
            "tgl_lhr" => ['required', 'date', 'before:today'],
            "alamat" => ['required', 'string'],
            "kode_kecamatan" => ['required', 'numeric'],
            "nama_kecamatan" => ['required', 'string'],
            "kode_kelurahan" => ['required', 'numeric'],
            "nama_kelurahan" => ['required', 'string'],
            "kode_rw" => ['required', 'numeric'],
            "nama_rw" => ['required', 'string'],
            "kode_rt" => ['required', 'numeric'],
            "nama_rt" => ['required', 'string'],
            "isDomisili" => ['nullable', 'boolean'],
            "alamat_domisili" => ['required_if:isDomisili,true', 'string'],
            "isUsaha" => ['nullable', 'boolean'],
            "alamat_usaha" => ['required_if:isDomisili,true', 'string'],
            "phone_number" => ['required', 'numeric', 'digits_between:10,15'],
            "daya_listrik" => ['required', 'numeric'],
            "isDisabilitas" => ['nullable', 'boolean'],
            "disabilitas" => ['nullable'],
            "disabilitas.*.value" => ['required_if:isDisabilitas,true', 'string'],
            "disabilitas.*.label" => ['required_if:isDisabilitas,true', 'string'],
            "kategori" => ['required', 'numeric'],
            "jenis_kategori" => ['required', 'numeric'],
            "klaster_usaha" => ['required', 'numeric'],
            "tanggungan_keluarga" => ['required_if:kategori,5', 'string'],
            "lama_usaha" => ['required', 'numeric'],
            "jumlah_tenaga" => ['required', 'numeric'],
            "bruto" => ['required', 'numeric'],
            "status_tempat_tinggal" => ['required', 'numeric'],
            "aset" => ['required', 'numeric'],
            "hutang" => ['required', 'numeric'],
            "jumlah_legalitas" => ['required', 'numeric'],
            "jumlah_teknologi" => ['required', 'numeric'],
            "jumlah_penyerapan_naker" => ['required', 'numeric'],
            "file_foto" => ['required', 'image'],
            "file_ktp" => ['required', 'image'],
            "file_kk" => ['required', 'file'],
            "file_nib" => ['required_if:kategori,1,2,3,4', 'file'],
            "file_sku" => ['required_if:kategori,4,5', 'file'],
            "file_skd" => ['required_if:isDomisili,true', 'file'],
            "file_produk" => ['required', 'image'],
            "file_pernyataan" => ['required', 'file'],
            "file_perizinan" => ['required', 'array'],
            "file_siinas" => ['required', 'file'],
            "file_bp" => ['required', 'file'],
            "file_sertifikat_pelatihan" => ['required_if:kategori,5', 'file']
        ]);

        return to_route('banmod')->with('success', 'Aduan berhasil dikirim.');
    }
}
