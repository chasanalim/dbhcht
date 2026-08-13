<?php

namespace Database\Seeders;

use App\Models\KategoriBanmod;
use App\Models\LamaUsaha;
use App\Models\PendaftaranBanmod;
use App\Models\Bruto;
use App\Models\StatusTempatTinggal;
use App\Models\TanggunganKeluarga;
use App\Models\JumlahTenagaKerja;
use App\Models\JumlahLegalitas;
use App\Models\JumlahTeknologiDigital;
use App\Models\PenyerapanTenagaMiskin;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class BanmodPendaftaranSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $kategoris = KategoriBanmod::all();

        foreach ($kategoris as $kategori) {
            $this->createPendaftaranData($kategori->id, 5);
        }
    }

    private function createPendaftaranData(int $kategoriId, int $count): void
    {
        $kategoriNames = [
            1 => 'Buruh Pabrik Rokok',
            2 => 'Buruh Tani Tembakau',
            3 => 'Pekerja Pabrik Rokok',
            4 => 'Industri Kecil Menengah (IKM)',
            5 => 'Masyarakat Miskin',
            6 => 'Pedagang Kaki Lima',
            7 => 'Disabilitas',
        ];

        $kategoriName = $kategoriNames[$kategoriId] ?? 'Unknown';

        $lamaUsaha = LamaUsaha::inRandomOrder()->first();
        $bruto = null;
        $statusTempatTinggal = null;
        $tanggunganKeluarga = null;
        $jumlahTenaga = null;
        $jumlahLegalitas = null;
        $jumlahTeknologi = null;
        $penyerapanTenagaMiskin = null;

        if ($kategoriId >= 1 && $kategoriId <= 4) {
            $bruto = Bruto::inRandomOrder()->first();
        }
        if ($kategoriId === 4) {
            $jumlahLegalitas = JumlahLegalitas::inRandomOrder()->first();
            $jumlahTeknologi = JumlahTeknologiDigital::inRandomOrder()->first();
            $penyerapanTenagaMiskin = PenyerapanTenagaMiskin::inRandomOrder()->first();
        }
        if ($kategoriId >= 1 && $kategoriId <= 3 || $kategoriId === 6) {
            $jumlahTenaga = JumlahTenagaKerja::inRandomOrder()->first();
        }
        if ($kategoriId === 5 || $kategoriId === 7) {
            $tanggunganKeluarga = TanggunganKeluarga::inRandomOrder()->first();
            $statusTempatTinggal = StatusTempatTinggal::inRandomOrder()->first();
        }

        $testImages = $this->createTestImages();

        for ($i = 0; $i < $count; $i++) {
            $nik = '3' . Str::random(15);
            $kk = '2' . Str::random(15);

            $isDomisili = random_int(0, 1);
            $isUsaha = $kategoriId === 6 ? 1 : random_int(0, 1);

            $data = [
                'nik' => $nik,
                'kk' => $kk,
                'name' => 'Pendaftar Test ' . $kategoriName . ' Ke-' . ($i + 1),
                'tmp_lhr' => 'Kota Kediri',
                'tgl_lhr' => now()->subYears(random_int(20, 50))->format('Y-m-d'),
                'alamat' => 'Jl. Test No. ' . random_int(1, 99) . ' Kediri',
                'jenis_kelamin' => random_int(1, 2) === 1 ? 'Laki-laki' : 'Perempuan',
                'kode_kecamatan' => '12345',
                'nama_kecamatan' => 'Kecamatan Test',
                'kode_kelurahan' => '67890',
                'nama_kelurahan' => 'Kelurahan Test',
                'kode_rw' => '001',
                'nama_rw' => 'RW 001',
                'kode_rt' => '005',
                'nama_rt' => 'RT 005',
                'isDomisili' => $isDomisili,
                'alamat_domisili' => $isDomisili ? 'Jl. Domisili Test No. ' . random_int(1, 99) : null,
                'isUsaha' => $isUsaha,
                'alamat_usaha' => $isUsaha ? 'Jl. Usaha Test No. ' . random_int(1, 99) : null,
                'phone_number' => '628' . Str::random(8),
                'desil' => '1-5',
                'daya_listrik' => '4500',
                'isDisabilitas' => $kategoriId === 7 ? random_int(0, 1) : null,
                'disabilitas' => $kategoriId === 7 && random_int(0, 1) ? ['jenis' => 'Fisik'] : null,
                'kategori' => $kategoriId,
                'jenis_kategori' => random_int(1, 3),
                'klaster_usaha' => random_int(1, 20),
                'tanggungan_keluarga' => ($kategoriId === 5 || $kategoriId === 7) ? random_int(1, 6) : null,
                'lama_usaha' => $lamaUsaha ? $lamaUsaha->id : random_int(1, 10),
                'jumlah_tenaga' => $jumlahTenaga ? $jumlahTenaga->id : random_int(1, 10),
                'bruto' => $bruto ? $bruto->id : null,
                'status_tempat_tinggal' => $statusTempatTinggal ? $statusTempatTinggal->id : null,
                'aset' => random_int(1000000, 50000000),
                'hutang' => random_int(1000000, 30000000),
                'jumlah_legalitas' => $kategoriId === 4 ? random_int(1, 10) : null,
                'jumlah_teknologi' => $kategoriId === 4 ? random_int(1, 10) : null,
                'jumlah_penyerapan_naker' => $kategoriId === 4 ? random_int(1, 10) : null,
                'file_foto' => $testImages['foto'],
                'file_ktp' => $testImages['ktp'],
                'file_kk' => $testImages['kk'],
                'file_nib' => $testImages['nib'],
                'file_sku' => $testImages['sku'],
                'file_produk' => $testImages['produk'],
                'file_pernyataan' => $testImages['pernyataan'],
                'file_lokasi_usaha' => $testImages['lokasi_usaha'],
                'file_perizinan' => null,
                'file_siinas' => null,
                'file_bp' => null,
                'file_sertifikat_pelatihan' => null,
                'file_surat_disabilitas' => null,
                'file_surat_buruh' => null,
                'file_surat_miskin' => null,
            ];

            if ($kategoriId >= 1 && $kategoriId <= 3) {
                $data['file_surat_buruh'] = $testImages['surat_buruh'];
            }
            if ($kategoriId === 4) {
                $data['file_perizinan'] = json_encode(['test-perizinan-' . $i]);
                $data['file_siinas'] = $testImages['siinas'];
                $data['file_bp'] = $testImages['bp'];
            }
            if ($kategoriId === 5) {
                $data['file_surat_miskin'] = $testImages['surat_miskin'];
                $data['file_sertifikat_pelatihan'] = $testImages['sertifikat_pelatihan'];
            }
            if ($kategoriId === 7) {
                $data['file_surat_disabilitas'] = $testImages['surat_disabilitas'];
                $data['file_sertifikat_pelatihan'] = $testImages['sertifikat_pelatihan'];
            }

            PendaftaranBanmod::create($data);
        }
    }

    private function createTestImages(): array
    {
        $fileNames = ['foto', 'ktp', 'kk', 'nib', 'sku', 'produk', 'lokasi_usaha', 'pernyataan', 'siinas', 'bp', 'surat_buruh', 'surat_miskin', 'surat_disabilitas', 'sertifikat_pelatihan'];
        $images = [];

        foreach ($fileNames as $fileType) {
            $filename = 'test_' . $fileType . '_' . uniqid() . '.jpg';
            $content = $this->generateMinimalJpeg(400, 300);
            Storage::put('pendaftaran-banmod/' . $fileType, $content);
            $images[$fileType] = '/storage/pendaftaran-banmod/' . $fileType . '/' . basename($filename);
        }

        return $images;
    }

    private function generateMinimalJpeg(int $width, int $height): string
    {
        $jpeg = '';
        $jpeg .= "\xFF\xD8\xFF";
        $jpeg .= "\xFF\xe0\x00\x10";
        $jpeg .= "\x4A\x46\x49\x46\x00\x01";
        $jpeg .= "\x01\x01";
        $jpeg .= "\x00\x00";
        $jpeg .= "\x00\x00";
        $jpeg .= "\x00\x00";
        $jpeg .= "\xFF\xDB\x00\x43";
        $jpeg .= "\x00";
        $jpeg .= "\xAA\x0C";
        $jpeg .= "\xFF\xC0\x00\x0E";
        $jpeg .= "\x08";
        $jpeg .= "\x00";
        $jpeg .= "\x00";
        $jpeg .= "\x01";
        $jpeg .= "\x01";
        $jpeg .= "\x11\x00";
        $jpeg .= "\xFF\xC4";
        $jpeg .= "\x00";
        $jpeg .= "\x10";
        $jpeg .= "\x01";
        $jpeg .= "\xFF\xDA";
        $jpeg .= "\x00";
        $jpeg .= "\x03";
        $jpeg .= "\x01";
        $jpeg .= "\x00";
        $jpeg .= "\x00";
        $jpeg .= "\x3F";
        $jpeg .= "\x00";
        $jpeg .= "\x2F";
        $jpeg .= "\xFF\xD9";

        return $jpeg;
    }
}