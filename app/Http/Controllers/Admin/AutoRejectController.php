<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\PelatihanUmkm;
use App\Models\PelatihanKerjas;
use App\Models\PelatihanPetani;
use App\Models\PelatihanBanmod;

class AutoRejectController extends Controller
{
    public function autoRejectNik(Request $request)
    {
        try {
            DB::beginTransaction();

            $currentTable = $request->current_table;
            $currentId = $request->current_id;
            $nik = $request->nik;

            if (!$nik) {
                return response()->json([
                    'success' => false,
                    'message' => 'NIK tidak ditemukan'
                ], 400);
            }

            $rejectedCount = 0;

            // Auto-reject di tabel pelatihan UMKM (jika saat ini bukan dari tabel ini)
            if ($currentTable !== 'umkm') {
                $rejectedUmkm = PelatihanUmkm::where('nik', $nik)
                    ->where('status', '!=', 1) // Hanya yang belum lolos
                    ->where('status', '!=', 4) // Tidak update yang sudah ditolak karena lolos di tempat lain
                    ->update([
                        'status' => 4, // Ubah ke status 4
                        'updated_at' => now()
                    ]);
                $rejectedCount += $rejectedUmkm;
            }

            // Auto-reject di tabel pelatihan kerja (jika saat ini bukan dari tabel ini)
            if ($currentTable !== 'kerja') {
                $rejectedKerja = PelatihanKerjas::where('nik', $nik)
                    ->where('status', '!=', 1)
                    ->where('status', '!=', 4)
                    ->update([
                        'status' => 4, // Ubah ke status 4
                        'updated_at' => now()
                    ]);
                $rejectedCount += $rejectedKerja;
            }

            // Auto-reject di tabel pelatihan pertanian (jika saat ini bukan dari tabel ini)
            if ($currentTable !== 'pertanian') {
                $rejectedPertanian = PelatihanPetani::where('nik', $nik)
                    ->where('status', '!=', 1)
                    ->where('status', '!=', 4)
                    ->update([
                        'status' => 4, // Ubah ke status 4
                        'updated_at' => now()
                    ]);
                $rejectedCount += $rejectedPertanian;
            }

            // Auto-reject di tabel pelatihan banmod (jika saat ini bukan dari tabel ini)
            if ($currentTable !== 'banmod') {
                $rejectedBanmod = PelatihanBanmod::where('nik', $nik)
                    ->where('status', '!=', 1)
                    ->where('status', '!=', 4)
                    ->update([
                        'status' => 4, // Ubah ke status 4
                        'updated_at' => now()
                    ]);
                $rejectedCount += $rejectedBanmod;
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => "Auto-reject berhasil. {$rejectedCount} pendaftaran lain dengan NIK yang sama telah ditolak karena sudah lolos di pelatihan lain.",
                'rejected_count' => $rejectedCount
            ]);
        } catch (\Exception $e) {
            DB::rollback();

            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan saat auto-reject: ' . $e->getMessage()
            ], 500);
        }
    }
}
