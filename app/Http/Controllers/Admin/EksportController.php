<?php

namespace App\Http\Controllers\Admin;

use Barryvdh\DomPDF\PDF;
use App\Ekports\UmkmExport;
use App\Ekports\EkrafExport;
use App\Ekports\KerjaExport;
use Illuminate\Http\Request;
use App\Ekports\BanmodExport;
use App\Models\PelatihanUmkm;
use App\Models\PelatihanBanmod;
use App\Models\PelatihanKerjas;
use App\Models\PelatihanPetani;
use App\Ekports\BlacklistExport;
use App\Ekports\PelBanmodExport;
use App\Ekports\PertanianExport;
use App\Models\PendaftaranBanmod;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use Maatwebsite\Excel\Facades\Excel;
use App\Models\PelatihanEkonomiKreatif;

class EksportController extends Controller
{
    private function filterByVerificationStatus($data, Request $request)
    {
        if (!$request->has('verification_status') || $request->verification_status === 'all') {
            return $data;
        }

        $verificationStatus = $request->verification_status;
        if (!in_array($verificationStatus, ['verified', 'rejected', 'pending'], true)) {
            return $data;
        }

        return $data->filter(fn ($item) =>
            $item->getDocumentVerificationStatus() === $verificationStatus
        );
    }

