<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Models\PelatihanUmkm;
use App\Models\PelatihanBanmod;
use App\Models\PelatihanKerjas;
use App\Models\PelatihanPetani;
use App\Models\PelatihanEkonomiKreatif;
use App\Models\PendaftaranBanmod;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;

class DashboardController extends Controller
{
    /**
     * Tahun yang dipakai untuk memfilter seluruh data dashboard.
     */
    private ?int $tahun = null;

    public function index(Request $request): JsonResponse
    {
        $tahunParam = $request->query('tahun', $request->query('year'));

        if ($tahunParam !== null && $tahunParam !== '') {
            if (!ctype_digit((string) $tahunParam)) {
                return response()->json([
                    'message' => 'Parameter tahun harus berupa angka 4 digit.',
                    'errors' => ['tahun' => ['Parameter tahun harus berupa angka 4 digit.']],
                ], 422);
            }

            $tahunParam = (int) $tahunParam;
            $tahunMin = 2024;
            $tahunMax = now()->year + 1;

            if ($tahunParam < $tahunMin || $tahunParam > $tahunMax) {
                return response()->json([
                    'message' => "Parameter tahun harus di antara {$tahunMin} dan {$tahunMax}.",
                    'errors' => ['tahun' => ["Parameter tahun harus di antara {$tahunMin} dan {$tahunMax}."]],
                ], 422);
            }

            $this->tahun = $tahunParam;
        } else {
            // Default: tahun berjalan (fallback ke tahun pada session bila ada)
            $this->tahun = (int) session('selected_year', now()->year);
        }

        $tahun = $this->tahun;

        return response()->json([
            'selected_year' => $tahun,
            'available_years' => range(now()->year, 2024),
            // Banmod Data
            'banmod' => [
                'summary' => $this->getBanmodSummary(),
                'byKategori' => $this->getBanmodByKategori(),
                'byKecamatan' => $this->getBanmodByKecamatan(),
                'byJenisUsaha' => $this->getBanmodByJenisUsaha(),
                'byVerifikasiDokumen' => $this->getBanmodByVerifikasi(),
                'byKelurahan' => $this->getBanmodByKelurahan()
            ],
            // UMKM Data
            'umkm' => [
                'summary' => $this->getUmkmSummary(),
                'byKecamatan' => $this->getUmkmByKecamatan(),
                'byPrioritas1' => $this->getUmkmByPrioritas1(),
                'byPrioritas2' => $this->getUmkmByPrioritas2(),
                'byPrioritas3' => $this->getUmkmByPrioritas3(),
                'byVerifikasiDokumen' => $this->getUmkmByVerifikasi(),
                'byKelurahan' => $this->getUmkmByKelurahan()
            ],
            // Kerja Data
            'kerja' => [
                'summary' => $this->getKerjaSummary(),
                'byKecamatan' => $this->getKerjaByKecamatan(),
                'byPendidikan' => $this->getKerjaByPendidikan(),
                'byJenisPelatihan' => $this->getKerjaByJenisPelatihan(),
                'byVerifikasiDokumen' => $this->getKerjaByVerifikasi(),
                'byKelurahan' => $this->getKerjaByKelurahan()
            ],
            // Pelatihan Penerima Banmod Data
            'pelatihan_banmod' => [
                'summary' => $this->getPelatihanBanmodSummary(),
                'byKecamatan' => $this->getPelatihanBanmodByKecamatan(),
                'byJenisPelatihan' => $this->getPelatihanBanmodByJenisPelatihan(),
                'byVerifikasiDokumen' => $this->getPelatihanBanmodByVerifikasi(),
                'byKelurahan' => $this->getPelatihanBanmodByKelurahan(),
                'byTahunPenerimaan' => $this->getPelatihanBanmodByTahunPenerimaan()
            ],
            // Pertanian Data
            'pertanian' => [
                'summary' => $this->getPertanianSummary(),
                'byKecamatan' => $this->getPertanianByKecamatan(),
                'byJenisPelatihan' => $this->getPertanianByJenisPelatihan(),
                'byVerifikasiDokumen' => $this->getPertanianByVerifikasi(),
                'byKelurahan' => $this->getPertanianByKelurahan()
            ],
            // Ekonomi Kreatif Data
            'ekraf' => [
                'summary' => $this->getEkrafSummary(),
                'byKecamatan' => $this->getEkrafByKecamatan(),
                'byJenisPelatihan' => $this->getEkrafByJenisPelatihan(),
                'byVerifikasiDokumen' => $this->getEkrafByVerifikasi(),
                'byKelurahan' => $this->getEkrafByKelurahan()
            ],
        ]);
    }

