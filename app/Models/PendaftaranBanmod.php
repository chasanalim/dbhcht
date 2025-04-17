<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PendaftaranBanmod extends Model
{
    protected $fillable = [
        "nik",
        "kk",
        "name",
        "tmp_lhr",
        "tgl_lhr",
        "alamat",
        "jenis_kelamin",
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
    public function kategoriUsaha(): BelongsTo
    {
        return $this->belongsTo(KategoriBanmod::class, 'kategori');
    }
    public function klasterUsaha(): BelongsTo
    {
        return $this->belongsTo(KlasterUsaha::class, 'klaster_usaha');
    }
    public function tanggunganKeluarga(): BelongsTo
    {
        return $this->belongsTo(TanggunganKeluarga::class, 'tanggungan_keluarga');
    }
    public function lamaUsaha(): BelongsTo
    {
        return $this->belongsTo(LamaUsaha::class, 'lama_usaha');
    }
    public function statusTempatTinggal(): BelongsTo
    {
        return $this->belongsTo(StatusTempatTinggal::class, 'status_tempat_tinggal');
    }
    public function jumlahTenagaKerja(): BelongsTo
    {
        return $this->belongsTo(JumlahTenagaKerja::class, 'jumlah_tenaga');
    }
    public function jumlahLegalitas(): BelongsTo
    {
        return $this->belongsTo(JumlahLegalitas::class, 'jumlah_legalitas');
    }
    public function jumlahTeknologiDigital(): BelongsTo
    {
        return $this->belongsTo(JumlahTeknologiDigital::class, 'jumlah_teknologi');
    }
    public function penyerapanTenagaMiskin(): BelongsTo
    {
        return $this->belongsTo(PenyerapanTenagaMiskin::class, 'jumlah_penyerapan_naker');
    }
    public function brutoPerbulan(): BelongsTo
    {
        return $this->belongsTo(Bruto::class, 'bruto');
    }
}
