<?php

namespace App\Ekports;

use App\Ekports\Concerns\FormatsParticipantStatus;
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

class PelBanmodExport extends DefaultValueBinder implements FromCollection, WithHeadings, WithStyles, WithCustomValueBinder
{
    use FormatsParticipantStatus;

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
                'tahun_penerimaan' => $item->tahun_penerimaan,
                'nik' => $item->nik,
                'no_kk' => $item->no_kk,
                'desil' => $item->desil ?? '',
                'nama' => $item->nama_lengkap,
                'alamat' => $item->jalan_ktp,
                'rt' => $item->rt_ktp,
                'rw' => $item->rw_ktp,
                'kelurahan' => $item->kelurahan_ktp,
                'kecamatan' => $item->kecamatan_ktp,
                'no_hp' => $item->no_hp,
                'ketrampilan' => $item->jenis_pelatihan_industri,
                'skor' => number_format($item->skor, 2),
                'verifikasi' => $item->getDocumentVerificationStatusLabel(),
                'status' => $this->participantStatusLabel($item->status),
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
            ['DAFTAR PESERTA PELATIHAN BANTUAN MODAL KOTA KEDIRI'],
            ['TAHUN ANGGARAN'],
            [''],
            [
                'NO',
                'TAHUN PENERIMAAN',
                'NIK',
                'NO KK',
                'DESIL',
                'NAMA',
                'ALAMAT',
                'RT',
                'RW',
                'KELURAHAN',
                'KECAMATAN',
                'NO HP',
                'KETRAMPILAN',
                'SKOR',
                'STATUS VERIFIKASI',
                'STATUS'
            ]
        ];
    }

    public function styles(Worksheet $sheet)
    {
        $lastColumn = 'P'; // Column for STATUS VERIFIKASI
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
        $sheet->getColumnDimension('B')->setWidth(15);  // TAHUN PENERIMAAN
        $sheet->getColumnDimension('C')->setWidth(20);  // NIK
        $sheet->getColumnDimension('D')->setWidth(20);  // NO KK
        $sheet->getColumnDimension('E')->setWidth(10);  // DESIL
        $sheet->getColumnDimension('F')->setWidth(30);  // NAMA
        $sheet->getColumnDimension('G')->setWidth(35);  // ALAMAT
        $sheet->getColumnDimension('H')->setWidth(5);   // RT
        $sheet->getColumnDimension('I')->setWidth(5);   // RW
        $sheet->getColumnDimension('J')->setWidth(15);  // KELURAHAN
        $sheet->getColumnDimension('K')->setWidth(15);  // KECAMATAN
        $sheet->getColumnDimension('L')->setWidth(15);  // NO HP
        $sheet->getColumnDimension('M')->setWidth(25);  // KETRAMPILAN
        $sheet->getColumnDimension('N')->setWidth(10);  // SKOR
        $sheet->getColumnDimension('O')->setWidth(20);  // STATUS VERIFIKASI
        $sheet->getColumnDimension('P')->setWidth(20);  // STATUS

        // Center specific columns
        $sheet->getStyle('A5:A' . $lastRow)->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER); // NO
        $sheet->getStyle('B5:B' . $lastRow)->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER); // TAHUN
        $sheet->getStyle('E5:E' . $lastRow)->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER); // DESIL
        $sheet->getStyle('H5:I' . $lastRow)->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER); // RT/RW
        $sheet->getStyle('N5:P' . $lastRow)->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER); // SKOR & STATUS

        // Format NIK, NO KK and NO HP as text so long numbers are not truncated by Excel
        $sheet->getStyle('C5:C' . $lastRow)->getNumberFormat()->setFormatCode('@'); // NIK
        $sheet->getStyle('D5:D' . $lastRow)->getNumberFormat()->setFormatCode('@'); // NO KK
        $sheet->getStyle('L5:L' . $lastRow)->getNumberFormat()->setFormatCode('@'); // NO HP

        return $sheet;
    }
}