    // ============================================================
    // Helper: ringkas query status per tabel pelatihan
    // ============================================================
    private function yearScope($table)
    {
        $tahun = $this->tahun();
        $tabel = str_contains($table, ' as ') ? explode(' as ', $table)[1] : $table;
        return "{$tabel}.created_at >= '{$tahun}-01-01 00:00:00' AND {$tabel}.created_at <= '{$tahun}-12-31 23:59:59'";
    }

    /**
     * Tahun aktif untuk filter (default tahun berjalan).
     */
    private function tahun(): int
    {
        return $this->tahun ??= (int) session('selected_year', now()->year);
    }

    /**
     * Rentang tanggal awal & akhir tahun aktif, untuk whereBetween created_at.
     */
    private function yearRange(): array
    {
        $tahun = $this->tahun();

        return ["{$tahun}-01-01 00:00:00", "{$tahun}-12-31 23:59:59"];
    }

    // status: 0=Menunggu, 1=Lolos, 2=Tidak Lolos, 3=Blacklist, 4=Lolos di pelatihan lain
    private function statusSummary($table, $totalAlias = 'total_pendaftar')
    {
        return "count(*) as {$totalAlias},
            SUM(CASE WHEN {$table}.status = 1 THEN 1 ELSE 0 END) as total_lolos,
            SUM(CASE WHEN {$table}.status = 2 THEN 1 ELSE 0 END) as total_tidak_lolos,
            SUM(CASE WHEN {$table}.status = 4 THEN 1 ELSE 0 END) as total_diterima_lain,
            SUM(CASE WHEN {$table}.status = 3 THEN 1 ELSE 0 END) as total_blacklist,
            SUM(CASE WHEN {$table}.status = 0 THEN 1 ELSE 0 END) as total_belum_diputuskan";
    }

    private function buildSummary($table, $type, $totalAlias = 'total_pendaftar')
    {
        $year = $this->yearScope($table);
        $tabel = str_contains($table, ' as ') ? explode(' as ', $table)[1] : $table;
        $result = DB::table($table)
            ->select(DB::raw($this->statusSummary($tabel, $totalAlias)))
            ->whereRaw($year)
            ->first();

        return [
            'total_pendaftar' => (int) ($result->total_pendaftar ?? 0),
            'total_pendaftar_lulus' => (int) ($result->total_lolos ?? 0),
            'total_pendaftar_tidak_lulus' => (int) ($result->total_tidak_lolos ?? 0),
            'total_pendaftar_belum_verifikasi' => (int) ($result->total_belum_diputuskan ?? 0),
            'total_diterima_lain' => (int) ($result->total_diterima_lain ?? 0),
            'total_blacklist' => (int) ($result->total_blacklist ?? 0),
        ];
    }

    private function buildByKecamatan($table, $kecColumn, $lolosCondition)
    {
        $year = $this->yearScope($table);
        return DB::table($table)
            ->select(
                $kecColumn . ' as name',
                DB::raw('count(*) as total'),
                DB::raw('SUM(CASE WHEN ' . $lolosCondition . ' THEN 1 ELSE 0 END) as lolos'),
                DB::raw('SUM(CASE WHEN status = 2 THEN 1 ELSE 0 END) as tidak_lolos')
            )
            ->whereNotNull($kecColumn)
            ->whereRaw($year)
            ->groupBy($kecColumn)
            ->orderBy('total', 'desc')
            ->get()
            ->map(fn($item) => [
                'name' => $item->name,
                'pendaftar' => (int) $item->total,
                'lolos' => (int) $item->lolos,
                'tidak_lolos' => (int) $item->tidak_lolos,
            ]);
    }

