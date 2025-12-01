import { Form, Button, ListGroup, InputGroup, Spinner } from "react-bootstrap";
import React, { useState } from "react";
import axios from "axios";

import SelectAlasanPelatihan from "@/Components/Select/SelectAlasanPelatihan";
import SelectJenisPelatihanKeterampilan from "@/Components/Select/SelectJenisPelatihanKeterampilan";
import SelectPendidikan from "@/Components/Select/SelectPendidikan";
import SelectKecamatan from "@/Components/Select/SelectKecamatan";
import SelectKelurahan from "@/Components/Select/SelectKelurahan";
import SelectRt from "@/Components/Select/SelectRt";
import SelectRw from "@/Components/Select/SelectRw";
import { useForm } from "@inertiajs/react";
import SelectJenisKelamin from "@/Components/Select/SelectJenisKelamin";

export default function FormKeterampilan() {
    const [nikStatus, setNikStatus] = useState(null);
    const [dataPenerima, setDataPenerima] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");
    const [nikLength, setNikLength] = useState(0);
    const [kkLength, setKkLength] = useState(0);

    const [isKomitmenChecked, setIsKomitmenChecked] = useState(false);
    const { data, setData, errors, post, reset, processing } = useForm({
        nik: "",
        no_kk: "",
        nama_lengkap: "",
        tmp_lhr: "",
        tgl_lhr: "",
        usia: "",
        jenis_kelamin: "",
        alamat: "",
        kode_kecamatan: "",
        nama_kecamatan: "",
        kode_kelurahan: "",
        nama_kelurahan: "",
        kode_rw: "",
        nama_rw: "",
        kode_rt: "",
        nama_rt: "",
        phone_number: "",
        alasan: "",
        pendidikan: "",
        jenis_pelatihan: "",
        // Field baru untuk scoring
        status_bekerja: "",
        pernah_pelatihan: "",
        status_domisili: "",
        file_ktp: [],
        file_kk: [],
        file_pasfoto: [],
        file_surat_pernyataan_tidak_ikut: [],
        file_surat_kesanggupan: [],
        file_fotokopi_ijazah: [],
    });
    let fileIndex = 1;

    const cekNik = async () => {
        setErrorMessage("");
        setNikStatus("");
        try {
            const response = await axios.get(
                `/pelatihan/kerja/cek-nik/${data.nik}`
            );

            // Handle success response
            if (response.data.success === true) {
                setNikStatus("NIK valid!");
                setDataPenerima(true);
            } else {
                setErrorMessage(response.data.message);
            }
        } catch (error) {
            // Handle error response
            if (
                error.response?.status === 403 ||
                error.response?.status === 404 ||
                error.response?.status === 400
            ) {
                setErrorMessage(error.response.data.message);
            } else {
                setErrorMessage("Terjadi kesalahan saat cek NIK.");
            }
        }
    };

    // Fungsi untuk format ukuran file
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
                `Silakan kompres atau pilih file yang lebih kecil.`
            );
            e.target.value = ''; // Reset input
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
                    `Silakan kompres atau pilih file yang lebih kecil.`
                );
                e.target.value = '';
                return;
            }
        }

        setData((prevState) => ({
            ...prevState,
            [field_name]: multiple ? files : files[0],
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        post(route("pelatihan.kerja.store"), {
            forceFormData: true,
        });
    };

    const handleRemoveFile = (field, index = null) => {
        if (index !== null) {
            // Handle array of files
            setData((prev) => {
                const updated = [...(prev[field] || [])];
                updated.splice(index, 1);
                return { ...prev, [field]: updated };
            });
        } else {
            // Handle single file
            setData((prev) => ({
                ...prev,
                [field]: null,
            }));
        }
    };

    const handleRemoveImage = (field, previewKey) => {
        setData((prev) => ({
            ...prev,
            [field]: [],
            [previewKey]: "",
        }));
    };

    // Component untuk panduan kompresi file
    const FileCompressionGuide = () => (
        <div className="alert alert-info mb-4">
            <h6 className="fw-bold">📋 Panduan Upload File:</h6>
            <ul className="mb-0 small">
                <li>Maksimal ukuran per file: <strong>2MB</strong></li>
                <li>Jika file terlalu besar, gunakan tools kompresi online:
                    <ul>
                        <li>Untuk gambar: <a href="https://tinypng.com" target="_blank" rel="noopener noreferrer">TinyPNG</a> atau <a href="https://compressjpeg.com" target="_blank" rel="noopener noreferrer">CompressJPEG</a></li>
                        <li>Untuk PDF: <a href="https://www.ilovepdf.com/compress_pdf" target="_blank" rel="noopener noreferrer">ILovePDF</a> atau <a href="https://smallpdf.com/compress-pdf" target="_blank" rel="noopener noreferrer">SmallPDF</a></li>
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
        description = ""
    ) => {
        const indexLabel = `${fileIndex++}.`;

        return (
            <Form.Group className="mb-4" key={fieldName}>
                <div className="mb-2 fw-semibold">
                    {indexLabel} {label}
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
                    isInvalid={errors[fieldName]}
                />
                <Form.Control.Feedback type="invalid">
                    {errors[fieldName]}
                </Form.Control.Feedback>

                {/* Deskripsi tambahan */}
                {description && (
                    <div className="text-muted mt-1" style={{ fontSize: "12px" }}>
                        {description}
                    </div>
                )}

                {/* Link untuk unduh template dokumen */}
                {downloadLink && (
                    <div className="mt-2">
                        <a
                            href={downloadLink}
                            target="_blank"
                            rel="noopener noreferrer"
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
                {!imagePreviewKey &&
                    data[fieldName] &&
                    (data[fieldName] instanceof File ||
                        (Array.isArray(data[fieldName]) &&
                            data[fieldName].length > 0)) && (
                        <ListGroup className="mt-3">
                            {multiple ? (
                                Array.isArray(data[fieldName]) &&
                                data[fieldName].map((file, idx) => (
                                    <ListGroup.Item
                                        key={idx}
                                        className="d-flex justify-content-between align-items-center"
                                    >
                                        <span>
                                            📄 {file.name} ({formatFileSize(file.size)})
                                            {file instanceof File && (
                                                <a
                                                    href={URL.createObjectURL(file)}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="ms-2 text-decoration-underline"
                                                    style={{ fontSize: "12px" }}
                                                >
                                                    Preview
                                                </a>
                                            )}
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
                                        📄 {data[fieldName].name} ({formatFileSize(data[fieldName].size)})
                                        {data[fieldName] instanceof File && (
                                            <a
                                                href={URL.createObjectURL(data[fieldName])}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="ms-2 text-decoration-underline"
                                                style={{ fontSize: "12px" }}
                                            >
                                                Preview
                                            </a>
                                        )}
                                    </span>
                                    <Button
                                        size="sm"
                                        variant="outline-danger"
                                        onClick={() =>
                                            handleRemoveFile(fieldName)
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

    const handleUsia = (birthDate) => {
        const today = new Date();
        const birth = new Date(birthDate);

        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();

        // Adjust age if birthday hasn't occurred this year
        if (
            monthDiff < 0 ||
            (monthDiff === 0 && today.getDate() < birth.getDate())
        ) {
            age--;
        }
        setData((prevState) => ({
            ...prevState,
            tgl_lhr: birthDate,
            usia: age,
        }));
    };

    return (
        <Form onSubmit={handleSubmit} encType="multipart/form-data">
            {/* Form Title */}
            <h4 className="text-center fw-bold mb-4">
                FORM PENDAFTARAN PELATIHAN KETERAMPILAN KERJA
            </h4>

            {/* Form Description */}
            <div className="alert alert-info mb-4">
                <strong>DESKRIPSI PELATIHAN:</strong>
                <p className="mb-2">
                    Pelatihan teknis dan soft skill untuk meningkatkan daya saing pencari kerja.
                </p>
                <ul className="mb-0">
                    <li><strong>Usia Min:</strong> 18 tahun</li>
                    <li><strong>Usia Maks:</strong> 45 tahun</li>
                    <li><strong>Durasi pelatihan:</strong> 10 hari</li>
                </ul>
            </div>

            <div className="big-text text-muted mb-4">
                Data Peserta
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
            {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

            {nikStatus && <div className="alert alert-success">{nikStatus}</div>}

            {/* Data Penerima */}
            {dataPenerima && (
                <>
                    {/* Nomor KK */}
                    <Form.Group className="mb-3">
                        <Form.Label className="required">Nomor KK</Form.Label>
                        <InputGroup className="mb-3" hasValidation>
                            <Form.Control
                                type="text"
                                value={data.no_kk || ""}
                                onChange={(e) => {
                                    const value = e.target.value.replace(
                                        /\D/g,
                                        ""
                                    ); // Hanya terima angka
                                    if (value.length <= 16) {
                                        // Batasi maksimal 16 digit
                                        setData("no_kk", value);
                                        setKkLength(value.length);
                                    }
                                }}
                                isInvalid={!!errors.no_kk}
                                className={`${
                                    kkLength === 16
                                        ? "border-success text-success"
                                        : "border-warning"
                                }`}
                                maxLength={16}
                                placeholder="Nomor Kartu Keluarga"
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.no_kk}
                            </Form.Control.Feedback>
                        </InputGroup>
                        <small
                            className={`d-block mt-1 ${
                                kkLength === 16
                                    ? "text-success"
                                    : kkLength > 0
                                    ? "text-warning"
                                    : "text-muted"
                            }`}
                        >
                            {kkLength}/16 digit
                        </small>
                    </Form.Group>

                    {/* Nama Lengkap */}
                    <Form.Group className="mb-3">
                        <Form.Label className="required">
                            Nama Lengkap
                        </Form.Label>
                        <Form.Control
                            name="nama"
                            type="text"
                            value={data.nama_lengkap || ""}
                            onChange={(e) =>
                                setData({
                                    ...data,
                                    nama_lengkap: e.target.value,
                                })
                            }
                            isInvalid={!!errors.nama_lengkap}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.nama_lengkap}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="row mb-1">
                        <div className="col-md-12 col-12 mb-3">
                            <div className="col-md-6 col-12 mb-3">
                                <Form.Label className="required">
                                    Jenis Kelamin
                                </Form.Label>
                                <SelectJenisKelamin
                                    onChange={(item) =>
                                        // console.log(item)
                                        setData((prevState) => ({
                                            ...prevState,
                                            jenis_kelamin: item,
                                        }))
                                    }
                                    errors={errors.jenis_kelamin}
                                />
                            </div>
                        </div>
                    </Form.Group>

                    {/* Alamat Sesuai KTP */}
                    <Form.Group className="row mb-1">
                        <div className="col-md-6 col-12 mb-3">
                            <Form.Label className="required">
                                Kecamatan
                            </Form.Label>
                            <SelectKecamatan
                                onChange={(item) =>
                                    setData((prevState) => ({
                                        ...prevState,
                                        kode_kecamatan: item.id,
                                        nama_kecamatan: item.text,
                                    }))
                                }
                                errors={errors.nama_kecamatan}
                            />
                        </div>
                        <div className="col-md-6 col-12 mb-3">
                            <Form.Label className="required">
                                Kelurahan
                            </Form.Label>
                            <SelectKelurahan
                                kodeKecamatan={data.kode_kecamatan}
                                onChange={(item) =>
                                    setData((prevState) => ({
                                        ...prevState,
                                        kode_kelurahan: item.id,
                                        nama_kelurahan: item.text,
                                    }))
                                }
                                errors={errors.nama_kelurahan}
                            />
                        </div>
                    </Form.Group>
                    <Form.Group className="row mb-1">
                        <div className="col-md-6 col-12 mb-3">
                            <Form.Label className="required">RW</Form.Label>
                            <SelectRw
                                kodeKelurahan={data.kode_kelurahan}
                                onChange={(item) =>
                                    setData((prevState) => ({
                                        ...prevState,
                                        kode_rw: item.id,
                                        nama_rw: item.text,
                                    }))
                                }
                                errors={errors.nama_rw}
                            />
                        </div>
                        <div className="col-md-6 col-12 mb-3">
                            <Form.Label className="required">RT</Form.Label>
                            <SelectRt
                                kodeKelurahan={data.kode_kelurahan}
                                kodeRw={data.nama_rw}
                                onChange={(item) =>
                                    setData((prevState) => ({
                                        ...prevState,
                                        kode_rt: item.id,
                                        nama_rt: item.text,
                                    }))
                                }
                                errors={errors.nama_rt}
                            />
                        </div>
                    </Form.Group>
                    <Form.Group className="row mb-1">
                        <div className="col-md-12 col-12 mb-3">
                            <Form.Label className="required">Alamat</Form.Label>
                            <Form.Control
                                onChange={(e) =>
                                    setData("alamat", e.target.value)
                                }
                                as="textarea"
                                rows="3"
                                value={data.alamat}
                                isInvalid={errors.alamat}
                                autoComplete="alamat"
                                placeholder="Alamat KTP (Jalan/Gang/Lingkungan/No rumah)"
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.alamat}
                            </Form.Control.Feedback>
                        </div>
                    </Form.Group>

                    {/* No HP/WA */}
                    <Form.Group className="mb-3">
                        <Form.Label className="required">No HP / WA</Form.Label>
                        <Form.Control
                            type="text"
                            value={data.phone_number || ""}
                            onChange={(e) =>
                                setData({
                                    ...data,
                                    phone_number: e.target.value,
                                })
                            }
                            isInvalid={!!errors.phone_number}
                            placeholder="628XXXXXXXXXX"
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.phone_number}
                        </Form.Control.Feedback>
                    </Form.Group>

                    {/* Tanggal Lahir */}
                    <div className="row mb-3">
                        <Form.Label className="required">
                            Tempat/Tgl. Lahir
                        </Form.Label>
                        <div className="col-md-8">
                            <Form.Control
                                name="tmp_lhr"
                                value={data.tmp_lhr}
                                onChange={(e) =>
                                    setData((prevState) => ({
                                        ...prevState,
                                        tmp_lhr: e.target.value,
                                    }))
                                }
                                isInvalid={errors.tmp_lhr}
                                placeholder="Tempat Lahir"
                            ></Form.Control>
                            <Form.Control.Feedback type="invalid">
                                {errors.tmp_lhr}
                            </Form.Control.Feedback>
                        </div>
                        <div className="col-md-4">
                            <Form.Control
                                name="tgl_lhr"
                                type="date"
                                value={data.tgl_lhr}
                                onChange={(e) => handleUsia(e.target.value)}
                                isInvalid={errors.tgl_lhr}
                            ></Form.Control>
                            <Form.Control.Feedback type="invalid">
                                {errors.tgl_lhr}
                            </Form.Control.Feedback>
                        </div>
                    </div>

                    {/* Pendidikan */}
                    <Form.Group className="mb-3">
                        <Form.Label className="required">
                            Pendidikan Terakhir
                        </Form.Label>
                        <SelectPendidikan
                            value={data.pendidikan}
                            onChange={(item) =>
                                setData((prevState) => ({
                                    ...prevState,
                                    pendidikan: item.id,
                                }))
                            }
                            errors={errors.pendidikan}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label className="required">
                            Alasan Mengikuti Pelatihan
                        </Form.Label>
                        <SelectAlasanPelatihan
                            value={data.alasan}
                            onChange={(item) =>
                                setData((prevState) => ({
                                    ...prevState,
                                    alasan: item.id,
                                }))
                            }
                            errors={errors.alasan}
                        />
                    </Form.Group>

                    {/* Field Baru: Status Bekerja */}
                    <Form.Group className="mb-3">
                        <Form.Label className="required">Status Bekerja</Form.Label>
                        <Form.Select
                            value={data.status_bekerja}
                            onChange={(e) => setData('status_bekerja', e.target.value)}
                            isInvalid={!!errors.status_bekerja}
                        >
                            <option value="">Pilih Status Bekerja</option>
                            <option value="3">Belum bekerja</option>
                            <option value="2">Sudah bekerja tapi tidak tetap</option>
                            <option value="1">Sudah bekerja</option>
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                            {errors.status_bekerja}
                        </Form.Control.Feedback>
                    </Form.Group>

                    {/* Field Baru: Pernah Mengikuti Pelatihan */}
                    <Form.Group className="mb-3">
                        <Form.Label className="required">
                            Pernah Mengikuti Pelatihan Tahun Sebelumnya?
                        </Form.Label>
                        <Form.Select
                            value={data.pernah_pelatihan}
                            onChange={(e) => setData('pernah_pelatihan', e.target.value)}
                            isInvalid={!!errors.pernah_pelatihan}
                        >
                            <option value="">Pilih</option>
                            <option value="3">Tidak pernah</option>
                            <option value="1">Pernah</option>
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                            {errors.pernah_pelatihan}
                        </Form.Control.Feedback>
                    </Form.Group>

                    {/* Field Baru: Status Domisili */}
                    <Form.Group className="mb-3">
                        <Form.Label className="required">Status Domisili</Form.Label>
                        <Form.Select
                            value={data.status_domisili}
                            onChange={(e) => setData('status_domisili', e.target.value)}
                            isInvalid={!!errors.status_domisili}
                        >
                            <option value="">Pilih Status Domisili</option>
                            <option value="3">Domisili sesuai KTP</option>
                            <option value="2">Domisili Kota Kediri (tidak sesuai KTP)</option>
                            <option value="1">Domisili luar Kota Kediri</option>
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                            {errors.status_domisili}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label className="required">
                            Jenis Pelatihan
                        </Form.Label>
                        <SelectJenisPelatihanKeterampilan
                            pendidikan_min={data.pendidikan}
                            usia_max={data.usia}
                            onChange={(item) =>
                                setData((prevState) => ({
                                    ...prevState,
                                    jenis_pelatihan: item.id,
                                }))
                            }
                            errors={errors.jenis_pelatihan}
                        />
                    </Form.Group>

                    <div className="big-text text-muted mb-4">
                        Upload Berkas (Max 2MB per File)
                        <div className="underline"></div>
                    </div>

                    {/* Error display untuk file size */}
                    {errors.error && (
                        <div className="alert alert-danger mb-3">
                            <strong>Error:</strong> {errors.error}
                        </div>
                    )}

                    {/* Panduan Kompresi */}
                    <FileCompressionGuide />

                    {renderFileUpload(
                        "Foto KTP",
                        "file_ktp",
                        ".png,.jpg,.jpeg",
                        false,
                        "imagePreviewKTP",
                        null,
                        "Maksimal 2MB. Format: PNG, JPG, JPEG"
                    )}
                    
                    {renderFileUpload(
                        "Foto Kartu Keluarga (KK)",
                        "file_kk",
                        ".png,.jpg,.jpeg",
                        false,
                        "imagePreviewKK",
                        null,
                        "Maksimal 2MB. Format: PNG, JPG, JPEG"
                    )}
                    
                    {renderFileUpload(
                        "Pas Foto",
                        "file_pasfoto",
                        ".png,.jpg,.jpeg",
                        false,
                        "imagePreviewPasFoto",
                        null,
                        "Maksimal 2MB. Format: PNG, JPG, JPEG"
                    )}
                    
                    {renderFileUpload(
                        "Surat Pernyataan Tidak Mengikuti Pelatihan Lain",
                        "file_surat_pernyataan_tidak_ikut",
                        ".pdf",
                        false,
                        null,
                        "https://sultan.kedirikota.go.id/storage/files/P1n9LnkfWqiJHWTRaI82DqDIZcS9vEwMcQit5762.pdf",
                        "Maksimal 2MB. Format: PDF"
                    )}
                    
                    {renderFileUpload(
                        "Surat Pernyataan Kesanggupan Mengikuti Pelatihan Secara Penuh",
                        "file_surat_kesanggupan",
                        ".pdf",
                        false,
                        null,
                        "https://sultan.kedirikota.go.id/storage/files/35KIXRx55JFg4M3H1laVMMhLE6yZ0EMvbhIf85d7.pdf",
                        "Maksimal 2MB. Format: PDF"
                    )}
                    
                    {renderFileUpload(
                        "Fotokopi Ijazah",
                        "file_fotokopi_ijazah",
                        ".pdf",
                        false,
                        null,
                        null,
                        "Maksimal 2MB. Format: PDF"
                    )}

                    <div className="big-text text-muted mb-4">
                        Pernyataan Komitmen
                        <div className="underline"></div>
                    </div>
                    <Form.Check
                        type="checkbox"
                        label="Saya menyatakan bahwa data yang saya isi adalah benar dan dapat dipertanggungjawabkan serta menyetujui penggunaannya oleh penyelenggara untuk keperluan verifikasi dan pelaksanaan program sesuai kebijakan privasi yang berlaku."
                        checked={isKomitmenChecked}
                        onChange={(e) => setIsKomitmenChecked(e.target.checked)}
                    />
                    <hr />

                    <div className="card-footer d-flex justify-content-center mt-4 gap-2">
                        <Button
                            type="submit"
                            disabled={!isKomitmenChecked || processing}
                            className={(!isKomitmenChecked || processing) ? "opacity-50" : ""}
                        >
                            {processing ? (
                                <>
                                    <Spinner
                                        as="span"
                                        animation="border"
                                        size="sm"
                                        role="status"
                                        aria-hidden="true"
                                        className="me-2"
                                    />
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
        </Form>
    );
}