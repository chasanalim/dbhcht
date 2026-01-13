<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Models\PelatihanUmkm;
use App\Models\PelatihanBanmod;
use App\Models\PelatihanKerjas;
use App\Models\PelatihanEkonomiKreatif;
use App\Models\PelatihanPetani;
use App\Http\Controllers\Controller;

class PelatihanLolosController extends Controller
{
    private $perPage = 10;

    /**
     * Get all training recipients with status = 1 (lolos)
     * Combines data from all training types with pagination
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $page = $request->query('page', 1);
            return response()->json([
                'success' => true,
                'message' => 'Data penerima pelatihan dengan status lolos',
                'data' => [
                    'pelatihan_umkm' => $this->getPelatihanUmkmLolos($page),
                    'pelatihan_banmod' => $this->getPelatihanBanmodLolos($page),
                    'pelatihan_kerja' => $this->getPelatihanKerjaLolos($page),
                    'pelatihan_ekonomi_kreatif' => $this->getPelatihanEkonomiKreatifLolos($page),
                    'pelatihan_petani' => $this->getPelatihanPetaniLolos($page),
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
    public function getPelatihanUmkmLolos($page = 1)
    {
        $query = PelatihanUmkm::where('status', 1)
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
            ]);

        $total = $query->count();
        $data = $query->paginate($this->perPage, ['*'], 'page', $page);

        return [
            'total' => $total,
            'pagination' => [
                'current_page' => $data->currentPage(),
                'per_page' => $data->perPage(),
                'total' => $total,
                'last_page' => $data->lastPage(),
                'from' => $data->firstItem(),
                'to' => $data->lastItem(),
            ],
            'data' => $data->items()
        ];
    }

    /**
     * Get Banmod training recipients with status = 1
     */
    public function getPelatihanBanmodLolos($page = 1)
    {
        $query = PelatihanBanmod::where('status', 1)
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
            ]);

        $total = $query->count();
        $data = $query->paginate($this->perPage, ['*'], 'page', $page);

        return [
            'total' => $total,
            'pagination' => [
                'current_page' => $data->currentPage(),
                'per_page' => $data->perPage(),
                'total' => $total,
                'last_page' => $data->lastPage(),
                'from' => $data->firstItem(),
                'to' => $data->lastItem(),
            ],
            'data' => $data->items(),
        ];
    }

    /**
     * Get Job Seeker training recipients with status = 1
     */
    public function getPelatihanKerjaLolos($page = 1)
    {
        $query = PelatihanKerjas::where('status', 1)
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
                'phone_number',
                'pendidikan',
                'jenis_pelatihan',
                'status',
                'created_at',
                'updated_at',
            ]);

        $total = $query->count();
        $data = $query->paginate($this->perPage, ['*'], 'page', $page);

        return [
            'total' => $total,
            'pagination' => [
                'current_page' => $data->currentPage(),
                'per_page' => $data->perPage(),
                'total' => $total,
                'last_page' => $data->lastPage(),
                'from' => $data->firstItem(),
                'to' => $data->lastItem(),
            ],
            'data' => $data->items()
        ];
    }

    /**
     * Get Creative Economy training recipients with status = 1 (lolos)
     */
    public function getPelatihanEkonomiKreatifLolos($page = 1)
    {
        $query = PelatihanEkonomiKreatif::where('status', 1)
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
            ]);

        $total = $query->count();
        $data = $query->paginate($this->perPage, ['*'], 'page', $page);

        return [

            'total' => $total,
            'pagination' => [
                'current_page' => $data->currentPage(),
                'per_page' => $data->perPage(),
                'total' => $total,
                'last_page' => $data->lastPage(),
                'from' => $data->firstItem(),
                'to' => $data->lastItem(),
            ],
            'data' => $data->items(),
        ];
    }

    /**
     * Get Farmer training recipients with status = 1
     */
    public function getPelatihanPetaniLolos($page = 1)
    {
        $query = PelatihanPetani::where('status', 1)
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
            ]);

        $total = $query->count();
        $data = $query->paginate($this->perPage, ['*'], 'page', $page);

        return [
            
            'total' => $total,
            'pagination' => [
                'current_page' => $data->currentPage(),
                'per_page' => $data->perPage(),
                'total' => $total,
                'last_page' => $data->lastPage(),
                'from' => $data->firstItem(),
                'to' => $data->lastItem(),
            ],
            'data' => $data->items(),
        ];
    }

    /**
     * Get specific training type recipients with status = 1
     * @param string $type - Type of training (umkm, banmod, kerja, ekraf, petani)
     * @param Request $request - HTTP request with page parameter
     */
    public function getByType(string $type, Request $request): JsonResponse
    {
        try {
            $page = $request->query('page', 1);
            $data = match (strtolower($type)) {
                'umkm' => $this->getPelatihanUmkmLolos($page),
                'banmod' => $this->getPelatihanBanmodLolos($page),
                'kerja' => $this->getPelatihanKerjaLolos($page),
                'ekraf' => $this->getPelatihanEkonomiKreatifLolos($page),
                'petani' => $this->getPelatihanPetaniLolos($page),
                default => null
            };

            if ($data === null) {
                return response()->json([
                    'success' => false,
                    'message' => "Tipe pelatihan '{$type}' tidak ditemukan. Gunakan: umkm, banmod, kerja, ekraf, atau petani",
                ], 404);
            }

            return response()->json([
                'success' => true,
                'message' => "Data penerima pelatihan {$type} dengan status lolos",
                'type' => $type,
                'total' => $data['total'],
                'pagination' => $data['pagination'],
                'data' => $data['data'],
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