    public function exportBanmod(Request $request)
    {
        $query = PendaftaranBanmod::with(['documentVerifications', 'klasterUsaha', 'kategoriUsaha']);

        // Apply kategori filter if provided
        if ($request->has('kategori')) {
            $query->where('kategori', $request->kategori);
        }

        // Apply klaster usaha filter if provided
        if ($request->has('klaster_usaha') && $request->klaster_usaha !== 'all') {
            $query->where('klaster_usaha', $request->klaster_usaha);
        }

        $data = $this->filterByVerificationStatus(
            $query->orderBy('created_at', 'asc')->get(),
            $request
        )->sortByDesc('skor')->values() // Reset keys after sorting
            ->map(function ($item, $index) {
                $item->row_num = $index + 1; // Add row number
                return $item;
            });

        // return response()->json([$data]);

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
        if ($request->has('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }
        $data = $this->filterByVerificationStatus(
            $query->orderBy('created_at', 'asc')->get(),
            $request
        )->sortByDesc('skor')->values() // Reset keys after sorting
            ->map(function ($item, $index) {
                $item->row_num = $index + 1; // Add row number
                return $item;
            });


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

    public function exportKerja(Request $request)
    {
        $query = PelatihanKerjas::with(['refPendidikan', 'jenisPelatihan', 'alasanPelatihan', 'documentVerifications']);

        if ($request->has('jenis_pelatihan') && $request->jenis_pelatihan !== 'all') {
            $query->where('jenis_pelatihan', $request->jenis_pelatihan);
        }
        if ($request->has('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }
        $data = $this->filterByVerificationStatus(
            $query->orderBy('created_at', 'asc')->get(),
            $request
        )->values() // Reset keys after sorting
            ->map(function ($item, $index) {
                $item->row_num = $index + 1; // Add row number
                return $item;
            });


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

    public function exportPelatihanBanmod(Request $request)
    {
        $query = PelatihanBanmod::with(['documentVerifications']);

        if ($request->has('jenis_pelatihan_industri') && $request->jenis_pelatihan_industri !== 'Semua Pelatihan') {
            $query->where('jenis_pelatihan_industri', $request->jenis_pelatihan_industri);
        }
        if ($request->has('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }
        $data = $this->filterByVerificationStatus(
            $query->orderBy('created_at', 'asc')->get(),
            $request
        )->values() // Reset keys after sorting
            ->map(function ($item, $index) {
                $item->row_num = $index + 1; // Add row number
                return $item;
            });


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

    public function exportPertanian(Request $request)
    {
        $query = PelatihanPetani::with('kelompokTani', 'jenisPelatihanPetani', 'kategoriKelompok', 'alasanPelatihan', 'masaAktifKelompok', 'documentVerifications');
        if ($request->has('jenis_pelatihan_petani') && $request->jenis_pelatihan_petani !== 'all') {
            $query->where('jenis_pelatihan_petani', $request->jenis_pelatihan_petani);
        }
        if ($request->has('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }
        $data = $this->filterByVerificationStatus(
            $query->orderBy('created_at', 'asc')->get(),
            $request
        )->sortByDesc('skor')->values() // Reset keys after sorting
            ->map(function ($item, $index) {
                $item->row_num = $index + 1; // Add row number
                return $item;
            });


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

    public function exportBlacklist(Request $request)
    {
        // Ambil data masing-masing tabel (pastikan alias kolom sama)
        $umkm = PelatihanUmkm::where('status', 3)
            ->select([
                'nik',
                'no_kk',
                'nama_lengkap as nama',
                'jalan as alamat',
                'kelurahan',
                'kecamatan',
                'status',
                DB::raw("'Pelatihan UMKM' as jenis_pelatihan")
            ])->get();

        $banmod = PelatihanBanmod::where('status', 3)
            ->select([
                'nik',
                'no_kk',
                'nama_lengkap as nama',
                'jalan_ktp as alamat',
                'kelurahan_ktp as kelurahan',
                'kecamatan_ktp as kecamatan',
                'status',
                DB::raw("'Pelatihan Penerima Banmod' as jenis_pelatihan")
            ])->get();

        $kerja = PelatihanKerjas::where('status', 3)
            ->select([
                'nik',
                'no_kk',
                'nama_lengkap as nama',
                'alamat',
                'nama_kelurahan as kelurahan',
                'nama_kecamatan as kecamatan',
                'status',
                DB::raw("'Pelatihan Pencari Kerja' as jenis_pelatihan")
            ])->get();

        $petani = PelatihanPetani::where('status', 3)
            ->select([
                'nik',
                'kk as no_kk',
                'nama_lengkap as nama',
                'alamat',
                'nama_kelurahan as kelurahan',
                'nama_kecamatan as kecamatan',
                'status',
                DB::raw("'Pelatihan Pertanian' as jenis_pelatihan")
            ])->get();

        // Gabungkan semua collection dan reset index
        $data = $umkm->concat($banmod)->concat($kerja)->concat($petani)->values();


        // Export Excel (BlacklistExport harus menerima Collection atau sesuaikan)
        if ($request->ext === 'excel') {
            return Excel::download(new BlacklistExport($data), 'Blacklist.xlsx');
        }

        // Export PDF
        $pdf = app(PDF::class);
        $pdf->setPaper('a4', 'landscape');
        $pdf->loadView('exports.blacklist-pdf', [
            'data' => $data,
        ]);

        return $pdf->stream('rekap-blacklist.pdf');
    }

    public function exportEkraf(Request $request)
    {
        $query = PelatihanEkonomiKreatif::with(['documentVerifications']);

        if ($request->has('jenis_pelatihan') && $request->jenis_pelatihan !== 'Semua Pelatihan') {
            $query->where('jenis_pelatihan', $request->jenis_pelatihan);
        }

        // Original DataTable logic
        if ($request->has('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }
        $data = $this->filterByVerificationStatus(
            $query->orderBy('created_at', 'asc')->get(),
            $request
        )->sortByDesc('skor')->values() // Reset keys after sorting
            ->map(function ($item, $index) {
                $item->row_num = $index + 1; // Add row number
                return $item;
            });


        // return response()->json($data);
        // Handle export type
        if ($request->ext === 'excel') {
            return Excel::download(new EkrafExport($data), 'Pelatihan-Ekraf.xlsx');
        }

        $pdf = app(PDF::class);
        $pdf->setPaper('a4', 'landscape');
        $pdf->loadView('exports.ekraf-pdf', [
            'data' => $data,
        ]);

        return $pdf->stream('rekap-ekraf.pdf');
    }
}
