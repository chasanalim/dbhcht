<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;
use App\Models\PelatihanUmkm;
use App\Models\PelatihanBanmod;
use App\Models\PelatihanKerjas;
use App\Models\PelatihanPetani;
use App\Models\PendaftaranBanmod;
use App\Http\Controllers\Controller;
use App\Traits\HasVerifikasiDokumen;
use App\Models\PelatihanEkonomiKreatif;
use Illuminate\Testing\Fluent\Concerns\Has;

class VerifikasiDokumenController extends Controller
{
    use HasVerifikasiDokumen;

    protected $modelMap = [
        'PENDAFTARAN_BANMOD' => PendaftaranBanmod::class,
        'PELATIHAN_UMKM' => PelatihanUmkm::class,
        'PELATIHAN_KERJA' => PelatihanKerjas::class,
        'PELATIHAN_BANMOD' => PelatihanBanmod::class,
        'PELATIHAN_PERTANIAN' => PelatihanPetani::class,
        'PELATIHAN_EKRAF' => PelatihanEkonomiKreatif::class
    ];

    public function verify(Request $request)
    {
        $request->validate([
            'training_type' => 'required|string',
            'id' => 'required',
            'document_type' => 'required|string',
        ]);

        $modelClass = $this->modelMap[$request->training_type] ?? null;
        if (!$modelClass) {
            return redirect()->back()->with('error', 'Invalid training type');
        }

        $data = $modelClass::findOrFail($request->id);

        // Update verifikasi dokumen
        // Tambahkan verifikasi dokumen baru
        $data->documentVerifications()->create([
            'document_type' => $request->document_type,
            'verified_by' => auth()->id(),
            'verified_at' => now(),
            'status' => '1',
            'notes' => $request->notes,
            'pelatihan_type' => $request->training_type // Tambahkan ini
        ]);

        return redirect()->back()->with('message', 'Dokumen berhasil diverifikasi');
    }

    public function tolak(Request $request)
    {
        $request->validate([
            'training_type' => 'required|string',
            'id' => 'required',
            'document_type' => 'required|string',
        ]);

        $modelClass = $this->modelMap[$request->training_type] ?? null;
        if (!$modelClass) {
            return redirect()->back()->with('error', 'Invalid training type');
        }

        $data = $modelClass::findOrFail($request->id);

        // Update verifikasi dokumen
        // Tambahkan verifikasi dokumen baru
        $data->documentVerifications()->create([
            'document_type' => $request->document_type,
            'verified_by' => auth()->id(),
            'verified_at' => now(),
            'status' => '0',
            'notes' => $request->notes,
            'pelatihan_type' => $request->training_type // Tambahkan ini
        ]);

        return redirect()->back()->with('message', 'Dokumen berhasil ditolak');
    }

    /**
     * Reset verifikasi dokumen - Dinamis untuk semua jenis pelatihan
     */
    public function resetDocumentVerification(Request $request)
    {
        $request->validate([
            'training_type' => 'required|string',
            'id' => 'required',
            'document_type' => 'required|string',
        ]);

        // Dapatkan model class berdasarkan training type
        $modelClass = $this->modelMap[$request->training_type] ?? null;

        if (!$modelClass) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid training type'
            ], 422);
        }

        try {
            // Cari data berdasarkan id
            $data = $modelClass::findOrFail($request->id);

            // Hapus verifikasi dokumen sesuai document_type
            $deletedCount = $data->documentVerifications()
                ->where('document_type', $request->document_type)
                ->delete();

            if ($deletedCount === 0) {
                return response()->json([
                    'success' => false,
                    'message' => 'Verifikasi dokumen tidak ditemukan'
                ], 404);
            }

            return redirect()->back()->with('message', 'Verifikasi dokumen berhasil direset');
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan: ' . $e->getMessage()
            ], 500);
        }
    }
}
