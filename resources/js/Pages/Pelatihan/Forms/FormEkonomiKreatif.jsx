import { Form, Button, ListGroup, InputGroup } from "react-bootstrap";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useForm } from "@inertiajs/react";
import Select from "react-select";

import SelectKecamatan from "@/Components/Select/SelectKecamatan";
import SelectKelurahan from "@/Components/Select/SelectKelurahan";
import SelectRt from "@/Components/Select/SelectRt";
import SelectRw from "@/Components/Select/SelectRw";
import SelectKategoriPendaftar from "@/Components/Select/SelectKategoriPendaftar";
import SelectJenisPelatihanEkraf from "@/Components/Select/SelectJenisPelatihanEkraf";
import SelectPeranEkraf from "@/Components/Select/SelectPeranEkraf";

export default function FormEkonomiKreatif({
    title = "Pendaftaran Pelatihan Ekonomi Kreatif",
    kategori_options = {},
    jenis_pelatihan_options = {}
}) {
    // State untuk NIK checking (sama seperti UMKM)
    const [nikStatus, setNikStatus] = useState(null);
    const [dataPenerima, setDataPenerima] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");
    const [nikLength, setNikLength] = useState(0);
    const [kkLength, setKkLength] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [requiredFiles, setRequiredFiles] = useState({});

    const [skorAlasanOptions, setSkorAlasanOptions] = useState([]);

    const { data, setData, errors, post, reset, processing } = useForm({
        kategori_pendaftar: "",
        nik: "",
        no_kk: "",
        nama_lengkap: "",
        tanggal_lahir: "",
        no_hp: "",
        desil: "",

        // Alamat KTP
        alamat_ktp: "",
        rt_ktp: "",
        rw_ktp: "",
        kelurahan_ktp: "",
        kecamatan_ktp: "",
        kode_kelurahan_ktp: "",
        kode_kecamatan_ktp: "",

        // Alamat Domisili
        alamat_domisili: "",
        rt_domisili: "",
        rw_domisili: "",
        kelurahan_domisili: "",
        kecamatan_domisili: "",
        kode_kelurahan_domisili: "",
        kode_kecamatan_domisili: "",

        // Pelatihan
        jenis_pelatihan: "",
        peran_ekraf: "",
        alasan: "",

        // Files Wajib
        file_ktp: null,
        file_kk: null,
        file_pasfoto: null,
        file_surat_pernyataan: null,
        file_nib: null,
        file_surat_pekerja_ekraf: null,

        // Files Khusus per Kategori
        file_surat_pemilik_lahan: null,
        file_id_card_iht: null,
        file_surat_phk: null,
        file_surat_disabilitas: null,
        file_surat_kb: null,

        komitmen: false,

        keterangan: "",
    });

    // Cek NIK function (sama seperti UMKM)
    const cekNik = async () => {
        setErrorMessage("");
        setNikStatus("");
        try {
            const response = await axios.get(
                `/pelatihan/ekonomi-kreatif/cek-nik/${data.nik}`
            );

            // Handle success response
            if (response.data.success === true) {
                setNikStatus("NIK valid!");
                setDataPenerima(true);
                // Set data dari DTKS
                setData((prev) => ({
                    ...prev,
                    desil: response.data.data?.desil || ">5",
                    no_kk: response.data.data?.no_kk || prev.no_kk,
                    nama_lengkap: response.data.data?.nama || prev.nama_lengkap,
                }));
            } else {
                setErrorMessage(response.data.message);
            }
        } catch (error) {
            // Handle error response
            if (error.response?.status === 403 || error.response?.status === 400) {
                setErrorMessage(error.response.data.message);
            } else {
                setErrorMessage("Terjadi kesalahan saat cek NIK.");
            }
        }
    };

    useEffect(() => {
        fetch("/skor-ekraf/alasan")
            .then((res) => res.json())
            .then((data) => {
                setSkorAlasanOptions(
                    data.map((item) => ({
                        value: item.id,
                        label: item.jawaban
                    }))
                );
            })
            .catch(error => {
                console.error('Error loading skor options:', error);
            });
    }, []);

    // Fetch required files when kategori changes
    useEffect(() => {
        if (data.kategori_pendaftar) {
            axios.get(route('pelatihan-ekonomi-kreatif.requirements', data.kategori_pendaftar))
                .then(response => {
                    setRequiredFiles(response.data.data.required_files || {});
                })
                .catch(error => {
                    console.error('Error fetching requirements:', error);
                });
        }
    }, [data.kategori_pendaftar]);

    const calculateAge = (birthDate) => {
        if (!birthDate) return 0;

        const today = new Date();
        const birth = new Date(birthDate);
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();

        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--;
        }

        return age;
    };

    const isKomitmenChecked = data.komitmen;

    const currentAge = calculateAge(data.tanggal_lahir);

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

        const maxFileSize = 2 * 1024 * 1024; // 2MB
        if (file.size > maxFileSize) {
            alert(
                `Ukuran file terlalu besar: ${formatFileSize(file.size)}\n` +
                `Maksimal ukuran file: 2MB\n` +
                `Silakan kompres atau pilih file yang lebih kecil.`
            );
            e.target.value = '';
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

    const handleUploadFile = (e, field_name) => {
        const file = e.target.files[0];
        if (!file) return;

        const maxFileSize = 2 * 1024 * 1024; // 2MB
        if (file.size > maxFileSize) {
            alert(
                `File terlalu besar: ${formatFileSize(file.size)}\n` +
                `Maksimal ukuran file: 2MB\n` +
                `Silakan kompres atau pilih file yang lebih kecil.`
            );
            e.target.value = '';
            return;
        }

        setData((prevState) => ({
            ...prevState,
            [field_name]: file,
        }));
    };

    const handleRemoveFile = (fieldName) => {
        setData((prev) => ({
            ...prev,
            [fieldName]: null,
        }));
    };

    const handleRemoveImage = (field, previewKey) => {
        setData((prev) => ({
            ...prev,
            [field]: null,
            [previewKey]: "",
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsSubmitting(true);

        try {
            await post(route("pelatihan-ekonomi-kreatif.store"), {
                forceFormData: true,
                onSuccess: () => {
                    // Success akan redirect otomatis
                },
                onError: (errors) => {
                    console.error("Form errors:", errors);
                }
            });
        } catch (error) {
            console.error("Submit error:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

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
        imagePreviewKey = null,
        description = "",
        fileIndex = 1,
        downloadLink = null
    ) => {
        return (
            <Form.Group className="mb-4" key={fieldName}>
                <div className="mb-2 fw-semibold">
                    {fileIndex}. {label}
                </div>
                <Form.Label className="text-primary" style={{ fontSize: "11px" }}>
                    Format: {accept === ".pdf" ? "*.pdf" : "*.png, *.jpg, *.jpeg"}
                </Form.Label>

                <Form.Control
                    type="file"
                    accept={accept}
                    onChange={(e) =>
                        imagePreviewKey
                            ? handleUploadFoto(e, fieldName, imagePreviewKey)
                            : handleUploadFile(e, fieldName)
                    }
                    isInvalid={!!errors[fieldName]}
                />

                {errors[fieldName] && (
                    <Form.Control.Feedback type="invalid">
                        {errors[fieldName]}
                    </Form.Control.Feedback>
                )}

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

                {/* Image Preview */}
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
                            onClick={() => handleRemoveImage(fieldName, imagePreviewKey)}
                        >
                            ✕
                        </Button>
                    </div>
                )}

                {/* File Preview */}
                {!imagePreviewKey && data[fieldName] && (
                    <ListGroup className="mt-3">
                        <ListGroup.Item className="d-flex justify-content-between align-items-center">
                            <span>
                                📄 {data[fieldName].name} ({formatFileSize(data[fieldName].size)})
                                <a
                                    href={URL.createObjectURL(data[fieldName])}
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
                                onClick={() => handleRemoveFile(fieldName)}
                            >
                                Hapus
                            </Button>
                        </ListGroup.Item>
                    </ListGroup>
                )}
            </Form.Group>
        );
    };

    return (
        <Form onSubmit={handleSubmit} encType="multipart/form-data">
            <h4 className="text-center fw-bold mb-4">
                FORM PENDAFTARAN PELATIHAN EKONOMI KREATIF
            </h4>

            <div className="alert alert-info mb-4">
                <strong>INFORMASI PELATIHAN:</strong>
                <p className="mb-2">
                    Pelatihan Ekonomi Kreatif bertujuan untuk meningkatkan keterampilan dan daya saing pelaku usaha di bidang ekonomi kreatif.
                </p>
                <ul className="mb-0">
                    <li>Durasi pelatihan disesuaikan dengan jenis pelatihan yang dipilih</li>
                    <li>Materi meliputi teori dan praktik</li>
                    <li>Sertifikat akan diberikan kepada peserta yang menyelesaikan pelatihan</li>
                </ul>
            </div>

            {/* NIK Checking Section */}
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
                                setData("nik", value);
                                setNikLength(value.length);
                                setNikStatus("");
                                setErrorMessage("");
                                setDataPenerima(null);
                            }
                        }}
                        className={`${
                            nikLength === 16 ? "border-success text-success" : "border-warning"
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

            {/* Error & Success Messages */}
            {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
            {nikStatus && <div className="alert alert-success">{nikStatus}</div>}

            {/* Show rest of form only when NIK is validated */}
            {dataPenerima && (
                <>
                    {/* Kategori Pendaftar */}
                    <div className="big-text text-muted mb-4">
                        A. Kategori Pendaftar
                        <div className="underline"></div>
                    </div>

                    <Form.Group className="mb-3">
                        <Form.Label className="required">Kategori Pendaftar</Form.Label>
                        <SelectKategoriPendaftar
                            value={data.kategori_pendaftar}
                            onChange={(value) => {
                                setData("kategori_pendaftar", value);
                                // Reset file fields when category changes
                                setData(prev => ({
                                    ...prev,
                                    file_surat_pemilik_lahan: null,
                                    file_id_card_iht: null,
                                    file_surat_phk: null,
                                    file_surat_disabilitas: null,
                                    file_surat_kb: null,
                                }));
                            }}
                            errors={errors.kategori_pendaftar}
                        />
                        <Form.Text className="text-muted">
                            Pilih kategori yang sesuai dengan kondisi Anda untuk menentukan persyaratan dokumen yang diperlukan.
                        </Form.Text>
                    </Form.Group>

                    {/* Show requirements info when category selected */}
                    {data.kategori_pendaftar && (
                        <div className="alert alert-warning mb-4">
                            <strong>📋 Dokumen yang diperlukan untuk kategori "{data.kategori_pendaftar.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}":</strong>
                            <ul className="mb-0 mt-2">
                                {Object.entries(requiredFiles).map(([key, label]) => (
                                    <li key={key}>{label}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Data Pendaftar - Only show if category selected */}
                    {data.kategori_pendaftar && (
                        <>
                            <div className="big-text text-muted mb-4">
                                B. Data Pendaftar
                                <div className="underline"></div>
                            </div>

                            {/* Data dari DTKS: Desil, No KK, Nama */}
                            <Form.Group className="mb-3">
                                <Form.Label className="required">Desil *(Data Terintegrasi dengan Walidata Dinas Sosial)</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={data.desil}
                                    readOnly
                                    placeholder="Menunggu data desil..."
                                    isInvalid={!!errors.desil}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.desil}
                                </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label className="required">Nomor KK</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={data.no_kk}
                                    onChange={(e) => {
                                        const value = e.target.value.replace(/\D/g, "");
                                        if (value.length <= 16) {
                                            setData("no_kk", value);
                                            setKkLength(value.length);
                                        }
                                    }}
                                    className={kkLength === 16 ? "border-success text-success" : "border-warning"}
                                    maxLength={16}
                                    placeholder="Nomor Kartu Keluarga"
                                    isInvalid={!!errors.no_kk}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.no_kk}
                                </Form.Control.Feedback>
                                <small className={`d-block mt-1 ${
                                    kkLength === 16 ? "text-success" : kkLength > 0 ? "text-warning" : "text-muted"
                                }`}>
                                    {kkLength}/16 digit
                                </small>
                            </Form.Group>

                            {/* Nama Lengkap */}
                            <Form.Group className="mb-3">
                                <Form.Label className="required">Nama Lengkap</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={data.nama_lengkap}
                                    onChange={(e) => setData("nama_lengkap", e.target.value)}
                                    isInvalid={!!errors.nama_lengkap}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.nama_lengkap}
                                </Form.Control.Feedback>
                            </Form.Group>

                            {/* Tanggal Lahir & Usia */}
                            <Form.Group className="mb-3">
                                <Form.Label className="required">Tanggal Lahir</Form.Label>
                                <Form.Control
                                    type="date"
                                    value={data.tanggal_lahir}
                                    onChange={(e) => setData("tanggal_lahir", e.target.value)}
                                    max={new Date(new Date().setFullYear(new Date().getFullYear() - 17)).toISOString().split('T')[0]}
                                    min={new Date(new Date().setFullYear(new Date().getFullYear() - 65)).toISOString().split('T')[0]}
                                    isInvalid={!!errors.tanggal_lahir}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.tanggal_lahir}
                                </Form.Control.Feedback>

                                {/* Display calculated age */}
                                {data.tanggal_lahir && (
                                    <Form.Text className={`mt-1 d-block fw-semibold ${
                                        currentAge >= 17 && currentAge <= 65 ? 'text-success' : 'text-danger'
                                    }`}>
                                        Usia saat ini: {currentAge} tahun
                                        {(currentAge < 17 || currentAge > 65) && (
                                            <span className="ms-2">⚠️ Usia harus antara 17-65 tahun</span>
                                        )}
                                    </Form.Text>
                                )}

                                <Form.Text className="text-muted">
                                    Usia minimal 17 tahun, maksimal 65 tahun
                                </Form.Text>
                            </Form.Group>

                            {/* No HP */}
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

                            {/* Alamat KTP */}
                            <div className="big-text text-muted mb-4">
                                Alamat Sesuai KTP
                                <div className="underline"></div>
                            </div>

                            <Form.Group className="row mb-3">
                                <div className="col-md-6 mb-3">
                                    <Form.Label className="required">Kecamatan</Form.Label>
                                    <SelectKecamatan
                                        onChange={(item) => setData(prev => ({
                                            ...prev,
                                            kode_kecamatan_ktp: item.id,
                                            kecamatan_ktp: item.text,
                                        }))}
                                        errors={errors.kecamatan_ktp}
                                    />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <Form.Label className="required">Kelurahan</Form.Label>
                                    <SelectKelurahan
                                        kodeKecamatan={data.kode_kecamatan_ktp}
                                        onChange={(item) => setData(prev => ({
                                            ...prev,
                                            kode_kelurahan_ktp: item.id,
                                            kelurahan_ktp: item.text,
                                        }))}
                                        errors={errors.kelurahan_ktp}
                                    />
                                </div>
                            </Form.Group>

                            <Form.Group className="row mb-3">
                                <div className="col-md-6 mb-3">
                                    <Form.Label className="required">RW</Form.Label>
                                    <SelectRw
                                        kodeKelurahan={data.kode_kelurahan_ktp}
                                        onChange={(item) => setData(prev => ({
                                            ...prev,
                                            rw_ktp: item.rw,
                                        }))}
                                        errors={errors.rw_ktp}
                                    />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <Form.Label className="required">RT</Form.Label>
                                    <SelectRt
                                        kodeKelurahan={data.kode_kelurahan_ktp}
                                        kodeRw={data.rw_ktp}
                                        onChange={(item) => setData(prev => ({
                                            ...prev,
                                            rt_ktp: item.rt,
                                        }))}
                                        errors={errors.rt_ktp}
                                    />
                                </div>
                            </Form.Group>

                            <Form.Group className="mb-4">
                                <Form.Label className="required">Alamat Lengkap KTP</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    value={data.alamat_ktp}
                                    onChange={(e) => setData("alamat_ktp", e.target.value)}
                                    placeholder="Alamat lengkap sesuai KTP"
                                    isInvalid={!!errors.alamat_ktp}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.alamat_ktp}
                                </Form.Control.Feedback>
                            </Form.Group>

                            {/* Alamat Domisili */}
                            <div className="big-text text-muted mb-4">
                                Alamat Domisili Saat Ini
                                <div className="underline"></div>
                            </div>

                            {/* Checkbox untuk alamat domisili */}
                            <Form.Group className="mb-3">
                                <Form.Check
                                    type="checkbox"
                                    id="isDomisiliDifferent"
                                    label="Tidak sama dengan KTP"
                                    checked={data.isDomisili || false}
                                    onChange={(e) => {
                                        const isDifferent = e.target.checked;
                                        setData(prev => ({
                                            ...prev,
                                            isDomisili: isDifferent,
                                            // Jika tidak diceklis, copy data dari KTP
                                            ...(!isDifferent && {
                                                alamat_domisili: prev.alamat_ktp,
                                                rt_domisili: prev.rt_ktp,
                                                rw_domisili: prev.rw_ktp,
                                                kelurahan_domisili: prev.kelurahan_ktp,
                                                kecamatan_domisili: prev.kecamatan_ktp,
                                                kode_kelurahan_domisili: prev.kode_kelurahan_ktp,
                                                kode_kecamatan_domisili: prev.kode_kecamatan_ktp,
                                            })
                                        }));
                                    }}
                                />
                            </Form.Group>

                            {/* Form alamat domisili - hanya muncul jika checkbox dicentang */}
                            {data.isDomisili && (
                                <>
                                    <Form.Group className="row mb-3">
                                        <div className="col-md-6 mb-3">
                                            <Form.Label className="required">Kecamatan</Form.Label>
                                            <SelectKecamatan
                                                value={data.kode_kecamatan_domisili && data.kecamatan_domisili ?
                                                    {id: data.kode_kecamatan_domisili, text: data.kecamatan_domisili} :
                                                    null
                                                }
                                                onChange={(item) => setData(prev => ({
                                                    ...prev,
                                                    kode_kecamatan_domisili: item.id,
                                                    kecamatan_domisili: item.text,
                                                    // Reset kelurahan ketika kecamatan berubah
                                                    kode_kelurahan_domisili: "",
                                                    kelurahan_domisili: "",
                                                    rw_domisili: "",
                                                    rt_domisili: "",
                                                }))}
                                                errors={errors.kecamatan_domisili}
                                            />
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <Form.Label className="required">Kelurahan</Form.Label>
                                            <SelectKelurahan
                                                kodeKecamatan={data.kode_kecamatan_domisili}
                                                value={data.kode_kelurahan_domisili && data.kelurahan_domisili ?
                                                    {id: data.kode_kelurahan_domisili, text: data.kelurahan_domisili} :
                                                    null
                                                }
                                                onChange={(item) => setData(prev => ({
                                                    ...prev,
                                                    kode_kelurahan_domisili: item.id,
                                                    kelurahan_domisili: item.text,
                                                    // Reset RW/RT ketika kelurahan berubah
                                                    rw_domisili: "",
                                                    rt_domisili: "",
                                                }))}
                                                errors={errors.kelurahan_domisili}
                                            />
                                        </div>
                                    </Form.Group>

                                    <Form.Group className="row mb-3">
                                        <div className="col-md-6 mb-3">
                                            <Form.Label className="required">RW</Form.Label>
                                            <SelectRw
                                                kodeKelurahan={data.kode_kelurahan_domisili}
                                                value={data.rw_domisili ? {text: data.rw_domisili} : null}
                                                onChange={(item) => setData(prev => ({
                                                    ...prev,
                                                    rw_domisili: item.rw,
                                                    rt_domisili: "",
                                                }))}
                                                errors={errors.rw_domisili}
                                            />
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <Form.Label className="required">RT</Form.Label>
                                            <SelectRt
                                                kodeKelurahan={data.kode_kelurahan_domisili}
                                                kodeRw={data.rw_domisili}
                                                value={data.rt_domisili ? {text: data.rt_domisili} : null}
                                                onChange={(item) => setData(prev => ({
                                                    ...prev,
                                                    rt_domisili: item.rt,
                                                }))}
                                                errors={errors.rt_domisili}
                                            />
                                        </div>
                                    </Form.Group>

                                    <Form.Group className="mb-4">
                                        <Form.Label className="required">Alamat Lengkap Domisili</Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            rows={3}
                                            value={data.alamat_domisili}
                                            onChange={(e) => setData("alamat_domisili", e.target.value)}
                                            placeholder="Alamat lengkap domisili saat ini"
                                            isInvalid={!!errors.alamat_domisili}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.alamat_domisili}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </>
                            )}

                            {/* Jika alamat sama dengan KTP, tampilkan informasi */}
                            {!data.isDomisili && (
                                <div className="alert alert-info mb-4">
                                    <i className="fa fa-info-circle me-2"></i>
                                    Alamat domisili sama dengan alamat KTP
                                </div>
                            )}

                            {/* Jenis Pelatihan */}
                            <div className="big-text text-muted mb-4">
                                C. Jenis Pelatihan
                                <div className="underline"></div>
                            </div>

                            <Form.Group className="mb-4">
                                <SelectJenisPelatihanEkraf
                                    value={data.jenis_pelatihan}
                                    onChange={(value) => setData("jenis_pelatihan", value)}
                                    errors={errors.jenis_pelatihan}
                                />
                            </Form.Group>

                            {/* Upload Section */}
                            <div className="big-text text-muted mb-4">
                                D. Berkas yang Diupload (Max 2MB per File)
                                <div className="underline"></div>
                            </div>

                            <FileCompressionGuide />

                            {/* Base files for all categories */}
                            {renderFileUpload(
                                "Foto KTP",
                                "file_ktp",
                                ".png,.jpg,.jpeg",
                                "imagePreviewKTP",
                                "Maksimal 2MB. Format: PNG, JPG, JPEG",
                                1
                            )}

                            {renderFileUpload(
                                "Foto Kartu Keluarga (KK)",
                                "file_kk",
                                ".png,.jpg,.jpeg",
                                "imagePreviewKK",
                                "Maksimal 2MB. Format: PNG, JPG, JPEG",
                                2
                            )}

                            {renderFileUpload(
                                "Pas Foto",
                                "file_pasfoto",
                                ".png,.jpg,.jpeg",
                                "imagePreviewPasFoto",
                                "Maksimal 2MB. Format: PNG, JPG, JPEG",
                                3
                            )}

                            

                            {renderFileUpload(
                                "Surat Pernyataan",
                                "file_surat_pernyataan",
                                ".pdf",
                                null,
                                "Maksimal 2MB. Format: PDF",
                                4,
                                "https://sultan.kedirikota.go.id/storage/files/jG8YSc7E11f1vCyMtwpA63pzzsqVmiIEPghYd4ZR.pdf" // Tambah parameter ini
                            )}

                            {/* Peran Ekraf - menentukan berkas nomor 5 */}
                            <Form.Group className="mb-4">
                                <div className="mb-2 fw-semibold">
                                    5. Peran Anda pada Ekonomi Kreatif
                                </div>
                                <SelectPeranEkraf
                                    value={data.peran_ekraf}
                                    onChange={(value) => {
                                        setData("peran_ekraf", value);
                                        // Reset berkas yang tidak relevan saat peran berubah
                                        setData(prev => ({
                                            ...prev,
                                            file_nib: null,
                                            file_surat_pekerja_ekraf: null,
                                        }));
                                    }}
                                    errors={errors.peran_ekraf}
                                />
                            </Form.Group>

                            {/* Upload NIB - khusus pemilik usaha */}
                            {data.peran_ekraf === "pemilik_usaha" && (
                                <>
                                    {renderFileUpload(
                                        "NIB (Nomor Induk Berusaha)",
                                        "file_nib",
                                        ".pdf,.png,.jpg,.jpeg",
                                        null,
                                        "Maksimal 2MB. Format: PDF, PNG, JPG, JPEG",
                                        6
                                    )}
                                    <div className="alert alert-info mb-3 py-2">
                                        <small>
                                            <strong>📋 Keterangan:</strong> NIB (Nomor Induk Berusaha) wajib diupload bagi pemilik usaha ekonomi kreatif.
                                        </small>
                                    </div>
                                </>
                            )}

                            {/* Upload Surat Keterangan - khusus pekerja */}
                            {data.peran_ekraf === "pekerja" && (
                                <>
                                    {renderFileUpload(
                                        "Surat Keterangan Pekerja Ekonomi Kreatif",
                                        "file_surat_pekerja_ekraf",
                                        ".pdf",
                                        null,
                                        "Maksimal 2MB. Format: PDF",
                                        6
                                    )}
                                    <div className="alert alert-info mb-3 py-2">
                                        <small>
                                            <strong>📋 Keterangan:</strong> Surat keterangan wajib diupload bagi pekerja ekonomi kreatif. Apabila anda adalah pemilik usaha ekonomi kreatif, cukup upload NIB saja.
                                        </small>
                                    </div>
                                </>
                            )}

                            {/* Conditional files based on category */}
                            {data.kategori_pendaftar === "buruh_tani_tembakau" && renderFileUpload(
                                "Surat Keterangan dari Pemilik Lahan",
                                "file_surat_pemilik_lahan",
                                ".pdf,.png,.jpg,.jpeg",
                                null,
                                "Maksimal 2MB. Format: PDF, PNG, JPG, JPEG",
                                7
                            )}

                            {data.kategori_pendaftar === "buruh_pabrik_rokok" && renderFileUpload(
                                "ID Card / Surat Keterangan dari IHT",
                                "file_id_card_iht",
                                ".pdf,.png,.jpg,.jpeg",
                                null,
                                "Maksimal 2MB. Format: PDF, PNG, JPG, JPEG",
                                7
                            )}

                            {data.kategori_pendaftar === "buruh_phk" && renderFileUpload(
                                "Surat Pemberhentian Kerja",
                                "file_surat_phk",
                                ".pdf,.png,.jpg,.jpeg",
                                null,
                                "Maksimal 2MB. Format: PDF, PNG, JPG, JPEG",
                                7
                            )}

                            {data.kategori_pendaftar === "disabilitas" && renderFileUpload(
                                "Surat Keterangan Disabilitas dari Kelurahan",
                                "file_surat_disabilitas",
                                ".pdf,.png,.jpg,.jpeg",
                                null,
                                "Maksimal 2MB. Format: PDF, PNG, JPG, JPEG",
                                7
                            )}

                            {data.kategori_pendaftar === "perempuan_kk" && renderFileUpload(
                                "Surat Keterangan dari Dinas KB",
                                "file_surat_kb",
                                ".pdf,.png,.jpg,.jpeg",
                                null,
                                "Maksimal 2MB. Format: PDF, PNG, JPG, JPEG",
                                7
                            )}

                            {/* TAMBAH SECTION INI SETELAH UPLOAD FILES */}
                            {/* Skala Prioritas */}
                            <div className="big-text text-muted mb-4">
                                E. Skala Prioritas Peserta Pelatihan
                                <div className="underline"></div>
                            </div>

                            <Form.Group className="mb-4">
                                <Form.Label className="required">Alasan Mengikuti Pelatihan</Form.Label>
                                <Select
                                    options={skorAlasanOptions}
                                    value={skorAlasanOptions.find(
                                        (opt) => opt.value === data.alasan
                                    )}
                                    onChange={(selected) =>
                                        setData("alasan", selected?.value || "")
                                    }
                                    className={errors.alasan ? "is-invalid" : ""}
                                    placeholder="Pilih alasan mengikuti pelatihan..."
                                    isClearable
                                />
                                {errors.alasan && (
                                    <div className="invalid-feedback d-block">
                                        {errors.alasan}
                                    </div>
                                )}
                            </Form.Group>

                            {/* Update section komitmen jadi huruf F */}
                            <div className="big-text text-muted mb-4">
                                F. Pernyataan Komitmen
                                <div className="underline"></div>
                            </div>

                            <Form.Group className="mb-4">
                                <Form.Check
                                    type="checkbox"
                                    id="komitmen"
                                    label="Saya menyatakan bahwa data yang saya isi adalah benar dan dapat dipertanggungjawabkan serta menyetujui penggunaannya oleh penyelenggara untuk keperluan verifikasi dan pelaksanaan program sesuai kebijakan privasi yang berlaku."
                                    checked={data.komitmen}
                                    onChange={(e) => setData("komitmen", e.target.checked)}
                                    isInvalid={!!errors.komitmen}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.komitmen}
                                </Form.Control.Feedback>
                            </Form.Group>

                            {/* Submit Button - Replace the existing submit button section with this: */}
                            <div className="d-flex justify-content-center mt-4">
                                <Button
                                    type="submit"
                                    disabled={!isKomitmenChecked || processing || isSubmitting}
                                    className={(!isKomitmenChecked || processing || isSubmitting) ? "opacity-50" : ""}
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
                </>
            )}
            {/* Error Message for Invalid NIK */}
            {!dataPenerima && errorMessage && (
                <div className="alert alert-warning mt-3">
                    NIK YANG ANDA MASUKKAN SALAH ATAU ANDA BUKAN PENERIMA
                    BANTUAN MODAL. INFO LEBIH LANJUT KIRIM WA KE{" "}
                    <strong>081-216-540-162</strong> DENGAN FORMAT:
                    <br />
                    <strong>NIK_NAMA_KELURAHAN_KELUHAN/PERTANYAAN</strong>
                </div>
            )}
        </Form>
    );
}
