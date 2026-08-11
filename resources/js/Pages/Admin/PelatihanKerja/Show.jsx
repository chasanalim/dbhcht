import AdminLayout from "@/Layouts/admin/AdminLayout";
import { Head, router, usePage } from "@inertiajs/react";
import { useEffect, useState, useRef } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

export default function Show({ title, data, type = "PELATIHAN_KERJA" }) {
    const { auth } = usePage().props;
    const userRoles = auth?.user?.roles || [];
    const canReplace = userRoles.includes("pertanian") || userRoles.includes("admin");

    const [showModal, setShowModal] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [activeFile, setActiveFile] = useState(null);
    const [rejectNote, setRejectNote] = useState("");
    const [showRejectForm, setShowRejectForm] = useState(false);
    const [zoomLevel, setZoomLevel] = useState(1);
    const [showReplaceModal, setShowReplaceModal] = useState(false);
    const [replaceTarget, setReplaceTarget] = useState(null);
    const [replaceFile, setReplaceFile] = useState(null);
    const [replacePreview, setReplacePreview] = useState(null);
    const [replaceUploading, setReplaceUploading] = useState(false);
    const fileInputRef = useRef(null);

    const DOCUMENT_TYPES = {
        PELATIHAN_KERJA: [
            { key: "pasfoto", label: "Pas Foto" },
            { key: "ktp", label: "KTP" },
            { key: "kk", label: "Kartu Keluarga" },
            { key: "fotokopi_ijazah", label: "Fotocopi Ijazah" },
            {
                key: "surat_pernyataan_tidak_ikut",
                label: "Surat Pernyataan Tidak Mengikuti Pelatihan Lain",
            },
            {
                key: "surat_kesanggupan",
                label: "Surat Kesanggupan Mengikuti Pelatihan",
            },
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

    useEffect(() => {
        const html = document.documentElement;
        if (showReplaceModal) { html.style.overflow = "hidden"; }
        else { html.style.overflow = ""; }
        return () => { html.style.overflow = ""; };
    }, [showReplaceModal]);

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

    const openReplaceModal = (fileData, label, fileType) => {
        setReplaceTarget({ url: fileData.url, label, fileType, isImage: fileData.isImage });
        setReplaceFile(null);
        setReplacePreview(null);
        setShowReplaceModal(true);
    };

    const handleReplaceFileSelect = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setReplaceFile(file);
        const reader = new FileReader();
        reader.onload = (evt) => setReplacePreview(evt.target.result);
        reader.readAsDataURL(file);
    };

    const handleReplaceSubmit = () => {
        if (!replaceFile || !replaceTarget) return;
        setReplaceUploading(true);
        const formData = new FormData();
        formData.append("training_type", type);
        formData.append("id", data.id);
        formData.append("document_type", replaceTarget.fileType);
        formData.append("file", replaceFile);
        router.post(route("admin.replace-document"), formData, {
            preserveScroll: true,
            headers: { "Content-Type": "multipart/form-data" },
            onSuccess: () => {
                setShowReplaceModal(false);
                setReplaceFile(null);
                setReplacePreview(null);
                setReplaceTarget(null);
                setReplaceUploading(false);
                router.reload();
            },
            onError: () => { setReplaceUploading(false); },
        });
    };

    const renderFilePreview = (fileData, label, fileType) => {
        if (!fileData?.url) return null;

        const extension = fileData.url.split(".").pop().toLowerCase();
        const isImage = ["jpg", "jpeg", "png", "gif", "webp"].includes(
            extension
        );
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
                    {/* Ganti button hidden sesuai permintaan */}
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
                                    isImage,
                                });
                                setShowModal(true);
                                setZoomLevel(1);
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

            <style>{`
                .zoom-controls {
                    position: absolute;
                    top: 10px;
                    right: 10px;
                    z-index: 10;
                    background: rgba(0, 0, 0, 0.7);
                    border-radius: 4px;
                    padding: 8px;
                    display: flex;
                    gap: 4px;
                }

                .zoom-controls button {
                    background: #fff;
                    border: none;
                    padding: 6px 10px;
                    cursor: pointer;
                    border-radius: 3px;
                    font-size: 14px;
                    font-weight: bold;
                    transition: all 0.2s;
                }

                .zoom-controls button:hover {
                    background: #f0f0f0;
                }

                .zoom-controls button:active {
                    transform: scale(0.95);
                }

                .modal-body-zoom {
                    position: relative;
                    overflow: hidden;
                    max-height: 600px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: #f5f5f5;
                }

                .zoom-info {
                    position: absolute;
                    bottom: 10px;
                    left: 10px;
                    background: rgba(0, 0, 0, 0.7);
                    color: white;
                    padding: 8px 12px;
                    border-radius: 4px;
                    font-size: 12px;
                    z-index: 10;
                }

                .react-transform-wrapper {
                    width: 100%;
                    height: 100%;
                }

                .react-transform-component {
                    width: 100%;
                    height: 100%;
                }

                .modal-overlay {
                    position: fixed; top: 0; left: 0; right: 0; bottom: 0;
                    background: rgba(0,0,0,0.5); z-index: 1040;
                }
                .modal-container {
                    position: fixed; top: 0; left: 0; right: 0; bottom: 0;
                    z-index: 1050; display: flex; align-items: center; justify-content: center;
                }
                .replace-preview {
                    max-width: 100%; max-height: 250px; object-fit: contain;
                    border: 2px dashed #dee2e6; border-radius: 8px; padding: 8px;
                }
                .file-drop-zone {
                    border: 2px dashed #dee2e6; border-radius: 8px; padding: 32px;
                    text-align: center; cursor: pointer; transition: all 0.2s; background: #f8f9fa;
                }
                .file-drop-zone:hover { border-color: #0d6efd; background: #e9ecef; }
                .file-drop-zone.has-file { border-color: #198754; background: #f0fff4; }
            `}</style>

            <div className="container-fluid py-4">
                <div>
                    <button
                        onClick={() => window.history.back()}
                        className="btn btn-secondary ms-2 mb-2"
                    >
                        <i className="bi bi-reply me-1"></i>
                        <span>Kembali</span>
                    </button>
                </div>
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
                                            <td>Desil</td>
                                            <td>: {data.desil}</td>
                                        </tr>
                                        <tr>
                                            <td>No. KK</td>
                                            <td>: {data.no_kk}</td>
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
                                                {data.jenis_kelamin == "L"
                                                    ? "Laki-laki"
                                                    : "Perempuan"}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>No. Telepon</td>
                                            <td>: {data.phone_number}</td>
                                        </tr>
                                    </tbody>
                                </table>

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
                                                : {data.rt.nama}/{data.rw.nama}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Kelurahan</td>
                                            <td>: {data.kelurahan.nama}</td>
                                        </tr>
                                        <tr>
                                            <td>Kecamatan</td>
                                            <td>: {data.kecamatan.nama}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div className="col-md-6">
                                <h6 className="fw-bold">Data Pelatihan</h6>
                                <table className="table table-sm">
                                    <tbody>
                                        <tr>
                                            <td style={{ width: "200px" }}>
                                                Pendidikan
                                            </td>
                                            <td>: {data.pendidikan.nama}</td>
                                        </tr>
                                        <tr>
                                            <td>Jenis Pelatihan</td>
                                            <td>
                                                : {data.jenis_pelatihan.nama}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Alasan Mengikuti</td>
                                            <td>
                                                : {data.alasan_pelatihan.nama}
                                            </td>
                                            <td className="text-danger text-bold">
                                                {" "}
                                                Skor : {data.alasan_pelatihan.skor}
                                            </td>
                                            <td className="text-danger text-bold">
                                                NA :{" "}
                                                {parseFloat(
                                                    (data.alasan_pelatihan.skor / 3) *
                                                        25
                                                ).toFixed(2)}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Status Bekerja</td>
                                            <td>
                                                :
                                                {data.status_bekerja === 1
                                                    ? " Sudah bekerja"
                                                    : data.status_bekerja === 2
                                                    ? " Sudah tidak bekerja"
                                                    : " Belum bekerja"}
                                            </td>
                                            <td className="text-danger text-bold">
                                                {" "}
                                                Skor : {data.status_bekerja}
                                            </td>
                                            <td className="text-danger text-bold">
                                                NA :{" "}
                                                {parseFloat(
                                                    (data.status_bekerja / 3) *
                                                        25
                                                ).toFixed(2)}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                Mengikuti Pelatihan Sebelumnya
                                            </td>
                                            <td>
                                                :{" "}
                                                {data.pernah_pelatihan === 1
                                                    ? " Pernah"
                                                    : data.pernah_pelatihan === 2
                                                    ? " Pernah"
                                                    : " Tidak Pernah"}
                                            </td>
                                            <td className="text-danger text-bold">
                                                {" "}
                                                Skor : {data.pernah_pelatihan}
                                            </td>
                                            <td className="text-danger text-bold">
                                                NA :{" "}
                                                {parseFloat(
                                                    (data.pernah_pelatihan / 3) *
                                                        25
                                                ).toFixed(2)}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Status Domisili</td>
                                            <td>
                                                :{" "}
                                                {data.status_domisili === 1
                                                    ? " Luar Kota Kediri"
                                                    : data.status_domisili === 2
                                                    ? " Kota Kediri tidak sesuai KTP"
                                                    : " Sesuai KTP"}
                                            </td>
                                            <td className="text-danger text-bold">
                                                {" "}
                                                Skor : {data.status_domisili}
                                            </td>
                                            <td className="text-danger text-bold">
                                                NA :{" "}
                                                {parseFloat(
                                                    (data.status_domisili / 3) *
                                                        25
                                                ).toFixed(2)}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                                <h6 className="fw-bold">SKORING</h6>
                                <table className="table table-sm">
                                    <tbody>
                                        <tr>
                                            <td>Skor </td>
                                            <td>
                                                {" "}
                                                :{" "}
                                                {parseFloat(data.skor_total).toFixed(
                                                    2
                                                )}
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
                                                    <div className="modal-body modal-body-zoom">
                                                        {activeFile.isImage ? (
                                                            <TransformWrapper
                                                                initialScale={1}
                                                                initialX={0}
                                                                initialY={0}
                                                                minScale={0.5}
                                                                maxScale={4}
                                                                centerOnInit={true}
                                                                wheel={{
                                                                    step: 100,
                                                                }}
                                                                panning={{
                                                                    velocityDisabled: false,
                                                                }}
                                                                doubleClick={{
                                                                    mode: "zoomIn",
                                                                }}
                                                            >
                                                                {({
                                                                    zoomIn,
                                                                    zoomOut,
                                                                    resetTransform,
                                                                    state,
                                                                }) => (
                                                                    <>
                                                                        <div className="zoom-controls">
                                                                            <button
                                                                                onClick={() =>
                                                                                    zoomIn()
                                                                                }
                                                                                title="Zoom In"
                                                                            >
                                                                                <i className="bi bi-zoom-in"></i>
                                                                            </button>
                                                                            <button
                                                                                onClick={() =>
                                                                                    zoomOut()
                                                                                }
                                                                                title="Zoom Out"
                                                                            >
                                                                                <i className="bi bi-zoom-out"></i>
                                                                            </button>
                                                                            <button
                                                                                onClick={() =>
                                                                                    resetTransform()
                                                                                }
                                                                                title="Reset"
                                                                            >
                                                                                <i className="bi bi-arrow-counterclockwise"></i>
                                                                            </button>
                                                                        </div>

                                                                        <TransformComponent>
                                                                            <img
                                                                                src={
                                                                                    activeFile.url
                                                                                }
                                                                                alt={
                                                                                    activeFile.label
                                                                                }
                                                                                style={{
                                                                                    maxWidth:
                                                                                        "100%",
                                                                                    maxHeight:
                                                                                        "100%",
                                                                                    objectFit:
                                                                                        "contain",
                                                                                }}
                                                                            />
                                                                        </TransformComponent>

                                                                        <div className="zoom-info">
                                                                            Zoom:{" "}
                                                                            {state
                                                                                ? Math.round(
                                                                                      state.scale *
                                                                                          100
                                                                                  )
                                                                                : 100}
                                                                            %
                                                                        </div>
                                                                    </>
                                                                )}
                                                            </TransformWrapper>
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

                        {showReplaceModal && replaceTarget && (
                            <div>
                                <div className="modal-overlay" onClick={() => setShowReplaceModal(false)}></div>
                                <div className="modal-container">
                                    <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
                                        <div className="modal-dialog modal-dialog-centered">
                                            <div className="modal-content">
                                                <div className="modal-header">
                                                    <h5 className="modal-title">Ganti Dokumen - {replaceTarget.label}</h5>
                                                    <button type="button" className="btn-close" onClick={() => setShowReplaceModal(false)}></button>
                                                </div>
                                                <div className="modal-body">
                                                    <p className="text-muted mb-3">
                                                        Unggah file baru untuk mengganti dokumen <strong>{replaceTarget.label}</strong>.
                                                        Verifikasi dokumen akan direset dan perlu diverifikasi ulang.
                                                    </p>
                                                    <div className={`file-drop-zone ${replaceFile ? "has-file" : ""}`}
                                                        onClick={() => fileInputRef.current?.click()}>
                                                        {replacePreview ? (
                                                            <div>
                                                                {replaceTarget.isImage ? (
                                                                    <img src={replacePreview} alt="Preview" className="replace-preview mb-2" />
                                                                ) : (
                                                                    <div className="mb-2">
                                                                        <i className="bi bi-file-earmark-pdf" style={{ fontSize: "48px", color: "#dc3545" }}></i>
                                                                        <p className="mt-2 fw-bold">{replaceFile.name}</p>
                                                                    </div>
                                                                )}
                                                                <p className="text-success mb-0"><i className="bi bi-check-circle me-1"></i>File siap diunggah</p>
                                                            </div>
                                                        ) : (
                                                            <div>
                                                                <i className="bi bi-cloud-upload" style={{ fontSize: "48px", color: "#6c757d" }}></i>
                                                                <p className="mt-2 fw-bold">Klik untuk memilih file</p>
                                                                <p className="text-muted small">Format: JPG, PNG, atau PDF (max 5MB)</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <input ref={fileInputRef} type="file" className="d-none"
                                                        accept={replaceTarget?.isImage ? ".jpg,.jpeg,.png" : ".pdf"}
                                                        onChange={handleReplaceFileSelect} />
                                                </div>
                                                <div className="modal-footer">
                                                    <button type="button" className="btn btn-secondary" onClick={() => setShowReplaceModal(false)}>Batal</button>
                                                    <button type="button" className="btn btn-primary" onClick={handleReplaceSubmit}
                                                        disabled={!replaceFile || replaceUploading}>
                                                        {replaceUploading ? (
                                                            <><span className="spinner-border spinner-border-sm me-2" role="status"></span>Mengunggah...</>
                                                        ) : (
                                                            <><i className="bi bi-upload me-1"></i>Unggah & Ganti</>
                                                        )}
                                                    </button>
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