    private function buildByKelurahan($table, $kecColumn, $kelColumn, $lolosCondition)
    {
        $year = $this->yearScope($table);
        return DB::table($table)
            ->select(
                $kecColumn . ' as kecamatan',
                $kelColumn . ' as kelurahan',
                DB::raw('count(*) as total'),
                DB::raw('SUM(CASE WHEN ' . $lolosCondition . ' THEN 1 ELSE 0 END) as lolos'),
                DB::raw('SUM(CASE WHEN status = 2 THEN 1 ELSE 0 END) as tidak_lolos')
            )
            ->whereNotNull($kecColumn)
            ->whereNotNull($kelColumn)
            ->whereRaw($year)
            ->groupBy($kecColumn, $kelColumn)
            ->orderBy($kecColumn)
            ->orderBy('total', 'desc')
            ->get()
            ->groupBy('kecamatan')
            ->map(function ($kelurahan) {
                return [
                    'name' => $kelurahan->first()->kecamatan,
                    'kelurahan' => $kelurahan->map(fn($item) => [
                        'name' => $item->kelurahan,
                        'total' => (int) $item->total,
                        'lolos' => (int) $item->lolos,
                        'tidak_lolos' => (int) $item->tidak_lolos,
                    ])->values()
                ];
            })
            ->values();
    }

    private function buildByVerifikasi($table, $type)
    {
        return $this->getVerifikasiDataRaw($table, $type);
    }

