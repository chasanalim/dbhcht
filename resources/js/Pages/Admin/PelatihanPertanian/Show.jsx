import AdminLayout from "@/Layouts/admin/AdminLayout";
import { Head } from "@inertiajs/react";

export default function Show({ title, data }) {
    const renderFilePreview = (url, label) => {
        if (!url) return null;

        const extension = url.split(".").pop().toLowerCase();
        const isImage = ["jpg", "jpeg", "png", "gif"].includes(extension);

        return (
            <div className="col-md-4 mb-4">
                <div className="card h-100">
                    <div className="card-header">
                        <h6 className="fw-bold mb-0">{label}</h6>
                    </div>
                    <div className="card-body d-flex flex-column">
                        {isImage ? (
                            <div
                                className="text-center mb-3"
                                style={{ height: "200px" }}
                            >
                                <img
                                    src={url}
                                    alt={label}
                                    className="img-fluid h-100 object-fit-cover"
                                />
                            </div>
                        ) : (
                            <div className="ratio ratio-16x9 mb-3">
                                <embed
                                    src={url}
                                    type="application/pdf"
                                    className="w-100 h-100"
                                />
                            </div>
                        )}
                        <a
                            href={url}
                            className="btn btn-sm btn-primary mt-auto"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <i className="bi bi-eye me-1"></i>
                            Lihat File
                        </a>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <AdminLayout>
            <Head title={title} />

            <div className="container-fluid py-4">
                <div className="card">
                    <div className="card-header">
                        <h5 className="fw-bold mb-0">{title}</h5>
                    </div>
                    <div className="card-body">
                        <div className="row">
                            <div className="col-md-6">
                                <h6 className="fw-bold">Data Pribadi</h6>
                                <table className="table table-sm">
                                    <tbody>
                                        <tr>
                                            <td style={{ width: "200px" }}>
                                                NIK
                                            </td>
                                            <td>: {data.nik}</td>
                                        </tr>
                                        <tr>
                                            <td>No. KK</td>
                                            <td>: {data.kk}</td>
                                        </tr>
                                        <tr>
                                            <td>Nama Lengkap</td>
                                            <td>: {data.nama_lengkap}</td>
                                        </tr>
                                        <tr>
                                            <td>Tempat, Tgl Lahir</td>
                                            <td>
                                                : {data.tmp_lhr}, {data.tgl_lhr}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Jenis Kelamin</td>
                                            <td>
                                                :{" "}
                                                {data.jenis_kelamin === "L"
                                                    ? "Laki-laki"
                                                    : "Perempuan"}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>No. HP</td>
                                            <td>: {data.no_hp}</td>
                                        </tr>
                                        <tr>
                                            <td>Pendidikan</td>
                                            <td>: {data.pendidikan}</td>
                                        </tr>
                                        <tr>
                                            <td>Status Disabilitas</td>
                                            <td>
                                                :{" "}
                                                {data.is_disabilitas
                                                    ? "Ya"
                                                    : "Tidak"}
                                            </td>
                                        </tr>
                                        {data.is_disabilitas == 1 && (
                                            <tr>
                                                <td>Jenis Disabilitas</td>
                                                <td>
                                                    : {data.jenis_disabilitas}
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>

                                <h6 className="fw-bold mt-4">Alamat</h6>
                                <table className="table table-sm">
                                    <tbody>
                                        <tr>
                                            <td style={{ width: "200px" }}>
                                                Alamat KTP
                                            </td>
                                            <td>: {data.alamat}</td>
                                        </tr>
                                        <tr>
                                            <td>RT/RW</td>
                                            <td>
                                                : {data.nama_rt}/{data.nama_rw}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Kelurahan</td>
                                            <td>: {data.nama_kelurahan}</td>
                                        </tr>
                                        <tr>
                                            <td>Kecamatan</td>
                                            <td>: {data.nama_kecamatan}</td>
                                        </tr>
                                        {data.isDomisili == 1 && (
                                            <tr>
                                                <td>Alamat Domisili</td>
                                                <td>
                                                    : {data.isDomisili === 0 ? "Sesuai KTP" : data.alamat_domisili}
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            <div className="col-md-6">
                                <h6 className="fw-bold">Data Kelompok Tani</h6>
                                <table className="table table-sm">
                                    <tbody>
                                        <tr>
                                            <td style={{ width: "200px" }}>
                                                Nama Kelompok
                                            </td>
                                            <td>: {data.kelompok_tani.nama}</td>
                                        </tr>
                                        <tr>
                                            <td>Tahun Berdiri</td>
                                            <td>
                                                :{" "}
                                                {
                                                    data.kelompok_tani
                                                        .tahun_berdiri
                                                }
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Masa Aktif</td>
                                            <td>
                                                :{" "}
                                                {data.kelompok_tani.masa_aktif}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Bidang Usaha</td>
                                            <td>
                                                :{" "}
                                                {
                                                    data.kelompok_tani
                                                        .bidang_usaha
                                                }
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Alamat</td>
                                            <td>
                                                : {data.kelompok_tani.alamat}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>RT/RW</td>
                                            <td>
                                                : {data.kelompok_tani.rt}/
                                                {data.kelompok_tani.rw}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Kelurahan</td>
                                            <td>
                                                : {data.kelompok_tani.kelurahan}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Kecamatan</td>
                                            <td>
                                                : {data.kelompok_tani.kecamatan}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>

                                <h6 className="fw-bold mt-4">Data Pelatihan</h6>
                                <table className="table table-sm">
                                    <tbody>
                                        <tr>
                                            <td style={{ width: "200px" }}>
                                                Kategori
                                            </td>
                                            <td>: {data.kategori.nama}</td>
                                        </tr>
                                        <tr>
                                            <td>Jenis Pelatihan</td>
                                            <td>
                                                : {data.jenis_pelatihan.nama}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Alasan</td>
                                            <td>: {data.alasan}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="mt-4">
                            <h6 className="fw-bold mb-3">Dokumen</h6>
                            <div className="row">
                                {renderFilePreview(data.file_foto, "Foto")}
                                {renderFilePreview(data.file_ktp, "KTP")}
                                {renderFilePreview(
                                    data.file_pengukuhan,
                                    "Pengukuhan Penyuluh Swadaya"
                                )}
                                {renderFilePreview(
                                    data.file_rekomendasi,
                                    "Rekomendasi Kelompok"
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
