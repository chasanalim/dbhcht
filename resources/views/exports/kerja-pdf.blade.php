<!DOCTYPE html>
<html>

<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title>Peserta Pelatihan Kerja DBHCHT 2025</title>
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
        <h4 style="margin: 0;">DAFTAR PESERTA PELATIHAN PENCARI KERJA KOTA KEDIRI</h4>
        <h4 style="margin: 0;">TAHUN ANGGARAN 2025</h4>
    </div>

    <table autosize="1">
        <thead>
            <tr>
                <th width="3%">NO</th>
                <th width="8%">NIK</th>
                <th width="8%">NO KK</th>
                <th width="10%">NAMA</th>
                <th width="7%">TEMPAT LAHIR</th>
                <th width="7%">TGL LAHIR</th>
                <th width="10%">ALAMAT</th>
                <th width="3%">RT</th>
                <th width="3%">RW</th>
                <th width="7%">KELURAHAN</th>
                <th width="7%">KECAMATAN</th>
                <th width="7%">NO HP</th>
                <th width="7%">PENDIDIKAN</th>
                <th width="7%">JENIS PELATIHAN</th>
                <th width="7%">ALASAN PELATIHAN</th>
                {{-- <th width="8%">VERIFIKASI DOKUMEN</th> --}}
                <th width="8%">STATUS</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($data as $index => $item)
            <tr>
                <td class="center">{{ $item->row_num }}</td>
                <td>{{ $item->nik }}</td>
                <td>{{ $item->no_kk }}</td>
                <td>{{ $item->nama_lengkap }}</td>
                <td>{{ $item->tmp_lhr }}</td>
                <td>{{ $item->tgl_lhr }}</td>
                <td>{{ $item->alamat }}</td>
                <td class="center">{{ $item->nama_rt }}</td>
                <td class="center">{{ $item->nama_rw }}</td>
                <td>{{ $item->nama_kelurahan }}</td>
                <td>{{ $item->nama_kecamatan }}</td>
                <td>{{ $item->phone_number }}</td>
                <td>{{ $item->refPendidikan?->nama }}</td>
                <td>{{ $item->jenisPelatihan?->nama }}</td>
                <td>{{ $item->alasanPelatihan?->nama }}</td>
                {{-- <td class="center">
                    @php
                    $verifications = $item->documentVerifications;
                    $requiredDocs = ['ktp', 'kk'];
                    $allVerified = count($verifications) === count($requiredDocs);
                    $allApproved = $verifications->every(fn($v) => $v->status === 1);
                    @endphp
                    <span class="status-{{ $allVerified && $allApproved ? 'verified' : ($allVerified && !$allApproved ? 'rejected' : 'pending') }}">
                        @if($allVerified && $allApproved)
                        Terverifikasi
                        @elseif($allVerified && !$allApproved)
                        Tidak Memenuhi Syarat
                        @else
                        Belum diverifikasi
                        @endif
                    </span>
                </td> --}}
                <td>
                    @switch($item->status)
                        @case(1)
                            Lulus
                            @break
                        @case(2)
                            Tidak Lulus
                            @break
                        @case(3)
                            Blacklist
                            @break
                        @case(4)
                            Lulus Pelatihan Lain
                            @break
                        @default
                            Belum diverifikasi
                    @endswitch
                </td>
            </tr>
            @endforeach
        </tbody>
    </table>
</body>

</html>
