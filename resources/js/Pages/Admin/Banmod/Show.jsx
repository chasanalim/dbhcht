import AdminLayout from "@/Layouts/admin/AdminLayout";
import { Head, router, usePage } from "@inertiajs/react";
import { useEffect, useState, useRef } from "react";

export default function Show({ title, data, type = "PENDAFTARAN_BANMOD" }) {
    const { auth } = usePage().props;
    const userRoles = auth?.user?.roles || [];
    const canReplace =
        userRoles.includes("pertanian") || userRoles.includes("admin");

    const [showModal, setShowModal] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [activeFile, setActiveFile] = useState(null);
    const [rejectNote, setRejectNote] = useState("");
    const [showRejectForm, setShowRejectForm] = useState(false);
    const [showReplaceModal, setShowReplaceModal] = useState(false);
    const [replaceTarget, setReplaceTarget] = useState(null);
    const [replaceFile, setReplaceFile] = useState(null);
    const [replacePreview, setReplacePreview] = useState(null);
    const [replaceUploading, setReplaceUploading] = useState(false);
    const fileInputRef = useRef(null);

    const DOCUMENT_TYPES = {
        PENDAFTARAN_BANMOD: [
            { key: "foto", label: "Pas Foto" },
            { key: "ktp", label: "KTP" },
            { key: "kk", label: "Kartu Keluarga" },
            { key: "nib", label: "NIB" },
            { key: "sku", label: "SKU" },
            { key: "skd", label: "Surat Keterangan Domisili" },
            { key: "produk", label: "Foto Produk" },
            { key: "lokasi_usaha", label: "Foto Lokasi Usaha" },
            { key: "siinas", label: "SIINAS" },
            { key: "bp", label: "Businness Plan" },
            { key: "sertifikat_pelatihan", label: "Sertifikat Pelatihan" },
            {
                key: "surat_disabilitas",
                label: "Surat Pernyataan Komitmen bagi Disabilitas",
            },
            {
                key: "surat_buruh",
                label: "Surat Pernyataan Komitmen bagi Buruh",
            },
            {
                key: "surat_miskin",
                label: "Surat Pernyataan Komitmen bagi Miskin",
            },
            { key: "perizinan", label: "Perizinan" },
        ],
    };

    const desilRaw = String(data.desil ?? "").trim();
    const desilMatch = !desilRaw.includes(">") ? desilRaw.match(/\d+/) : null;
    const nilaiDesil = desilMatch
        ? ({ 1: 4, 2: 3, 3: 2, 4: 1, 5: 1 }[parseInt(desilMatch[0])] ?? 0)
        : 0;
    const adaNilaiTambahan = ["1", "2", "3", "7"].includes(
        String(data.kategori_id),
    );

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
            },
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
        if (showReplaceModal) {
            html.style.overflow = "hidden";
        } else {
            html.style.overflow = "";
        }
        return () => {
            html.style.overflow = "";
        };
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
            },
        );
    };

    const openReplaceModal = (fileData, label, fileType) => {
        setReplaceTarget({
            url: fileData.url,
            label,
            fileType,
            isImage: fileData.isImage,
        });
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
            onError: () => {
                setReplaceUploading(false);
            },
        });
    };

    const renderFilePreview = (fileData, label, fileType) => {
        // Handle empty or invalid data
        if (!fileData) return null;

        // Handle multiple files (perizinan)
        if (Array.isArray(fileData)) {
            return (
                <div className="row g-3">
                    {fileData.map((file, index) => (
                        <div key={index} className="col-12">
                            <div className="card h-100">
                                <div className="card-header d-flex justify-content-between align-items-center">
                                    <h6 className="fw-bold mb-0">{`${label} ${
                                        index + 1
                                    }`}</h6>
                                    {file.verification && (
                                        <div className="d-flex align-items-center">
                                            <i
                                                className={`bi ${
                                                    file.verification.status ===
                                                    1
                                                        ? "bi-check-circle-fill text-success"
                                                        : "bi-x-circle-fill text-danger"
                                                } me-2`}
                                            ></i>
                                            <small className="text-muted">
                                                {file.verification.status === 1
                                                    ? "Diverifikasi"
                                                    : "Ditolak"}{" "}
                                                oleh{" "}
                                                {file.verification.verified_by}
                                            </small>
                                        </div>
                                    )}
                                </div>
                                <div className="card-body d-flex flex-column">
                                    {file.url.match(
                                        /\.(jpg|jpeg|png|gif)$/i,
                                    ) ? (
                                        <div
                                            className="text-center mb-3"
                                            style={{ height: "200px" }}
                                        >
                                            <img
                                                src={file.url}
                                                alt={`${label} ${index + 1}`}
                                                className="img-fluid h-100 object-fit-cover"
                                            />
                                        </div>
                                    ) : (
                                        <div className="ratio ratio-16x9 mb-3">
                                            <embed
                                                src={file.url}
                                                type="application/pdf"
                                                className="w-100 h-100"
                                            />
                                        </div>
                                    )}
                                    <div className="mt-auto">
                                        <button
                                            className={`btn btn-sm ${
                                                file.verification
                                                    ? file.verification
                                                          .status === 1
                                                        ? "btn-success"
                                                        : "btn-danger"
                                                    : "btn-primary"
                                            } w-100`}
                                            onClick={() => {
                                                setActiveFile({
                                                    url: file.url,
                                                    label: `${label} ${
                                                        index + 1
                                                    }`,
                                                    fileType,
                                                    verification:
                                                        file.verification,
                                                });
                                                setShowModal(true);
                                            }}
                                        >
                                            <i
                                                className={`bi ${
                                                    file.verification
                                                        ? file.verification
                                                              .status === 1
                                                            ? "bi-check-circle"
                                                            : "bi-x-circle"
                                                        : "bi-eye"
                                                } me-1`}
                                            ></i>
                                            {file.verification
                                                ? file.verification.status === 1
                                                    ? "Terverifikasi"
                                                    : "Ditolak"
                                                : "Lihat & Verifikasi"}
                                        </button>
                                    </div>
                                    {file.verification?.status === 0 && (
                                        <div className="mt-2">
                                            <small className="text-muted">
                                                Catatan:{" "}
                                                {file.verification.notes}
                                            </small>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            );
        }

        // Handle single file
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
                    <div className="mt-auto">
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
                                Catatan: {fileData.verification.notes}
                            </small>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    const renderDocuments = () => {
        if (!data.files || Object.keys(data.files).length === 0) {
            return <p>Tidak ada dokumen tersedia.</p>;
        }

        return (
            <div className="row row-cols-1 row-cols-md-3 g-4">
                {Object.entries(data.documentTypes).map(([key, label]) => {
                    const fileData = data.files[key];
                    return fileData ? (
                        <div key={key} className="col">
                            {renderFilePreview(fileData, label, key)}
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
                                            <td>NIK</td>
                                            <td>: {data.nik}</td>
                                        </tr>
                                        <tr>
                                            <td>No. KK</td>
                                            <td>: {data.kk}</td>
                                        </tr>
                                        <tr>
                                            <td>Desil</td>
                                            <td>: {data.desil}</td>
                                            {data.kategori_id === "5" && (
                                                <>
                                                    <td className="text-danger text-bold">
                                                        Skor : {nilaiDesil}
                                                    </td>
                                                    <td className="text-danger text-bold">
                                                        Bobot : 0.25
                                                    </td>
                                                    <td className="text-danger text-bold">
                                                        NA : skor x bobot ={" "}
                                                        {parseFloat(
                                                            nilaiDesil * 0.25,
                                                        ).toFixed(2)}
                                                    </td>
                                                </>
                                            )}
                                        </tr>
                                        <tr>
                                            <td>Nama</td>
                                            <td>: {data.name}</td>
                                        </tr>
                                        <tr>
                                            <td>Tempat Lahir</td>
                                            <td>: {data.tmp_lhr}</td>
                                        </tr>
                                        <tr>
                                            <td>Tanggal Lahir</td>
                                            <td>: {data.tgl_lhr}</td>
                                        </tr>
                                        <tr>
                                            <td>Jenis Kelamin</td>
                                            <td>
                                                :
                                                {data.jenis_kelamin === "L"
                                                    ? " Laki-laki"
                                                    : " Perempuan"}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>No. HP</td>
                                            <td>: {data.phone_number}</td>
                                        </tr>
                                    </tbody>
                                </table>

                                <h6 className="fw-bold mt-4">Alamat</h6>
                                <table className="table table-sm">
                                    <tbody>
                                        <tr>
                                            <td>Alamat KTP</td>
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
                                        {data.isDomisili && (
                                            <tr>
                                                <td>Alamat Domisili</td>
                                                <td>
                                                    :{" "}
                                                    {data.isDomisili === "0"
                                                        ? " Sesuai KTP"
                                                        : data.alamat_domisili}
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            <div className="col-md-6">
                                <h6 className="fw-bold">Data Usaha</h6>
                                <table className="table table-sm">
                                    <tbody>
                                        <tr>
                                            <td>Kategori</td>
                                            <td>: {data.kategori}</td>
                                        </tr>
                                        <tr>
                                            <td>Klaster Usaha</td>
                                            <td>: {data.klaster_usaha}</td>
                                        </tr>
                                        {data.isUsaha && (
                                            <tr>
                                                <td>Alamat Usaha</td>
                                                <td>
                                                    :{" "}
                                                    {data.isUsaha === "0"
                                                        ? " Sesuai KTP"
                                                        : data.alamat_usaha}
                                                </td>
                                                {(data.kategori_id === "1" ||
                                                    data.kategori_id === "2" ||
                                                    data.kategori_id ===
                                                        "3") && (
                                                    <>
                                                        <td className="text-danger text-bold">
                                                            Skor :{" "}
                                                            {data.isDomisili ===
                                                                "0" &&
                                                            data.isUsaha === "0"
                                                                ? 4
                                                                : data.isDomisili ===
                                                                        "0" &&
                                                                    data.isUsaha ===
                                                                        "1"
                                                                  ? 3
                                                                  : data.isDomisili ===
                                                                          "1" &&
                                                                      data.isUsaha ===
                                                                          "0"
                                                                    ? 2
                                                                    : 1}
                                                        </td>
                                                        <td className="text-danger text-bold">
                                                            Bobot : 0.15
                                                        </td>
                                                        <td className="text-danger text-bold">
                                                            NA : skor x bobot ={" "}
                                                            {data.isDomisili ===
                                                                "0" &&
                                                            data.isUsaha === "0"
                                                                ? 4 * 0.15
                                                                : data.isDomisili ===
                                                                        "0" &&
                                                                    data.isUsaha ===
                                                                        "1"
                                                                  ? 3 * 0.15
                                                                  : data.isDomisili ===
                                                                          "1" &&
                                                                      data.isUsaha ===
                                                                          "0"
                                                                    ? 2 * 0.15
                                                                    : 1 * 0.15}
                                                        </td>
                                                    </>
                                                )}
                                                {data.kategori_id === "4" && (
                                                    <>
                                                        <td className="text-danger text-bold">
                                                            Skor :{" "}
                                                            {data.isDomisili ===
                                                                "0" &&
                                                            data.isUsaha === "0"
                                                                ? 4
                                                                : data.isDomisili ===
                                                                        "0" &&
                                                                    data.isUsaha ===
                                                                        "1"
                                                                  ? 3
                                                                  : data.isDomisili ===
                                                                          "1" &&
                                                                      data.isUsaha ===
                                                                          "0"
                                                                    ? 2
                                                                    : 1}
                                                        </td>
                                                        <td className="text-danger text-bold">
                                                            Bobot : 0.05
                                                        </td>
                                                        <td className="text-danger text-bold">
                                                            NA :{" "}
                                                            {data.isDomisili ===
                                                                "0" &&
                                                            data.isUsaha === "0"
                                                                ? 4 * 0.05
                                                                : data.isDomisili ===
                                                                        "0" &&
                                                                    data.isUsaha ===
                                                                        "1"
                                                                  ? 3 * 0.05
                                                                  : data.isDomisili ===
                                                                          "1" &&
                                                                      data.isUsaha ===
                                                                          "0"
                                                                    ? 2 * 0.05
                                                                    : 1 * 0.05}
                                                        </td>
                                                    </>
                                                )}
                                                {data.kategori_id === "5" && (
                                                    <>
                                                        <td className="text-danger text-bold">
                                                            Skor :{" "}
                                                            {data.isDomisili ===
                                                                "0" &&
                                                            data.isUsaha === "0"
                                                                ? 4
                                                                : data.isDomisili ===
                                                                        "0" &&
                                                                    data.isUsaha ===
                                                                        "1"
                                                                  ? 3
                                                                  : data.isDomisili ===
                                                                          "1" &&
                                                                      data.isUsaha ===
                                                                          "0"
                                                                    ? 2
                                                                    : 1}
                                                        </td>
                                                        <td className="text-danger text-bold">
                                                            Bobot : 0.10
                                                        </td>
                                                        <td className="text-danger text-bold">
                                                            NA : skor x bobot ={" "}
                                                            {data.isDomisili ===
                                                                "0" &&
                                                            data.isUsaha === "0"
                                                                ? 4 * 0.1
                                                                : data.isDomisili ===
                                                                        "0" &&
                                                                    data.isUsaha ===
                                                                        "1"
                                                                  ? 3 * 0.1
                                                                  : data.isDomisili ===
                                                                          "1" &&
                                                                      data.isUsaha ===
                                                                          "0"
                                                                    ? 2 * 0.1
                                                                    : 1 * 0.1}
                                                        </td>
                                                    </>
                                                )}
                                            </tr>
                                        )}
                                        {data.kategori_id === "5" && (
                                            <>
                                                <tr>
                                                    <td>Tanggungan Keluarga</td>
                                                    <td>
                                                        :{" "}
                                                        {
                                                            data.tanggungan_keluarga
                                                        }
                                                    </td>
                                                    <td className="text-danger text-bold">
                                                        Skor :{" "}
                                                        {
                                                            data.skor_tanggungan_keluarga
                                                        }
                                                    </td>
                                                    <td className="text-danger text-bold">
                                                        Bobot : 0.20
                                                    </td>
                                                    <td className="text-danger text-bold">
                                                        NA : skor x bobot ={" "}
                                                        {parseFloat(
                                                            data.skor_tanggungan_keluarga *
                                                                0.2,
                                                        ).toFixed(2)}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        Status Tempat Tinggal
                                                    </td>
                                                    <td>
                                                        :{" "}
                                                        {
                                                            data.status_tempat_tinggal
                                                        }
                                                    </td>
                                                    <td className="text-danger text-bold">
                                                        Skor :{" "}
                                                        {
                                                            data.skor_status_tempat_tinggal
                                                        }
                                                    </td>
                                                    <td className="text-danger text-bold">
                                                        Bobot : 0.20
                                                    </td>
                                                    <td className="text-danger text-bold">
                                                        NA : skor x bobot ={" "}
                                                        {parseFloat(
                                                            data.skor_status_tempat_tinggal *
                                                                0.2,
                                                        ).toFixed(2)}
                                                    </td>
                                                </tr>
                                            </>
                                        )}
                                        <tr>
                                            <td>Lama Usaha</td>
                                            <td>: {data.lama_usaha}</td>
                                            {(data.kategori_id === "1" ||
                                                data.kategori_id === "2" ||
                                                data.kategori_id === "3") && (
                                                <>
                                                    <td className="text-danger text-bold">
                                                        Skor :{" "}
                                                        {data.skor_lama_usaha}
                                                    </td>
                                                    <td className="text-danger text-bold">
                                                        Bobot : 0.25
                                                    </td>
                                                    <td className="text-danger text-bold">
                                                        NA : skor x bobot ={" "}
                                                        {data.skor_lama_usaha *
                                                            0.25}
                                                    </td>
                                                </>
                                            )}
                                            {data.kategori_id === "4" && (
                                                <>
                                                    <td className="text-danger text-bold">
                                                        Skor :{" "}
                                                        {data.skor_lama_usaha}
                                                    </td>
                                                    <td className="text-danger text-bold">
                                                        Bobot : 0.15
                                                    </td>
                                                    <td className="text-danger text-bold">
                                                        NA : skor x bobot ={" "}
                                                        {data.skor_lama_usaha *
                                                            0.15}
                                                    </td>
                                                </>
                                            )}
                                            {data.kategori_id === "5" && (
                                                <>
                                                    <td className="text-danger text-bold">
                                                        Skor :{" "}
                                                        {data.skor_lama_usaha}
                                                    </td>
                                                    <td className="text-danger text-bold">
                                                        Bobot : 0.15
                                                    </td>
                                                    <td className="text-danger text-bold">
                                                        NA : skor x bobot ={" "}
                                                        {data.skor_lama_usaha *
                                                            0.15}
                                                    </td>
                                                </>
                                            )}
                                        </tr>
                                        {data.kategori_id !== "5" && (
                                            <tr>
                                                <td>Jumlah Tenaga Kerja</td>
                                                <td>: {data.jumlah_tenaga}</td>
                                                {(data.kategori_id === "1" ||
                                                    data.kategori_id === "2" ||
                                                    data.kategori_id ===
                                                        "3") && (
                                                    <>
                                                        <td className="text-danger text-bold">
                                                            Skor :{" "}
                                                            {
                                                                data.skor_jumlah_tenaga
                                                            }
                                                        </td>
                                                        <td className="text-danger text-bold">
                                                            NA :{" "}
                                                            {data.skor_jumlah_tenaga *
                                                                0.35}
                                                        </td>
                                                    </>
                                                )}
                                                {data.kategori_id === "4" && (
                                                    <>
                                                        <td className="text-danger text-bold">
                                                            Skor :{" "}
                                                            {
                                                                data.skor_jumlah_tenaga
                                                            }
                                                        </td>
                                                        <td className="text-danger text-bold">
                                                            NA :{" "}
                                                            {data.skor_jumlah_tenaga *
                                                                0.1}
                                                        </td>
                                                    </>
                                                )}
                                            </tr>
                                        )}
                                        {data.kategori_id !== "5" && (
                                            <tr>
                                                <td>Omzet per Bulan</td>
                                                <td>: {data.bruto}</td>
                                                {(data.kategori_id === "1" ||
                                                    data.kategori_id === "2" ||
                                                    data.kategori_id ===
                                                        "3") && (
                                                    <>
                                                        <td className="text-danger text-bold">
                                                            Skor :{" "}
                                                            {data.skor_bruto}
                                                        </td>
                                                        <td className="text-danger text-bold">
                                                            Bobot : 0.20
                                                        </td>
                                                        <td className="text-danger text-bold">
                                                            NA : skor x bobot ={" "}
                                                            {data.skor_bruto *
                                                                0.2}
                                                        </td>
                                                    </>
                                                )}
                                                {data.kategori_id === "4" && (
                                                    <>
                                                        <td className="text-danger text-bold">
                                                            Skor :{" "}
                                                            {data.skor_bruto}
                                                        </td>
                                                        <td className="text-danger text-bold">
                                                            Bobot : 0.05
                                                        </td>
                                                        <td className="text-danger text-bold">
                                                            NA : skor x bobot ={" "}
                                                            {data.skor_bruto *
                                                                0.05}
                                                        </td>
                                                    </>
                                                )}
                                            </tr>
                                        )}

                                        <tr>
                                            <td>Aset</td>
                                            <td>
                                                : Rp{" "}
                                                {Number(
                                                    data.aset,
                                                ).toLocaleString()}
                                            </td>
                                            {(data.kategori_id === "1" ||
                                                data.kategori_id === "2" ||
                                                data.kategori_id === "3") && (
                                                <>
                                                    <td className="text-danger text-bold">
                                                        Skor :{" "}
                                                        {Number(data.aset) >
                                                        Number(data.hutang)
                                                            ? 3
                                                            : Number(
                                                                    data.aset,
                                                                ) ===
                                                                Number(
                                                                    data.hutang,
                                                                )
                                                              ? 2
                                                              : 1}
                                                    </td>
                                                    <td className="text-danger text-bold">
                                                        Bobot : 0.05
                                                    </td>
                                                    <td className="text-danger text-bold">
                                                        NA : skor x bobot ={" "}
                                                        {Number(data.aset) >
                                                        Number(data.hutang)
                                                            ? parseFloat(
                                                                  3 * 0.05,
                                                              ).toFixed(2)
                                                            : Number(
                                                                    data.aset,
                                                                ) ===
                                                                Number(
                                                                    data.hutang,
                                                                )
                                                              ? parseFloat(
                                                                    2 * 0.05,
                                                                ).toFixed(2)
                                                              : parseFloat(
                                                                    1 * 0.05,
                                                                ).toFixed(2)}
                                                    </td>
                                                </>
                                            )}
                                            {data.kategori_id === "4" && (
                                                <>
                                                    <td className="text-danger text-bold">
                                                        Skor :{" "}
                                                        {Number(data.aset) >
                                                        Number(data.hutang)
                                                            ? 3
                                                            : Number(
                                                                    data.aset,
                                                                ) ===
                                                                Number(
                                                                    data.hutang,
                                                                )
                                                              ? 2
                                                              : 1}
                                                    </td>
                                                    <td className="text-danger text-bold">
                                                        Bobot : 0.05
                                                    </td>
                                                    <td className="text-danger text-bold">
                                                        NA : skor x bobot ={" "}
                                                        {Number(data.aset) >
                                                        Number(data.hutang)
                                                            ? 3 * 0.05
                                                            : Number(
                                                                    data.aset,
                                                                ) ===
                                                                Number(
                                                                    data.hutang,
                                                                )
                                                              ? parseFloat(
                                                                    2 * 0.05,
                                                                ).toFixed(2)
                                                              : parseFloat(
                                                                    1 * 0.05,
                                                                ).toFixed(2)}
                                                    </td>
                                                </>
                                            )}
                                            {data.kategori_id === "5" && (
                                                <>
                                                    <td className="text-danger text-bold">
                                                        Skor :{" "}
                                                        {Number(data.aset) >
                                                        Number(data.hutang)
                                                            ? 3
                                                            : Number(
                                                                    data.aset,
                                                                ) ===
                                                                Number(
                                                                    data.hutang,
                                                                )
                                                              ? 2
                                                              : 1}
                                                    </td>
                                                    <td className="text-danger text-bold">
                                                        Bobot : 0.10
                                                    </td>
                                                    <td className="text-danger text-bold">
                                                        NA : skor x bobot ={" "}
                                                        {(Number(data.aset) >
                                                        Number(data.hutang)
                                                            ? 3 * 0.1
                                                            : Number(
                                                                    data.aset,
                                                                ) ===
                                                                Number(
                                                                    data.hutang,
                                                                )
                                                              ? 2 * 0.1
                                                              : 1 * 0.1
                                                        ).toFixed(2)}
                                                    </td>
                                                </>
                                            )}
                                        </tr>
                                        <tr>
                                            <td>Hutang</td>
                                            <td>
                                                : Rp{" "}
                                                {Number(
                                                    data.hutang,
                                                ).toLocaleString()}
                                            </td>
                                        </tr>

                                        {data.kategori_id === "4" && (
                                            <>
                                                <tr>
                                                    <td>Jumlah Legalitas</td>
                                                    <td>
                                                        :{" "}
                                                        {data.jumlah_legalitas}
                                                    </td>
                                                    <td className="text-danger text-bold">
                                                        Skor :{" "}
                                                        {data.skor_legalitas}
                                                    </td>
                                                    <td className="text-danger text-bold">
                                                        Bobot : 0.10
                                                    </td>
                                                    <td className="text-danger text-bold">
                                                        NA : skor x bobot ={" "}
                                                        {parseFloat(
                                                            data.skor_legalitas *
                                                                0.1,
                                                        ).toFixed(2)}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>Jumlah Teknologi</td>
                                                    <td>
                                                        :{" "}
                                                        {data.jumlah_teknologi}
                                                    </td>
                                                    <td className="text-danger text-bold">
                                                        Skor :{" "}
                                                        {data.skor_teknologi}
                                                    </td>
                                                    <td className="text-danger text-bold">
                                                        Bobot : 0.10
                                                    </td>
                                                    <td className="text-danger text-bold">
                                                        NA : skor x bobot ={" "}
                                                        {parseFloat(
                                                            data.skor_teknologi *
                                                                0.1,
                                                        ).toFixed(2)}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        Penyerapan Tenaga Kerja
                                                    </td>
                                                    <td>
                                                        :{" "}
                                                        {
                                                            data.jumlah_penyerapan_naker
                                                        }
                                                    </td>
                                                    <td className="text-danger text-bold">
                                                        Skor :{" "}
                                                        {
                                                            data.skor_penyerapan_naker
                                                        }
                                                    </td>
                                                    <td className="text-danger text-bold">
                                                        Bobot : 0.10
                                                    </td>
                                                    <td className="text-danger text-bold">
                                                        NA : skor x bobot ={" "}
                                                        {parseFloat(
                                                            data.skor_penyerapan_naker *
                                                                0.1,
                                                        ).toFixed(2)}
                                                    </td>
                                                </tr>
                                            </>
                                        )}
                                    </tbody>
                                </table>

                                <h6 className="fw-bold">SKORING</h6>
                                <table className="table table-sm">
                                    <tbody>
                                        {adaNilaiTambahan && (
                                            <tr>
                                                <td>Nilai Tambahan</td>
                                                <td>: 1.35</td>
                                            </tr>
                                        )}
                                        <tr>
                                            <td>Total Skor</td>
                                            <td>: {data.skor.toFixed(2)}</td>
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
                                                                  ? `${activeFile.label} | NO KK : ${data.kk}`
                                                                  : activeFile.label}
                                                        </h5>
                                                        <button
                                                            type="button"
                                                            className="btn-close"
                                                            onClick={() =>
                                                                setShowModal(
                                                                    false,
                                                                )
                                                            }
                                                        ></button>
                                                    </div>
                                                    <div className="modal-body">
                                                        {activeFile.url.match(
                                                            /\.(jpg|jpeg|png|gif)$/i,
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
                                                                            e,
                                                                        ) =>
                                                                            setRejectNote(
                                                                                e
                                                                                    .target
                                                                                    .value,
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
                                                                                false,
                                                                            );
                                                                            setRejectNote(
                                                                                "",
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
                                                                                activeFile.fileType,
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
                                                                        false,
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
                                                                                true,
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
                                                                                activeFile.fileType,
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
                                <div
                                    className="modal-overlay"
                                    onClick={() => setShowReplaceModal(false)}
                                ></div>
                                <div className="modal-container">
                                    <div
                                        className="modal fade show d-block"
                                        style={{
                                            backgroundColor: "rgba(0,0,0,0.5)",
                                        }}
                                    >
                                        <div className="modal-dialog modal-dialog-centered">
                                            <div className="modal-content">
                                                <div className="modal-header">
                                                    <h5 className="modal-title">
                                                        Ganti Dokumen -{" "}
                                                        {replaceTarget.label}
                                                    </h5>
                                                    <button
                                                        type="button"
                                                        className="btn-close"
                                                        onClick={() =>
                                                            setShowReplaceModal(
                                                                false,
                                                            )
                                                        }
                                                    ></button>
                                                </div>
                                                <div className="modal-body">
                                                    <p className="text-muted mb-3">
                                                        Unggah file baru untuk
                                                        mengganti dokumen{" "}
                                                        <strong>
                                                            {
                                                                replaceTarget.label
                                                            }
                                                        </strong>
                                                        . Verifikasi dokumen
                                                        akan direset dan perlu
                                                        diverifikasi ulang.
                                                    </p>
                                                    <div
                                                        className={`file-drop-zone ${replaceFile ? "has-file" : ""}`}
                                                        onClick={() =>
                                                            fileInputRef.current?.click()
                                                        }
                                                    >
                                                        {replacePreview ? (
                                                            <div>
                                                                {replaceTarget.isImage ? (
                                                                    <img
                                                                        src={
                                                                            replacePreview
                                                                        }
                                                                        alt="Preview"
                                                                        className="replace-preview mb-2"
                                                                    />
                                                                ) : (
                                                                    <div className="mb-2">
                                                                        <i
                                                                            className="bi bi-file-earmark-pdf"
                                                                            style={{
                                                                                fontSize:
                                                                                    "48px",
                                                                                color: "#dc3545",
                                                                            }}
                                                                        ></i>
                                                                        <p className="mt-2 fw-bold">
                                                                            {
                                                                                replaceFile.name
                                                                            }
                                                                        </p>
                                                                    </div>
                                                                )}
                                                                <p className="text-success mb-0">
                                                                    <i className="bi bi-check-circle me-1"></i>
                                                                    File siap
                                                                    diunggah
                                                                </p>
                                                            </div>
                                                        ) : (
                                                            <div>
                                                                <i
                                                                    className="bi bi-cloud-upload"
                                                                    style={{
                                                                        fontSize:
                                                                            "48px",
                                                                        color: "#6c757d",
                                                                    }}
                                                                ></i>
                                                                <p className="mt-2 fw-bold">
                                                                    Klik untuk
                                                                    memilih file
                                                                </p>
                                                                <p className="text-muted small">
                                                                    Format: JPG,
                                                                    PNG, atau
                                                                    PDF (max
                                                                    5MB)
                                                                </p>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <input
                                                        ref={fileInputRef}
                                                        type="file"
                                                        className="d-none"
                                                        accept={
                                                            replaceTarget?.isImage
                                                                ? ".jpg,.jpeg,.png"
                                                                : ".pdf"
                                                        }
                                                        onChange={
                                                            handleReplaceFileSelect
                                                        }
                                                    />
                                                </div>
                                                <div className="modal-footer">
                                                    <button
                                                        type="button"
                                                        className="btn btn-secondary"
                                                        onClick={() =>
                                                            setShowReplaceModal(
                                                                false,
                                                            )
                                                        }
                                                    >
                                                        Batal
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="btn btn-primary"
                                                        onClick={
                                                            handleReplaceSubmit
                                                        }
                                                        disabled={
                                                            !replaceFile ||
                                                            replaceUploading
                                                        }
                                                    >
                                                        {replaceUploading ? (
                                                            <>
                                                                <span
                                                                    className="spinner-border spinner-border-sm me-2"
                                                                    role="status"
                                                                ></span>
                                                                Mengunggah...
                                                            </>
                                                        ) : (
                                                            <>
                                                                <i className="bi bi-upload me-1"></i>
                                                                Unggah & Ganti
                                                            </>
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
