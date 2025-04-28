<?php

namespace App\Traits;

use Illuminate\Support\Facades\Http;

trait GeneralTrait
{
    public function sendWhatsappMessage($message, $phoneNumber)
    {
        $url = env('EGREF_API_URL') . '/prod/hsm-text';

        Http::withBasicAuth(env('EGREF_USERNAME'), env('EGREF_PASSWORD'))->post($url, [
            "client_id" => "0572",
            "project_id" => "4711",
            "type" => "mapan_utility",
            "recipient_number" => $phoneNumber,
            "language_code" => "id",
            "params" => (object)[
                "1" => $message,
            ],
            "header" => (object)[
                "param" => "Banmod Dan Pelatihan"
            ],
        ]);
    }
}
