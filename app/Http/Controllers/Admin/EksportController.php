<?php

namespace App\Http\Controllers\Admin;

use Barryvdh\DomPDF\PDF;
use App\Ekports\UmkmExport;
use App\Ekports\KerjaExport;
use Illuminate\Http\Request;
use App\Ekports\BanmodExport;
use App\Models\PelatihanUmkm;
use App\Models\PelatihanBanmod;
use App\Models\PelatihanKerjas;
use App\Models\PelatihanPetani;
use App\Ekports\PelBanmodExport;
use App\Ekports\PertanianExport;
use App\Models\PendaftaranBanmod;
use App\Http\Controllers\Controller;
use Maatwebsite\Excel\Facades\Excel;

class EksportController extends Controller
{
    public function exportBanmod(Request $request)
    {
        $query = PendaftaranBanmod::with(['documentVerifications', 'klasterUsaha', 'kategoriUsaha']);

        // Apply kategori filter if provided
        if ($request->has('kategori')) {
            $query->where('kategori', $request->kategori);
        }

        // Apply verification status filter
        if ($request->has('verification_status') && $request->verification_status !== 'all') {
            $status = $request->verification_status;
            $query = $this->applyVerificationFilterBanmod($query, $status);
        }

        $data = $query->orderBy('created_at', 'asc')->get()->sortByDesc('skor');

        // return response()->json([
        //     'data' => $data,
        //     'message' => 'Data successfully retrieved'
        // ]);

        // Handle export type
        if ($request->ext === 'excel') {
            return Excel::download(new BanmodExport($data), 'banmod.xlsx');
        }

        $pdf = app(PDF::class);
        $pdf->setPaper('a4', 'landscape');
        $pdf->loadView('exports.banmod-pdf', [
            'data' => $data,
            'title' => $request->kategori ? PendaftaranBanmod::getKategoriName($request->kategori) : 'Semua Kategori'
        ]);

        return $pdf->stream('rekap-banmod.pdf');
    }

