<?php

namespace App\Ekports;

use App\Models\PendaftaranBanmod;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Style\Border;
use Maatwebsite\Excel\Concerns\WithHeadings;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use Maatwebsite\Excel\Concerns\FromCollection;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class BanmodExport implements FromCollection, WithHeadings, WithStyles
{
    protected $data;

    public function __construct($data)
    {
        $this->data = $data;
    }

    public function collection()
    {
        return $this->data->map(function ($item, $index) {
            return [
                'no' => $item->row_num,
                'nik' => $item->nik,
                'nama' => $item->name,
                'no_hp' => $item->phone_number,
                'desil' => $item->desil ?? '',
                'alamat' => $item->alamat,
                'rt' => $item->nama_rt,
                'rw' => $item->nama_rw,
                'kelurahan' => $item->nama_kelurahan,
                'kecamatan' => $item->nama_kecamatan,
                'kategori' => $item->kategoriUsaha?->nama,
                'klaster_usaha' => $item->klasterUsaha?->nama,
                'skor' => number_format($item->skor, 2),
                'verifikasi' => $this->getVerificationStatus($item)
            ];
        });
    }

    public function headings(): array
    {
        return [
            ['DAFTAR PESERTA BANTUAN MODAL KOTA KEDIRI'],
            ['TAHUN ANGGARAN '],
            [''],
            [
                'NO',
                'NIK',
                'NAMA',
                'NO HP',
                'DESIL',
                'ALAMAT',
                'RT',
                'RW',
                'KELURAHAN',
                'KECAMATAN',
                'KATEGORI',
                'KLASTER USAHA',
                'SKOR',
                'STATUS VERIFIKASI'
            ]
        ];
    }

    private function getVerificationStatus($item)
    {
        $verifications = $item->documentVerifications;
        $requiredDocs = $item->requiredDocuments();
        $allVerified = count($verifications) === count($requiredDocs);
        $allApproved = $verifications->every(fn($v) => $v->status === 1);

        if ($allVerified && $allApproved) return 'Terverifikasi';
        if ($allVerified && !$allApproved) return 'Tidak Memenuhi Syarat';
        return 'Belum diverifikasi';
    }

    public function styles(Worksheet $sheet)
    {
        $sheet->mergeCells('A1:N1');
        $sheet->mergeCells('A2:N2');

        // Header style
        $sheet->getStyle('A1:N1')->applyFromArray([
            'font' => [
                'bold' => true,
                'size' => 12
            ],
            'alignment' => [
                'horizontal' => Alignment::HORIZONTAL_CENTER,
                'vertical' => Alignment::VERTICAL_CENTER
            ]
        ]);
        $sheet->getStyle('A2:N2')->applyFromArray([
            'font' => [
                'bold' => true,
                'size' => 12
            ],
            'alignment' => [
                'horizontal' => Alignment::HORIZONTAL_CENTER,
                'vertical' => Alignment::VERTICAL_CENTER
            ]
        ]);


        // Table header style
        $sheet->getStyle('A4:N4')->applyFromArray([
            'font' => [
                'bold' => true
            ],
            'borders' => [
                'allBorders' => [
                    'borderStyle' => Border::BORDER_THIN
                ]
            ],
            'fill' => [
                'fillType' => Fill::FILL_SOLID,
                'startColor' => [
                    'rgb' => 'E2EFDA'
                ]
            ],
            'alignment' => [
                'horizontal' => Alignment::HORIZONTAL_CENTER
            ]
        ]);

        // Set column widths
        $sheet->getColumnDimension('A')->setWidth(5);
        $sheet->getColumnDimension('B')->setWidth(20);
        $sheet->getColumnDimension('C')->setWidth(25);
        $sheet->getColumnDimension('D')->setWidth(15);
        $sheet->getColumnDimension('E')->setWidth(10);
        $sheet->getColumnDimension('F')->setWidth(35);
        $sheet->getColumnDimension('G')->setWidth(5);
        $sheet->getColumnDimension('H')->setWidth(5);
        $sheet->getColumnDimension('I')->setWidth(15);
        $sheet->getColumnDimension('J')->setWidth(15);
        $sheet->getColumnDimension('K')->setWidth(25);
        $sheet->getColumnDimension('L')->setWidth(20);
        $sheet->getColumnDimension('M')->setWidth(10);
        $sheet->getColumnDimension('N')->setWidth(30);

        return $sheet;
    }
}
