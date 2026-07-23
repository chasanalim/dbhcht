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
use Illuminate\Support\Facades\Storage;
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
     * Replace/re-upload document file for any training type
     */
    public function replaceDocument(Request $request)
    {
        $request->validate([
            'training_type' => 'required|string',
            'id' => 'required',
            'document_type' => 'required|string',
            'file' => 'required|file|mimes:jpg,jpeg,png,pdf|max:5120',
        ]);

        $modelClass = $this->modelMap[$request->training_type] ?? null;
        if (!$modelClass) {
            return redirect()->back()->with('error', 'Invalid training type');
        }

        $data = $modelClass::findOrFail($request->id);
        $documentType = $request->document_type;
        $file = $request->file('file');

        // Mapping for each training type
        $columnMap = $this->getColumnMap($request->training_type);
        $column = $columnMap[$documentType] ?? ('file_' . $documentType);

        if (!isset($data->$column)) {
            return redirect()->back()->with('error', 'Dokumen tidak ditemukan');
        }

        $isImage = in_array($file->extension(), ['jpg', 'jpeg', 'png', 'gif', 'webp']);

        // Hapus file lama dari storage
        $oldFile = $data->$column;
        if ($oldFile && Storage::disk('public')->exists(str_replace('storage/', '', $oldFile))) {
            Storage::disk('public')->delete(str_replace('storage/', '', $oldFile));
        }

        // Simpan file baru - use same pattern as registration controllers
        $folder = $request->training_type === 'PELATIHAN_PERTANIAN'
            ? ($isImage ? "petani/{$documentType}" : "petani/file_{$documentType}")
            : "pelatihan/{$request->training_type}";

        Storage::disk('public')->makeDirectory($folder);

        if ($isImage && $request->training_type === 'PELATIHAN_PERTANIAN') {
            // Pertanian images: convert to webp
            $webpName = pathinfo($file->hashName(), PATHINFO_FILENAME) . '.webp';
            $image = \Intervention\Image\Laravel\Facades\Image::read($file)->toWebp(80);
            Storage::disk('public')->put("$folder/$webpName", (string) $image);
            $data->$column = "storage/$folder/$webpName";
        } else {
            $fileName = $file->hashName();
            $file->storeAs($folder, $fileName, 'public');
            $data->$column = "storage/$folder/$fileName";
        }

        $data->save();

        // Reset verifikasi dokumen
        $data->documentVerifications()
            ->where('document_type', $documentType)
            ->delete();

        return redirect()->back()->with('message', 'Dokumen berhasil diganti');
    }

    /**
     * Get column mapping for a training type
     */
    private function getColumnMap(string $trainingType): array
    {
        $maps = [
            'PELATIHAN_PERTANIAN' => [
                'foto' => 'file_foto',
                'ktp' => 'file_ktp',
                'kk' => 'file_kk',
                'pernyataan' => 'file_pernyataan_tidak_mengikuti_pelatihan_lain',
                'kesanggupan' => 'file_pernyataan_kesanggupan_ikut_pelatihan',
                'pengukuhan_penyuluh_swadaya' => 'file_pengukuhan_penyuluh_swadaya',
                'legalitas_kelompok' => 'file_legalitas_kelompok',
                'rekomendasi_kelompok' => 'file_rekomendasi_kelompok',
            ],
        ];

        return $maps[$trainingType] ?? [];
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
