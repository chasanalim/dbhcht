import AdminLayout from "@/Layouts/admin/AdminLayout";
import { Head, router } from "@inertiajs/react";
import { useEffect, useState } from "react";

export default function Show({ title, data, type = "PELATIHAN_EKRAF" }) {
    const [showModal, setShowModal] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [activeFile, setActiveFile] = useState(null);
    const [rejectNote, setRejectNote] = useState("");
    const [showRejectForm, setShowRejectForm] = useState(false);
    const [isLoadingReset, setIsLoadingReset] = useState(false);
    const [isLoadingVerify, setIsLoadingVerify] = useState(false);
    const [isLoadingReject, setIsLoadingReject] = useState(false);

    const REQUIRED_DOCUMENTS = {
        umum: [
            { key: "pasfoto", label: "Pas Foto" },
            { key: "ktp", label: "KTP" },
            { key: "kk", label: "Kartu Keluarga" },
            { key: "surat_pernyataan", label: "Surat Pernyataan Komitmen" },
            {
                key: "surat_pekerja_ekraf",
                label: "Surat Keterangan Pekerja Ekonomi Kreatif",
            },
            { key: "nib", label: "NIB" },
        ],
        buruh_tani_tembakau: [
            { key: "pasfoto", label: "Pas Foto" },
            { key: "ktp", label: "KTP" },
            { key: "kk", label: "Kartu Keluarga" },
            { key: "surat_pernyataan", label: "Surat Pernyataan Komitmen" },
            {
                key: "surat_pekerja_ekraf",
                label: "Surat Keterangan Pekerja Ekonomi Kreatif",
            },
            { key: "nib", label: "NIB" },
            {
                key: "surat_pemilik_lahan",
                label: "Surat Keterangan Pemilik Lahan",
            },
        ],
        buruh_pabrik_rokok: [
            { key: "pasfoto", label: "Pas Foto" },
            { key: "ktp", label: "KTP" },
            { key: "kk", label: "Kartu Keluarga" },
            { key: "surat_pernyataan", label: "Surat Pernyataan Komitmen" },
            {
                key: "surat_pekerja_ekraf",
                label: "Surat Keterangan Pekerja Ekonomi Kreatif",
            },
            { key: "nib", label: "NIB" },
            {
                key: "id_card_iht",
                label: "ID Card / Surat Keterangan dari IHT",
            },
        ],
        buruh_phk: [
            { key: "pasfoto", label: "Pas Foto" },
            { key: "ktp", label: "KTP" },
            { key: "kk", label: "Kartu Keluarga" },
            { key: "surat_pernyataan", label: "Surat Pernyataan Komitmen" },
            {
                key: "surat_pekerja_ekraf",
                label: "Surat Keterangan Pekerja Ekonomi Kreatif",
            },
            { key: "nib", label: "NIB" },
            {
                key: "surat_phk",
                label: "Surat Pemberhentian Kerja / sejenisnya dari IHT",
            },
        ],
        disabilitas: [
            { key: "pasfoto", label: "Pas Foto" },
            { key: "ktp", label: "KTP" },
            { key: "kk", label: "Kartu Keluarga" },
            { key: "surat_pernyataan", label: "Surat Pernyataan Komitmen" },
            {
                key: "surat_pekerja_ekraf",
                label: "Surat Keterangan Pekerja Ekonomi Kreatif",
            },
            { key: "nib", label: "NIB" },
            {
                key: "surat_disabilitas",
                label: "Surat Keterangan Disabilitas dari Kelurahan",
            },
        ],
        perempuan_kk: [
            { key: "pasfoto", label: "Pas Foto" },
            { key: "ktp", label: "KTP" },
            { key: "kk", label: "Kartu Keluarga" },
            { key: "surat_pernyataan", label: "Surat Pernyataan Komitmen" },
            {
                key: "surat_pekerja_ekraf",
                label: "Surat Keterangan Pekerja Ekonomi Kreatif",
            },
            { key: "nib", label: "NIB" },
            { key: "surat_kb", label: "Surat Keterangan Dinas KB" },
        ],
    };

    // Handlers
    const handleVerification = async (fileType) => {
        setIsLoadingVerify(true);
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
                    setIsLoadingVerify(false);
                    router.reload();
                },
                onError: () => {
                    setIsLoadingVerify(false);
                    alert("Terjadi kesalahan saat verifikasi dokumen");
                },
            }
        );
    };

    const handleTolak = async (fileType) => {
        setIsLoadingReject(true);
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
                    setIsLoadingReject(false);
                    router.reload();
                },
                onError: () => {
                    setIsLoadingReject(false);
                    alert("Terjadi kesalahan saat menolak dokumen");
                },
            }
        );
    };

    const handleResetVerification = async (fileType) => {
        if (
            !window.confirm(
                "Apakah Anda yakin ingin mereset verifikasi dokumen ini?"
            )
        ) {
            return;
        }

        setIsLoadingReset(true);

        router.delete(route("admin.reset-document-verification"), {
            data: {
                training_type: type,
                id: data.id,
                document_type: fileType,
            },
            preserveScroll: true,
            onSuccess: () => {
                setShowModal(false);
                setShowRejectForm(false);
                setRejectNote("");
                setIsLoadingReset(false);
                router.reload();
            },
            onError: () => {
                setIsLoadingReset(false);
                alert("Terjadi kesalahan saat mereset verifikasi");
            },
        });
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
                                            ? "bi-check-circle"
                                            : "bi-x-circle"
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
                    {isVerified && status === 0 && (
                        <div className="mt-2">
                            <small className="text-muted">
                                Catatan: {fileData.verification?.notes}
                            </small>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    const renderDocuments = () => {
        const kategori = data.kategori_pendaftar || "umum";
        const status = data.status;
        const documentTypes =
            REQUIRED_DOCUMENTS[kategori] || REQUIRED_DOCUMENTS["umum"];

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

    const getCategoryLabel = (kategori) => {
        const categories = {
            umum: "Umum",
            buruh_tani_tembakau: "Buruh Tani Tembakau",
            buruh_pabrik_rokok: "Buruh Pabrik Rokok",
            buruh_phk: "Buruh yang Terkena PHK",
            disabilitas: "Disabilitas",
            perempuan_kk: "Perempuan Kepala Keluarga",
        };
        return categories[kategori] || kategori;
    };

    const getStatusLabel = (status) => {
        const statusLabel = {
            0: "-",
            1: "Lolos",
            2: "Tidak Lolos",
            3: "Blacklist",
            4: "Ditolak - Lolos di Pelatihan Lain",
        };
        return statusLabel[status] || status;
    };

    // Modal JSX
    const renderModal = () => {
        if (!showModal || !activeFile) return null;

        const isImage = activeFile.url.match(/\.(jpg|jpeg|png|gif)$/i);

        return (
            <div className="modal-wrapper">
                <div
                    className="modal-overlay"
                    onClick={() => setShowModal(false)}
                ></div>
                <div className="modal-container">
                    <div className="modal-content">
                        <div
                            className="modal fade show d-block"
                            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
                        >
                            <div className="modal-dialog modal-xl modal-dialog-centered">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title">
                                            {activeFile.label === "KTP"
                                                ? `${activeFile.label} | NIK : ${data.nik}`
                                                : activeFile.label ===
                                                  "Kartu Keluarga"
                                                ? `${activeFile.label} | NO KK : ${data.no_kk}`
                                                : activeFile.label}
                                        </h5>
                                        <button
                                            type="button"
                                            className="btn-close"
                                            onClick={() => setShowModal(false)}
                                            disabled={
                                                isLoadingVerify ||
                                                isLoadingReject ||
                                                isLoadingReset
                                            }
                                        ></button>
                                    </div>
                                    <div className="modal-body">
                                        {isImage ? (
                                            <img
                                                src={activeFile.url}
                                                className="img-fluid"
                                                alt={activeFile.label}
                                            />
                                        ) : (
                                            <embed
                                                src={activeFile.url}
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
                                                        Alasan Penolakan:
                                                    </label>
                                                    <textarea
                                                        className="form-control"
                                                        value={rejectNote}
                                                        onChange={(e) =>
                                                            setRejectNote(
                                                                e.target.value
                                                            )
                                                        }
                                                        rows="3"
                                                        placeholder="Tuliskan alasan penolakan dokumen..."
                                                        disabled={
                                                            isLoadingReject
                                                        }
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
                                                            setRejectNote("");
                                                        }}
                                                        disabled={
                                                            isLoadingReject
                                                        }
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
                                                            !rejectNote.trim() ||
                                                            isLoadingReject
                                                        }
                                                    >
                                                        {isLoadingReject ? (
                                                            <>
                                                                <span
                                                                    className="spinner-border spinner-border-sm me-2"
                                                                    role="status"
                                                                    aria-hidden="true"
                                                                ></span>
                                                                Loading...
                                                            </>
                                                        ) : (
                                                            "Konfirmasi Penolakan"
                                                        )}
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                        <div className="w-100 d-flex justify-content-end gap-2">
                                            <button
                                                type="button"
                                                className="btn btn-secondary"
                                                onClick={() =>
                                                    setShowModal(false)
                                                }
                                                disabled={
                                                    isLoadingVerify ||
                                                    isLoadingReject ||
                                                    isLoadingReset
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
                                                        disabled={
                                                            isLoadingVerify ||
                                                            isLoadingReject
                                                        }
                                                    >
                                                        Tolak Dokumen
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="btn btn-primary"
                                                        onClick={() =>
                                                            handleVerification(
                                                                activeFile.fileType
                                                            )
                                                        }
                                                        disabled={
                                                            isLoadingVerify ||
                                                            isLoadingReject
                                                        }
                                                    >
                                                        {isLoadingVerify ? (
                                                            <>
                                                                <span
                                                                    className="spinner-border spinner-border-sm me-2"
                                                                    role="status"
                                                                    aria-hidden="true"
                                                                ></span>
                                                                Loading...
                                                            </>
                                                        ) : (
                                                            "Verifikasi Dokumen"
                                                        )}
                                                    </button>
                                                </>
                                            )}
                                            {activeFile.verification &&
                                                activeFile.verification
                                                    .status === 0 && (
                                                    <button
                                                        type="button"
                                                        className="btn btn-info"
                                                        onClick={() =>
                                                            handleResetVerification(
                                                                activeFile.fileType
                                                            )
                                                        }
                                                        disabled={
                                                            isLoadingReset
                                                        }
                                                    >
                                                        {isLoadingReset ? (
                                                            <>
                                                                <span
                                                                    className="spinner-border spinner-border-sm me-2"
                                                                    role="status"
                                                                    aria-hidden="true"
                                                                ></span>
                                                                Loading...
                                                            </>
                                                        ) : (
                                                            <>
                                                                <i className="bi bi-arrow-counterclockwise me-1"></i>
                                                                Reset Penolakan
                                                            </>
                                                        )}
                                                    </button>
                                                )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
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
                                <h6 className="fw-bold">Kategori Pendaftar</h6>
                                <table className="table table-sm">
                                    <tbody>
                                        <tr>
                                            <td>Kategori</td>
                                            <td>
                                                :{" "}
                                                {getCategoryLabel(
                                                    data.kategori_pendaftar
                                                )}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>

                                <h6 className="fw-bold">Data Pribadi</h6>
                                <table className="table table-sm">
                                    <tbody>
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
                                            <td>: {data.alamat_ktp.alamat}</td>
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
                                <h6 className="fw-bold">Alamat Domisili</h6>
                                <table className="table table-sm">
                                    <tbody>
                                        <tr>
                                            <td style={{ width: "200px" }}>
                                                Jalan
                                            </td>
                                            <td>
                                                : {data.alamat_domisili.alamat}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>RT/RW</td>
                                            <td>
                                                : {data.alamat_domisili.rt}/
                                                {data.alamat_domisili.rw}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Kelurahan</td>
                                            <td>
                                                :{" "}
                                                {data.alamat_domisili.kelurahan}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Kecamatan</td>
                                            <td>
                                                :{" "}
                                                {data.alamat_domisili.kecamatan}
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
                                <h6 className="fw-bold">Status</h6>
                                <table className="table table-sm">
                                    <tbody>
                                        <tr>
                                            <td style={{ width: "200px" }}>
                                                Status Pendaftaran
                                            </td>
                                            <td>
                                                : {getStatusLabel(data.status)}
                                            </td>
                                        </tr>
                                        {data.status === 3 && (
                                            <tr>
                                                <td>Keterangan</td>
                                                <td>: {data.keterangan}</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {renderModal()}

                        <div className="mt-4">
                            <h6 className="fw-bold mb-3">
                                Dokumen (Kategori:{" "}
                                {getCategoryLabel(data.kategori_pendaftar)})
                            </h6>
                            {renderDocuments()}
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
