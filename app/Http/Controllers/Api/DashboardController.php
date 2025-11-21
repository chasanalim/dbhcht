<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\JsonResponse;
use App\Models\PelatihanUmkm;
use App\Models\PelatihanBanmod;
use App\Models\PelatihanKerjas;
use App\Models\PelatihanPetani;
use App\Models\PendaftaranBanmod;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;

class DashboardController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json([
            // 'banmod' => [
            //     'summary' => $this->getBanmodSummary(),
                // 'byKategori' => $this->getBanmodByKategori(),
                // 'byKecamatan' => $this->getBanmodByKecamatan(),
                // 'byJenisUsaha' => $this->getBanmodByJenisUsaha(),
                // 'byVerifikasiDokumen' => $this->getBanmodByVerifikasi(),
                // 'byKelurahan' => $this->getBanmodByKelurahan()
            // ],
            'umkm' => [
                'summary' => $this->getUmkmSummary(),
                // 'byKecamatan' => $this->getUmkmByKecamatan(),
                // 'byPrioritas1' => $this->getUmkmByPrioritas1(),
                // 'byPrioritas2' => $this->getUmkmByPrioritas2(),
                // 'byPrioritas3' => $this->getUmkmByPrioritas3(),
                // 'byVerifikasiDokumen' => $this->getUmkmByVerifikasi(),
                // 'byKelurahan' => $this->getUmkmByKelurahan()
            ],
            'kerja' => [
                'summary' => $this->getKerjaSummary(),
                // 'byKecamatan' => $this->getKerjaByKecamatan(),
                // 'byPendidikan' => $this->getKerjaByPendidikan(),
                // 'byJenisPelatihan' => $this->getKerjaByJenisPelatihan(),
                // 'byVerifikasiDokumen' => $this->getKerjaByVerifikasi(),
                // 'byKelurahan' => $this->getKerjaByKelurahan()
            ],
            'pelatihan_banmod' => [
                'summary' => $this->getPelatihanBanmodSummary(),
                // 'byKecamatan' => $this->getPelatihanBanmodByKecamatan(),
                // 'byJenisPelatihan' => $this->getPelatihanBanmodByJenisPelatihan(),
                // 'byVerifikasiDokumen' => $this->getPelatihanBanmodByVerifikasi(),
                // 'byKelurahan' => $this->getPelatihanBanmodByKelurahan(),
                // 'byTahunPenerimaan' => $this->getPelatihanBanmodByTahunPenerimaan()
            ],
            'pertanian' => [
                'summary' => $this->getPertanianSummary(),
                // 'byKecamatan' => $this->getPertanianByKecamatan(),
                // 'byJenisPelatihan' => $this->getPertanianByJenisPelatihan(),
                // 'byVerifikasiDokumen' => $this->getPertanianByVerifikasi(),
                // 'byKelurahan' => $this->getPertanianByKelurahan()
            ],
        ]);
    }

    private function getBanmodSummary()
    {
        $result = DB::table('pendaftaran_banmods as pb')
            ->select(DB::raw('
            count(*) as total_pendaftar,
            SUM(CASE
                WHEN vd.total_docs =
                    CASE
                        WHEN pb.kategori IN (1,2,3) THEN 8
                        WHEN pb.kategori = 4 THEN 11
                        WHEN pb.kategori = 5 THEN 9
                        ELSE 12
                    END
                AND vd.verified_docs =
                    CASE
                        WHEN pb.kategori IN (1,2,3) THEN 8
                        WHEN pb.kategori = 4 THEN 11
                        WHEN pb.kategori = 5 THEN 9
                        ELSE 12
                    END
                THEN 1 ELSE 0
            END) as total_pendaftar_lulus,
            SUM(CASE
                WHEN vd.total_docs =
                    CASE
                        WHEN pb.kategori IN (1,2,3) THEN 8
                        WHEN pb.kategori = 4 THEN 11
                        WHEN pb.kategori = 5 THEN 9
                        ELSE 12
                    END
                AND vd.verified_docs <
                    CASE
                        WHEN pb.kategori IN (1,2,3) THEN 8
                        WHEN pb.kategori = 4 THEN 11
                        WHEN pb.kategori = 5 THEN 9
                        ELSE 12
                    END
                THEN 1 ELSE 0
            END) as total_pendaftar_tidak_lulus,
            SUM(CASE
                WHEN vd.total_docs IS NULL THEN 1 ELSE 0
            END) as total_pendaftar_belum_verifikasi
        '))
            ->leftJoin(DB::raw('(
            SELECT
                pelatihan_id,
                COUNT(*) as total_docs,
                SUM(CASE WHEN status = 1 THEN 1 ELSE 0 END) as verified_docs
            FROM verifikasi_dokumen
            WHERE pelatihan_type = ?
            GROUP BY pelatihan_id
        ) as vd'), 'pb.id', '=', 'vd.pelatihan_id')
            ->setBindings([PendaftaranBanmod::class])
            ->first();

        return [
            'total_pendaftar' => $result->total_pendaftar,
            'total_pendaftar_lulus' => $result->total_pendaftar_lulus,
            'total_pendaftar_tidak_lulus' => $result->total_pendaftar_tidak_lulus,
            'total_pendaftar_belum_verifikasi' => $result->total_pendaftar_belum_verifikasi
        ];
    }

    private function getBanmodByKategori()
    {
        return PendaftaranBanmod::select('kategori', DB::raw('count(*) as total'))
            ->groupBy('kategori')
            ->get()
            ->map(function ($item) {
                return [
                    'name' => PendaftaranBanmod::getKategoriName($item->kategori),
                    'y' => $item->total
                ];
            });
    }

    private function getBanmodByKecamatan()
    {
        return PendaftaranBanmod::select(
            'nama_kecamatan',
            DB::raw('count(*) as total'),
        )
            ->whereNotNull('nama_kecamatan') // Tambahkan filter
            ->groupBy('nama_kecamatan')
            ->orderBy('total', 'desc') // Tambahkan ordering
            ->get()
            ->map(function ($item) {
                return [
                    'name' => $item->nama_kecamatan,
                    'pendaftar' => $item->total,
                ];
            });
    }

    private function getBanmodByJenisUsaha()
    {
        return PendaftaranBanmod::with('klasterUsaha')
            ->select('klaster_usaha', DB::raw('count(*) as total'))
            ->groupBy('klaster_usaha')
            ->orderBy('total', 'desc')
            ->limit(12)
            ->get()
            ->map(function ($item) {
                return [
                    'name' => $item->klasterUsaha->nama ?? 'Tidak ada',
                    'y' => $item->total
                ];
            });
    }

    private function getBanmodByVerifikasi()
    {
        $result = DB::table('pendaftaran_banmods as pb')
            ->select(DB::raw('
            CASE
                WHEN vd.total_docs =
                    CASE
                        WHEN pb.kategori IN (1,2,3) THEN 8
                        WHEN pb.kategori = 4 THEN 11
                        WHEN pb.kategori = 5 THEN 9
                        ELSE 12
                    END
                    AND vd.verified_docs =
                    CASE
                        WHEN pb.kategori IN (1,2,3) THEN 8
                        WHEN pb.kategori = 4 THEN 11
                        WHEN pb.kategori = 5 THEN 9
                        ELSE 12
                    END
                THEN "Terverifikasi"
                WHEN vd.total_docs =
                    CASE
                        WHEN pb.kategori IN (1,2,3) THEN 8
                        WHEN pb.kategori = 4 THEN 11
                        WHEN pb.kategori = 5 THEN 9
                        ELSE 12
                    END
                    AND vd.verified_docs <
                    CASE
                        WHEN pb.kategori IN (1,2,3) THEN 8
                        WHEN pb.kategori = 4 THEN 11
                        WHEN pb.kategori = 5 THEN 9
                        ELSE 12
                    END
                THEN "Ditolak"
                WHEN vd.total_docs IS NULL THEN "Belum Diverifikasi"
                ELSE "Belum Lengkap"
            END as status,
            COUNT(*) as total
        '))
            ->leftJoin(DB::raw('(
            SELECT
                pelatihan_id,
                COUNT(*) as total_docs,
                SUM(CASE WHEN status = 1 THEN 1 ELSE 0 END) as verified_docs
            FROM verifikasi_dokumen
            WHERE pelatihan_type = ?
            GROUP BY pelatihan_id
        ) as vd'), 'pb.id', '=', 'vd.pelatihan_id')
            ->setBindings([PendaftaranBanmod::class])
            ->groupBy('status')
            ->get();

        // Jika tidak ada data, berikan default values
        if ($result->isEmpty()) {
            return [
                ['name' => 'Belum Diverifikasi', 'y' => 0],
                ['name' => 'Belum Lengkap', 'y' => 0],
                ['name' => 'Ditolak', 'y' => 0],
                ['name' => 'Terverifikasi', 'y' => 0]
            ];
        }

        return $result->map(fn($item) => [
            'name' => $item->status,
            'y' => $item->total
        ]);
    }

    private function getBanmodByKelurahan()
    {
        return PendaftaranBanmod::select(
            'nama_kecamatan',
            'nama_kelurahan',
            DB::raw('count(*) as total')
        )
            ->whereNotNull('nama_kecamatan')
            ->whereNotNull('nama_kelurahan')
            ->groupBy('nama_kecamatan', 'nama_kelurahan')
            ->orderBy('nama_kecamatan')
            ->orderBy('total', 'desc')
            ->get()
            ->groupBy('nama_kecamatan')
            ->map(function ($kelurahan) {
                return [
                    'name' => $kelurahan->first()->nama_kecamatan,
                    'kelurahan' => $kelurahan->map(fn($item) => [
                        'name' => $item->nama_kelurahan,
                        'total' => $item->total
                    ])->values()
                ];
            })
            ->values();
    }
    // UMKM Methods
    private function getUmkmSummary()
    {
        $requiredDocs = count(PelatihanUmkm::getDocumentTypes());

        $result = DB::table('pelatihan_umkm as pu')
            ->select(DB::raw('
            count(*) as total_pendaftar,
            SUM(CASE
                WHEN vd.total_docs = ' . $requiredDocs . '
                AND vd.verified_docs = ' . $requiredDocs . '
                THEN 1 ELSE 0
            END) as total_pendaftar_lulus,
            SUM(CASE
                WHEN vd.total_docs = ' . $requiredDocs . '
                AND vd.verified_docs < ' . $requiredDocs . '
                THEN 1 ELSE 0
            END) as total_pendaftar_tidak_lulus,
            SUM(CASE
                WHEN vd.total_docs IS NULL THEN 1 ELSE 0
            END) as total_pendaftar_belum_verifikasi
        '))
            ->leftJoin(DB::raw('(
            SELECT
                pelatihan_id,
                COUNT(*) as total_docs,
                SUM(CASE WHEN status = 1 THEN 1 ELSE 0 END) as verified_docs
            FROM verifikasi_dokumen
            WHERE pelatihan_type = ?
            GROUP BY pelatihan_id
        ) as vd'), 'pu.id', '=', 'vd.pelatihan_id')
            ->setBindings([PelatihanUmkm::class])
            ->first();

        return [
            'total_pendaftar' => $result->total_pendaftar,
            'total_pendaftar_lulus' => $result->total_pendaftar_lulus,
            'total_pendaftar_tidak_lulus' => $result->total_pendaftar_tidak_lulus,
            'total_pendaftar_belum_verifikasi' => $result->total_pendaftar_belum_verifikasi
        ];
    }

    private function getUmkmByKecamatan()
    {
        return PelatihanUmkm::select('kecamatan', DB::raw('count(*) as total'))
            ->whereNotNull('kecamatan')
            ->groupBy('kecamatan')
            ->orderBy('total', 'desc')
            ->get()
            ->map(fn($item) => [
                'name' => $item->kecamatan,
                'y' => $item->total
            ]);
    }

    private function getUmkmByPrioritas1()
    {
        return PelatihanUmkm::select('prioritas_1 as pelatihan', DB::raw('count(*) as total'))
            ->groupBy('prioritas_1')
            ->get()
            ->map(fn($item) => [
                'name' => $item->pelatihan,
                'y' => $item->total
            ]);
    }

    private function getUmkmByPrioritas2()
    {
        return PelatihanUmkm::select('prioritas_2 as pelatihan', DB::raw('count(*) as total'))
            ->groupBy('prioritas_2')
            ->get()
            ->map(fn($item) => [
                'name' => $item->pelatihan,
                'y' => $item->total
            ]);
    }

    private function getUmkmByPrioritas3()
    {
        return PelatihanUmkm::select('prioritas_3 as pelatihan', DB::raw('count(*) as total'))
            ->groupBy('prioritas_3')
            ->get()
            ->map(fn($item) => [
                'name' => $item->pelatihan,
                'y' => $item->total
            ]);
    }

    private function getUmkmByVerifikasi()
    {
        return $this->getVerifikasiData(PelatihanUmkm::class);
    }

    private function getUmkmByKelurahan()
    {
        return PelatihanUmkm::select(
            'kecamatan',
            'kelurahan',
            DB::raw('count(*) as total')
        )
            ->whereNotNull('kecamatan')
            ->whereNotNull('kelurahan')
            ->groupBy('kecamatan', 'kelurahan')
            ->orderBy('kecamatan')
            ->orderBy('total', 'desc')
            ->get()
            ->groupBy('kecamatan')
            ->map(function ($kelurahan) {
                return [
                    'name' => $kelurahan->first()->kecamatan,
                    'kelurahan' => $kelurahan->map(fn($item) => [
                        'name' => $item->kelurahan,
                        'total' => $item->total
                    ])->values()
                ];
            })
            ->values();
    }

    // Kerja Methods
    private function getKerjaSummary()
    {
        $requiredDocs = count(PelatihanKerjas::getDocumentTypes());

        $result = DB::table('pelatihan_kerjas as pk')
            ->select(DB::raw('
            count(*) as total_pendaftar,
            SUM(CASE
                WHEN vd.total_docs = ' . $requiredDocs . '
                AND vd.verified_docs = ' . $requiredDocs . '
                THEN 1 ELSE 0
            END) as total_pendaftar_lulus,
            SUM(CASE
                WHEN vd.total_docs = ' . $requiredDocs . '
                AND vd.verified_docs < ' . $requiredDocs . '
                THEN 1 ELSE 0
            END) as total_pendaftar_tidak_lulus,
            SUM(CASE
                WHEN vd.total_docs IS NULL THEN 1 ELSE 0
            END) as total_pendaftar_belum_verifikasi
        '))
            ->leftJoin(DB::raw('(
            SELECT
                pelatihan_id,
                COUNT(*) as total_docs,
                SUM(CASE WHEN status = 1 THEN 1 ELSE 0 END) as verified_docs
            FROM verifikasi_dokumen
            WHERE pelatihan_type = ?
            GROUP BY pelatihan_id
        ) as vd'), 'pk.id', '=', 'vd.pelatihan_id')
            ->setBindings([PelatihanKerjas::class])
            ->first();

        return [
            'total_pendaftar' => $result->total_pendaftar,
            'total_pendaftar_lulus' => $result->total_pendaftar_lulus,
            'total_pendaftar_tidak_lulus' => $result->total_pendaftar_tidak_lulus,
            'total_pendaftar_belum_verifikasi' => $result->total_pendaftar_belum_verifikasi
        ];
    }

    private function getKerjaByKecamatan()
    {
        return PelatihanKerjas::select('nama_kecamatan', DB::raw('count(*) as total'))
            ->groupBy('nama_kecamatan')
            ->get()
            ->map(fn($item) => [
                'name' => $item->nama_kecamatan,
                'y' => $item->total
            ]);
    }

    private function getKerjaByPendidikan()
    {
        return PelatihanKerjas::with('refPendidikan')
            ->select('pendidikan', DB::raw('count(*) as total'))
            ->groupBy('pendidikan')
            ->get()
            ->map(fn($item) => [
                'name' => $item->refPendidikan->nama ?? 'Tidak ada',
                'y' => $item->total
            ]);
    }

    private function getKerjaByJenisPelatihan()
    {
        return PelatihanKerjas::with('jenisPelatihan')
            ->select('jenis_pelatihan', DB::raw('count(*) as total'))
            ->groupBy('jenis_pelatihan')
            ->get()
            ->map(fn($item) => [
                'name' => $item->jenisPelatihan->nama ?? 'Tidak ada',
                'y' => $item->total
            ]);
    }

    private function getKerjaByVerifikasi()
    {
        return $this->getVerifikasiData(PelatihanKerjas::class);
    }
    private function getKerjaByKelurahan()
    {
        return PelatihanKerjas::select(
            'nama_kecamatan',
            'nama_kelurahan',
            DB::raw('count(*) as total')
        )
            ->whereNotNull('nama_kecamatan')
            ->whereNotNull('nama_kelurahan')
            ->groupBy('nama_kecamatan', 'nama_kelurahan')
            ->orderBy('nama_kecamatan')
            ->orderBy('total', 'desc')
            ->get()
            ->groupBy('nama_kecamatan')
            ->map(function ($kelurahan) {
                return [
                    'name' => $kelurahan->first()->nama_kecamatan,
                    'kelurahan' => $kelurahan->map(fn($item) => [
                        'name' => $item->nama_kelurahan,
                        'total' => $item->total
                    ])->values()
                ];
            })
            ->values();
    }
    // Pertanian Methods
    private function getPelatihanBanmodSummary()
    {
        $requiredDocs = count(PelatihanBanmod::getDocumentTypes());

        $result = DB::table('pelatihan_banmod as pb')
            ->select(DB::raw('
            count(*) as total_pendaftar,
            SUM(CASE
                WHEN vd.total_docs = ' . $requiredDocs . '
                AND vd.verified_docs = ' . $requiredDocs . '
                THEN 1 ELSE 0
            END) as total_pendaftar_lulus,
            SUM(CASE
                WHEN vd.total_docs = ' . $requiredDocs . '
                AND vd.verified_docs < ' . $requiredDocs . '
                THEN 1 ELSE 0
            END) as total_pendaftar_tidak_lulus,
            SUM(CASE
                WHEN vd.total_docs IS NULL THEN 1 ELSE 0
            END) as total_pendaftar_belum_verifikasi
        '))
            ->leftJoin(DB::raw('(
            SELECT
                pelatihan_id,
                COUNT(*) as total_docs,
                SUM(CASE WHEN status = 1 THEN 1 ELSE 0 END) as verified_docs
            FROM verifikasi_dokumen
            WHERE pelatihan_type = ?
            GROUP BY pelatihan_id
        ) as vd'), 'pb.id', '=', 'vd.pelatihan_id')
            ->setBindings([PelatihanBanmod::class])
            ->first();

        return [
            'total_pendaftar' => $result->total_pendaftar,
            'total_pendaftar_lulus' => $result->total_pendaftar_lulus,
            'total_pendaftar_tidak_lulus' => $result->total_pendaftar_tidak_lulus,
            'total_pendaftar_belum_verifikasi' => $result->total_pendaftar_belum_verifikasi
        ];
    }

    private function getPelatihanBanmodByKecamatan()
    {
        return PelatihanBanmod::select('kecamatan_ktp', DB::raw('count(*) as total'))
            ->groupBy('kecamatan_ktp')
            ->get()
            ->map(fn($item) => [
                'name' => $item->kecamatan_ktp,
                'y' => $item->total
            ]);
    }

    private function getPelatihanBanmodByJenisPelatihan()
    {
        return PelatihanBanmod::select('jenis_pelatihan_industri', DB::raw('count(*) as total'))
            ->groupBy('jenis_pelatihan_industri')
            ->get()
            ->map(fn($item) => [
                'name' => $item->jenis_pelatihan_industri ?? 'Tidak ada',
                'y' => $item->total
            ]);
    }

    private function getPelatihanBanmodByVerifikasi()
    {
        return $this->getVerifikasiData(PelatihanBanmod::class);
    }
    private function getPelatihanBanmodByKelurahan()
    {
        return PelatihanBanmod::select(
            'kecamatan_ktp as nama_kecamatan',
            'kelurahan_ktp as nama_kelurahan',
            DB::raw('count(*) as total')
        )
            ->whereNotNull('kecamatan_ktp')
            ->whereNotNull('kelurahan_ktp')
            ->groupBy('kecamatan_ktp', 'kelurahan_ktp')
            ->orderBy('kecamatan_ktp')
            ->orderBy('total', 'desc')
            ->get()
            ->groupBy('nama_kecamatan')
            ->map(function ($kelurahan) {
                return [
                    'name' => $kelurahan->first()->nama_kecamatan,
                    'kelurahan' => $kelurahan->map(fn($item) => [
                        'name' => $item->nama_kelurahan,
                        'total' => $item->total
                    ])->values()
                ];
            })
            ->values();
    }

    private function getPelatihanBanmodByTahunPenerimaan()
    {
        return PelatihanBanmod::select('tahun_penerimaan', DB::raw('count(*) as total'))
            ->groupBy('tahun_penerimaan')
            ->get()
            ->map(fn($item) => [
                'name' => $item->tahun_penerimaan,
                'y' => $item->total
            ]);
    }

    private function getPertanianSummary()
    {
        $requiredDocs = count(PelatihanPetani::getDocumentTypes());

        $result = DB::table('pelatihan_petanis as pp')
            ->select(DB::raw('
            count(*) as total_pendaftar,
            SUM(CASE
                WHEN vd.total_docs = ' . $requiredDocs . '
                AND vd.verified_docs = ' . $requiredDocs . '
                THEN 1 ELSE 0
            END) as total_pendaftar_lulus,
            SUM(CASE
                WHEN vd.total_docs = ' . $requiredDocs . '
                AND vd.verified_docs < ' . $requiredDocs . '
                THEN 1 ELSE 0
            END) as total_pendaftar_tidak_lulus,
            SUM(CASE
                WHEN vd.total_docs IS NULL THEN 1 ELSE 0
            END) as total_pendaftar_belum_verifikasi
        '))
            ->leftJoin(DB::raw('(
            SELECT
                pelatihan_id,
                COUNT(*) as total_docs,
                SUM(CASE WHEN status = 1 THEN 1 ELSE 0 END) as verified_docs
            FROM verifikasi_dokumen
            WHERE pelatihan_type = ?
            GROUP BY pelatihan_id
        ) as vd'), 'pp.id', '=', 'vd.pelatihan_id')
            ->setBindings([PelatihanPetani::class])
            ->first();

        return [
            'total_pendaftar' => $result->total_pendaftar,
            'total_pendaftar_lulus' => $result->total_pendaftar_lulus,
            'total_pendaftar_tidak_lulus' => $result->total_pendaftar_tidak_lulus,
            'total_pendaftar_belum_verifikasi' => $result->total_pendaftar_belum_verifikasi
        ];
    }

    private function getPertanianByKecamatan()
    {
        return PelatihanPetani::select('nama_kecamatan', DB::raw('count(*) as total'))
            ->groupBy('nama_kecamatan')
            ->get()
            ->map(fn($item) => [
                'name' => $item->nama_kecamatan,
                'y' => $item->total
            ]);
    }

    private function getPertanianByJenisPelatihan()
    {
        return PelatihanPetani::with('jenisPelatihanPetani')
            ->select('jenis_pelatihan_petani', DB::raw('count(*) as total'))
            ->groupBy('jenis_pelatihan_petani')
            ->get()
            ->map(fn($item) => [
                'name' => $item->jenisPelatihanPetani->nama ?? 'Tidak ada',
                'y' => $item->total
            ]);
    }

    private function getPertanianByVerifikasi()
    {
        return $this->getVerifikasiData(PelatihanPetani::class);
    }

    // Helper Methods
    private function getVerifikasiData($modelClass)
    {
        $model = new $modelClass;
        $requiredDocs = count($modelClass::getDocumentTypes());
        $tableName = $model->getTable();

        $result = DB::table($tableName . ' as m')
            ->select(DB::raw('
            CASE
                WHEN vd.total_docs = ' . $requiredDocs . ' AND vd.verified_docs = ' . $requiredDocs . ' THEN "Terverifikasi"
                WHEN vd.total_docs = ' . $requiredDocs . ' AND vd.verified_docs < ' . $requiredDocs . ' THEN "Ditolak"
                WHEN vd.total_docs IS NULL THEN "Belum Diverifikasi"
            END as status,
            COUNT(*) as total
        '))
            ->leftJoin(DB::raw('(
            SELECT
                pelatihan_id,
                COUNT(*) as total_docs,
                SUM(CASE WHEN status = 1 THEN 1 ELSE 0 END) as verified_docs
            FROM verifikasi_dokumen
            WHERE pelatihan_type = ?
            GROUP BY pelatihan_id
        ) as vd'), 'm.id', '=', 'vd.pelatihan_id')
            ->setBindings([$modelClass])
            ->groupBy('status')
            ->get();

        // Jika tidak ada data, berikan default values
        if ($result->isEmpty()) {
            return [
                ['name' => 'Belum Diverifikasi', 'y' => 0],
                ['name' => 'Ditolak', 'y' => 0],
                ['name' => 'Terverifikasi', 'y' => 0]
            ];
        }

        return $result->map(fn($item) => [
            'name' => $item->status,
            'y' => $item->total
        ]);
    }
    private function getPertanianByKelurahan()
    {
        return PelatihanPetani::select(
            'nama_kecamatan',
            'nama_kelurahan',
            DB::raw('count(*) as total')
        )
            ->whereNotNull('nama_kecamatan')
            ->whereNotNull('nama_kelurahan')
            ->groupBy('nama_kecamatan', 'nama_kelurahan')
            ->orderBy('nama_kecamatan')
            ->orderBy('total', 'desc')
            ->get()
            ->groupBy('nama_kecamatan')
            ->map(function ($kelurahan) {
                return [
                    'name' => $kelurahan->first()->nama_kecamatan,
                    'kelurahan' => $kelurahan->map(fn($item) => [
                        'name' => $item->nama_kelurahan,
                        'total' => $item->total
                    ])->values()
                ];
            })
            ->values();
    }
}
