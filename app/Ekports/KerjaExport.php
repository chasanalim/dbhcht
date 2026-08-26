<?php

namespace App\Ekports;

use PhpOffice\PhpSpreadsheet\Style\Fill;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Style\Border;
use Maatwebsite\Excel\Concerns\WithHeadings;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use Maatwebsite\Excel\Concerns\FromCollection;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use PhpOffice\PhpSpreadsheet\Cell\Cell;
use PhpOffice\PhpSpreadsheet\Cell\DataType;
use PhpOffice\PhpSpreadsheet\Cell\DefaultValueBinder;
use Maatwebsite\Excel\Concerns\WithCustomValueBinder;

class KerjaExport extends DefaultValueBinder implements FromCollection, WithHeadings, WithStyles, WithCustomValueBinder
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
                'tempat_lahir' => $item->tmp_lhr,
                'jenis_kelamin' => $item->jenis_kelamin == 'L' ? 'Laki-laki' : 'Perempuan',
                'alamat' => $item->alamat,
                'kecamatan' => $item->nama_kecamatan,
                'no_hp' => $item->phone_number,
                'pendidikan' => $item->refPendidikan?->nama,
                'pelatihan' => $item->jenisPelatihan?->nama,
                // 'verifikasi' => $this->getVerificationStatus($item)
                'status' => [
                    '1' => 'Lolos',
                    '2' => 'Tidak Lolos',
                    '3' => 'Blacklist',
                    '4' => 'Lolos Pelatihan Lain',
                ][$item->status] ?? 'Belum Diverifikasi',
            ];
        });
    }

    public function bindValue(Cell $cell, $value)
    {
        if (
            is_string($value)
            && is_numeric($value)
            && !str_contains($value, '.')
            && strlen($value) >= 12
        ) {
            $cell->setValueExplicit($value, DataType::TYPE_STRING);
            return true;
        }

        return parent::bindValue($cell, $value);
    }

    public function headings(): array
    {
        return [
            ['DAFTAR PESERTA PELATIHAN PENCARI KERJA KOTA KEDIRI'],
            ['TAHUN ANGGARAN '],
            [''],
            [
                'NO',
                'NIK',
                'NO KK',
                'NAMA',
                'TEMPAT LAHIR',
                'JENIS KELAMIN',
                'ALAMAT',
                'KECAMATAN',
                'NO HP',
                'PENDIDIKAN',
                'PELATIHAN',
                // 'STATUS VERIFIKASI',
                'STATUS'
            ]
        ];
    }

    private function getVerificationStatus($item)
    {
        $verifications = $item->documentVerifications;
        $requiredDocs = ['ktp', 'kk'];
        $allVerified = count($verifications) === count($requiredDocs);
        $allApproved = $verifications->every(fn($v) => $v->status === 1);

        if ($allVerified && $allApproved) return 'Terverifikasi';
        if ($allVerified && !$allApproved) return 'Tidak Memenuhi Syarat';
        return 'Belum diverifikasi';
    }

    public function styles(Worksheet $sheet)
    {
        $lastColumn = 'L'; // Column for STATUS VERIFIKASI
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
        $sheet->getColumnDimension('A')->setWidth(5);   // NO
        $sheet->getColumnDimension('B')->setWidth(20);  // NIK
        $sheet->getColumnDimension('C')->setWidth(20);  // NO KK
        $sheet->getColumnDimension('D')->setWidth(30);  // NAMA
        $sheet->getColumnDimension('E')->setWidth(20);  // TEMPAT LAHIR
        $sheet->getColumnDimension('F')->setWidth(15);  // JENIS KELAMIN
        $sheet->getColumnDimension('G')->setWidth(35);  // ALAMAT
        $sheet->getColumnDimension('H')->setWidth(20);  // KECAMATAN
        $sheet->getColumnDimension('I')->setWidth(15);  // NO HP
        $sheet->getColumnDimension('J')->setWidth(20);  // PENDIDIKAN
        $sheet->getColumnDimension('K')->setWidth(25);  // PELATIHAN
        $sheet->getColumnDimension('L')->setWidth(20);  // STATUS VERIFIKASI

        // Center specific columns
        $sheet->getStyle('A5:A' . $lastRow)->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER); // NO
        $sheet->getStyle('F5:F' . $lastRow)->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER); // JENIS KELAMIN
        $sheet->getStyle('L5:L' . $lastRow)->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER); // SKOR & STATUS

        // Format NIK, NO KK and NO HP as text so long numbers are not truncated by Excel
        $sheet->getStyle('B5:B' . $lastRow)->getNumberFormat()->setFormatCode('@'); // NIK
        $sheet->getStyle('C5:C' . $lastRow)->getNumberFormat()->setFormatCode('@'); // NO KK
        $sheet->getStyle('I5:I' . $lastRow)->getNumberFormat()->setFormatCode('@'); // NO HP

        return $sheet;
    }
}
