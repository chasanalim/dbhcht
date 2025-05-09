<?php

namespace App\Traits;

use App\Models\VerifikasiDokumen;

trait HasVerifikasiDokumen
{
    public function documentVerifications()
    {
        return $this->morphMany(VerifikasiDokumen::class, 'verifiable', 'pelatihan_type', 'pelatihan_id');
    }

    public function isDocumentVerified($documentType)
    {
        return $this->documentVerifications()
            ->where('document_type', $documentType)
            ->exists();
    }

    public function verifyDocument($documentType, $notes = null)
    {
        return $this->documentVerifications()->create([
            'document_type' => $documentType,
            'verified_by' => auth()->id(),
            'verified_at' => now(),
            'notes' => $notes
        ]);
    }
}
