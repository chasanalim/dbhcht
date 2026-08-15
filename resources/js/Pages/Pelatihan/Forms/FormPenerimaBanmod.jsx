import { Form, Button, InputGroup, ListGroup } from "react-bootstrap";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useForm } from "@inertiajs/react";
import Select from "react-select";

import SelectKecamatan from "@/Components/Select/SelectKecamatan";
import SelectKelurahan from "@/Components/Select/SelectKelurahan";
import SelectRt from "@/Components/Select/SelectRt";
import SelectRw from "@/Components/Select/SelectRw";
import SelectTahun from "@/Components/Select/SelectTahun";
import SelectJenisPelatihan from "@/Components/Select/SelectPelatihanBanmod";
import SelectSkorPelatihan from "@/Components/Select/SelectSkorPelatihanBanmod";

export default function FormPenerimaBanmod({ jenisPelatihanOptions = [] }) {
    const [nikStatus, setNikStatus] = useState(null);
    const [dataPenerima, setDataPenerima] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");
    const [tampilKonfirmasi, setTampilKonfirmasi] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [nikLength, setNikLength] = useState(0);
    const [dataFound, setDataFound] = useState(false);

    // Add processing to useForm destructuring
    const { data, setData, errors, post, reset, processing } = useForm({
        tahun_penerimaan: "",
        nik: "",
        nama_lengkap: "",
        no_kk: "",
        no_hp: "",
        desil: "",

        // Alamat KTP
        kecamatan_ktp: "",
        kelurahan_ktp: "",
        rw_ktp: "",
        rt_ktp: "",
        jalan_ktp: "",

        kode_kecamatan_ktp: "",
        kode_kelurahan_ktp: "",
        kode_rw_ktp: "",
        kode_rt_ktp: "",

        // Alamat Usaha
        kecamatan_usaha: "",
        kelurahan_usaha: "",
        rw_usaha: "",
        rt_usaha: "",
        jalan_usaha: "",

        // Pelatihan & Perkembangan
        jenis_pelatihan_industri: "",
        perkembangan_omzet: "",
        perkembangan_tenaga_kerja: "",

        // Skor Pelatihan
        skor_ketrampilan: "",
        skor_kualitas_produk: "",
        skor_permasalahan_usaha: "",
        skor_mengisi_waktu: "",
        skor_diajak_teman: "",

        // Files - Updated structure
        file_ktp: null,
        file_kk: null,
        file_pasfoto: null,
        file_surat_pernyataan_tidak_ikut: null,
        file_nib: null,

        komitmen: false,
    });

    // Add isKomitmenChecked computed value
    const isKomitmenChecked = data.komitmen;

    // Helper function untuk menentukan apakah field should readonly
    const isFieldReadOnly = (fieldName) => {
        if (!dataPenerima) return false;
        
        // tahun_penerimaan dan desil always readonly
        if (['tahun_penerimaan', 'desil'].includes(fieldName)) return true;
        
        // no_hp always editable
        if (fieldName === 'no_hp') return false;
        
        // Jika data ditemukan dan tidak dalam edit mode, field readonly (kecuali no_hp)
        if (dataFound && !editMode) return true;
        
        return false;
    };

    // Fungsi untuk mengecek NIK
    const cekNik = async () => {
        setErrorMessage("");
        setNikStatus("");
        try {
            const response = await axios.get(
                `/pelatihan/banmod/cek-nik/${data.nik}`,
            );

            // Handle success response
            if (response.data.success) {
                const d = response.data.data;
                // Deteksi apakah data ditemukan atau tidak
                // Data ditemukan jika ada property 'nama' atau tahun_dapat_bantuan bukan '-'
                const found = !!d.nama || d.tahun_dapat_bantuan !== '-';
                setDataFound(found);
                
                setDataPenerima(d);
                setNikStatus(response.data.message || "NIK Valid ✓");
                setData((prev) => ({
                    ...prev,
                    nama_lengkap: d.nama || "",
                    no_kk: d.kk || "",
                    kecamatan_ktp: d.kec || "",
                    kelurahan_ktp: d.kel || "",
                    rw_ktp: d.rw || "",
                    rt_ktp: d.rt || "",
                    jalan_ktp: d.alamat || "",
                    desil: d.desil,
                    tahun_penerimaan: d.tahun_dapat_bantuan,
                }));
                setTampilKonfirmasi(found); // Hanya tampil konfirmasi jika data ditemukan
            } else {
                setErrorMessage(response.data.message);
                setDataPenerima(null);
            }
        } catch (error) {
            // Handle error response
            if (
                error.response?.status === 403 ||
                error.response?.status === 400
            ) {
                setErrorMessage(error.response.data.message);
                setDataPenerima(null);
            } else if (error.response?.status === 404) {
                setErrorMessage(
                    "NIK tidak ditemukan sebagai penerima bantuan modal.",
                );
                setDataPenerima(null);
            } else {
                setErrorMessage("Terjadi kesalahan saat cek NIK.");
            }
        }
    };

    const handleRemoveFile = (field, index) => {
        setData((prev) => {
            const updated = [...(prev[field] || [])];
            updated.splice(index, 1);
            return { ...prev, [field]: updated };
        });
    };

    const handleRemoveImage = (field, previewKey) => {
        setData((prev) => ({
            ...prev,
            [field]: [],
            [previewKey]: "",
        }));
    };

    const handleRemovePdfFile = (fieldName) => {
        setData((prev) => ({
            ...prev,
            [fieldName]: null,
        }));
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return "0 Bytes";
        const k = 1024;
        const sizes = ["Bytes", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    };

    const handleUploadFoto = (e, field_name, preview_name) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validasi ukuran file (2MB)
        const maxFileSize = 2 * 1024 * 1024; // 2MB
        if (file.size > maxFileSize) {
            alert(
                `Ukuran file terlalu besar: ${formatFileSize(file.size)}\n` +
                    `Maksimal ukuran file: 2MB\n` +
                    `Silakan kompres atau pilih file yang lebih kecil.`,
            );
            e.target.value = ""; // Reset input
            return;
        }

        let reader = new FileReader();

        reader.onloadend = () => {
            setData((prevState) => ({
                ...prevState,
                [field_name]: file,
                [preview_name]: reader.result,
            }));
        };

        reader.readAsDataURL(file);
    };

    const handleUploadFile = (e, field_name, multiple) => {
        const rawFiles = e.target.files;
        if (!rawFiles || rawFiles.length === 0) return;

        const files = Array.from(rawFiles);
        const maxFileSize = 2 * 1024 * 1024; // 2MB

        // Validasi setiap file
        for (let file of files) {
            if (file.size > maxFileSize) {
                alert(
                    `File "${file.name}" terlalu besar: ${formatFileSize(file.size)}\n` +
                        `Maksimal ukuran file: 2MB\n` +
                        `Silakan kompres atau pilih file yang lebih kecil.`,
                );
                e.target.value = "";
                return;
            }
        }

        setData((prevState) => ({
            ...prevState,
            [field_name]: multiple ? files : files[0],
        }));
    };

    const FileCompressionGuide = () => (
        <div className="alert alert-info mb-4">
            <h6 className="fw-bold">📋 Panduan Upload File:</h6>
            <ul className="mb-0 small">
                <li>
                    Maksimal ukuran per file: <strong>2MB</strong>
                </li>
                <li>
                    Jika file terlalu besar, gunakan tools kompresi online:
                    <ul>
                        <li>
                            Untuk gambar:{" "}
                            <a
                                href="https://tinypng.com"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                TinyPNG
                            </a>{" "}
                            atau{" "}
                            <a
                                href="https://compressjpeg.com"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                CompressJPEG
                            </a>
                        </li>
                        <li>
                            Untuk PDF:{" "}
                            <a
                                href="https://www.ilovepdf.com/compress_pdf"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                ILovePDF
                            </a>{" "}
                            atau{" "}
                            <a
                                href="https://smallpdf.com/compress-pdf"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                SmallPDF
                            </a>
                        </li>
                    </ul>
                </li>
            </ul>
        </div>
    );

    const renderFileUpload = (
        label,
        fieldName,
        accept = ".pdf",
        multiple = false,
        imagePreviewKey = null,
        downloadLink = null,
        description = "",
        fileIndex = 1,
    ) => {
        return (
            <Form.Group className="mb-4" key={fieldName}>
                <div className="mb-2 fw-semibold">
                    {fileIndex}. {label} {/* ✅ GANTI index dengan fileIndex */}
                </div>
                <Form.Label
                    className="text-primary"
                    style={{ fontSize: "11px" }}
                >
                    Format:{" "}
                    {accept === ".pdf" ? "*.pdf" : "*.png, *.jpg, *.jpeg"}
                </Form.Label>

                <Form.Control
                    type="file"
                    accept={accept}
                    multiple={multiple}
                    onChange={(e) =>
                        imagePreviewKey
                            ? handleUploadFoto(e, fieldName, imagePreviewKey)
                            : handleUploadFile(e, fieldName, multiple)
                    }
                    isInvalid={!!errors[fieldName]}
                />

                {/* Error display */}
                {errors[fieldName] && (
                    <Form.Control.Feedback type="invalid">
                        {errors[fieldName]}
                    </Form.Control.Feedback>
                )}

                {/* Deskripsi tambahan */}
                {description && (
                    <div
                        className="text-muted mt-1"
                        style={{ fontSize: "12px" }}
                    >
                        {description}
                    </div>
                )}

                {/* Link untuk unduh template dokumen */}
                {downloadLink && (
                    <div className="mt-2">
                        <a
                            href={downloadLink}
                            download
                            className="text-decoration-none text-danger fw-semibold"
                            style={{ fontSize: "12px" }}
                        >
                            📥 Unduh Template Dokumen (PDF)
                        </a>
                    </div>
                )}

                {/* Image Preview with Remove */}
                {imagePreviewKey && data[imagePreviewKey] && (
                    <div className="mt-3 position-relative d-inline-block">
                        <img
                            className="object-fit-cover rounded border"
                            width={200}
                            height={200}
                            src={data[imagePreviewKey]}
                            alt="Preview"
                        />
                        <Button
                            size="sm"
                            variant="danger"
                            className="position-absolute top-0 end-0"
                            onClick={() =>
                                handleRemoveImage(fieldName, imagePreviewKey)
                            }
                        >
                            ✕
                        </Button>
                    </div>
                )}

                {/* PDF/File Preview */}
                {!imagePreviewKey && data[fieldName] && (
                    <ListGroup className="mt-3">
                        {Array.isArray(data[fieldName]) ? (
                            data[fieldName].map((file, idx) => (
                                <ListGroup.Item
                                    key={idx}
                                    className="d-flex justify-content-between align-items-center"
                                >
                                    <span>
                                        📄 {file.name} (
                                        {formatFileSize(file.size)})
                                        <a
                                            href={URL.createObjectURL(file)}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="ms-2 text-decoration-underline"
                                        >
                                            Preview
                                        </a>
                                    </span>
                                    <Button
                                        size="sm"
                                        variant="outline-danger"
                                        onClick={() =>
                                            handleRemoveFile(fieldName, idx)
                                        }
                                    >
                                        Hapus
                                    </Button>
                                </ListGroup.Item>
                            ))
                        ) : (
                            <ListGroup.Item className="d-flex justify-content-between align-items-center">
                                <span>
                                    📄 {data[fieldName].name} (
                                    {formatFileSize(data[fieldName].size)})
                                    <a
                                        href={URL.createObjectURL(
                                            data[fieldName],
                                        )}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="ms-2 text-decoration-underline"
                                    >
                                        Preview
                                    </a>
                                </span>
                                <Button
                                    size="sm"
                                    variant="outline-danger"
                                    onClick={() =>
                                        handleRemovePdfFile(fieldName)
                                    }
                                >
                                    Hapus
                                </Button>
                            </ListGroup.Item>
                        )}
                    </ListGroup>
                )}
            </Form.Group>
        );
    };

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            await post(route("pelatihan-banmod.store"), {
                forceFormData: true,
                onSuccess: () => {
                    reset();
                    setTampilKonfirmasi(false);
                    setDataPenerima(null);
                    setNikStatus(null);
                },
                onError: (errors) => {
                    console.error("Form errors:", errors);
                },
            });
        } catch (error) {
            console.error("Submit error:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Form onSubmit={handleSubmit} encType="multipart/form-data">
            {/* Form Title */}
            <h4 className="text-center fw-bold mb-4">
                FORM PENDAFTARAN PELATIHAN KETRAMPILAN KERJA BAGI PENERIMA
                BANTUAN MODAL
            </h4>

            {/* Form Description */}
            {/* <div className="alert alert-info mb-4">
                <strong>DESKRIPSI PELATIHAN:</strong>
                <p className="mb-2">
                    Pelatihan akan dilaksanakan selama 10 hari, meliputi:
                </p>
                <ul className="mb-0">
                    <li>Manajemen Keuangan (1 hari)</li>
                    <li>Manajemen Pemasaran (1 hari)</li>
                    <li>Peningkatan Mutu Produk (3 hari termasuk praktek)</li>
                    <li>Pendampingan di Lokasi Usaha (5 hari)</li>
                </ul>
            </div> */}

            {/* Section A: Identitas Pendaftar */}
            <div className="big-text text-muted mb-4">
                A. Identitas Pendaftar
                <div className="underline"></div>
            </div>

            {/* NIK & Pengecekan */}
            <Form.Group className="mb-3">
                <Form.Label className="required">NIK</Form.Label>
                <InputGroup className="mb-3" hasValidation>
                    <Form.Control
                        name="nik"
                        isInvalid={errors.nik}
                        placeholder="Nomor KTP"
                        value={data.nik}
                        onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, ""); // Hanya terima angka
                            if (value.length <= 16) {
                                // Batasi maksimal 16 digit
                                setData("nik", value);
                                setNikLength(value.length);
                                setNikStatus("");
                                setErrorMessage("");
                                setDataPenerima(null);
                                setDataFound(false);
                            }
                        }}
                        className={`${
                            nikLength === 16
                                ? "border-success text-success"
                                : "border-warning"
                        }`}
                        maxLength={16}
                    />
                    <Button
                        className="z-0"
                        variant="outline-primary"
                        onClick={cekNik}
                        disabled={nikLength !== 16}
                    >
                        Cek NIK
                    </Button>
                    <Form.Control.Feedback type="invalid">
                        {errors.nik}
                    </Form.Control.Feedback>
                </InputGroup>
                <small
                    className={`d-block mt-1 ${
                        nikLength === 16
                            ? "text-success"
                            : nikLength > 0
                              ? "text-warning"
                              : "text-muted"
                    }`}
                >
                    {nikLength}/16 digit
                </small>
            </Form.Group>

            {errorMessage && <div className="text-danger">{errorMessage}</div>}

            {nikStatus && <div className="text-success mb-3">{nikStatus}</div>}

            {/* Data Penerima */}
            {dataPenerima && (
                <>
                    <Form.Group className="mb-3">
                        <Form.Label className="required">
                            Nama Lengkap
                        </Form.Label>
                        <Form.Control
                            type="text"
                            value={data.nama_lengkap}
                            onChange={(e) =>
                                setData("nama_lengkap", e.target.value)
                            }
                            readOnly={isFieldReadOnly('nama_lengkap')}
                            isInvalid={!!errors.nama_lengkap}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.nama_lengkap}
                        </Form.Control.Feedback>
                    </Form.Group>
                    {/* Tahun Penerimaan */}
                    <Form.Group className="mb-3">
                        <Form.Label>
                            Tahun Penerimaan Bantuan
                        </Form.Label>
                        <Form.Control
                            type="text"
                            value={data.tahun_penerimaan}
                            onChange={(e) =>
                                setData("tahun_penerimaan", e.target.value)
                            }
                            readOnly
                            isInvalid={!!errors.tahun_penerimaan}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.tahun_penerimaan}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label className="required">No KK</Form.Label>
                        <Form.Control
                            type="text"
                            value={data.no_kk}
                            readOnly={isFieldReadOnly('no_kk')}
                            onChange={(e) => setData("no_kk", e.target.value)}
                            isInvalid={!!errors.no_kk}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.no_kk}
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label className="required">Desil *(Data Terintregasi dengan Walidata Dinas Sosial)</Form.Label>
                        <Form.Control
                            type="text"
                            value={data.desil}
                            readOnly
                            isInvalid={!!errors.desil}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.desil}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <div className="big-text text-muted mb-4 mt-4">
                        Alamat KTP
                        <div className="underline"></div>
                    </div>

                    <Form.Group className="row mb-1">
                        <div className="col-md-6 col-12 mb-3">
                            <Form.Label className="required">
                                Kecamatan
                            </Form.Label>
                            {isFieldReadOnly('kecamatan_ktp') ? (
                                <Form.Control
                                    type="text"
                                    value={data.kecamatan_ktp}
                                    readOnly
                                    isInvalid={!!errors.kecamatan_ktp}
                                />
                            ) : (
                                <SelectKecamatan
                                    value={{
                                        id: data.kode_kecamatan_ktp,
                                        text: data.kecamatan_ktp,
                                    }}
                                    onChange={(item) =>
                                        setData((prev) => ({
                                            ...prev,
                                            kode_kecamatan_ktp: item.id,
                                            kecamatan_ktp: item.text,
                                        }))
                                    }
                                    errors={errors.kecamatan_ktp}
                                />
                            )}
                            <Form.Control.Feedback type="invalid">
                                {errors.kecamatan_ktp}
                            </Form.Control.Feedback>
                        </div>
                        <div className="col-md-6 col-12 mb-3">
                            <Form.Label className="required">
                                Kelurahan
                            </Form.Label>
                            {isFieldReadOnly('kelurahan_ktp') ? (
                                <Form.Control
                                    type="text"
                                    value={data.kelurahan_ktp}
                                    readOnly
                                    isInvalid={!!errors.kelurahan_ktp}
                                />
                            ) : (
                                <SelectKelurahan
                                    kodeKecamatan={data.kode_kecamatan_ktp}
                                    value={{
                                        id: data.kode_kelurahan_ktp,
                                        text: data.kelurahan_ktp,
                                    }}
                                    onChange={(item) =>
                                        setData((prev) => ({
                                            ...prev,
                                            kode_kelurahan_ktp: item.id,
                                            kelurahan_ktp: item.text,
                                        }))
                                    }
                                    errors={errors.kelurahan_ktp}
                                />
                            )}
                            <Form.Control.Feedback type="invalid">
                                {errors.kelurahan_ktp}
                            </Form.Control.Feedback>
                        </div>
                    </Form.Group>

                    <Form.Group className="row mb-3">
                        <div className="col-md-6 col-12 mb-3">
                            <Form.Label className="required">RW</Form.Label>
                            {isFieldReadOnly('rw_ktp') ? (
                                <Form.Control
                                    type="text"
                                    value={data.rw_ktp}
                                    readOnly
                                    isInvalid={!!errors.rw_ktp}
                                />
                            ) : (
                                <SelectRw
                                    kodeKelurahan={data.kode_kelurahan_ktp}
                                    value={{
                                        id: data.kode_rw_ktp,
                                        text: data.rw_ktp,
                                    }}
                                    onChange={(item) =>
                                        setData((prev) => ({
                                            ...prev,
                                            kode_rw_ktp: item.id,
                                            rw_ktp: item.rw,
                                        }))
                                    }
                                    errors={errors.rw_ktp}
                                />
                            )}
                            <Form.Control.Feedback type="invalid">
                                {errors.rw_ktp}
                            </Form.Control.Feedback>
                        </div>
                        <div className="col-md-6 col-12 mb-3">
                            <Form.Label className="required">RT</Form.Label>
                            {isFieldReadOnly('rt_ktp') ? (
                                <Form.Control
                                    type="text"
                                    value={data.rt_ktp}
                                    readOnly
                                    isInvalid={!!errors.rt_ktp}
                                />
                            ) : (
                                <SelectRt
                                    kodeKelurahan={data.kode_kelurahan_ktp}
                                    kodeRw={data.rw_ktp}
                                    value={{
                                        id: data.kode_rt_ktp,
                                        text: data.rt_ktp,
                                    }}
                                    onChange={(item) =>
                                        setData((prev) => ({
                                            ...prev,
                                            kode_rt_ktp: item.id,
                                            rt_ktp: item.rt,
                                        }))
                                    }
                                    errors={errors.rt_ktp}
                                />
                            )}
                            <Form.Control.Feedback type="invalid">
                                {errors.rt_ktp}
                            </Form.Control.Feedback>
                        </div>
                    </Form.Group>

                    <Form.Group className="mb-4">
                        <Form.Label className="required">
                            Alamat Lengkap KTP
                        </Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            value={data.jalan_ktp}
                            readOnly={isFieldReadOnly('jalan_ktp')}
                            onChange={(e) =>
                                setData("jalan_ktp", e.target.value)
                            }
                            placeholder="Alamat lengkap KTP (Jalan/Gang/Lingkungan/No)"
                            isInvalid={!!errors.jalan_ktp}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.jalan_ktp}
                        </Form.Control.Feedback>
                    </Form.Group>

                    {/* Konfirmasi Data */}
                    {tampilKonfirmasi && (
                        <div className="alert alert-warning mb-3">
                            <Form.Label className="fw-bold required">
                                Apakah data sudah sesuai dan tidak ada
                                perubahan?
                            </Form.Label>
                            <div className="d-flex gap-2 mt-2">
                                <Button
                                    variant="success"
                                    onClick={() => {
                                        setEditMode(false);
                                        setTampilKonfirmasi(false); // Hide confirmation after choice
                                        // Show success message
                                        setNikStatus(
                                            "Data telah dikonfirmasi ✓",
                                        );
                                    }}
                                >
                                    <i className="fa fa-check me-1"></i> Ya,
                                    sesuai
                                </Button>
                                <Button
                                    variant="warning"
                                    onClick={() => {
                                        setEditMode(true);
                                        setTampilKonfirmasi(false); // Hide confirmation
                                        // Show edit message
                                        setNikStatus(
                                            "Silakan edit data yang perlu diubah",
                                        );
                                    }}
                                >
                                    <i className="fa fa-pencil me-1"></i> Tidak,
                                    saya ingin edit
                                </Button>
                            </div>
                        </div>
                    )}

                    {editMode && (
                        <div className="alert alert-info mb-3">
                            <div className="d-flex justify-content-between align-items-center">
                                <span>
                                    <i className="fa fa-info-circle me-2"></i>
                                    Mode edit aktif - Silakan ubah data yang
                                    perlu dikoreksi
                                </span>
                                <Button
                                    size="sm"
                                    variant="success"
                                    onClick={() => {
                                        setEditMode(false);
                                        setNikStatus(
                                            "Perubahan data telah disimpan ✓",
                                        );
                                    }}
                                >
                                    <i className="fa fa-save me-1"></i> Selesai
                                    Edit
                                </Button>
                            </div>
                        </div>
                    )}

                    <Form.Group className="mb-3">
                        <Form.Label className="required">No HP/WA</Form.Label>
                        <Form.Control
                            type="text"
                            value={data.no_hp}
                            onChange={(e) => setData("no_hp", e.target.value)}
                            placeholder="628XXXXXXXXXX"
                            isInvalid={!!errors.no_hp}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.no_hp}
                        </Form.Control.Feedback>
                    </Form.Group>

                    {/* Alamat Usaha */}
                    <div className="big-text text-muted mb-4 mt-4">
                        Alamat Usaha
                        <div className="underline"></div>
                    </div>

                    <Form.Group className="row mb-1">
                        <div className="col-md-6 col-12 mb-3">
                            <Form.Label className="required">
                                Kecamatan
                            </Form.Label>
                            <SelectKecamatan
                                onChange={(item) =>
                                    setData((prev) => ({
                                        ...prev,
                                        kode_kecamatan_usaha: item.id,
                                        kecamatan_usaha: item.text,
                                    }))
                                }
                                errors={errors.kecamatan_usaha}
                            />
                        </div>
                        <div className="col-md-6 col-12 mb-3">
                            <Form.Label className="required">
                                Kelurahan
                            </Form.Label>
                            <SelectKelurahan
                                kodeKecamatan={data.kode_kecamatan_usaha}
                                onChange={(item) =>
                                    setData((prev) => ({
                                        ...prev,
                                        kode_kelurahan_usaha: item.id,
                                        kelurahan_usaha: item.text,
                                    }))
                                }
                                errors={errors.kelurahan_usaha}
                            />
                        </div>
                    </Form.Group>

                    <Form.Group className="row mb-3">
                        <div className="col-md-6 col-12 mb-3">
                            <Form.Label className="required">RW</Form.Label>
                            <SelectRw
                                kodeKelurahan={data.kode_kelurahan_usaha}
                                onChange={(item) =>
                                    setData((prev) => ({
                                        ...prev,
                                        kode_rw_usaha: item.id,
                                        rw_usaha: item.rw,
                                    }))
                                }
                                errors={errors.rw_usaha}
                            />
                        </div>
                        <div className="col-md-6 col-12 mb-3">
                            <Form.Label className="required">RT</Form.Label>
                            <SelectRt
                                kodeKelurahan={data.kode_kelurahan_usaha}
                                kodeRw={data.rw_usaha}
                                onChange={(item) =>
                                    setData((prev) => ({
                                        ...prev,
                                        rt_usaha: item.text,
                                    }))
                                }
                                errors={errors.rt_usaha}
                            />
                        </div>
                    </Form.Group>

                    <Form.Group className="mb-4">
                        <Form.Label className="required">
                            Alamat Lengkap Usaha
                        </Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            value={data.jalan_usaha}
                            onChange={(e) =>
                                setData("jalan_usaha", e.target.value)
                            }
                            placeholder="Alamat lengkap usaha (Jalan/Gang/Lingkungan/No)"
                            isInvalid={!!errors.jalan_usaha}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.jalan_usaha}
                        </Form.Control.Feedback>
                    </Form.Group>

                    {/* Jenis Pelatihan & Perkembangan */}
                    <div className="big-text text-muted mb-4">
                        Data Pelatihan
                        <div className="underline"></div>
                    </div>

                    <Form.Group className="mb-3">
                        <Form.Label className="required">
                            Jenis Pelatihan 
                        </Form.Label>
                        <SelectJenisPelatihan
                            value={data.jenis_pelatihan_industri}
                            onChange={(item) =>
                                setData(
                                    "jenis_pelatihan_industri",
                                    item?.value || "",
                                )
                            }
                            options={jenisPelatihanOptions}
                            errors={errors.jenis_pelatihan_industri}
                        />
                    </Form.Group>

                    {/* Skor Section */}
                    {[
                        {
                            label: "Perkembangan Omzet (Pendapatan Kotor) Usaha",
                            name: "perkembangan_omzet",
                            kategori: "perkembangan_omzet",
                        },
                        {
                            label: "Perkembangan Jumlah Tenaga Kerja",
                            name: "perkembangan_tenaga_kerja",
                            kategori: "perkembangan_tenaga_kerja",
                        },
                        {
                            label: "Mengikuti pelatihan untuk meningkatkan keterampilan dan kemampuan",
                            name: "skor_ketrampilan",
                            kategori: "ketrampilan",
                        },
                        {
                            label: "Mengikuti pelatihan untuk meningkatkan kualitas produk",
                            name: "skor_kualitas_produk",
                            kategori: "kualitas_produk",
                        },
                        {
                            label: "Mengikuti pelatihan untuk mencari solusi atas permasalahan usaha",
                            name: "skor_permasalahan_usaha",
                            kategori: "permasalahan_usaha",
                        },
                        {
                            label: "Mengikuti pelatihan untuk mengisi waktu luang",
                            name: "skor_mengisi_waktu",
                            kategori: "mengisi_waktu",
                        },
                        {
                            label: "Mengikuti pelatihan karena diajak teman",
                            name: "skor_diajak_teman",
                            kategori: "diajak_teman",
                        },
                    ].map((item, i) => (
                        <Form.Group key={i} className="mb-3">
                            <Form.Label className="required">
                                {item.label}
                            </Form.Label>
                            <SelectSkorPelatihan
                                kategori={item.kategori}
                                value={data[item.name]}
                                onChange={(selected) =>
                                    setData(item.name, selected?.value || "")
                                }
                                errors={errors[item.name]}
                            />
                        </Form.Group>
                    ))}

                    {/* Upload Section */}
                    <div className="big-text text-muted mb-4">
                        B. Berkas yang Diupload Max 2MB per File
                        <div className="underline"></div>
                    </div>

                    {errors.error && (
                        <div className="alert alert-danger mb-3">
                            <strong>Error:</strong> {errors.error}
                        </div>
                    )}

                    <FileCompressionGuide />

                    {renderFileUpload(
                        "Foto KTP",
                        "file_ktp",
                        ".png,.jpg,.jpeg",
                        false,
                        "imagePreviewKTP",
                        null,
                        "Maksimal 2MB. Format: PNG, JPG, JPEG",
                        1,
                    )}

                    {renderFileUpload(
                        "Foto Kartu Keluarga (KK)",
                        "file_kk",
                        ".png,.jpg,.jpeg",
                        false,
                        "imagePreviewKK",
                        null,
                        "Maksimal 2MB. Format: PNG, JPG, JPEG",
                        2,
                    )}

                    {renderFileUpload(
                        "Pas Foto",
                        "file_pasfoto",
                        ".png,.jpg,.jpeg",
                        false,
                        "imagePreviewPasFoto",
                        null,
                        "Maksimal 2MB. Format: PNG, JPG, JPEG",
                        3,
                    )}

                    {renderFileUpload(
                        "Surat Pernyataan",
                        "file_surat_pernyataan_tidak_ikut",
                        ".pdf",
                        false,
                        null,
                        "https://sultan.kedirikota.go.id/storage/files/ea73rWhs22Facatiw2jBVXbjU79DJp5JJEgnVvQL.pdf",
                        "Maksimal 2MB. Format: PDF",
                        4,
                    )}

                    {/* {renderFileUpload(
                        "Surat Pernyataan Kesanggupan Mengikuti Pelatihan Secara Penuh",
                        "file_surat_kesanggupan",
                        ".pdf",
                        false,
                        null,
                        "http://localhost:8000/storage/files/H2LjEsHX6j0Hq6P7eUzUTeziRUy7lftr6tRMKsWN.pdf",
                        "Maksimal 2MB. Format: PDF",
                        5
                    )} */}

                    {renderFileUpload(
                        "NIB",
                        "file_nib",
                        ".pdf,.png,.jpg,.jpeg",
                        false,
                        null,
                        null,
                        "Maksimal 2MB. Format: PDF, PNG, JPG, JPEG",
                        5,
                    )}

                    {/* Komitmen Section */}
                    <div className="big-text text-muted mb-4">
                        C. Pernyataan Komitmen
                        <div className="underline"></div>
                    </div>

                    <Form.Group className="mb-4">
                        <Form.Check
                            type="checkbox"
                            id="komitmen"
                            label="Saya menyatakan bahwa data yang saya isi adalah benar dan dapat dipertanggungjawabkan serta menyetujui penggunaannya oleh penyelenggara untuk keperluan verifikasi dan pelaksanaan program sesuai kebijakan privasi yang berlaku."
                            checked={data.komitmen}
                            onChange={(e) =>
                                setData("komitmen", e.target.checked)
                            }
                            isInvalid={!!errors.komitmen}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.komitmen}
                        </Form.Control.Feedback>
                    </Form.Group>

                    {/* Submit Button - Replace the existing submit button section */}
                    <div className="card-footer d-flex justify-content-center mt-4 gap-2">
                        <Button
                            type="submit"
                            disabled={
                                !isKomitmenChecked || processing || isSubmitting
                            }
                            className={
                                !isKomitmenChecked || processing || isSubmitting
                                    ? "opacity-50"
                                    : ""
                            }
                            variant="primary"
                            size="lg"
                        >
                            {processing || isSubmitting ? (
                                <>
                                    <span
                                        className="spinner-border spinner-border-sm me-2"
                                        role="status"
                                        aria-hidden="true"
                                    ></span>
                                    Sedang Menyimpan...
                                </>
                            ) : (
                                <>
                                    Simpan{" "}
                                    <i
                                        className="fa fa-paper-plane ms-1"
                                        aria-hidden="true"
                                    ></i>
                                </>
                            )}
                        </Button>
                    </div>
                </>
            )}

            {/* Error Message for Invalid NIK */}
            {/* {!dataPenerima && errorMessage && (
                <div className="alert alert-warning mt-3">
                    NIK YANG ANDA MASUKKAN SALAH ATAU ANDA BUKAN PENERIMA
                    BANTUAN MODAL. INFO LEBIH LANJUT KIRIM WA KE{" "}
                    <strong>081-359-075-353</strong> DENGAN FORMAT:
                    <br />
                    <strong>NIK_NAMA_KELURAHAN_KELUHAN/PERTANYAAN</strong>
                </div>
            )} */}
        </Form>
    );
}
