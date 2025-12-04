import AdminLayout from "@/Layouts/admin/AdminLayout";
import { Head, router } from "@inertiajs/react";
import { useEffect, useState } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

export default function Show({ title, data, type = "PELATIHAN_PERTANIAN" }) {
    const [showModal, setShowModal] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [activeFile, setActiveFile] = useState(null);
    const [rejectNote, setRejectNote] = useState("");
    const [showRejectForm, setShowRejectForm] = useState(false);
    const [zoomLevel, setZoomLevel] = useState(1);

    const DOCUMENT_TYPES = {
        PELATIHAN_PERTANIAN: [
            { key: "foto", label: "Pas Foto" },
            { key: "ktp", label: "KTP" },
            { key: "kk", label: "Kartu Keluarga" },
            {
                key: "pernyataan",
                label: "Surat Pernyataan Tidak Mengikuti Pelatihan Lain",
            },
            {
                key: "kesanggupan",
                label: "Surat Kesanggupan Mengikuti Pelatihan",
            },
            {
                key: "pengukuhan_penyuluh_swadaya",
                label: "SK Pengukuhan Penyuluh Swadaya",
            },
            {
                key: "legalitas_kelompok",
                label: "Surat Legalitas Kelompok",
            },
            {
                key: "rekomendasi_kelompok",
                label: "Surat Rekomendasi Kelompok",
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
                            <div className="col-md-5">
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
                                                    :{" "}
                                                    {data.isDomisili === 0
                                                        ? "Sesuai KTP"
                                                        : data.alamat_domisili}
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            <div className="col-md-7">
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
                                            <td>Mempunyai Legalitas</td>
                                            <td>: Ya</td>
                                            <td className="text-danger text-bold">
                                                Skor :{" "}
                                                {
                                                    data.kelompok_tani
                                                        .skor_masa_aktif
                                                }
                                            </td>
                                            <td className="text-danger text-bold">
                                                NA :{" "}
                                                {parseFloat(
                                                    (data.kelompok_tani
                                                        .skor_masa_aktif /
                                                        3) *
                                                        50
                                                ).toFixed(2)}
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
                                            <td width={"50%"}>
                                                : {data.alasan}
                                            </td>
                                            <td className="text-danger text-bold">
                                                Skor : {data.skor_alasan}
                                            </td>
                                            <td className="text-danger text-bold">
                                                NA :{" "}
                                                {parseFloat(
                                                    (data.skor_alasan / 3) * 50
                                                ).toFixed(2)}
                                            </td>
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
                                                :{" "}
                                                {parseFloat(data.skor).toFixed(
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
                                                                centerOnInit={
                                                                    true
                                                                }
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
