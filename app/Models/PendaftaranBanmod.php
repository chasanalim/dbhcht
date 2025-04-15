<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PendaftaranBanmod extends Model
{
    protected $fillable = [
        "nik",
        "kk",
        "name",
        "tmp_lhr",
        "tgl_lhr",
        "alamat",
        "kode_kecamatan",
        "nama_kecamatan",
        "kode_kelurahan",
        "nama_kelurahan",
        "kode_rw",
        "nama_rw",
        "kode_rt",
        "nama_rt",
        "isDomisili",
        "alamat_domisili",
        "isUsaha",
        "alamat_usaha",
        "phone_number",
        "daya_listrik",
        "isDisabilitas",
        "disabilitas",
        "kategori",
        "jenis_kategori",
        "klaster_usaha",
        "tanggungan_keluarga",
        "lama_usaha",
        "jumlah_tenaga",
        "bruto",
        "status_tempat_tinggal",
        "aset",
        "hutang",
        "jumlah_legalitas",
        "jumlah_teknologi",
        "jumlah_penyerapan_naker",
        "file_foto",
        "file_ktp",
        "file_kk",
        "file_nib",
        "file_sku",
        "file_skd",
        "file_produk",
        "file_pernyataan",
        "file_perizinan",
        "file_siinas",
        "file_bp",
        "file_sertifikat_pelatihan",
    ];

    protected function casts(): array
    {
        return [
            'file_perizinan' => 'array',
            'disabilitas' => 'array',
        ];
    }
}
