import AdminLayout from "@/Layouts/admin/AdminLayout";
import { Head, router } from "@inertiajs/react";
import { useEffect, useState } from "react";

export default function Show({ title, data, type = "PELATIHAN_BANMOD" }) {
    const [showModal, setShowModal] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [activeFile, setActiveFile] = useState(null);
    const [rejectNote, setRejectNote] = useState("");
    const [showRejectForm, setShowRejectForm] = useState(false);

    const DOCUMENT_TYPES = {
        PELATIHAN_BANMOD: [
            { key: "ktp", label: "KTP" },
            { key: "kk", label: "Kartu Keluarga" },
            { key: "nib", label: "NIB" },
            { key: "skd", label: "Surat Keterangan Domisili" },
        ],
    };

    const handleVerification = async (fileType) => {
        router.post(
            route("admin.verify-document"),
            {
                training_type: type,
                id: data.id,
                document_type: fileType,
                status: 1,
                notes: "Dokumen telah diverifikasi",
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setShowModal(false);
                    // Refresh the page to get updated verification status
                    router.reload();
                },
            }
        );
    };

    useEffect(() => {
        const html = document.documentElement;
        if (showModal) {
            html.style.overflow = "hidden";
            const scrollbarWidth = window.innerWidth - html.clientWidth;
            html.style.paddingRight = `${scrollbarWidth}px`;
        } else {
            html.style.overflow = "";
            html.style.paddingRight = "";
        }

        return () => {
            html.style.overflow = "";
            html.style.paddingRight = "";
        };
    }, [showModal]);

    const handleTolak = async (fileType) => {
        router.post(
            route("admin.tolak-document"),
            {
                training_type: type,
                id: data.id,
                document_type: fileType,
                status: 0,
                notes: rejectNote,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setShowModal(false);
                    setShowRejectForm(false);
                    setRejectNote("");
                    router.reload();
                },
            }
        );
    };

    const renderFilePreview = (fileData, label, fileType) => {
        if (!fileData?.url) return null;

        const extension = fileData.url.split(".").pop().toLowerCase();
        const isImage = ["jpg", "jpeg", "png", "gif"].includes(extension);
        const isVerified = fileData.verification?.verified;
        const status = fileData.verification?.status;

        return (
            <div className="card h-100">
                <div className="card-header d-flex justify-content-between align-items-center">
                    <h6 className="fw-bold mb-0">{label}</h6>
                    {isVerified && (
                        <div className="d-flex align-items-center">
                            <i
                                className={`bi ${
                                    status === 1
                                        ? "bi-check-circle-fill text-success"
                                        : "bi-x-circle-fill text-danger"
                                } me-2`}
                            ></i>
                            <small className="text-muted">
                                {status === 1 ? "Diverifikasi" : "Ditolak"} oleh{" "}
                                {fileData.verification.verified_by}
                            </small>
                        </div>
                    )}
                </div>
                <div className="card-body d-flex flex-column">
                    {isImage ? (
                        <div
                            className="text-center mb-3"
                            style={{ height: "200px" }}
                        >
                            <img
                                src={fileData.url}
                                alt={label}
                                className="img-fluid h-100 object-fit-cover"
                            />
                        </div>
                    ) : (
                        <div className="ratio ratio-16x9 mb-3">
                            <embed
                                src={fileData.url}
                                type="application/pdf"
                                className="w-100 h-100"
                            />
                        </div>
                    )}

                    <div className="mt-2">
                        <button
                            className={`btn btn-sm ${
                                isVerified
                                    ? status === 1
                                        ? "btn-success"
                                        : "btn-danger"
                                    : "btn-primary"
                            } w-100`}
                            onClick={() => {
                                setActiveFile({
                                    url: fileData.url,
                                    label,
                                    fileType,
                                    verification: fileData.verification,
                                });
                                setShowModal(true);
                            }}
                        >
                            <i
                                className={`bi ${
                                    isVerified
                                        ? status === 1
                                            ? "bi-check-circle text-success"
                                            : "bi-x-circle text-danger"
                                        : "bi-eye"
                                } me-1`}
                            ></i>
                            {isVerified
                                ? status === 1
                                    ? "Terverifikasi"
                                    : "Ditolak"
                                : "Lihat & Verifikasi"}
                        </button>
                    </div>
                    <div>
                        {isVerified && status === 0 && (
                            <div className="mt-2">
                                <small className="text-muted">
                                    Catatan: {fileData.verification?.notes}
                                </small>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    const renderDocuments = () => {
        const documentTypes = DOCUMENT_TYPES[type] || [];

        return (
            <div className="row row-cols-1 row-cols-md-3 g-4">
                {documentTypes.map((doc) => {
                    const fileUrl = data.files?.[doc.key];
                    return fileUrl ? (
                        <div key={doc.key}>
                            {renderFilePreview(fileUrl, doc.label, doc.key)}
                        </div>
                    ) : null;
                })}
            </div>
        );
    };

    return (
        <AdminLayout>
            <Head title={title} />
<div>
                    <button
                        onClick={() => window.history.back()}
                        className="btn btn-secondary ms-2 mb-2"
                    >
                        <i className="bi bi-reply me-1"></i>
                        <span>Kembali</span>
                    </button>
                </div>
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
                                <h6 className="fw-bold">SKORING</h6>
                                <table className="table table-sm">
                                    <tbody>
                                        <tr>
                                            <td>Skor Total </td>
                                            <td>
                                                {" "}
                                                :{" "}
                                                {parseFloat(
                                                    data.skor_total
                                                ).toFixed(2)}
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
                                            <td className="text-danger text-bold">
                                                Skor :{" "}
                                                {data.perkembangan.omzet ===
                                                "meningkat"
                                                    ? 3
                                                    : data.perkembangan
                                                          .omzet === "tetap"
                                                    ? 2
                                                    : 1}
                                            </td>
                                            <td className="text-danger text-bold">
                                                NA :{" "}
                                                {data.perkembangan.omzet ===
                                                "meningkat"
                                                    ? parseFloat(
                                                          (3 / 3) * 14.3
                                                      ).toFixed(2)
                                                    : data.perkembangan
                                                          .omzet === "tetap"
                                                    ? parseFloat(
                                                          (2 / 3) * 14.3
                                                      ).toFixed(2)
                                                    : parseFloat(
                                                          (1 / 3) * 14.3
                                                      ).toFixed(2)}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Tenaga Kerja</td>
                                            <td>
                                                :{" "}
                                                {data.perkembangan.tenaga_kerja}
                                            </td>
                                            <td className="text-danger text-bold">
                                                Skor :{" "}
                                                {data.perkembangan.omzet ===
                                                "bertambah"
                                                    ? 3
                                                    : data.perkembangan
                                                          .omzet === "tetap"
                                                    ? 2
                                                    : 1}
                                            </td>
                                            <td className="text-danger text-bold">
                                                NA :{" "}
                                                {data.perkembangan.omzet ===
                                                "bertambah"
                                                    ? parseFloat(
                                                          (3 / 3) * 14.3
                                                      ).toFixed(2)
                                                    : data.perkembangan
                                                          .omzet === "tetap"
                                                    ? parseFloat(
                                                          (2 / 3) * 14.3
                                                      ).toFixed(2)
                                                    : parseFloat(
                                                          (1 / 3) * 14.3
                                                      ).toFixed(2)}
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
                                            <td>
                                                :{" "}
                                                {data.skor.ketrampilan === 1
                                                    ? "Kurang Setuju"
                                                    : data.skor.ketrampilan ===
                                                      2
                                                    ? "Setuju"
                                                    : "Sangat Setuju"}
                                            </td>
                                            <td className="text-danger text-bold">
                                                Skor : {data.skor.ketrampilan}
                                            </td>
                                            <td className="text-danger text-bold">
                                                NA :{" "}
                                                {parseFloat(
                                                    (data.skor.ketrampilan /
                                                        3) *
                                                        14.3
                                                ).toFixed(2)}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Kualitas Produk</td>
                                            <td>
                                                :{" "}
                                                {data.skor.kualitas_produk === 1
                                                    ? "Kurang Setuju"
                                                    : data.skor
                                                          .kualitas_produk === 2
                                                    ? "Setuju"
                                                    : "Sangat Setuju"}
                                            </td>
                                            <td className="text-danger text-bold">
                                                Skor :{" "}
                                                {data.skor.kualitas_produk}
                                            </td>
                                            <td className="text-danger text-bold">
                                                NA :{" "}
                                                {parseFloat(
                                                    (data.skor.kualitas_produk /
                                                        3) *
                                                        14.3
                                                ).toFixed(2)}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Permasalahan Usaha</td>
                                            <td>
                                                :{" "}
                                                {data.skor
                                                    .permasalahan_usaha === 1
                                                    ? "Kurang Setuju"
                                                    : data.skor
                                                          .permasalahan_usaha ===
                                                      2
                                                    ? "Setuju"
                                                    : "Sangat Setuju"}
                                            </td>
                                            <td className="text-danger text-bold">
                                                Skor :{" "}
                                                {data.skor.permasalahan_usaha}
                                            </td>
                                            <td className="text-danger text-bold">
                                                NA :{" "}
                                                {parseFloat(
                                                    (data.skor
                                                        .permasalahan_usaha /
                                                        3) *
                                                        14.3
                                                ).toFixed(2)}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Mengisi Waktu</td>
                                            <td>
                                                :{" "}
                                                {data.skor.mengisi_waktu === 1
                                                    ? "Kurang Setuju"
                                                    : data.skor
                                                          .mengisi_waktu === 2
                                                    ? "Setuju"
                                                    : "Sangat Setuju"}
                                            </td>
                                            <td className="text-danger text-bold">
                                                Skor : {data.skor.mengisi_waktu}
                                            </td>
                                            <td className="text-danger text-bold">
                                                NA :{" "}
                                                {parseFloat(
                                                    (data.skor.mengisi_waktu /
                                                        3) *
                                                        14.3
                                                ).toFixed(2)}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Diajak Teman</td>
                                            <td>
                                                :{" "}
                                                {data.skor.diajak_teman === 1
                                                    ? "Kurang Setuju"
                                                    : data.skor.diajak_teman ===
                                                      2
                                                    ? "Setuju"
                                                    : "Sangat Setuju"}
                                            </td>
                                            <td className="text-danger text-bold">
                                                Skor : {data.skor.diajak_teman}
                                            </td>
                                            <td className="text-danger text-bold">
                                                NA :{" "}
                                                {parseFloat(
                                                    (data.skor.diajak_teman /
                                                        3) *
                                                        14.3
                                                ).toFixed(2)}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {showModal && activeFile && (
                            <div className="modal-wrapper">
                                <div
                                    className="modal-overlay"
                                    onClick={() => setShowModal(false)}
                                ></div>
                                <div
                                    className={`modal-container ${
                                        isFullscreen ? "is-fullscreen" : ""
                                    }`}
                                >
                                    <div className="modal-content">
                                        <div
                                            className="modal fade show d-block"
                                            style={{
                                                backgroundColor:
                                                    "rgba(0,0,0,0.5)",
                                            }}
                                        >
                                            <div className="modal-dialog modal-xl modal-dialog-centered">
                                                <div className="modal-content">
                                                    <div className="modal-header">
                                                        <h5 className="modal-title">
                                                            {activeFile.label ===
                                                            "KTP"
                                                                ? `${activeFile.label} | NIK : ${data.nik}`
                                                                : activeFile.label ===
                                                                  "Kartu Keluarga"
                                                                ? `${activeFile.label} | NO KK : ${data.no_kk}`
                                                                : activeFile.label}
                                                        </h5>
                                                        <button
                                                            type="button"
                                                            className="btn-close"
                                                            onClick={() =>
                                                                setShowModal(
                                                                    false
                                                                )
                                                            }
                                                        ></button>
                                                    </div>
                                                    <div className="modal-body">
                                                        {activeFile.url.match(
                                                            /\.(jpg|jpeg|png|gif)$/i
                                                        ) ? (
                                                            <img
                                                                src={
                                                                    activeFile.url
                                                                }
                                                                className="img-fluid"
                                                                alt={
                                                                    activeFile.label
                                                                }
                                                            />
                                                        ) : (
                                                            <embed
                                                                src={
                                                                    activeFile.url
                                                                }
                                                                type="application/pdf"
                                                                width="100%"
                                                                height="500px"
                                                            />
                                                        )}
                                                    </div>
                                                    <div className="modal-footer flex-column align-items-stretch">
                                                        {showRejectForm && (
                                                            <div className="w-100 mb-3">
                                                                <div className="form-group">
                                                                    <label className="form-label">
                                                                        Alasan
                                                                        Penolakan:
                                                                    </label>
                                                                    <textarea
                                                                        className="form-control"
                                                                        value={
                                                                            rejectNote
                                                                        }
                                                                        onChange={(
                                                                            e
                                                                        ) =>
                                                                            setRejectNote(
                                                                                e
                                                                                    .target
                                                                                    .value
                                                                            )
                                                                        }
                                                                        rows="3"
                                                                        placeholder="Tuliskan alasan penolakan dokumen..."
                                                                    ></textarea>
                                                                </div>
                                                                <div className="d-flex justify-content-end gap-2 mt-2">
                                                                    <button
                                                                        type="button"
                                                                        className="btn btn-secondary"
                                                                        onClick={() => {
                                                                            setShowRejectForm(
                                                                                false
                                                                            );
                                                                            setRejectNote(
                                                                                ""
                                                                            );
                                                                        }}
                                                                    >
                                                                        Batal
                                                                    </button>
                                                                    <button
                                                                        type="button"
                                                                        className="btn btn-danger"
                                                                        onClick={() =>
                                                                            handleTolak(
                                                                                activeFile.fileType
                                                                            )
                                                                        }
                                                                        disabled={
                                                                            !rejectNote.trim()
                                                                        }
                                                                    >
                                                                        Konfirmasi
                                                                        Penolakan
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        )}
                                                        <div className="w-100 d-flex justify-content-end gap-2">
                                                            <button
                                                                type="button"
                                                                className="btn btn-secondary"
                                                                onClick={() =>
                                                                    setShowModal(
                                                                        false
                                                                    )
                                                                }
                                                            >
                                                                Tutup
                                                            </button>
                                                            {!activeFile.verification && (
                                                                <>
                                                                    <button
                                                                        type="button"
                                                                        className="btn btn-danger"
                                                                        onClick={() =>
                                                                            setShowRejectForm(
                                                                                true
                                                                            )
                                                                        }
                                                                    >
                                                                        Tolak
                                                                        Dokumen
                                                                    </button>
                                                                    <button
                                                                        type="button"
                                                                        className="btn btn-primary"
                                                                        onClick={() =>
                                                                            handleVerification(
                                                                                activeFile.fileType
                                                                            )
                                                                        }
                                                                    >
                                                                        Verifikasi
                                                                        Dokumen
                                                                    </button>
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="mt-4">
                            <h6 className="fw-bold mb-3">Dokumen</h6>
                            {renderDocuments()}
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
