import AdminLayout from "@/Layouts/admin/AdminLayout";
import { Head, router } from "@inertiajs/react";
import { useEffect, useState } from "react";

export default function Show({ title, data, type = "PENDAFTARAN_BANMOD" }) {
    const [showModal, setShowModal] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [activeFile, setActiveFile] = useState(null);
    const [rejectNote, setRejectNote] = useState("");
    const [showRejectForm, setShowRejectForm] = useState(false);

    const DOCUMENT_TYPES = {
        PENDAFTARAN_BANMOD: [
            { key: "foto", label: "Pas Foto" },
            { key: "ktp", label: "KTP" },
            { key: "kk", label: "Kartu Keluarga" },
            { key: "nib", label: "NIB" },
            { key: "sku", label: "SKU" },
            { key: "skd", label: "Surat Keterangan Domisili" },
            { key: "produk", label: "Foto Produk" },
            { key: "pernyataan", label: "Surat Pernyataan Komitmen" },
            { key: "siinas", label: "SIINAS" },
            { key: "bp", label: "Businness Plan" },
            { key: "sertifikat_pelatihan", label: "Sertifikat Pelatihan" },
            { key: "perizinan", label: "Perizinan" },
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
                                        /\.(jpg|jpeg|png|gif)$/i
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
                                            <td>NIK</td>
                                            <td>: {data.nik}</td>
                                        </tr>
                                        <tr>
                                            <td>No. KK</td>
                                            <td>: {data.kk}</td>
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
                                                            NA :{" "}
                                                            {data.isDomisili ===
                                                                "0" &&
                                                            data.isUsaha === "0"
                                                                ? (4 / 4) * 15
                                                                : data.isDomisili ===
                                                                      "0" &&
                                                                  data.isUsaha ===
                                                                      "1"
                                                                ? (3 / 4) * 15
                                                                : data.isDomisili ===
                                                                      "1" &&
                                                                  data.isUsaha ===
                                                                      "0"
                                                                ? (2 / 4) * 15
                                                                : (1 / 4) * 15}
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
                                                            NA :{" "}
                                                            {data.isDomisili ===
                                                                "0" &&
                                                            data.isUsaha === "0"
                                                                ? (4 / 4) * 5
                                                                : data.isDomisili ===
                                                                      "0" &&
                                                                  data.isUsaha ===
                                                                      "1"
                                                                ? (3 / 4) * 5
                                                                : data.isDomisili ===
                                                                      "1" &&
                                                                  data.isUsaha ===
                                                                      "0"
                                                                ? (2 / 4) * 5
                                                                : (1 / 4) * 5}
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
                                                            NA :{" "}
                                                            {data.isDomisili ===
                                                                "0" &&
                                                            data.isUsaha === "0"
                                                                ? (4 / 4) * 10
                                                                : data.isDomisili ===
                                                                      "0" &&
                                                                  data.isUsaha ===
                                                                      "1"
                                                                ? (3 / 4) * 10
                                                                : data.isDomisili ===
                                                                      "1" &&
                                                                  data.isUsaha ===
                                                                      "0"
                                                                ? (2 / 4) * 10
                                                                : (1 / 4) * 10}
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
                                                        NA :{" "}
                                                        {parseFloat(
                                                            (data.skor_tanggungan_keluarga /
                                                                3) *
                                                                20
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
                                                        NA :{" "}
                                                        {parseFloat(
                                                            (data.skor_status_tempat_tinggal /
                                                                3) *
                                                                20
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
                                                        NA :{" "}
                                                        {(data.skor_lama_usaha /
                                                            4) *
                                                            25}
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
                                                        NA :{" "}
                                                        {(data.skor_lama_usaha /
                                                            4) *
                                                            15}
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
                                                        NA :{" "}
                                                        {(data.skor_lama_usaha /
                                                            4) *
                                                            15}
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
                                                            {(data.skor_jumlah_tenaga /
                                                                4) *
                                                                35}
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
                                                            {(data.skor_jumlah_tenaga /
                                                                4) *
                                                                10}
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
                                                            NA :{" "}
                                                            {(data.skor_bruto /
                                                                4) *
                                                                20}
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
                                                            NA :{" "}
                                                            {(data.skor_bruto /
                                                                4) *
                                                                5}
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
                                                    data.aset
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
                                                                  data.aset
                                                              ) ===
                                                              Number(
                                                                  data.hutang
                                                              )
                                                            ? 2
                                                            : 1}
                                                    </td>
                                                    <td className="text-danger text-bold">
                                                        NA :{" "}
                                                        {Number(data.aset) >
                                                        Number(data.hutang)
                                                            ? (3 / 3) * 5
                                                            : Number(
                                                                  data.aset
                                                              ) ===
                                                              Number(
                                                                  data.hutang
                                                              )
                                                            ? parseFloat(
                                                                  (2 / 3) * 5
                                                              ).toFixed(2)
                                                            : parseFloat(
                                                                  (1 / 3) * 5
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
                                                                  data.aset
                                                              ) ===
                                                              Number(
                                                                  data.hutang
                                                              )
                                                            ? 2
                                                            : 1}
                                                    </td>
                                                    <td className="text-danger text-bold">
                                                        NA :{" "}
                                                        {Number(data.aset) >
                                                        Number(data.hutang)
                                                            ? (3 / 3) * 5
                                                            : Number(
                                                                  data.aset
                                                              ) ===
                                                              Number(
                                                                  data.hutang
                                                              )
                                                            ? parseFloat(
                                                                  (2 / 3) * 5
                                                              ).toFixed(2)
                                                            : parseFloat(
                                                                  (1 / 3) * 5
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
                                                                  data.aset
                                                              ) ===
                                                              Number(
                                                                  data.hutang
                                                              )
                                                            ? 2
                                                            : 1}
                                                    </td>
                                                    <td className="text-danger text-bold">
                                                        NA :{" "}
                                                        {Math.round(
                                                            Number(data.aset) >
                                                                Number(
                                                                    data.hutang
                                                                )
                                                                ? (3 / 3) * 10
                                                                : Number(
                                                                      data.aset
                                                                  ) ===
                                                                  Number(
                                                                      data.hutang
                                                                  )
                                                                ? parseFloat(
                                                                      (2 / 3) *
                                                                          10
                                                                  ).toFixed(2)
                                                                : parseFloat(
                                                                      (1 / 3) *
                                                                          10
                                                                  ).toFixed(2)
                                                        )}
                                                    </td>
                                                </>
                                            )}
                                        </tr>
                                        <tr>
                                            <td>Hutang</td>
                                            <td>
                                                : Rp{" "}
                                                {Number(
                                                    data.hutang
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
                                                        NA :{" "}
                                                        {parseFloat(
                                                            (data.skor_legalitas /
                                                                3) *
                                                                10
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
                                                        NA :{" "}
                                                        {parseFloat(
                                                            (data.skor_teknologi /
                                                                3) *
                                                                10
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
                                                        NA :{" "}
                                                        {parseFloat(
                                                            (data.skor_penyerapan_naker /
                                                                3) *
                                                                10
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
                                        <tr>
                                            <td>Skor Sementara</td>
                                            <td>: {data.skor}</td>
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
                                                            {activeFile.label}
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
