<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Data User</title>
</head>

<body style="font-family: 'Segoe UI', Arial, sans-serif; background-color: #f8f9fa; margin: 0; padding: 0;">
    <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <!-- Header -->
        <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #2d3748; margin: 0; font-size: 24px; font-weight: 600;">Data User</h1>
        </div>

        <!-- Main Content -->
        <div
            style="background-color: #ffffff; border-radius: 10px; padding: 30px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
            <table style="width: 100%; border-collapse: collapse;">
                <tr style="border-bottom: 1px solid #edf2f7;">
                    <td style="padding: 16px 0; color: #718096; width: 120px;"><strong>Nama</strong></td>
                    <td style="padding: 16px 0; color: #2d3748;">{{ $peserta->name }}</td>
                </tr>
                <tr style="border-bottom: 1px solid #edf2f7;">
                    <td style="padding: 16px 0; color: #718096;"><strong>NIK</strong></td>
                    <td style="padding: 16px 0; color: #2d3748;">{{ $peserta->nik }}</td>
                </tr>
                <tr style="border-bottom: 1px solid #edf2f7;">
                    <td style="padding: 16px 0; color: #718096;"><strong>KK</strong></td>
                    <td style="padding: 16px 0; color: #2d3748;">{{ $peserta->kk }}</td>
                </tr>
                <tr style="border-bottom: 1px solid #edf2f7;">
                    <td style="padding: 16px 0; color: #718096;"><strong>Tempat, Tgl Lahir</strong></td>
                    <td style="padding: 16px 0; color: #2d3748;">{{ $peserta->tmp_lhr }}, {{ $peserta->tgl_lhr }}</td>
                </tr>
                <tr style="border-bottom: 1px solid #edf2f7;">
                    <td style="padding: 16px 0; color: #718096;"><strong>Jenis Kelamin</strong></td>
                    <td style="padding: 16px 0; color: #2d3748;">{{ $peserta->jenis_kelamin }}</td>
                </tr>
                <tr style="border-bottom: 1px solid #edf2f7;">
                    <td style="padding: 16px 0; color: #718096;"><strong>Kecamatan</strong></td>
                    <td style="padding: 16px 0; color: #2d3748;">{{ $peserta->nama_kecamatan }}</td>
                </tr>
                <tr style="border-bottom: 1px solid #edf2f7;">
                    <td style="padding: 16px 0; color: #718096;"><strong>Kelurahan</strong></td>
                    <td style="padding: 16px 0; color: #2d3748;">{{ $peserta->nama_kelurahan }}</td>
                </tr>
                <tr style="border-bottom: 1px solid #edf2f7;">
                    <td style="padding: 16px 0; color: #718096;"><strong>RW</strong></td>
                    <td style="padding: 16px 0; color: #2d3748;">{{ $peserta->nama_rw }}</td>
                </tr>
                <tr style="border-bottom: 1px solid #edf2f7;">
                    <td style="padding: 16px 0; color: #718096;"><strong>RT</strong></td>
                    <td style="padding: 16px 0; color: #2d3748;">{{ $peserta->nama_rt }}</td>
                </tr>
                <tr>
                    <td style="padding: 16px 0; color: #718096;"><strong>No. HP</strong></td>
                    <td style="padding: 16px 0; color: #2d3748;">{{ $peserta->phone_number }}</td>
                </tr>
                <tr style="border-bottom: 1px solid #edf2f7;">
                    <td style="padding: 16px 0; color: #718096;"><strong>Alamat</strong></td>
                    <td style="padding: 16px 0; color: #2d3748;">{{ $peserta->alamat }}</td>
                </tr>
                @if ($peserta->isDomisili)
                    <tr style="border-bottom: 1px solid #edf2f7;">
                        <td style="padding: 16px 0; color: #718096;"><strong>Alamat Domisili</strong></td>
                        <td style="padding: 16px 0; color: #2d3748;">{{ $peserta->alamat_domisili }}</td>
                    </tr>
                @endif
                @if ($peserta->isUsaha)
                    <tr style="border-bottom: 1px solid #edf2f7;">
                        <td style="padding: 16px 0; color: #718096;"><strong>Alamat Usaha</strong></td>
                        <td style="padding: 16px 0; color: #2d3748;">{{ $peserta->alamat_usaha }}</td>
                    </tr>
                @endif

                <tr style="border-bottom: 1px solid #edf2f7;">
                    <td style="padding: 16px 0; color: #718096;"><strong>Daya Listrik</strong></td>
                    <td style="padding: 16px 0; color: #2d3748;">{{ $peserta->daya_listrik }}</td>
                </tr>
                @if ($peserta->isDisabilitas)

                    <tr style="border-bottom: 1px solid #edf2f7;">
                        <td style="padding: 16px 0; color: #718096;"><strong>Disabilitas</strong></td>
                        <td style="padding: 16px 0; color: #2d3748;">
                            {{ implode(', ', array_map(function($el){ return $el['label']; }, $peserta->disabilitas)); }}
                        </td>
                    </tr>
                @endif

                <tr style="border-bottom: 1px solid #edf2f7;">
                    <td style="padding: 16px 0; color: #718096;"><strong>Kategori</strong></td>
                    <td style="padding: 16px 0; color: #2d3748;">{{ $peserta->kategoriUsaha->nama }}</td>
                </tr>

                <tr style="border-bottom: 1px solid #edf2f7;">
                    <td style="padding: 16px 0; color: #718096;"><strong>Klaster Usaha</strong></td>
                    <td style="padding: 16px 0; color: #2d3748;">{{ $peserta->klasterUsaha->nama }}</td>
                </tr>
                @if ($peserta->kategori == 5)
                    <tr style="border-bottom: 1px solid #edf2f7;">
                        <td style="padding: 16px 0; color: #718096;"><strong>Jumlah Keluarga yang Ditanggung Dalam 1
                                KK</strong></td>
                        <td style="padding: 16px 0; color: #2d3748;">{{ $peserta->tanggunganKeluarga->nama }}</td>
                    </tr>

                    <tr style="border-bottom: 1px solid #edf2f7;">
                        <td style="padding: 16px 0; color: #718096;"><strong>Status Tempat Tinggal</strong></td>
                        <td style="padding: 16px 0; color: #2d3748;">{{ $peserta->statusTempatTinggal->nama }}</td>
                    </tr>
                @endif

                <tr style="border-bottom: 1px solid #edf2f7;">
                    <td style="padding: 16px 0; color: #718096;"><strong>Lama Usaha</strong></td>
                    <td style="padding: 16px 0; color: #2d3748;">{{ $peserta->lamaUsaha->nama }}</td>
                </tr>
                @if ($peserta->kategori != 5)
                    <tr style="border-bottom: 1px solid #edf2f7;">
                        <td style="padding: 16px 0; color: #718096;"><strong>Jumlah Tenaga Kerja</strong></td>
                        <td style="padding: 16px 0; color: #2d3748;">{{ $peserta->jumlahTenagaKerja->nama }}</td>
                    </tr>

                    <tr style="border-bottom: 1px solid #edf2f7;">
                        <td style="padding: 16px 0; color: #718096;"><strong>Pendapatan Kotor per Bulan</strong></td>
                        <td style="padding: 16px 0; color: #2d3748;">{{ $peserta->brutoPerbulan->nama }}</td>
                    </tr>
                @endif
                <tr style="border-bottom: 1px solid #edf2f7;">
                    <td style="padding: 16px 0; color: #718096;"><strong>Aset (Selain Tanah & Bangunan)</strong></td>
                    <td style="padding: 16px 0; color: #2d3748;">Rp {{ number_format($peserta->aset, 0, ',', '.') }}
                    </td>
                </tr>
                <tr style="border-bottom: 1px solid #edf2f7;">
                    <td style="padding: 16px 0; color: #718096;"><strong>Hutang</strong></td>
                    <td style="padding: 16px 0; color: #2d3748;">Rp {{ number_format($peserta->hutang, 0, ',', '.') }}
                    </td>
                </tr>
                @if ($peserta->kategori == 4)
                    <tr style="border-bottom: 1px solid #edf2f7;">
                        <td style="padding: 16px 0; color: #718096;"><strong>Jumlah Legalitas dan Standarisasi</strong>
                        </td>
                        <td style="padding: 16px 0; color: #2d3748;">{{ $peserta->jumlahLegalitas->nama }}</td>
                    </tr>

                    <tr style="border-bottom: 1px solid #edf2f7;">
                        <td style="padding: 16px 0; color: #718096;"><strong>Jumlah Teknologi Dalam Pemasaran</strong>
                        </td>
                        <td style="padding: 16px 0; color: #2d3748;">{{ $peserta->jumlahTeknologiDigital->nama }}</td>
                    </tr>

                    <tr style="border-bottom: 1px solid #edf2f7;">
                        <td style="padding: 16px 0; color: #718096;"><strong>Jumlah Rencana Penyerapan Tenaga Kerja
                                Miskin</strong></td>
                        <td style="padding: 16px 0; color: #2d3748;">{{ $peserta->penyerapanTenagaMiskin->nama }}</td>
                    </tr>
                @endif
            </table>
        </div>

        <!-- Footer -->
        <div style="margin-top: 30px; text-align: center; color: #718096; font-size: 14px;">
            <p style="margin: 0;">Email ini dikirim secara otomatis oleh sistem.</p>
            <p style="margin: 5px 0 0;">© {{ date('Y') }} Dinas Komunikasi dan Informatika. All rights reserved.
            </p>
        </div>
    </div>
</body>

</html>
