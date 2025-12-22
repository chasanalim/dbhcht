<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\JsonResponse;
use App\Models\PelatihanUmkm;
use App\Models\PelatihanBanmod;
use App\Models\PelatihanKerjas;
use App\Models\PelatihanEkonomiKreatif;
use App\Models\PelatihanPetani;
use App\Http\Controllers\Controller;

class PelatihanLolosController extends Controller
{
    /**
     * Get all training recipients with status = 1 (lolos)
     * Combines data from all training types
     */
    public function index(): JsonResponse
    {
        try {
            return response()->json([
                'success' => true,
                'message' => 'Data penerima pelatihan dengan status lolos',
                'data' => [
                    'pelatihan_umkm' => $this->getPelatihanUmkmLolos(),
                    'pelatihan_banmod' => $this->getPelatihanBanmodLolos(),
                    'pelatihan_kerja' => $this->getPelatihanKerjaLolos(),
                    'pelatihan_ekonomi_kreatif' => $this->getPelatihanEkonomiKreatifLolos(),
                    'pelatihan_petani' => $this->getPelatihanPetaniLolos(),
                ],
                'summary' => [
                    'total_umkm' => PelatihanUmkm::where('status', 1)->count(),
                    'total_banmod' => PelatihanBanmod::where('status', 1)->count(),
                    'total_kerja' => PelatihanKerjas::where('status', 1)->count(),
                    'total_ekonomi_kreatif' => PelatihanEkonomiKreatif::where('status', 1)->count(),
                    'total_petani' => PelatihanPetani::where('status', 1)->count(),
                ],
                'timestamp' => now(),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get UMKM training recipients with status = 1
     */
    public function getPelatihanUmkmLolos()
    {
        return PelatihanUmkm::where('status', 1)
            ->select([
                'id',
                'nik',
                'no_kk',
                'nama_lengkap',
                'tempat_lahir',
                'tgl_lahir',
                'jenis_kelamin',
                'no_hp',
                'jalan',
                'kecamatan',
                'kelurahan',
                'nama_usaha',
                'bidang_usaha',
                'modal',
                'omset',
                'status',
                'created_at',
                'updated_at',
            ])
            ->get()
            ->map(function ($item) {
                $item['jenis_pelatihan'] = 'UMKM';
                return $item;
            });
    }

    /**
     * Get Banmod training recipients with status = 1
     */
    public function getPelatihanBanmodLolos()
    {
        return PelatihanBanmod::where('status', 1)
            ->select([
                'id',
                'tahun_penerimaan',
                'nik',
                'nama_lengkap',
                'no_kk',
                'kecamatan_ktp',
                'kelurahan_ktp',
                'jalan_ktp',
                'no_hp',
                'jenis_pelatihan_industri',
                'perkembangan_omzet',
                'perkembangan_tenaga_kerja',
                'status',
                'created_at',
                'updated_at',
            ])
            ->get()
            ->map(function ($item) {
                $item['jenis_pelatihan'] = 'Penerima Bantuan Modal';
                return $item;
            });
    }

    /**
     * Get Job Seeker training recipients with status = 1
     */
    public function getPelatihanKerjaLolos()
    {
        return PelatihanKerjas::where('status', 1)
            ->select([
                'id',
                'nik',
                'no_kk',
                'nama_lengkap',
                'tmp_lhr',
                'tgl_lhr',
                'jenis_kelamin',
                'alamat',
                'nama_kecamatan',
                'nama_kelurahan',
                'no_hp' => 'phone_number',
                'pendidikan',
                'jenis_pelatihan',
                'status',
                'created_at',
                'updated_at',
            ])
            ->get()
            ->map(function ($item) {
                $item['jenis_pelatihan'] = 'Pencari Kerja';
                return $item;
            });
    }

    /**
     * Get Creative Economy training recipients with status = 1 (lolos)
     */
    public function getPelatihanEkonomiKreatifLolos()
    {
        return PelatihanEkonomiKreatif::where('status', 1)
            ->select([
                'id',
                'kategori_pendaftar',
                'nik',
                'no_kk',
                'nama_lengkap',
                'tanggal_lahir',
                'no_hp',
                'alamat_ktp',
                'kelurahan_ktp',
                'kecamatan_ktp',
                'alamat_domisili',
                'kelurahan_domisili',
                'kecamatan_domisili',
                'jenis_pelatihan',
                'alasan',
                'status',
                'created_at',
                'updated_at',
            ])
            ->get()
            ->map(function ($item) {
                $item['jenis_pelatihan'] = 'Ekonomi Kreatif';
                return $item;
            });
    }

    /**
     * Get Farmer training recipients with status = 1
     */
    public function getPelatihanPetaniLolos()
    {
        return PelatihanPetani::where('status', 1)
            ->select([
                'id',
                'nik',
                'kk',
                'jenis_kelamin',
                'nama_lengkap',
                'no_hp',
                'nama_kecamatan',
                'nama_kelurahan',
                'nama_rw',
                'nama_rt',
                'alamat',
                'tgl_lhr',
                'pendidikan',
                'id_kelompok',
                'tahun_berdiri',
                'bidang_usaha_kelompok',
                'kategori',
                'jenis_pelatihan_petani',
                'alasan',
                'status',
                'created_at',
                'updated_at',
            ])
            ->get()
            ->map(function ($item) {
                $item['jenis_pelatihan'] = 'Petani';
                return $item;
            });
    }

    /**
     * Get specific training type recipients with status = 1
     * @param string $type - Type of training (umkm, banmod, kerja, ekraf, petani)
     */
    public function getByType(string $type): JsonResponse
    {
        try {
            $data = match (strtolower($type)) {
                'umkm' => $this->getPelatihanUmkmLolos(),
                'banmod' => $this->getPelatihanBanmodLolos(),
                'kerja' => $this->getPelatihanKerjaLolos(),
                'ekraf' => $this->getPelatihanEkonomiKreatifLolos(),
                'petani' => $this->getPelatihanPetaniLolos(),
                default => []
            };

            return response()->json([
                'success' => true,
                'message' => "Data penerima pelatihan {$type} dengan status lolos",
                'type' => $type,
                'total' => count($data),
                'data' => $data,
                'timestamp' => now(),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error: ' . $e->getMessage(),
            ], 500);
        }
    }
}
