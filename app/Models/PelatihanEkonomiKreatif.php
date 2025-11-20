<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Traits\HasVerifikasiDokumen;
use App\Models\SkorPelatihanEkonomiKreatif;

class PelatihanEkonomiKreatif extends Model
{
    use HasFactory, HasVerifikasiDokumen;

    protected $table = 'pelatihan_ekonomi_kreatif';

    protected $fillable = [
        // Kategori
        'kategori_pendaftar',

        // Data Dasar
        'nik',
        'no_kk',
        'nama_lengkap',
        'tanggal_lahir',
        'no_hp',

        // Alamat KTP
        'alamat_ktp',
        'rt_ktp',
        'rw_ktp',
        'kelurahan_ktp',
        'kecamatan_ktp',
        'kode_kelurahan_ktp',
        'kode_kecamatan_ktp',

        // Alamat Domisili
        'alamat_domisili',
        'rt_domisili',
        'rw_domisili',
        'kelurahan_domisili',
        'kecamatan_domisili',
        'kode_kelurahan_domisili',
        'kode_kecamatan_domisili',

        // Pelatihan
        'jenis_pelatihan',
        'alasan',

        // Files Wajib
        'file_ktp',
        'file_kk',
        'file_pasfoto',
        'file_surat_pernyataan',
        'file_nib',
        'file_surat_pekerja_ekraf',

        // Files Khusus
        'file_surat_pemilik_lahan',
        'file_id_card_iht',
        'file_surat_phk',
        'file_surat_disabilitas',
        'file_surat_kb',

        // Status
        'komitmen',
        'status',
        'created_by',
        'updated_by',
    ];

    protected $casts = [
        'komitmen' => 'boolean',
        'usia' => 'integer',
        'status' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    const KUOTA_PELATIHAN = [
        'fotografi' => 25,
        'videografi' => 25,
    ];

    public static function getAvailableQuota($jenis_pelatihan)
    {
        $totalKuota = self::KUOTA_PELATIHAN[$jenis_pelatihan] ?? 0;
        $terpakai = self::where('jenis_pelatihan', $jenis_pelatihan)
            ->where('status', self::STATUS_LOLOS) // Hanya yang diterima
            ->count();

        return [
            'total_kuota' => $totalKuota,
            'terpakai' => $terpakai,
            'sisa' => $totalKuota - $terpakai,
            'penuh' => ($totalKuota - $terpakai) <= 0
        ];
    }

    public static function getAllQuotaInfo()
    {
        $result = [];
        foreach (self::KUOTA_PELATIHAN as $jenis => $kuota) {
            $result[$jenis] = self::getAvailableQuota($jenis);
        }
        return $result;
    }

    public static function isQuotaAvailable($jenis_pelatihan)
    {
        $quota = self::getAvailableQuota($jenis_pelatihan);
        return !$quota['penuh'];
    }

    /**
     * Konstanta untuk kategori pendaftar
     */
    const KATEGORI_UMUM = 'umum';
    const KATEGORI_BURUH_TANI = 'buruh_tani_tembakau';
    const KATEGORI_BURUH_PABRIK = 'buruh_pabrik_rokok';
    const KATEGORI_BURUH_PHK = 'buruh_phk';
    const KATEGORI_DISABILITAS = 'disabilitas';
    const KATEGORI_PEREMPUAN_KK = 'perempuan_kk';

    /**
     * Konstanta untuk status
     */
    const STATUS_MENUNGGU = 0;
    const STATUS_LOLOS = 1;
    const STATUS_GAGAL = 2;
    const STATUS_BLACKLIST = 3;

    /**
     * Get daftar kategori pendaftar
     */
    public static function getKategoriPendaftar()
    {
        return [
            self::KATEGORI_UMUM => 'Umum',
            self::KATEGORI_BURUH_TANI => 'Buruh Tani Tembakau',
            self::KATEGORI_BURUH_PABRIK => 'Buruh Pabrik Rokok',
            self::KATEGORI_BURUH_PHK => 'Buruh yang Terkena PHK',
            self::KATEGORI_DISABILITAS => 'Disabilitas',
            self::KATEGORI_PEREMPUAN_KK => 'Perempuan Kepala Keluarga',
        ];
    }

    /**
     * Get daftar status
     */
    public static function getStatusList()
    {
        return [
            self::STATUS_MENUNGGU => 'Menunggu Verifikasi',
            self::STATUS_LOLOS => 'Lolos Seleksi',
            self::STATUS_GAGAL => 'Tidak Lolos',
            self::STATUS_BLACKLIST => 'Blacklist',
        ];
    }

    /**
     * Get required files berdasarkan kategori pendaftar
     */
    public function getRequiredFiles()
    {
        $baseFiles = [
            'file_ktp' => 'Foto KTP',
            'file_kk' => 'Foto KK',
            'file_pasfoto' => 'Pas Foto',
            'file_surat_pernyataan' => 'Surat Pernyataan',
            'file_nib' => 'NIB',
            'file_surat_pekerja_ekraf' => 'Surat Keterangan Pekerja Ekraf',
        ];

        $additionalFiles = [];

        switch ($this->kategori_pendaftar) {
            case self::KATEGORI_BURUH_TANI:
                $additionalFiles['file_surat_pemilik_lahan'] = 'Surat Keterangan dari Pemilik Lahan';
                break;
            case self::KATEGORI_BURUH_PABRIK:
                $additionalFiles['file_id_card_iht'] = 'ID Card / Surat Keterangan dari IHT';
                break;
            case self::KATEGORI_BURUH_PHK:
                $additionalFiles['file_surat_phk'] = 'Surat Pemberhentian Kerja';
                break;
            case self::KATEGORI_DISABILITAS:
                $additionalFiles['file_surat_disabilitas'] = 'Surat Keterangan Disabilitas dari Kelurahan';
                break;
            case self::KATEGORI_PEREMPUAN_KK:
                $additionalFiles['file_surat_kb'] = 'Surat Keterangan dari Dinas KB';
                break;
        }

        return array_merge($baseFiles, $additionalFiles);
    }

    /**
     * Scope untuk filter berdasarkan kategori
     */
    public function scopeByKategori($query, $kategori)
    {
        return $query->where('kategori_pendaftar', $kategori);
    }

    /**
     * Scope untuk filter berdasarkan status
     */
    public function scopeByStatus($query, $status)
    {
        return $query->where('status', $status);
    }

    /**
     * Accessor untuk status text
     */
    public function getStatusTextAttribute()
    {
        return self::getStatusList()[$this->status] ?? 'Unknown';
    }

    /**
     * Accessor untuk kategori text
     */
    public function getKategoriTextAttribute()
    {
        return self::getKategoriPendaftar()[$this->kategori_pendaftar] ?? 'Unknown';
    }

    // Tambah appends:
    protected $appends = [
        'skor',
    ];

    // Tambah method skor:
    public function getSkorAttribute()
    {
        return $this->alasanPelatihan->skor ?? 0;
    }

    // Tambah relasi:
    public function alasanPelatihan()
    {
        return $this->belongsTo(SkorPelatihanEkonomiKreatif::class, 'alasan', 'id');
    }
}
