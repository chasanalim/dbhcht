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
                            <div className="col-md-7">
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
                                            <td>: {data.no_kk}</td>
                                        </tr>
                                        <tr>
                                            <td>Nama</td>
                                            <td>: {data.name}</td>
                                        </tr>
                                        <tr>
                                            <td>Tempat, Tgl Lahir</td>
                                            <td>
                                                : {data.tempat_lahir},{" "}
                                                {data.tgl_lahir}
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
                                        {data.is_disabilitas !== 0 && (
                                            <tr>
                                                <td>Jenis Disabilitas</td>
                                                <td>
                                                    : {data.jenis_disabilitas}
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>

                                <h6 className="fw-bold mt-4">Data Pelatihan</h6>
                                <table className="table table-sm">
                                    <tbody>
                                        <tr>
                                            <td style={{ width: "200px" }}>
                                                Prioritas 1
                                            </td>
                                            <td>: {data.prioritas_1}</td>
                                        </tr>
                                        <tr>
                                            <td>Prioritas 2</td>
                                            <td>: {data.prioritas_2}</td>
                                        </tr>
                                        <tr>
                                            <td>Prioritas 3</td>
                                            <td>: {data.prioritas_3}</td>
                                        </tr>
                                        <tr>
                                            <td>Alasan</td>
                                            <td width={"50%"}>
                                                : {data.alasan}
                                            </td>
                                            <td className="text-danger text-bold">
                                                {" "}
                                                Skor : {data.skor_alasan}
                                            </td>
                                            <td className="text-danger text-bold">
                                                NA :{" "}
                                                {parseFloat(
                                                    (data.skor_alasan / 3) *
                                                        33.33
                                                ).toFixed(2)}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Kesesuaian</td>
                                            <td width={"50%"}>
                                                : {data.kesesuaian}
                                            </td>
                                            <td className="text-danger text-bold">
                                                {" "}
                                                Skor : {data.skor_kesesuaian}
                                            </td>
                                            <td className="text-danger text-bold">
                                                NA :{" "}
                                                {parseFloat(
                                                    (data.skor_kesesuaian / 3) *
                                                        33.33
                                                ).toFixed(2)}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Pengalaman</td>
                                            <td width={"50%"}>
                                                : {data.pengalaman}
                                            </td>
                                            <td className="text-danger text-bold">
                                                {" "}
                                                Skor : {data.skor_pengalaman}
                                            </td>
                                            <td className="text-danger text-bold">
                                                NA :{" "}
                                                {parseFloat(
                                                    (data.skor_pengalaman / 3) *
                                                        33.33
                                                ).toFixed(2)}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Komitmen</td>
                                            <td>
                                                :{" "}
                                                {data.komitmen === "1"
                                                    ? "Ya"
                                                    : "Tidak"}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div className="col-md-5">
                                <h6 className="fw-bold mt-4">Alamat</h6>
                                <table className="table table-sm">
                                    <tbody>
                                        <tr>
                                            <td style={{ width: "200px" }}>
                                                Alamat
                                            </td>
                                            <td>: {data.alamat}</td>
                                        </tr>
                                        <tr>
                                            <td>RT/RW</td>
                                            <td>
                                                : {data.rt}/{data.rw}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Kelurahan</td>
                                            <td>: {data.kelurahan}</td>
                                        </tr>
                                        <tr>
                                            <td>Kecamatan</td>
                                            <td>: {data.kecamatan}</td>
                                        </tr>
                                    </tbody>
                                </table>
                                <h6 className="fw-bold">Data Usaha</h6>
                                <table className="table table-sm">
                                    <tbody>
                                        <tr>
                                            <td style={{ width: "200px" }}>
                                                Nama Usaha
                                            </td>
                                            <td>: {data.nama_usaha}</td>
                                        </tr>
                                        <tr>
                                            <td>Tahun Berdiri</td>
                                            <td>: {data.tahun_berdiri}</td>
                                        </tr>
                                        <tr>
                                            <td>Bidang Usaha</td>
                                            <td>: {data.bidang_usaha}</td>
                                        </tr>
                                        <tr>
                                            <td>NIB</td>
                                            <td>: {data.nib || "-"}</td>
                                        </tr>
                                        <tr>
                                            <td>Jenis Legalitas</td>
                                            <td>
                                                {data.legalitas_status === 0 ? (
                                                    ": Tidak Ada"
                                                ) : (
                                                    <>
                                                        :{" "}
                                                        {data.legalitas_jenis
                                                            .replace(
                                                                /[\[\]"]/g,
                                                                ""
                                                            ) // Remove brackets and quotes
                                                            .split(",")
                                                            .join(", ")}
                                                    </>
                                                )}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Modal Usaha</td>
                                            <td>
                                                : Rp{" "}
                                                {Number(
                                                    data.modal
                                                ).toLocaleString()}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Omset per Bulan</td>
                                            <td>
                                                : Rp{" "}
                                                {Number(
                                                    data.omset
                                                ).toLocaleString()}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Kapasitas Produksi</td>
                                            <td>: {data.kapasitas_produksi}</td>
                                        </tr>
                                        <tr>
                                            <td>Jangkauan Pemasaran</td>
                                            <td>: {data.jangkauan}</td>
                                        </tr>
                                    </tbody>
                                </table>
                                <h6 className="fw-bold">SKORING</h6>
                                <table className="table table-sm">
                                    <tbody>
                                        <tr>
                                            <td>Skor Sementara </td>
                                            <td>
                                                {" "}
                                                : {parseFloat(data.skor).toFixed(
                                                    2
                                                )}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="mt-4">
                            <h6 className="fw-bold mb-3">Dokumen</h6>
                            <div className="row">
                                {renderFilePreview(data.files.foto, "Pas Foto")}
                                {renderFilePreview(data.files.ktp, "KTP")}
                                {renderFilePreview(
                                    data.files.kk,
                                    "Kartu Keluarga"
                                )}
                                {renderFilePreview(
                                    data.files.pernyataan,
                                    "Surat Pernyataan"
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
