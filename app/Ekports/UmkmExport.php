<?php

namespace App\Ekports;

use PhpOffice\PhpSpreadsheet\Style\Fill;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Style\Border;
use Maatwebsite\Excel\Concerns\WithHeadings;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use Maatwebsite\Excel\Concerns\FromCollection;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class UmkmExport implements FromCollection, WithHeadings, WithStyles
{
    protected $data;

    public function __construct($data)
    {
        $this->data = $data;
    }

    public function collection()
    {
        return $this->data->map(function ($item) {
            return [
                'no' => $item->row_num,
                'nik' => $item->nik,
                'no_kk' => $item->no_kk,
                'nama' => $item->nama_lengkap,
                'tempat_lahir' => $item->tempat_lahir,
                'tgl_lahir' => $item->tgl_lahir,
                'alamat' => $item->jalan,
                'kecamatan' => $item->kecamatan,
                'no_hp' => $item->no_hp,
                'prioritas_1' => $item->prioritas_1,
                'prioritas_2' => $item->prioritas_2,
                'prioritas_3' => $item->prioritas_3,
                'skor' => number_format($item->skor, 2),
                // 'verifikasi' => $this->getVerificationStatus($item),
                'status' => [
                    '1' => 'Lolos',
                    '2' => 'Tidak Lolos',
                    '3' => 'Blacklist',
                    '4' => 'Lolos Pelatihan Lain',
                ][$item->status] ?? 'Belum Diverifikasi',
            ];
        });
    }

    public function headings(): array
    {
        return [
            ['DAFTAR PESERTA PELATIHAN UMKM KOTA KEDIRI'],
            ['TAHUN ANGGARAN '],
            [''],
            [
                'NO',
                'NIK',
                'NO KK',
                'NAMA',
                'TEMPAT LAHIR',
                'TGL LAHIR',
                'ALAMAT',
                'KECAMATAN',
                'NO HP',
                'PRIORITAS 1',
                'PRIORITAS 2',
                'PRIORITAS 3',
                'SKOR',
                // 'STATUS VERIFIKASI',
                'STATUS'
            ]
        ];
    }

    private function getVerificationStatus($item)
    {
        $verifications = $item->documentVerifications;
        $requiredDocs = ['foto', 'ktp', 'kk', 'pernyataan'];
        $allVerified = count($verifications) === count($requiredDocs);
        $allApproved = $verifications->every(fn($v) => $v->status === 1);

        if ($allVerified && $allApproved) return 'Terverifikasi';
        if ($allVerified && !$allApproved) return 'Tidak Memenuhi Syarat';
        return 'Belum diverifikasi';
    }

    public function styles(Worksheet $sheet)
    {
        $lastColumn = 'N'; // Column for STATUS VERIFIKASI
        $lastRow = $sheet->getHighestRow();

        // Merge title cells
        $sheet->mergeCells("A1:{$lastColumn}1");
        $sheet->mergeCells("A2:{$lastColumn}2");

        // Title styles
        $sheet->getStyle('A1:A2')->applyFromArray([
            'font' => [
                'bold' => true,
                'size' => 14
            ],
            'alignment' => [
                'horizontal' => Alignment::HORIZONTAL_CENTER,
                'vertical' => Alignment::VERTICAL_CENTER
            ]
        ]);

        // Headers style
        $sheet->getStyle("A4:{$lastColumn}4")->applyFromArray([
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
                'horizontal' => Alignment::HORIZONTAL_CENTER,
                'vertical' => Alignment::VERTICAL_CENTER
            ]
        ]);

        // Data styles
        $sheet->getStyle("A5:{$lastColumn}{$lastRow}")->applyFromArray([
            'borders' => [
                'allBorders' => [
                    'borderStyle' => Border::BORDER_THIN
                ]
            ],
            'alignment' => [
                'vertical' => Alignment::VERTICAL_CENTER
            ]
        ]);

        // Set column widths
        $sheet->getColumnDimension('A')->setWidth(5);  // NO
        $sheet->getColumnDimension('B')->setWidth(20); // NIK
        $sheet->getColumnDimension('C')->setWidth(20); // NO KK
        $sheet->getColumnDimension('D')->setWidth(30); // NAMA
        $sheet->getColumnDimension('E')->setWidth(20); // TEMPAT LAHIR
        $sheet->getColumnDimension('F')->setWidth(15); // TGL LAHIR
        $sheet->getColumnDimension('G')->setWidth(35); // ALAMAT
        $sheet->getColumnDimension('H')->setWidth(20); // KECAMATAN
        $sheet->getColumnDimension('I')->setWidth(15); // NO HP
        $sheet->getColumnDimension('J')->setWidth(30); // PRIORITAS 1
        $sheet->getColumnDimension('K')->setWidth(30); // PRIORITAS 2
        $sheet->getColumnDimension('L')->setWidth(30); // PRIORITAS 3
        $sheet->getColumnDimension('M')->setWidth(10); // SKOR
        $sheet->getColumnDimension('N')->setWidth(20); // STATUS VERIFIKASI

        // Center specific columns
        $sheet->getStyle('A5:A'.$lastRow)->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER); // NO
        $sheet->getStyle('M5:N'.$lastRow)->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER); // SKOR & STATUS

        return $sheet;
    }
}
