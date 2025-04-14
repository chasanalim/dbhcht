<?php

namespace App\Http\Controllers;

use App\Models\PendaftaranBanmod;
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
            "kode_kecamatan" => ['required', 'string'],
            "nama_kecamatan" => ['required', 'string'],
            "kode_kelurahan" => ['required', 'string'],
            "nama_kelurahan" => ['required', 'string'],
            "kode_rw" => ['required', 'string'],
            "nama_rw" => ['required', 'string'],
            "kode_rt" => ['required', 'string'],
            "nama_rt" => ['required', 'string'],
            "isDomisili" => ['nullable', 'boolean'],
            "alamat_domisili" => ['nullable', 'required_if:isDomisili,true', 'string'],
            "isUsaha" => ['nullable', 'boolean'],
            "alamat_usaha" => ['nullable', 'required_if:isDomisili,true', 'string'],
            "phone_number" => ['required', 'numeric', 'digits_between:10,15'],
            "daya_listrik" => ['required', 'numeric'],
            "isDisabilitas" => ['nullable', 'boolean'],
            "disabilitas" => ['nullable'],
            "disabilitas.*.value" => ['nullable', 'required_if:isDisabilitas,true', 'string'],
            "disabilitas.*.label" => ['nullable', 'required_if:isDisabilitas,true', 'string'],
            "kategori" => ['required', 'numeric'],
            "jenis_kategori" => ['required', 'numeric'],
            "klaster_usaha" => ['required', 'numeric'],
            "tanggungan_keluarga" => ['nullable', 'required_if:kategori,5', 'string'],
            "lama_usaha" => ['required', 'numeric'],
            "jumlah_tenaga" => ['nullable', 'required_if:kategori,1,2,3,4', 'numeric'],
            "bruto" => ['nullable', 'required_if:kategori,1,2,3,4', 'numeric'],
            "status_tempat_tinggal" => ['nullable', 'required_if:kategori,5', 'numeric'],
            "aset" => ['required', 'numeric'],
            "hutang" => ['required', 'numeric'],
            "jumlah_legalitas" => ['nullable', 'required_if:kategori,4', 'numeric'],
            "jumlah_teknologi" => ['nullable', 'required_if:kategori,4', 'numeric'],
            "jumlah_penyerapan_naker" => ['nullable', 'required_if:kategori,4', 'numeric'],
            "file_foto" => ['required', 'image'],
            "file_ktp" => ['required', 'image'],
            "file_kk" => ['required', 'file'],
            "file_nib" => ['nullable', 'required_if:kategori,1,2,3,4', 'file'],
            "file_sku" => ['nullable', 'required_if:kategori,4,5', 'file'],
            "file_skd" => ['nullable', 'required_if:isDomisili,true', 'file'],
            "file_produk" => ['required', 'image'],
            "file_pernyataan" => ['required', 'file'],
            "file_perizinan" => ['nullable', 'required_if:kategori,4', 'array'],
            "file_siinas" => ['nullable', 'required_if:kategori,4', 'file'],
            "file_bp" => ['nullable', 'required_if:kategori,4', 'file'],
            "file_sertifikat_pelatihan" => ['nullable', 'required_if:kategori,5', 'file']
        ]);
        if ($request['file_perizinan']) {
            $file_perizinan = [];
            foreach ($request['file_perizinan'] as $key => $value) {
                array_push($file_perizinan, '/storage/pendaftaran-banmod/perizinan/' . $value->hashName());
                $value->storeAs('/pendaftaran-banmod/perizinan', $value->hashName(), 'public');
            }
            $validated['file_perizinan'] = $file_perizinan;
        }
        if ($request->hasFile('file_foto')) {
            $validated['file_foto'] = '/storage/pendaftaran-banmod/foto/' . $request->file('file_foto')->hashName();
            $request->file('file_foto')->storeAs('/pendaftaran-banmod/foto', $request->file('file_foto')->hashName(), 'public');
        }
        if ($request->hasFile('file_ktp')) {
            $validated['file_ktp'] = '/storage/pendaftaran-banmod/ktp/' . $request->file('file_ktp')->hashName();
            $request->file('file_ktp')->storeAs('/pendaftaran-banmod/ktp', $request->file('file_ktp')->hashName(), 'public');
        }
        if ($request->hasFile('file_kk')) {
            $validated['file_kk'] = '/storage/pendaftaran-banmod/kk/' . $request->file('file_kk')->hashName();
            $request->file('file_kk')->storeAs('/pendaftaran-banmod/kk', $request->file('file_kk')->hashName(), 'public');
        }
        if ($request->hasFile('file_nib')) {
            $validated['file_nib'] = '/storage/pendaftaran-banmod/nib/' . $request->file('file_nib')->hashName();
            $request->file('file_nib')->storeAs('/pendaftaran-banmod/nib', $request->file('file_nib')->hashName(), 'public');
        }
        if ($request->hasFile('file_sku')) {
            $validated['file_sku'] = '/storage/pendaftaran-banmod/sku/' . $request->file('file_sku')->hashName();
            $request->file('file_sku')->storeAs('/pendaftaran-banmod/sku', $request->file('file_sku')->hashName(), 'public');
        }
        if ($request->hasFile('file_skd')) {
            $validated['file_skd'] = '/storage/pendaftaran-banmod/skd/' . $request->file('file_skd')->hashName();
            $request->file('file_skd')->storeAs('/pendaftaran-banmod/skd', $request->file('file_skd')->hashName(), 'public');
        }
        if ($request->hasFile('file_produk')) {
            $validated['file_produk'] = '/storage/pendaftaran-banmod/produk/' . $request->file('file_produk')->hashName();
            $request->file('file_produk')->storeAs('/pendaftaran-banmod/produk', $request->file('file_produk')->hashName(), 'public');
        }
        if ($request->hasFile('file_pernyataan')) {
            $validated['file_pernyataan'] = '/storage/pendaftaran-banmod/pernyataan/' . $request->file('file_pernyataan')->hashName();
            $request->file('file_pernyataan')->storeAs('/pendaftaran-banmod/pernyataan', $request->file('file_pernyataan')->hashName(), 'public');
        }
        if ($request->hasFile('file_siinas')) {
            $validated['file_siinas'] = '/storage/pendaftaran-banmod/siinas/' . $request->file('file_siinas')->hashName();
            $request->file('file_siinas')->storeAs('/pendaftaran-banmod/siinas', $request->file('file_siinas')->hashName(), 'public');
        }
        if ($request->hasFile('file_bp')) {
            $validated['file_bp'] = '/storage/pendaftaran-banmod/bp/' . $request->file('file_bp')->hashName();
            $request->file('file_bp')->storeAs('/pendaftaran-banmod/bp', $request->file('file_bp')->hashName(), 'public');
        }
        if ($request->hasFile('file_sertifikat_pelatihan')) {
            $validated['file_sertifikat_pelatihan'] = '/storage/pendaftaran-banmod/pelatihan/' . $request->file('file_sertifikat_pelatihan')->hashName();
            $request->file('file_sertifikat_pelatihan')->storeAs('/pendaftaran-banmod/pelatihan', $request->file('file_sertifikat_pelatihan')->hashName(), 'public');
        }
        // dd($validated);
        $storedPendaftaran = PendaftaranBanmod::create($validated);

        return to_route('banmod.success')->with('success', 'Pendaftaran Berhasil.');
    }

    public function success()
    {
        return Inertia::render('Banmod/Success', [
            'meta' => [
                'title' => 'Pendaftaran Banmod',
            ],
        ]);
    }
}
