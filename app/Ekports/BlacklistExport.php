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

class BlacklistExport extends DefaultValueBinder implements FromCollection, WithHeadings, WithStyles, WithCustomValueBinder
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
                'no' => $index + 1,
                'nik' => $item->nik,
                'no_kk' => $item->no_kk,
                'nama' => $item->nama,
                'alamat' => $item->alamat,
                'kelurahan' => $item->kelurahan,
                'kecamatan' => $item->kecamatan,
                'pelatihan' => $item->jenis_pelatihan,
                'status' => $item->status == 3 ? 'Blacklist' : 'Blacklist',
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
            ['DAFTAR PESERTA DAFTAR HITAM DBHCHT KOTA KEDIRI'],
            ['TAHUN ANGGARAN'],
            [''],
            [
                'NO',
                'NIK',
                'NO KK',
                'NAMA',
                'ALAMAT',
                'KELURAHAN',
                'KECAMATAN',
                'JENIS PELATIHAN',
                'STATUS '
            ]
        ];
    }

    public function styles(Worksheet $sheet)
    {
        $lastColumn = 'I'; // Column for STATUS VERIFIKASI
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
        $sheet->getColumnDimension('E')->setWidth(35);  // ALAMAT
        $sheet->getColumnDimension('F')->setWidth(20);  // KELURAHAN
        $sheet->getColumnDimension('G')->setWidth(20);  // KECAMATAN
        $sheet->getColumnDimension('H')->setWidth(25);  // PELATIHAN
        $sheet->getColumnDimension('I')->setWidth(20);  // STATUS

        // Center specific columns
        $sheet->getStyle('A5:A' . $lastRow)->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER); // NO
        $sheet->getStyle('I5:I' . $lastRow)->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER); // SKOR & STATUS

        // Format NIK and NO KK as text so long numbers are not truncated by Excel
        $sheet->getStyle('B5:B' . $lastRow)->getNumberFormat()->setFormatCode('@'); // NIK
        $sheet->getStyle('C5:C' . $lastRow)->getNumberFormat()->setFormatCode('@'); // NO KK

        return $sheet;
    }
}
