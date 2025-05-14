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
use Illuminate\Testing\Fluent\Concerns\Has;

class VerifikasiDokumenController extends Controller
{
    use HasVerifikasiDokumen;

    protected $modelMap = [
        'PENDAFTARAN_BANMOD' => PendaftaranBanmod::class,
        'PELATIHAN_UMKM' => PelatihanUmkm::class,
        'PELATIHAN_KERJA' => PelatihanKerjas::class,
        'PELATIHAN_BANMOD' => PelatihanBanmod::class,
        'PELATIHAN_PERTANIAN' => PelatihanPetani::class
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
}
