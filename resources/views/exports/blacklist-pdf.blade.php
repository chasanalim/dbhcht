<!DOCTYPE html>
<html>

<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title>Peserta Daftar Hitam DBHCHT </title>
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
        <h4 style="margin: 0;">DAFTAR PESERTA DAFTAR HITAM</h4>
        <h4 style="margin: 0;">TAHUN ANGGARAN </h4>
    </div>

    <table autosize="1">
        <thead>
            <tr>
                <th >NO</th>
                <th >NIK</th>
                <th >NO KK</th>
                <th >NAMA</th>
                <th >ALAMAT</th>
                <th >KELURAHAN</th>
                <th >KECAMATAN</th>
                <th >JENIS PELATIHAN</th>
                <th >STATUS</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($data as $index => $item)
            <tr>
                <td class="center">{{ $index + 1 }}</td>
                <td>{{ $item->nik }}</td>
                <td>{{ $item->no_kk }}</td>
                <td>{{ $item->nama }}</td>
                <td>{{ $item->alamat }}</td>
                <td>{{ $item->kelurahan }}</td>
                <td>{{ $item->kecamatan }}</td>
                <td>{{ $item->jenis_pelatihan }}</td>
                <td>BLACKLIST</td>
            </tr>
            @endforeach
        </tbody>
    </table>
</body>

</html>
