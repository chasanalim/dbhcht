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
        <div style="background-color: #ffffff; border-radius: 10px; padding: 30px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
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
                    <td style="padding: 16px 0; color: #718096;"><strong>Alamat</strong></td>
                    <td style="padding: 16px 0; color: #2d3748;">{{ $peserta->alamat }}</td>
                </tr>
                <tr>
                    <td style="padding: 16px 0; color: #718096;"><strong>No. HP</strong></td>
                    <td style="padding: 16px 0; color: #2d3748;">{{ $peserta->phone_number }}</td>
                </tr>
            </table>
        </div>

        <!-- Footer -->
        <div style="margin-top: 30px; text-align: center; color: #718096; font-size: 14px;">
            <p style="margin: 0;">Email ini dikirim secara otomatis oleh sistem.</p>
            <p style="margin: 5px 0 0;">© {{ date('Y') }} Laravel App. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
