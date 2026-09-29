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

class KerjaExport extends DefaultValueBinder implements FromCollection, WithHeadings, WithStyles, WithCustomValueBinder
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
                'nik' => $item->nik,
                'no_kk' => $item->no_kk,
                'desil' => $item->desil ?? '',
                'nama' => $item->nama_lengkap,
                'tempat_lahir' => $item->tmp_lhr,
                'jenis_kelamin' => $item->jenis_kelamin == 'L' ? 'Laki-laki' : 'Perempuan',
                'alamat' => $item->alamat,
                'kelurahan' => $item->nama_kelurahan,
                'kecamatan' => $item->nama_kecamatan,
                'no_hp' => $item->phone_number,
                'pendidikan' => $item->refPendidikan?->nama,
                'pelatihan' => $item->jenisPelatihan?->nama,
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
            ['DAFTAR PESERTA PELATIHAN PENCARI KERJA KOTA KEDIRI'],
            ['TAHUN ANGGARAN '],
            [''],
            [
                'NO',
                'NIK',
                'NO KK',
                'DESIL',
                'NAMA',
                'TEMPAT LAHIR',
                'JENIS KELAMIN',
                'ALAMAT',
                'KELURAHAN',
                'KECAMATAN',
                'NO HP',
                'PENDIDIKAN',
                'PELATIHAN',
                'STATUS VERIFIKASI',
                'STATUS'
            ]
        ];
    }

    public function styles(Worksheet $sheet)
    {
        $lastColumn = 'O'; // Column for STATUS VERIFIKASI
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
        $sheet->getColumnDimension('D')->setWidth(10);  // DESIL
        $sheet->getColumnDimension('E')->setWidth(30);  // NAMA
        $sheet->getColumnDimension('F')->setWidth(20);  // TEMPAT LAHIR
        $sheet->getColumnDimension('G')->setWidth(15);  // JENIS KELAMIN
        $sheet->getColumnDimension('H')->setWidth(35);  // ALAMAT
        $sheet->getColumnDimension('I')->setWidth(20);  // KELURAHAN
        $sheet->getColumnDimension('J')->setWidth(20);  // KECAMATAN
        $sheet->getColumnDimension('K')->setWidth(15);  // NO HP
        $sheet->getColumnDimension('L')->setWidth(20);  // PENDIDIKAN
        $sheet->getColumnDimension('M')->setWidth(25);  // PELATIHAN
        $sheet->getColumnDimension('N')->setWidth(20);  // STATUS VERIFIKASI
        $sheet->getColumnDimension('O')->setWidth(20);  // STATUS

        // Center specific columns
        $sheet->getStyle('A5:A' . $lastRow)->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER); // NO
        $sheet->getStyle('D5:D' . $lastRow)->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER); // DESIL
        $sheet->getStyle('G5:G' . $lastRow)->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER); // JENIS KELAMIN
        $sheet->getStyle('M5:O' . $lastRow)->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER); // PELATIHAN & STATUS

        // Format NIK, NO KK and NO HP as text so long numbers are not truncated by Excel
        $sheet->getStyle('B5:B' . $lastRow)->getNumberFormat()->setFormatCode('@'); // NIK
        $sheet->getStyle('C5:C' . $lastRow)->getNumberFormat()->setFormatCode('@'); // NO KK
        $sheet->getStyle('K5:K' . $lastRow)->getNumberFormat()->setFormatCode('@'); // NO HP

        return $sheet;
    }
}