    private function getVerifikasiDataRaw($tableName, $type)
    {
        $year = $this->yearScope($tableName . ' as m');
        $result = DB::table($tableName . ' as m')
            ->selectRaw('CASE
                WHEN vd.total_docs = vd.required_docs
                    AND vd.verified_docs = vd.required_docs THEN "Terverifikasi"
                WHEN vd.total_docs = vd.required_docs
                    AND vd.verified_docs < vd.required_docs THEN "Ditolak"
                WHEN vd.total_docs IS NULL THEN "Belum Diverifikasi"
            END as status')
            ->leftJoin(DB::raw('(
            SELECT
                pelatihan_id,
                COUNT(*) as total_docs,
                SUM(CASE WHEN status = 1 THEN 1 ELSE 0 END) as verified_docs,
                (SELECT COUNT(*) FROM verifikasi_dokumen v2 WHERE v2.pelatihan_type = ? AND v2.pelatihan_id = vd_inner.pelatihan_id) as required_docs
            FROM verifikasi_dokumen vd_inner
            WHERE pelatihan_type = ?
            GROUP BY pelatihan_id
        ) as vd'), 'm.id', '=', 'vd.pelatihan_id')
            ->whereRaw($year)
            ->setBindings([$type, $type])
            ->get()
            ->groupBy('status');

        if ($result->isEmpty()) {
            return [
                ['name' => 'Belum Diverifikasi', 'y' => 0],
                ['name' => 'Ditolak', 'y' => 0],
                ['name' => 'Terverifikasi', 'y' => 0]
            ];
        }

        return $result->map(fn($items, $status) => [
            'name' => $status,
            'y' => $items->count()
        ])->values();
    }

    // ============================================================
    // Banmod (PendaftaranBanmod) Methods
    // ============================================================
    private function getBanmodSummary()
    {
        $year = $this->yearScope('pendaftaran_banmods as pb');
        $result = DB::table('pendaftaran_banmods as pb')
            ->select(DB::raw('
            count(*) as total_pendaftar,
            SUM(CASE
                WHEN vd.total_docs =
                    CASE
                        WHEN pb.kategori IN (1,2,3,6) THEN 8
                        WHEN pb.kategori = 4 THEN 11
                        WHEN pb.kategori = 5 THEN 9
                        WHEN pb.kategori = 7 THEN 10
                        ELSE 12
                    END
                AND vd.verified_docs =
                    CASE
                        WHEN pb.kategori IN (1,2,3,6) THEN 8
                        WHEN pb.kategori = 4 THEN 11
                        WHEN pb.kategori = 5 THEN 9
                        WHEN pb.kategori = 7 THEN 10
                        ELSE 12
                    END
                THEN 1 ELSE 0
            END) as total_pendaftar_lulus,
            SUM(CASE
                WHEN vd.total_docs =
                    CASE
                        WHEN pb.kategori IN (1,2,3,6) THEN 8
                        WHEN pb.kategori = 4 THEN 11
                        WHEN pb.kategori = 5 THEN 9
                        WHEN pb.kategori = 7 THEN 10
                        ELSE 12
                    END
                AND vd.verified_docs <
                    CASE
                        WHEN pb.kategori IN (1,2,3,6) THEN 8
                        WHEN pb.kategori = 4 THEN 11
                        WHEN pb.kategori = 5 THEN 9
                        WHEN pb.kategori = 7 THEN 10
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
            ->whereRaw($year)
            ->setBindings([PendaftaranBanmod::class])
            ->first();

        return [
            'total_pendaftar' => $result->total_pendaftar,
            'total_pendaftar_lulus' => $result->total_pendaftar_lulus,
            'total_pendaftar_tidak_lulus' => $result->total_pendaftar_tidak_lulus,
            'total_pendaftar_belum_verifikasi' => $result->total_pendaftar_belum_verifikasi,
            'total_diterima_lain' => 0,
            'total_blacklist' => 0,
        ];
    }

    private function getBanmodByKategori()
    {
        return PendaftaranBanmod::select('kategori', DB::raw('count(*) as total'))
            ->whereBetween('created_at', $this->yearRange())
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
            DB::raw('count(*) as total')
        )
            ->whereNotNull('nama_kecamatan')
            ->whereBetween('created_at', $this->yearRange())
            ->groupBy('nama_kecamatan')
            ->orderBy('total', 'desc')
            ->get()
            ->map(function ($item) {
                return [
                    'name' => $item->nama_kecamatan,
                    'pendaftar' => (int) $item->total,
                    'lolos' => 0,
                    'tidak_lolos' => 0,
                ];
            });
    }

    private function getBanmodByJenisUsaha()
    {
        return PendaftaranBanmod::with('klasterUsaha')
            ->select('klaster_usaha', DB::raw('count(*) as total'))
            ->whereBetween('created_at', $this->yearRange())
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
        $year = $this->yearScope('pendaftaran_banmods as pb');
        $result = DB::table('pendaftaran_banmods as pb')
            ->selectRaw('CASE
                WHEN vd.total_docs =
                    CASE
                        WHEN pb.kategori IN (1,2,3,6) THEN 8
                        WHEN pb.kategori = 4 THEN 11
                        WHEN pb.kategori = 5 THEN 9
                        WHEN pb.kategori = 7 THEN 10
                        ELSE 12
                    END
                    AND vd.verified_docs =
                    CASE
                        WHEN pb.kategori IN (1,2,3,6) THEN 8
                        WHEN pb.kategori = 4 THEN 11
                        WHEN pb.kategori = 5 THEN 9
                        WHEN pb.kategori = 7 THEN 10
                        ELSE 12
                    END
                THEN "Terverifikasi"
                WHEN vd.total_docs =
                    CASE
                        WHEN pb.kategori IN (1,2,3,6) THEN 8
                        WHEN pb.kategori = 4 THEN 11
                        WHEN pb.kategori = 5 THEN 9
                        WHEN pb.kategori = 7 THEN 10
                        ELSE 12
                    END
                    AND vd.verified_docs <
                    CASE
                        WHEN pb.kategori IN (1,2,3,6) THEN 8
                        WHEN pb.kategori = 4 THEN 11
                        WHEN pb.kategori = 5 THEN 9
                        WHEN pb.kategori = 7 THEN 10
                        ELSE 12
                    END
                THEN "Ditolak"
                WHEN vd.total_docs IS NULL THEN "Belum Diverifikasi"
                ELSE "Belum Lengkap"
            END as status')
            ->leftJoin(DB::raw('(
            SELECT
                pelatihan_id,
                COUNT(*) as total_docs,
                SUM(CASE WHEN status = 1 THEN 1 ELSE 0 END) as verified_docs
            FROM verifikasi_dokumen
            WHERE pelatihan_type = ?
            GROUP BY pelatihan_id
        ) as vd'), 'pb.id', '=', 'vd.pelatihan_id')
            ->whereRaw($year)
            ->setBindings([PendaftaranBanmod::class])
            ->get()
            ->groupBy('status');

        if ($result->isEmpty()) {
            return [
                ['name' => 'Belum Diverifikasi', 'y' => 0],
                ['name' => 'Belum Lengkap', 'y' => 0],
                ['name' => 'Ditolak', 'y' => 0],
                ['name' => 'Terverifikasi', 'y' => 0]
            ];
        }

        return $result->map(fn($items, $status) => [
            'name' => $status,
            'y' => $items->count()
        ])->values();
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
            ->whereBetween('created_at', $this->yearRange())
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
                        'total' => (int) $item->total,
                        'lolos' => 0,
                        'tidak_lolos' => 0,
                    ])->values()
                ];
            })
            ->values();
    }

    // ============================================================
    // UMKM Methods
    // ============================================================
    private function getUmkmSummary()
    {
        return $this->buildSummary('pelatihan_umkm', 'umkm');
    }

    private function getUmkmByKecamatan()
    {
        return $this->buildByKecamatan('pelatihan_umkm', 'kecamatan', 'status = 1');
    }

    private function getUmkmByPrioritas1()
    {
        return PelatihanUmkm::select('prioritas_1 as pelatihan', DB::raw('count(*) as total'))
            ->whereBetween('created_at', $this->yearRange())
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
            ->whereBetween('created_at', $this->yearRange())
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
            ->whereBetween('created_at', $this->yearRange())
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
        return $this->buildByKelurahan('pelatihan_umkm', 'kecamatan', 'kelurahan', 'status = 1');
    }

    // ============================================================
    // Kerja Methods
    // ============================================================
    private function getKerjaSummary()
    {
        return $this->buildSummary('pelatihan_kerjas', 'kerja');
    }

    private function getKerjaByKecamatan()
    {
        return $this->buildByKecamatan('pelatihan_kerjas', 'nama_kecamatan', 'status = 1');
    }

    private function getKerjaByPendidikan()
    {
        return PelatihanKerjas::with('refPendidikan')
            ->select('pendidikan', DB::raw('count(*) as total'))
            ->whereBetween('created_at', $this->yearRange())
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
            ->whereBetween('created_at', $this->yearRange())
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
        return $this->buildByKelurahan('pelatihan_kerjas', 'nama_kecamatan', 'nama_kelurahan', 'status = 1');
    }

    // ============================================================
    // Pertanian Methods
    // ============================================================
    private function getPelatihanBanmodSummary()
    {
        return $this->buildSummary('pelatihan_banmod', 'pelatihan_banmod');
    }

    private function getPelatihanBanmodByKecamatan()
    {
        return $this->buildByKecamatan('pelatihan_banmod', 'kecamatan_ktp', 'status = 1');
    }

    private function getPelatihanBanmodByJenisPelatihan()
    {
        return PelatihanBanmod::select('jenis_pelatihan_industri', DB::raw('count(*) as total'))
            ->whereBetween('created_at', $this->yearRange())
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
        return $this->buildByKelurahan('pelatihan_banmod', 'kecamatan_ktp', 'kelurahan_ktp', 'status = 1');
    }

    private function getPelatihanBanmodByTahunPenerimaan()
    {
        return PelatihanBanmod::select('tahun_penerimaan', DB::raw('count(*) as total'))
            ->whereBetween('created_at', $this->yearRange())
            ->groupBy('tahun_penerimaan')
            ->get()
            ->map(fn($item) => [
                'name' => $item->tahun_penerimaan,
                'y' => $item->total
            ]);
    }

    private function getPertanianSummary()
    {
        return $this->buildSummary('pelatihan_petanis', 'pertanian');
    }

    private function getPertanianByKecamatan()
    {
        return $this->buildByKecamatan('pelatihan_petanis', 'nama_kecamatan', 'status = 1');
    }

    private function getPertanianByJenisPelatihan()
    {
        return PelatihanPetani::with('jenisPelatihanPetani')
            ->select('jenis_pelatihan_petani', DB::raw('count(*) as total'))
            ->whereBetween('created_at', $this->yearRange())
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

    private function getPertanianByKelurahan()
    {
        return $this->buildByKelurahan('pelatihan_petanis', 'nama_kecamatan', 'nama_kelurahan', 'status = 1');
    }

    // ============================================================
    // Ekonomi Kreatif Methods
    // ============================================================
    private function getEkrafSummary()
    {
        return $this->buildSummary('pelatihan_ekonomi_kreatif', 'ekraf');
    }

    private function getEkrafByKecamatan()
    {
        return $this->buildByKecamatan('pelatihan_ekonomi_kreatif', 'kecamatan_ktp', 'status = 1');
    }

    private function getEkrafByJenisPelatihan()
    {
        return PelatihanEkonomiKreatif::select('jenis_pelatihan', DB::raw('count(*) as total'))
            ->whereBetween('created_at', $this->yearRange())
            ->groupBy('jenis_pelatihan')
            ->get()
            ->map(fn($item) => [
                'name' => $item->jenis_pelatihan ?? 'Tidak ada',
                'y' => $item->total
            ]);
    }

    private function getEkrafByVerifikasi()
    {
        return $this->getVerifikasiData(PelatihanEkonomiKreatif::class);
    }

    private function getEkrafByKelurahan()
    {
        return $this->buildByKelurahan('pelatihan_ekonomi_kreatif', 'kecamatan_ktp', 'kelurahan_ktp', 'status = 1');
    }

    // ============================================================
    // Helper Methods (verifikasi dengan model class)
    // ============================================================
    private function getVerifikasiData($modelClass)
    {
        $model = new $modelClass;
        $requiredDocs = count($modelClass::getDocumentTypes());
        $tableName = $model->getTable();
        $year = $this->yearScope($tableName . ' as m');

        $result = DB::table($tableName . ' as m')
            ->selectRaw('CASE
                WHEN verification_status.status = "complete" THEN "Terverifikasi"
                WHEN verification_status.status = "incomplete" THEN "Ditolak"
                WHEN verification_status.status IS NULL THEN "Belum Diverifikasi"
            END as status')
            ->leftJoin(DB::raw('(
            SELECT
                pelatihan_id,
                CASE
                    WHEN COUNT(*) = ' . $requiredDocs . ' AND SUM(CASE WHEN status = 1 THEN 1 ELSE 0 END) = ' . $requiredDocs . ' THEN "complete"
                    WHEN COUNT(*) = ' . $requiredDocs . ' AND SUM(CASE WHEN status = 1 THEN 1 ELSE 0 END) < ' . $requiredDocs . ' THEN "incomplete"
                END as status
            FROM verifikasi_dokumen
            WHERE pelatihan_type = ?
            GROUP BY pelatihan_id
        ) as verification_status'), 'm.id', '=', 'verification_status.pelatihan_id')
            ->whereRaw($year)
            ->setBindings([$modelClass])
            ->get()
            ->groupBy('status');

        if ($result->isEmpty()) {
            return [
                ['name' => 'Belum Diverifikasi', 'y' => 0],
                ['name' => 'Ditolak', 'y' => 0],
                ['name' => 'Terverifikasi', 'y' => 0]
            ];
        }

        return $result->map(fn($items, $status) => [
            'name' => $status,
            'y' => $items->count()
        ])->values();
    }
}