    private function applyVerificationFilterBanmod($query, $status)
    {

        switch ($status) {
            case 'verified':
                return $query->whereExists(function ($query) {
                    $query->selectRaw('1')
                        ->from('verifikasi_dokumen as v')
                        ->whereColumn('v.pelatihan_id', 'pendaftaran_banmods.id')
                        ->where('v.pelatihan_type', PendaftaranBanmod::class)
                        ->where('v.status', 1)
                        ->groupBy('v.pelatihan_id')
                        ->havingRaw('COUNT(*) = (
                        CASE
                            WHEN pendaftaran_banmods.kategori = 1 THEN 8
                            WHEN pendaftaran_banmods.kategori = 2 THEN 8
                            WHEN pendaftaran_banmods.kategori = 4 THEN 8
                            WHEN pendaftaran_banmods.kategori = 4 THEN 11
                            WHEN pendaftaran_banmods.kategori = 5 THEN 8
                            ELSE 8
                        END
                    )');
                });

            case 'rejected':
                return $query->whereExists(function ($query) {
                    $query->selectRaw('1')
                        ->from('verifikasi_dokumen as v')
                        ->whereColumn('v.pelatihan_id', 'pendaftaran_banmods.id')
                        ->where('v.pelatihan_type', PendaftaranBanmod::class)
                        ->groupBy('v.pelatihan_id')
                        ->havingRaw('
                COUNT(*) = (
                    CASE
                        WHEN pendaftaran_banmods.kategori = 1 THEN 8
                        WHEN pendaftaran_banmods.kategori = 2 THEN 8
                        WHEN pendaftaran_banmods.kategori = 3 THEN 8
                        WHEN pendaftaran_banmods.kategori = 4 THEN 11
                        WHEN pendaftaran_banmods.kategori = 5 THEN 8
                        ELSE 8
                    END
                )
                AND
                SUM(CASE WHEN v.status = 1 THEN 1 ELSE 0 END) < (
                    CASE
                        WHEN pendaftaran_banmods.kategori = 1 THEN 8
                        WHEN pendaftaran_banmods.kategori = 2 THEN 8
                        WHEN pendaftaran_banmods.kategori = 3 THEN 8
                        WHEN pendaftaran_banmods.kategori = 4 THEN 11
                        WHEN pendaftaran_banmods.kategori = 5 THEN 8
                        ELSE 8
                    END
                )
            ');
                });


            case 'pending':
                return $query->where(function ($q) {
                    $q->whereRaw('(
                    SELECT COUNT(*)
                    FROM verifikasi_dokumen
                    WHERE pelatihan_id = pendaftaran_banmods.id
                    AND pelatihan_type = ?
                ) < (
                    CASE
                        WHEN kategori = 1 THEN 8
                        WHEN kategori = 2 THEN 8
                        WHEN kategori = 3 THEN 8
                        WHEN kategori = 4 THEN 11
                        WHEN kategori = 5 THEN 8
                        ELSE 4
                    END
                )', [PendaftaranBanmod::class])
                        ->orWhereDoesntHave('documentVerifications');
                });

            default:
                return $query;
        }
    }

    public function exportUmkm(Request $request)
    {
        $query = PelatihanUmkm::with(['documentVerifications']);

        // Check prioritas_1
        if ($request->has('prioritas_1') && $request->prioritas_1 !== 'Semua Pelatihan') {

            $query->where('prioritas_1', $request->prioritas_1);
        }
        // Check prioritas_2 only if prioritas_1 is not set
        if (
            $request->has('prioritas_2') && $request->prioritas_2 !== 'Semua Pelatihan'
        ) {
            $query->where('prioritas_2', $request->prioritas_2);
        }
        // Check prioritas_3 only if prioritas_1 and prioritas_2 are not set
        if (
            $request->has('prioritas_3') && $request->prioritas_3 !== 'Semua Pelatihan'
        ) {
            $query->where('prioritas_3', $request->prioritas_3);
        }

        // Apply verification status filter
        if ($request->has('verification_status') && $request->verification_status !== 'all') {
            $status = $request->verification_status;
            $query = $this->applyVerificationFilterUmkm($query, $status);
        }

        $data = $query->orderBy('created_at', 'asc')->get()->sortByDesc('skor');

        // Handle export type
        if ($request->ext === 'excel') {
            return Excel::download(new UmkmExport($data), 'Umkm.xlsx');
        }

        $pdf = app(PDF::class);
        $pdf->setPaper('a4', 'landscape');
        $pdf->loadView('exports.umkm-pdf', [
            'data' => $data,
        ]);

        return $pdf->stream('rekap-pelatihan-umkm.pdf');
    }

    private function applyVerificationFilterUmkm($query, $status)
    {

        switch ($status) {
            case 'verified':
                return $query->whereExists(function ($query) {
                    $query->selectRaw('1')
                        ->from('verifikasi_dokumen as v')
                        ->whereColumn('v.pelatihan_id', 'pelatihan_umkm.id')
                        ->where('v.pelatihan_type', PelatihanUmkm::class)
                        ->where('v.status', 1)
                        ->groupBy('v.pelatihan_id')
                        ->havingRaw('COUNT(*) = 4');
                });

            case 'rejected':
                return $query->whereExists(function ($query) {
                    $query->selectRaw('1')
                        ->from('verifikasi_dokumen as v')
                        ->whereColumn('v.pelatihan_id', 'pelatihan_umkm.id')
                        ->where('v.pelatihan_type', PelatihanUmkm::class)
                        ->groupBy('v.pelatihan_id')
                        ->havingRaw('
                COUNT(*) = 4
                AND
                SUM(CASE WHEN v.status = 1 THEN 1 ELSE 0 END) < 4
            ');
                });


            case 'pending':
                return $query->where(function ($q) {
                    $q->whereRaw('(
                    SELECT COUNT(*)
                    FROM verifikasi_dokumen
                    WHERE pelatihan_id = pelatihan_umkm.id
                    AND pelatihan_type = ?
                ) < 4', [PelatihanUmkm::class])
                        ->orWhereDoesntHave('documentVerifications');
                });

            default:
                return $query;
        }
    }

    public function exportKerja(Request $request)
    {
        $query = PelatihanKerjas::with(['refPendidikan', 'jenisPelatihan', 'alasanPelatihan', 'documentVerifications']);

        if ($request->has('jenis_pelatihan') && $request->jenis_pelatihan !== 'all') {
            $query->where('jenis_pelatihan', $request->jenis_pelatihan);
        }

        // Apply verification status filter
        if ($request->has('verification_status') && $request->verification_status !== 'all') {
            $status = $request->verification_status;
            $query = $this->applyVerificationFilterKerja($query, $status);
        }

        $data = $query->orderBy('created_at', 'asc')->get();

        // return response()->json($data);
        // Handle export type
        if ($request->ext === 'excel') {
            return Excel::download(new KerjaExport($data), 'Kerja.xlsx');
        }

        $pdf = app(PDF::class);
        $pdf->setPaper('a4', 'landscape');
        $pdf->loadView('exports.kerja-pdf', [
            'data' => $data,
        ]);

        return $pdf->stream('rekap-pelatihan-kerja.pdf');
    }

    private function applyVerificationFilterKerja($query, $status)
    {
        switch ($status) {
            case 'verified':
                return $query->whereExists(function ($query) {
                    $query->selectRaw('1')
                        ->from('verifikasi_dokumen as v')
                        ->whereColumn('v.pelatihan_id', 'pelatihan_kerjas.id')
                        ->where('v.pelatihan_type', PelatihanKerjas::class)
                        ->where('v.status', 1)
                        ->groupBy('v.pelatihan_id')
                        ->havingRaw('COUNT(*) = 2');
                });

            case 'rejected':
                return $query->whereExists(function ($query) {
                    $query->selectRaw('1')
                        ->from('verifikasi_dokumen as v')
                        ->whereColumn('v.pelatihan_id', 'pelatihan_kerjas.id')
                        ->where('v.pelatihan_type', PelatihanKerjas::class)
                        ->groupBy('v.pelatihan_id')
                        ->havingRaw('
                COUNT(*) = 2
                AND
                SUM(CASE WHEN v.status = 1 THEN 1 ELSE 0 END) < 2
            ');
                });


            case 'pending':
                return $query->where(function ($q) {
                    $q->whereRaw('(
                    SELECT COUNT(*)
                    FROM verifikasi_dokumen
                    WHERE pelatihan_id = pelatihan_kerjas.id
                    AND pelatihan_type = ?
                ) < 2', [PelatihanKerjas::class])
                        ->orWhereDoesntHave('documentVerifications');
                });

            default:
                return $query;
        }
    }

    public function exportPelatihanBanmod(Request $request)
    {
        $query = PelatihanBanmod::with(['documentVerifications']);

        if ($request->has('jenis_pelatihan_industri') && $request->jenis_pelatihan_industri !== 'Semua Pelatihan') {
            $query->where('jenis_pelatihan_industri', $request->jenis_pelatihan_industri);
        }

        // Apply verification status filter
        if ($request->has('verification_status') && $request->verification_status !== 'all') {
            $status = $request->verification_status;
            $query = $this->applyVerificationFilterPelatihanBanmod($query, $status);
        }

        $data = $query->orderBy('created_at', 'asc')->get();

        // return response()->json($data);
        // Handle export type
        if ($request->ext === 'excel') {
            return Excel::download(new PelBanmodExport($data), 'Pelatihan-Banmod.xlsx');
        }

        $pdf = app(PDF::class);
        $pdf->setPaper('a4', 'landscape');
        $pdf->loadView('exports.pelbanmod-pdf', [
            'data' => $data,
        ]);

        return $pdf->stream('rekap-pelatihan-banmod.pdf');
    }

    private function applyVerificationFilterPelatihanBanmod($query, $status)
    {
        switch ($status) {
            case 'verified':
                return $query->whereExists(function ($query) {
                    $query->selectRaw('1')
                        ->from('verifikasi_dokumen as v')
                        ->whereColumn('v.pelatihan_id', 'pelatihan_banmod.id')
                        ->where('v.pelatihan_type', PelatihanBanmod::class)
                        ->where('v.status', 1)
                        ->groupBy('v.pelatihan_id')
                        ->havingRaw('COUNT(*) = 3');
                });

            case 'rejected':
                return $query->whereExists(function ($query) {
                    $query->selectRaw('1')
                        ->from('verifikasi_dokumen as v')
                        ->whereColumn('v.pelatihan_id', 'pelatihan_banmod.id')
                        ->where('v.pelatihan_type', PelatihanBanmod::class)
                        ->groupBy('v.pelatihan_id')
                        ->havingRaw('
                COUNT(*) = 3
                AND
                SUM(CASE WHEN v.status = 1 THEN 1 ELSE 0 END) < 3
            ');
                });


            case 'pending':
                return $query->where(function ($q) {
                    $q->whereRaw('(
                    SELECT COUNT(*)
                    FROM verifikasi_dokumen
                    WHERE pelatihan_id = pelatihan_banmod.id
                    AND pelatihan_type = ?
                ) < 3', [PelatihanBanmod::class])
                        ->orWhereDoesntHave('documentVerifications');
                });

            default:
                return $query;
        }
    }

    public function exportPertanian(Request $request)
    {
        $query = PelatihanPetani::with('kelompokTani', 'jenisPelatihanPetani', 'kategoriKelompok', 'alasanPelatihan', 'masaAktifKelompok', 'documentVerifications');
        if ($request->has('jenis_pelatihan_petani') && $request->jenis_pelatihan_petani !== 'all') {
            $query->where('jenis_pelatihan_petani', $request->jenis_pelatihan_petani);
        }

        // Apply verification status filter
        if ($request->has('verification_status') && $request->verification_status !== 'all') {
            $status = $request->verification_status;
            $query = $this->applyVerificationFilterPertanian($query, $status);
        }

        $data = $query->orderBy('created_at', 'asc')->get()->sortByDesc('skor');

        // return response()->json($data);
        // Handle export type
        if ($request->ext === 'excel') {
            return Excel::download(new PertanianExport($data), 'Pelatihan-Pertanian.xlsx');
        }

        $pdf = app(PDF::class);
        $pdf->setPaper('a4', 'landscape');
        $pdf->loadView('exports.pertanian-pdf', [
            'data' => $data,
        ]);

        return $pdf->stream('rekap-pertanian.pdf');
    }

    private function applyVerificationFilterPertanian($query, $status)
    {
        switch ($status) {
            case 'verified':
                return $query->whereExists(function ($query) {
                    $query->selectRaw('1')
                        ->from('verifikasi_dokumen as v')
                        ->whereColumn('v.pelatihan_id', 'pelatihan_petanis.id')
                        ->where('v.pelatihan_type', PelatihanPetani::class)
                        ->where('v.status', 1)
                        ->groupBy('v.pelatihan_id')
                        ->havingRaw('COUNT(*) = 4');
                });

            case 'rejected':
                return $query->whereExists(function ($query) {
                    $query->selectRaw('1')
                        ->from('verifikasi_dokumen as v')
                        ->whereColumn('v.pelatihan_id', 'pelatihan_petanis.id')
                        ->where('v.pelatihan_type', PelatihanPetani::class)
                        ->groupBy('v.pelatihan_id')
                        ->havingRaw('
                COUNT(*) = 4
                AND
                SUM(CASE WHEN v.status = 1 THEN 1 ELSE 0 END) < 4
            ');
                });


            case 'pending':
                return $query->where(function ($q) {
                    $q->whereRaw('(
                    SELECT COUNT(*)
                    FROM verifikasi_dokumen
                    WHERE pelatihan_id = pelatihan_petanis.id
                    AND pelatihan_type = ?
                ) < 4', [PelatihanPetani::class])
                        ->orWhereDoesntHave('documentVerifications');
                });

            default:
                return $query;
        }
    }
}
