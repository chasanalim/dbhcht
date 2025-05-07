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
                                                Tahun Penerimaan
                                            </td>
                                            <td>: {data.tahun_penerimaan}</td>
                                        </tr>
                                        <tr>
                                            <td>NIK</td>
                                            <td>: {data.nik}</td>
                                        </tr>
                                        <tr>
                                            <td>Nama Lengkap</td>
                                            <td>: {data.nama_lengkap}</td>
                                        </tr>
                                        <tr>
                                            <td>No. KK</td>
                                            <td>: {data.no_kk}</td>
                                        </tr>
                                        <tr>
                                            <td>No. HP</td>
                                            <td>: {data.no_hp}</td>
                                        </tr>
                                    </tbody>
                                </table>

                                <h6 className="fw-bold mt-4">Alamat KTP</h6>
                                <table className="table table-sm">
                                    <tbody>
                                        <tr>
                                            <td style={{ width: "200px" }}>
                                                Jalan
                                            </td>
                                            <td>: {data.alamat_ktp.jalan}</td>
                                        </tr>
                                        <tr>
                                            <td>RT/RW</td>
                                            <td>
                                                : {data.alamat_ktp.rt}/
                                                {data.alamat_ktp.rw}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Kelurahan</td>
                                            <td>
                                                : {data.alamat_ktp.kelurahan}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Kecamatan</td>
                                            <td>
                                                : {data.alamat_ktp.kecamatan}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div className="col-md-6">
                                <h6 className="fw-bold">Alamat Usaha</h6>
                                <table className="table table-sm">
                                    <tbody>
                                        <tr>
                                            <td style={{ width: "200px" }}>
                                                Jalan
                                            </td>
                                            <td>: {data.alamat_usaha.jalan}</td>
                                        </tr>
                                        <tr>
                                            <td>RT/RW</td>
                                            <td>
                                                : {data.alamat_usaha.rt}/
                                                {data.alamat_usaha.rw}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Kelurahan</td>
                                            <td>
                                                : {data.alamat_usaha.kelurahan}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Kecamatan</td>
                                            <td>
                                                : {data.alamat_usaha.kecamatan}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>

                                <h6 className="fw-bold mt-4">
                                    Data Perkembangan
                                </h6>
                                <table className="table table-sm">
                                    <tbody>
                                        <tr>
                                            <td style={{ width: "200px" }}>
                                                Jenis Pelatihan
                                            </td>
                                            <td>: {data.jenis_pelatihan}</td>
                                        </tr>
                                        <tr>
                                            <td>Omzet</td>
                                            <td>: {data.perkembangan.omzet}</td>
                                        </tr>
                                        <tr>
                                            <td>Tenaga Kerja</td>
                                            <td>
                                                :{" "}
                                                {data.perkembangan.tenaga_kerja}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>

                                <h6 className="fw-bold mt-4">Skor Penilaian</h6>
                                <table className="table table-sm">
                                    <tbody>
                                        <tr>
                                            <td style={{ width: "200px" }}>
                                                Ketrampilan
                                            </td>
                                            <td>: {data.skor.ketrampilan}</td>
                                        </tr>
                                        <tr>
                                            <td>Kualitas Produk</td>
                                            <td>
                                                : {data.skor.kualitas_produk}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Permasalahan Usaha</td>
                                            <td>
                                                : {data.skor.permasalahan_usaha}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Mengisi Waktu</td>
                                            <td>: {data.skor.mengisi_waktu}</td>
                                        </tr>
                                        <tr>
                                            <td>Diajak Teman</td>
                                            <td>: {data.skor.diajak_teman}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="mt-4">
                            <h6 className="fw-bold mb-3">Dokumen</h6>
                            <div className="row">
                                {renderFilePreview(data.file_ktp, "KTP")}
                                {renderFilePreview(
                                    data.file_kk,
                                    "Kartu Keluarga"
                                )}
                                {renderFilePreview(data.file_nib, "NIB")}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
