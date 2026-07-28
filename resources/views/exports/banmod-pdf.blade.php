<!DOCTYPE html>
<html>

<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title>Peserta Bantuan Modal </title>
    <style>
        @page {
            size: landscape;
            margin: 1cm;
        }

        body {
            font-family: Arial, sans-serif;
            font-size: 12px;
        }

        .header {
            text-align: center;
            margin-bottom: 20px;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
            font-size: 11px;
        }

        th {
            padding: 4px;
            border: 1px solid #b8b5b5;
            background-color: #ddd7d7;
            font-weight: bold;
            text-align: center;
        }

        td {
            padding: 4px;
            border: 1px solid #c4c2c2;
            vertical-align: top;
            word-wrap: break-word;
        }

        .numeric {
            text-align: right;
        }

        .center {
            text-align: center;
        }

        .status-verified {
            color: green;
            font-weight: bold;
        }

        .status-rejected {
            color: red;
            font-weight: bold;
        }

        .status-pending {
            color: orange;
            font-weight: bold;
        }
    </style>
</head>

<body>
    <div class="header">
        <h4 style="margin: 0;">DAFTAR PESERTA BANTUAN MODAL KOTA KEDIRI</h4>
        <h4 style="margin: 0;">TAHUN ANGGARAN</h4>
    </div>

    <table autosize="1">
        <thead>
            <tr>
                <th width="3%">NO</th>
                <th width="10%">NIK</th>
                <th width="12%">NAMA</th>
                <th width="8%">NO HP</th>
                <th width="15%">ALAMAT</th>
                <th width="3%">RT</th>
                <th width="3%">RW</th>
                <th width="8%">KELURAHAN</th>
                <th width="8%">KECAMATAN</th>
                <th width="8%">KATEGORI</th>
                <th width="8%">KLASTER USAHA</th>
                <th width="6%">SKOR</th>
                <th width="8%">STATUS VERIFIKASI</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($data as $index => $item)
                <tr>
                    <td class="center">{{ $item->row_num }}</td>
                    <td>{{ $item->nik }}</td>
                    <td>{{ $item->name }}</td>
                    <td>{{ $item->phone_number }}</td>
                    <td>{{ $item->alamat }}</td>
                    <td class="center">{{ $item->nama_rt }}</td>
                    <td class="center">{{ $item->nama_rw }}</td>
                    <td>{{ $item->nama_kelurahan }}</td>
                    <td>{{ $item->nama_kecamatan }}</td>
                    <td>{{ $item->kategoriUsaha?->nama }}</td>
                    <td>{{ $item->klasterUsaha?->nama }}</td>
                    <td class="numeric">{{ number_format($item->skor, 2) }}</td>
                    <td class="center">
                        @php
                            $verifications = $item->documentVerifications;
                            $requiredDocs = App\Models\PendaftaranBanmod::getRequiredDocuments($item->kategori);
                            $allVerified = count($verifications) === count($requiredDocs);
                            $allApproved = $verifications->every(fn($v) => $v->status === 1);
                        @endphp
                        <span
                            class="status-{{ $allVerified && $allApproved ? 'verified' : ($allVerified && !$allApproved ? 'rejected' : 'pending') }}">
                            @if ($allVerified && $allApproved)
                                Terverifikasi
                            @elseif($allVerified && !$allApproved)
                                Tidak Memenuhi Syarat
                            @else
                                Belum diverifikasi
                            @endif
                        </span>
                    </td>
                </tr>
            @endforeach
        </tbody>
    </table>
</body>

</html>
