<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Data User</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 30px;">
    <div style="background-color: #ffffff; padding: 20px; border-radius: 8px; max-width: 600px; margin: auto; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        <h2 style="color: #333;">📄 Data User</h2>

        <table style="width: 100%; font-size: 16px;">
            <tr>
                <td><strong>Nama:</strong></td>
                <td>{{ $peserta->nama }}</td>
            </tr>
            <tr>
                <td><strong>NIK:</strong></td>
                <td>{{ $peserta->nik }}</td>
            </tr>
            <tr>
                <td><strong>Alamat:</strong></td>
                <td>{{ $peserta->alamat }}</td>
            </tr>
            <tr>
                <td><strong>No. HP:</strong></td>
                <td>{{ $peserta->phone_number }}</td>
            </tr>
            <!-- Tambah data lain di sini -->
        </table>

        <p style="margin-top: 20px; color: #777;">Email ini dikirim otomatis oleh sistem Laravel App.</p>
    </div>
</body>
</html>
