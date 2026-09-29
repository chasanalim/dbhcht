<?php

namespace App\Ekports\Concerns;

trait FormatsParticipantStatus
{
    protected function participantStatusLabel($status): string
    {
        return match ((int) $status) {
            0 => '-',
            1 => 'Lolos',
            2 => 'Tidak Lolos',
            3 => 'Blacklist',
            4 => 'Ditolak - Lolos di Pelatihan Lain',
            default => '-',
        };
    }
}
