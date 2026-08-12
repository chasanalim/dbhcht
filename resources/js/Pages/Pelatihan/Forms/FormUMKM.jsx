import { Form, Button, ListGroup, InputGroup } from "react-bootstrap";
import Select from "react-select";
import { useEffect, useState } from "react";
import { useForm } from "@inertiajs/react";
import CurrencyInput from "react-currency-input-field";
import axios from "axios";

import SelectLegalitasStatus from "@/Components/Select/SelectLegalitasStatus";
import SelectLegalitasJenis from "@/Components/Select/SelectLegalitasJenis";
import SelectSatuanProduksi from "@/Components/Select/SelectSatuanProduksi";
import SelectPemasaran from "@/Components/Select/SelectPemasaran";
import SelectJenisKelamin from "@/Components/Select/SelectJenisKelamin";
import SelectPendidikan from "@/Components/Select/SelectPendidikan";
import SelectDisabilitas from "@/Components/Select/SelectDisabilitas";
import SelectBidangUsaha from "@/Components/Select/SelectBidangUsaha";
import SelectKecamatan from "@/Components/Select/SelectKecamatan";
import SelectKelurahan from "@/Components/Select/SelectKelurahan";
import SelectRt from "@/Components/Select/SelectRt";
import SelectRw from "@/Components/Select/SelectRw";
import SelectPrioritasPelatihan from "@/Components/Select/SelectPrioritasPelatihan";

export default function FormUMKM() {
    const [nikStatus, setNikStatus] = useState(null);
    const [dataPenerima, setDataPenerima] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");
    const [nikLength, setNikLength] = useState(0);
    const [kkLength, setKkLength] = useState(0);

    const { data, setData, errors, post, reset } = useForm({
        nik: "",
        no_kk: "",
        desil: "",
        nama_lengkap: "",
        tempat_lahir: "",
        tgl_lahir: "",
        jenis_kelamin: "",
        no_hp: "",
        jalan: "",
        kecamatan: "",
        kelurahan: "",
        rw: "",
        rt: "",
        pendidikan: "",
        is_disabilitas: false,
        jenis_disabilitas: [],

        nama_usaha: "",
        tahun_berdiri: "",
        bidang_usaha: "",
        alamat_usaha: "",
        kec_usaha: "",
        kel_usaha: "",
        rw_usaha: "",
        rt_usaha: "",
        nib: "",
        legalitas_status: "",
        legalitas_jenis: [],

        modal: "",
        omset: "",
        kapasitas_satuan: "",
        kapasitas_jumlah: "",
        jangkauan: "",

        file_ktp: null,
        file_kk: null,
        file_pasfoto: null,
        file_surat_pernyataan_tidak_ikut: null,
        file_surat_kesanggupan: null,
        file_nib: null,

        prioritas_1: "",
        // prioritas_2: "",
        // prioritas_3: "",

        alasan: "",
        kesesuaian: "",
        pengalaman: "",

        komitmen: false,
    });

    const [skorAlasanOptions, setSkorAlasanOptions] = useState([]);
    const [skorKesesuaianOptions, setSkorKesesuaianOptions] = useState([]);
    const [skorPengalamanOptions, setSkorPengalamanOptions] = useState([]);

    useEffect(() => {
        Promise.all([
            fetch("/skor/alasan").then((res) => res.json()),
            fetch("/skor/kesesuaian").then((res) => res.json()),
            fetch("/skor/pengalaman").then((res) => res.json()),
        ]).then(([alasan, kesesuaian, pengalaman]) => {
            setSkorAlasanOptions(
                alasan.map((i) => ({ value: i.id, label: i.jawaban }))
            );
            setSkorKesesuaianOptions(
                kesesuaian.map((i) => ({ value: i.id, label: i.jawaban }))
            );
            setSkorPengalamanOptions(
                pengalaman.map((i) => ({ value: i.id, label: i.jawaban }))
            );
        });
    }, []);

    useEffect(() => {
        const handleBeforeUnload = (event) => {
            if (Object.values(data).some((val) => val)) {
                event.preventDefault();
                event.returnValue = "";
                return "";
            }
        };

        window.addEventListener("beforeunload", handleBeforeUnload);

        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, [data]);

    // useEffect(() => {
    //     const saved = localStorage.getItem("form_umkm_data");
    //     if (saved) {
    //         setData(JSON.parse(saved));
    //     }
    // }, []);

    useEffect(() => {
        localStorage.setItem("form_umkm_data", JSON.stringify(data));
    }, [data]);

    const cekNik = async () => {
        setErrorMessage("");
        setNikStatus("");
        try {
            const response = await axios.get(
                `/pelatihan/umkm/cek-nik/${data.nik}`
            );

            // Handle success response
            if (response.data.success === true) {
                setNikStatus("NIK valid!");
                setDataPenerima(true);
                if (response.data.desil) {
                    setData("desil", response.data.desil);
                }
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

    // Fungsi untuk format ukuran file
    const formatFileSize = (bytes) => {
        if (bytes === 0) return "0 Bytes";
        const k = 1024;
        const sizes = ["Bytes", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    };

    // Fungsi untuk validasi total ukuran file
    const getTotalFileSize = () => {
        let totalSize = 0;

        const fileFields = [
            'file_ktp', 'file_kk', 'file_pasfoto',
            'file_surat_pernyataan_tidak_ikut',
            'file_surat_kesanggupan', 'file_nib'
        ];

        fileFields.forEach(field => {
            if (data[field]) {
                if (Array.isArray(data[field])) {
                    data[field].forEach(file => {
                        totalSize += file.size || 0;
                    });
                } else {
                    totalSize += data[field].size || 0;
                }
            }
        });

        return totalSize;
    };

    const handleUploadFoto = (e, field_name, preview_name) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validasi ukuran file individual (2MB)
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

        // Validasi total ukuran semua file (8MB)
        const currentTotalSize = getTotalFileSize();
        const maxTotalSize = 8 * 1024 * 1024; // 8MB
        const newTotalSize = currentTotalSize + file.size - (data[field_name]?.size || 0);

        if (newTotalSize > maxTotalSize) {
            alert(
                `Total ukuran semua file akan melebihi batas: ${formatFileSize(newTotalSize)}\n` +
                `Maksimal total ukuran: 8MB\n` +
                `Saat ini: ${formatFileSize(currentTotalSize)}\n` +
                `Silakan kompres file atau hapus file lain terlebih dahulu.`
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

        // Validasi total ukuran
        const currentTotalSize = getTotalFileSize();
        const newFilesSize = files.reduce((sum, file) => sum + file.size, 0);
        const oldFileSize = Array.isArray(data[field_name])
            ? data[field_name].reduce((sum, file) => sum + (file.size || 0), 0)
            : (data[field_name]?.size || 0);

        const newTotalSize = currentTotalSize + newFilesSize - oldFileSize;
        const maxTotalSize = 8 * 1024 * 1024; // 8MB

        if (newTotalSize > maxTotalSize) {
            alert(
                `Total ukuran semua file akan melebihi batas: ${formatFileSize(newTotalSize)}\n` +
                `Maksimal total ukuran: 8MB\n` +
                `Saat ini: ${formatFileSize(currentTotalSize)}\n` +
                `Silakan kompres file atau hapus file lain terlebih dahulu.`
            );
            e.target.value = '';
            return;
        }

        setData((prevState) => ({
            ...prevState,
            [field_name]: multiple ? files : files[0],
        }));
    };

    // // Component untuk menampilkan info ukuran total
    // const FileSizeIndicator = () => {
    //     const totalSize = getTotalFileSize();
    //     const maxSize = 8 * 1024 * 1024; // 8MB
    //     const percentage = (totalSize / maxSize) * 100;

    //     return (
    //         <div className="mb-3 p-3 border rounded bg-light">
    //             <div className="d-flex justify-content-between align-items-center mb-2">
    //                 <span className="fw-semibold">Total Ukuran File:</span>
    //                 <span className={`fw-bold ${percentage > 80 ? 'text-danger' : percentage > 60 ? 'text-warning' : 'text-success'}`}>
    //                     {formatFileSize(totalSize)} / 8MB
    //                 </span>
    //             </div>
    //             <div className="progress" style={{ height: '8px' }}>
    //                 <div
    //                     className={`progress-bar ${percentage > 80 ? 'bg-danger' : percentage > 60 ? 'bg-warning' : 'bg-success'}`}
    //                     style={{ width: `${Math.min(percentage, 100)}%` }}
    //                 ></div>
    //             </div>
    //             {percentage > 80 && (
    //                 <small className="text-danger mt-1 d-block">
    //                     ⚠️ Mendekati batas maksimal! Kompres file untuk menghindari error.
    //                 </small>
    //             )}
    //         </div>
    //     );
    // };

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsSubmitting(true);

        try {
            await post(route("pelatihan.umkm.store"), {
                forceFormData: true,
                onSuccess: () => {
                    localStorage.removeItem("form_umkm_data");
                    // Redirect akan dilakukan oleh Inertia
                },
                onError: (errors) => {
                    console.error("Form errors:", errors);
                    // Errors akan otomatis ditampilkan di form
                }
            });
        } catch (error) {
            console.error("Submit error:", error);
        } finally {
            setIsSubmitting(false);
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

    const renderFileUpload = ({
        label,
        fieldName,
        accept = ".pdf",
        multiple = false,
        imagePreviewKey = null,
        index = 1,
        description = "",
        downloadLink = null,
    }) => {
        const indexLabel = `${index}.`;

        return (
            <Form.Group className="mb-4" key={fieldName}>
                <div className="mb-2 fw-semibold">
                    {indexLabel} {label}
                </div>
                <Form.Label className="text-primary" style={{ fontSize: "11px" }}>
                    Format: {accept === ".pdf" ? "*.pdf" : "*.png, *.jpg, *.jpeg"}
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
                            download
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
                        {Array.isArray(data[fieldName]) ? (
                            data[fieldName].map((file, idx) => (
                                <ListGroup.Item
                                    key={idx}
                                    className="d-flex justify-content-between align-items-center"
                                >
                                    <span>
                                        📄 {file.name} ({formatFileSize(file.size)})
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
                                        onClick={() => handleRemoveFile(fieldName, idx)}
                                    >
                                        Hapus
                                    </Button>
                                </ListGroup.Item>
                            ))
                        ) : (
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
                                    onClick={() => handleRemoveImage(fieldName, imagePreviewKey || 'preview')}
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

    return (
        <Form onSubmit={handleSubmit} encType="multipart/form-data">
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
            {errorMessage && <div className="text-danger">{errorMessage}</div>}

            {nikStatus && <div className="text-success mb-3">{nikStatus}</div>}

            {/* Desil (readonly, dari DTKS) */}
            {data.desil && (
                <Form.Group className="mb-3">
                    <Form.Label className="required">Desil</Form.Label>
                    <Form.Control
                        type="text"
                        value={data.desil}
                        readOnly
                        className="bg-light"
                    />
                    <Form.Text className="text-muted">
                        Data desil diambil otomatis dari API Walidata Kota Kediri
                    </Form.Text>
                </Form.Group>
            )}

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
                                    const value = e.target.value.replace(/\D/g, ''); // Hanya terima angka
                                    if (value.length <= 16) { // Batasi maksimal 16 digit
                                        setData("no_kk", value);
                                        setKkLength(value.length);
                                    }
                                }}
                                isInvalid={!!errors.no_kk}
                                className={`${kkLength === 16 ? 'border-success text-success' : 'border-warning'}`}
                                maxLength={16}
                                placeholder="Nomor Kartu Keluarga"
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.no_kk}
                            </Form.Control.Feedback>
                        </InputGroup>
                        <small className={`d-block mt-1 ${
                            kkLength === 16 ? 'text-success' :
                            kkLength > 0 ? 'text-warning' : 'text-muted'
                        }`}>
                            {kkLength}/16 digit
                        </small>
                    </Form.Group>

                    {/* Jenis Kelamin */}
                    <Form.Group className="mb-3">
                        <Form.Label className="required">
                            Jenis Kelamin
                        </Form.Label>
                        <SelectJenisKelamin
                            value={data.jenis_kelamin}
                            onChange={(value) =>
                                setData("jenis_kelamin", value)
                            }
                            errors={errors.jenis_kelamin}
                        />
                    </Form.Group>

                    {/* Nama Lengkap */}
                    <Form.Group className="mb-3">
                        <Form.Label className="required">
                            Nama Lengkap
                        </Form.Label>
                        <Form.Control
                            type="text"
                            value={data.nama_lengkap || ""}
                            onChange={(e) =>
                                setData("nama_lengkap", e.target.value)
                            }
                            isInvalid={!!errors.nama_lengkap}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.nama_lengkap}
                        </Form.Control.Feedback>
                    </Form.Group>

                    {/* No HP/WA */}
                    <Form.Group className="mb-3">
                        <Form.Label className="required">No HP / WA</Form.Label>
                        <Form.Control
                            type="text"
                            value={data.no_hp || ""}
                            onChange={(e) => {
                                let input = e.target.value;
                                if (input.startsWith("08")) {
                                    input = "62" + input.slice(1);
                                }
                                setData("no_hp", input);
                            }}
                            isInvalid={!!errors.no_hp}
                            placeholder="628XXXXXXXXXX"
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.no_hp}
                        </Form.Control.Feedback>
                    </Form.Group>

                    {/* Alamat Sesuai KTP */}
                    <Form.Group className="row mb-1">
                        <div className="col-md-6 col-12 mb-3">
                            <Form.Label className="required">
                                Kecamatan
                            </Form.Label>
                            <SelectKecamatan
                                onChange={(item) =>
                                    setData((prev) => ({
                                        ...prev,
                                        kode_kecamatan: item.id,
                                        kecamatan: item.text,
                                    }))
                                }
                                errors={errors.kecamatan}
                            />
                        </div>
                        <div className="col-md-6 col-12 mb-3">
                            <Form.Label className="required">
                                Kelurahan
                            </Form.Label>
                            <SelectKelurahan
                                kodeKecamatan={data.kode_kecamatan}
                                onChange={(item) =>
                                    setData((prev) => ({
                                        ...prev,
                                        kode_kelurahan: item.id,
                                        kelurahan: item.text,
                                    }))
                                }
                                errors={errors.kelurahan}
                            />
                        </div>
                    </Form.Group>

                    <Form.Group className="row mb-1">
                        <div className="col-md-6 col-12 mb-3">
                            <Form.Label className="required">RW</Form.Label>
                            <SelectRw
                                kodeKelurahan={data.kode_kelurahan}
                                onChange={(item) =>
                                    setData((prev) => ({
                                        ...prev,
                                        kode_rw: item.id,
                                        rw: item.rw,
                                    }))
                                }
                                errors={errors.rw}
                            />
                        </div>
                        <div className="col-md-6 col-12 mb-3">
                            <Form.Label className="required">RT</Form.Label>
                            <SelectRt
                                kodeKelurahan={data.kode_kelurahan}
                                kodeRw={data.rw}
                                onChange={(item) =>
                                    setData((prev) => ({
                                        ...prev,
                                        kode_rt: item.id,
                                        rt: item.rt,
                                    }))
                                }
                                errors={errors.rt}
                            />
                        </div>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label className="required">
                            Alamat Lengkap
                        </Form.Label>
                        <Form.Control
                            as="textarea"
                            rows="3"
                            value={data.jalan || ""}
                            onChange={(e) => setData("jalan", e.target.value)}
                            isInvalid={!!errors.jalan}
                            placeholder="Alamat sesuai KTP (Jalan/Gang/Lingkungan/No rumah)"
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.jalan}
                        </Form.Control.Feedback>
                    </Form.Group>

                    {/* Tempat, Tanggal Lahir */}
                    <div className="row mb-3">
                        <Form.Label className="required">
                            Tempat / Tanggal Lahir
                        </Form.Label>
                        <div className="col-md-8">
                            <Form.Control
                                placeholder="Tempat Lahir"
                                value={data.tempat_lahir}
                                onChange={(e) =>
                                    setData("tempat_lahir", e.target.value)
                                }
                                isInvalid={!!errors.tempat_lahir}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.tempat_lahir}
                            </Form.Control.Feedback>
                        </div>
                        <div className="col-md-4">
                            <Form.Control
                                type="date"
                                value={data.tgl_lahir}
                                onChange={(e) =>
                                    setData("tgl_lahir", e.target.value)
                                }
                                isInvalid={!!errors.tgl_lahir}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.tgl_lahir}
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
                                setData({
                                    ...data,
                                    pendidikan: item.nama,
                                })
                            }
                            errors={errors.pendidikan}
                        />
                    </Form.Group>

                    {/* Disabilitas */}
                    <Form.Group className="row mb-1">
                        <div className="col-md-12 col-12 mb-3">
                            <Form.Check
                                type="checkbox"
                                id="switchDisabilitas"
                                label="Apakah Anda Penyandang Disabilitas Fisik/Sensorik?"
                                onChange={(e) => {
                                    setData("is_disabilitas", e.target.checked);
                                }}
                            />
                        </div>
                        {data.is_disabilitas && (
                            <div className="col-md-12 col-12 mb-3">
                                <SelectDisabilitas
                                    onChange={(selected) =>
                                        setData((prevState) => ({
                                            ...prevState,
                                            jenis_disabilitas: selected.map(
                                                (opt) => opt.value
                                            ),
                                        }))
                                    }
                                    errors={errors.jenis_disabilitas}
                                />
                            </div>
                        )}
                    </Form.Group>

                    {/* Profil Usaha */}
                    <div className="big-text text-muted mb-4 mt-5">
                        Profil Usaha
                        <div className="underline"></div>
                    </div>

                    {/* Nama Usaha */}
                    <Form.Group className="mb-3">
                        <Form.Label className="required">Nama Usaha</Form.Label>
                        <Form.Control
                            value={data.nama_usaha}
                            onChange={(e) =>
                                setData("nama_usaha", e.target.value)
                            }
                            isInvalid={!!errors.nama_usaha}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.nama_usaha}
                        </Form.Control.Feedback>
                    </Form.Group>

                    {/* Tahun Berdiri */}
                    <Form.Group className="mb-3">
                        <Form.Label className="required">
                            Tahun Pendirian Usaha
                        </Form.Label>
                        <Form.Control
                            type="number"
                            value={data.tahun_berdiri}
                            onChange={(e) =>
                                setData("tahun_berdiri", e.target.value)
                            }
                            isInvalid={!!errors.tahun_berdiri}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.tahun_berdiri}
                        </Form.Control.Feedback>
                    </Form.Group>

                    {/* Bidang Usaha */}
                    <Form.Group className="mb-3">
                        <Form.Label className="required">
                            Bidang Usaha
                        </Form.Label>
                        <SelectBidangUsaha
                            value={data.bidang_usaha}
                            onChange={(item) => setData("bidang_usaha", item)}
                            errors={errors.bidang_usaha}
                        />
                    </Form.Group>

                    {/* Alamat Usaha */}
                    <Form.Group className="row mb-1">
                        <div className="col-md-6 col-12 mb-3">
                            <Form.Label className="required">
                                Kecamatan
                            </Form.Label>
                            <SelectKecamatan
                                onChange={(item) =>
                                    setData((prev) => ({
                                        ...prev,
                                        kode_kecamatan: item.id,
                                        kec_usaha: item.text,
                                    }))
                                }
                                errors={errors.kec_usaha}
                            />
                        </div>
                        <div className="col-md-6 col-12 mb-3">
                            <Form.Label className="required">
                                Kelurahan
                            </Form.Label>
                            <SelectKelurahan
                                kodeKecamatan={data.kode_kecamatan}
                                onChange={(item) =>
                                    setData((prev) => ({
                                        ...prev,
                                        kode_kelurahan: item.id,
                                        kel_usaha: item.text,
                                    }))
                                }
                                errors={errors.kel_usaha}
                            />
                        </div>
                    </Form.Group>

                    <Form.Group className="row mb-1">
                        <div className="col-md-6 col-12 mb-3">
                            <Form.Label className="required">RW</Form.Label>
                            <SelectRw
                                kodeKelurahan={data.kode_kelurahan}
                                onChange={(item) =>
                                    setData((prev) => ({
                                        ...prev,
                                        kode_rw: item.id,
                                        rw_usaha: item.text,
                                    }))
                                }
                                errors={errors.rw_usaha}
                            />
                        </div>
                        <div className="col-md-6 col-12 mb-3">
                            <Form.Label className="required">RT</Form.Label>
                            <SelectRt
                                kodeKelurahan={data.kode_kelurahan}
                                kodeRw={data.rw}
                                onChange={(item) =>
                                    setData((prev) => ({
                                        ...prev,
                                        kode_rt: item.id,
                                        rt_usaha: item.rw,
                                    }))
                                }
                                errors={errors.rt_usaha}
                            />
                        </div>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label className="required">
                            Alamat Usaha
                        </Form.Label>
                        <Form.Control
                            as="textarea"
                            rows="3"
                            value={data.alamat_usaha}
                            onChange={(e) =>
                                setData("alamat_usaha", e.target.value)
                            }
                            isInvalid={!!errors.alamat_usaha}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.alamat_usaha}
                        </Form.Control.Feedback>
                    </Form.Group>

                    {/* NIB */}
                    <Form.Group className="mb-3">
                        <Form.Label className="required">Nomor NIB</Form.Label>
                        <Form.Control
                            value={data.nib}
                            onChange={(e) => setData("nib", e.target.value)}
                            isInvalid={!!errors.nib}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.nib}
                        </Form.Control.Feedback>
                    </Form.Group>

                    {/* Legalitas Usaha */}
                    <Form.Group className="mb-3">
                        <Form.Label className="required">
                            Memiliki Legalitas Usaha?
                        </Form.Label>
                        <SelectLegalitasStatus
                            value={data.legalitas_status}
                            onChange={(value) => {
                                const intValue = value === "ya" ? 1 : 0;
                                setData({
                                    ...data,
                                    legalitas_status: intValue,
                                    legalitas_jenis:
                                        intValue === 0
                                            ? []
                                            : data.legalitas_jenis,
                                });
                            }}
                            errors={errors.legalitas_status}
                        />
                    </Form.Group>

                    {data.legalitas_status === 1 && (
                        <Form.Group className="mb-3">
                            <Form.Label>Pilih Jenis Legalitas</Form.Label>
                            <SelectLegalitasJenis
                                value={data.legalitas_jenis}
                                onChange={(val) =>
                                    setData("legalitas_jenis", val)
                                }
                                errors={errors.legalitas_jenis}
                            />
                        </Form.Group>
                    )}

                    {/* Modal */}
                    <Form.Group className="mb-3">
                        <div className="col-12 mb-3">
                            <Form.Label className="required">
                                Modal (Rp)
                            </Form.Label>
                            <CurrencyInput
                                placeholder="Rp."
                                prefix={"Rp. "}
                                groupSeparator="."
                                decimalSeparator=","
                                allowDecimals={false}
                                className={`form-control ${
                                    errors.modal ? `is-invalid` : ``
                                }`}
                                onValueChange={(value, name, values) =>
                                    setData((prevState) => ({
                                        ...prevState,
                                        modal: value,
                                    }))
                                }
                            />
                            <div className="invalid-feedback">
                                {errors.modal}
                            </div>
                        </div>
                    </Form.Group>

                    {/* Omset */}
                    <Form.Group className="mb-3">
                        <Form.Label className="required">
                            Omset Per Bulan (Rp)
                        </Form.Label>
                        <div className="col-12 mb-3">
                            <CurrencyInput
                                placeholder="Rp."
                                prefix={"Rp. "}
                                groupSeparator="."
                                decimalSeparator=","
                                allowDecimals={false}
                                className={`form-control ${
                                    errors.omset ? `is-invalid` : ``
                                }`}
                                onValueChange={(value, name, values) =>
                                    setData((prevState) => ({
                                        ...prevState,
                                        omset: value,
                                    }))
                                }
                            />
                            <div className="invalid-feedback">
                                {errors.omset}
                            </div>
                        </div>
                    </Form.Group>

                    {/* Kapasitas Produksi */}
                    <Form.Group className="mb-3">
                        <Form.Label className="required">
                            Kapasitas Produksi per Bulan
                        </Form.Label>
                        <div className="row">
                            <div className="col-md-6">
                                <Form.Control
                                    type="number"
                                    placeholder="Volume Produksi"
                                    value={data.kapasitas_jumlah}
                                    onChange={(e) =>
                                        setData(
                                            "kapasitas_jumlah",
                                            e.target.value
                                        )
                                    }
                                    isInvalid={!!errors.kapasitas_jumlah}
                                />
                            </div>
                            <div className="col-md-6">
                                <SelectSatuanProduksi
                                    value={data.kapasitas_satuan}
                                    onChange={(item) =>
                                        setData("kapasitas_satuan", item)
                                    }
                                    errors={errors.kapasitas_satuan}
                                />
                            </div>
                        </div>
                    </Form.Group>

                    {/* Jangkauan Pemasaran */}
                    <Form.Group className="mb-3">
                        <Form.Label className="required">
                            Jangkauan Pemasaran
                        </Form.Label>
                        <SelectPemasaran
                            value={data.jangkauan}
                            onChange={(item) => setData("jangkauan", item)}
                            errors={errors.jangkauan}
                        />
                    </Form.Group>

                    <div className="big-text text-muted mb-4">
                        Upload Berkas Max 2MB (Total Max 8MB)
                        <div className="underline"></div>
                    </div>

                    {/* Error display untuk file size */}
                    {errors.error && (
                        <div className="alert alert-danger mb-3">
                            <strong>Error:</strong> {errors.error}
                        </div>
                    )}

                    {/* File Size Indicator
                    <FileSizeIndicator /> */}

                    {/* Panduan Kompresi */}
                    <FileCompressionGuide />

                    {/* File uploads */}
                    {renderFileUpload({
                        label: "Foto KTP",
                        fieldName: "file_ktp",
                        accept: ".png,.jpg,.jpeg",
                        imagePreviewKey: "imagePreviewKTP",
                        index: 1,
                        description: "Maksimal 2MB. Format: PNG, JPG, JPEG",
                    })}

                    {renderFileUpload({
                        label: "Foto Kartu Keluarga (KK)",
                        fieldName: "file_kk",
                        accept: ".png,.jpg,.jpeg",
                        imagePreviewKey: "imagePreviewKK",
                        index: 2,
                        description: "Maksimal 2MB. Format: PNG, JPG, JPEG",
                    })}

                    {renderFileUpload({
                        label: "Pas Foto",
                        fieldName: "file_pasfoto",
                        accept: ".png,.jpg,.jpeg",
                        imagePreviewKey: "imagePreviewPasFoto",
                        index: 3,
                        description: "Maksimal 2MB. Format: PNG, JPG, JPEG",
                    })}

                    {renderFileUpload({
                        label: "Surat Pernyataan Tidak Mengikuti Pelatihan Lain",
                        fieldName: "file_surat_pernyataan_tidak_ikut",
                        accept: ".pdf",
                        index: 4,
                        description: "Maksimal 2MB. Format: PDF",
                        downloadLink: "https://sultan.kedirikota.go.id/storage/files/ACnkVFsu9Fl8yi6pNan4SfQFNIVmcN95qhXKOtqy.pdf",
                    })}

                    {renderFileUpload({
                        label: "Surat Pernyataan Kesanggupan Mengikuti Pelatihan Secara Penuh",
                        fieldName: "file_surat_kesanggupan",
                        accept: ".pdf",
                        index: 5,
                        description: "Maksimal 2MB. Format: PDF",
                        downloadLink: "https://sultan.kedirikota.go.id/storage/files/ACnkVFsu9Fl8yi6pNan4SfQFNIVmcN95qhXKOtqy.pdf",
                    })}

                    {renderFileUpload({
                        label: "NIB",
                        fieldName: "file_nib",
                        accept: ".pdf",
                        index: 6,
                        description: "Maksimal 2MB. Format: PDF",
                    })}

                    <hr />

                    <div className="big-text text-muted mb-4">
                        Pilihan Pelatihan
                        <div className="underline"></div>
                    </div>

                    <Form.Group className="mb-3">
                        {/* <Form.Label className="required">Pilih Pelatihan</Form.Label> */}
                        <SelectPrioritasPelatihan
                            prioritasKe={1}
                            value={data.prioritas_1}
                            onChange={(val) => setData("prioritas_1", val)}
                            // selectedValues={[
                            //     data.prioritas_2,
                            //     data.prioritas_3,
                            // ]}
                            errors={errors.prioritas_1}
                        />

                        {/* <SelectPrioritasPelatihan
                            prioritasKe={2}
                            value={data.prioritas_2}
                            onChange={(val) => setData("prioritas_2", val)}
                            selectedValues={[
                                data.prioritas_1,
                                data.prioritas_3,
                            ]}
                            errors={errors.prioritas_2}
                        />

                        <SelectPrioritasPelatihan
                            prioritasKe={3}
                            value={data.prioritas_3}
                            onChange={(val) => setData("prioritas_3", val)}
                            selectedValues={[
                                data.prioritas_1,
                                data.prioritas_2,
                            ]}
                            errors={errors.prioritas_3}
                        /> */}
                    </Form.Group>

                    <div className="big-text text-muted mb-4">
                        Skala Prioritas Peserta Pelatihan
                        <div className="underline"></div>
                    </div>

                    <Form.Group className="mb-3">
                        <Form.Label>Alasan Mengikuti Pelatihan</Form.Label>
                        <Select
                            options={skorAlasanOptions}
                            value={skorAlasanOptions.find(
                                (opt) => opt.value === data.alasan
                            )}
                            onChange={(selected) =>
                                setData("alasan", selected?.value)
                            }
                            className={errors.alasan ? "is-invalid" : ""}
                        />
                        {errors.alasan && (
                            <div className="invalid-feedback d-block">
                                {errors.alasan}
                            </div>
                        )}
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Kesesuaian Usaha</Form.Label>
                        <Select
                            options={skorKesesuaianOptions}
                            value={skorKesesuaianOptions.find(
                                (opt) => opt.value === data.kesesuaian
                            )}
                            onChange={(selected) =>
                                setData("kesesuaian", selected?.value)
                            }
                            className={errors.kesesuaian ? "is-invalid" : ""}
                        />
                        {errors.kesesuaian && (
                            <div className="invalid-feedback d-block">
                                {errors.kesesuaian}
                            </div>
                        )}
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Pengalaman Pelatihan</Form.Label>
                        <Select
                            options={skorPengalamanOptions}
                            value={skorPengalamanOptions.find(
                                (opt) => opt.value === data.pengalaman
                            )}
                            onChange={(selected) =>
                                setData("pengalaman", selected?.value)
                            }
                            className={errors.pengalaman ? "is-invalid" : ""}
                        />
                        {errors.pengalaman && (
                            <div className="invalid-feedback d-block">
                                {errors.pengalaman}
                            </div>
                        )}
                    </Form.Group>

                    <Form.Group className="mt-4 mb-3">
                        <Form.Check
                            type="checkbox"
                            label="Saya menyatakan bahwa data yang saya isi adalah benar dan dapat dipertanggungjawabkan serta menyetujui penggunaannya oleh penyelenggara untuk keperluan verifikasi dan pelaksanaan program sesuai kebijakan privasi yang berlaku."
                            checked={data.komitmen}
                            onChange={(e) =>
                                setData("komitmen", e.target.checked)
                            }
                            isInvalid={!!errors.komitmen}
                        />
                        {errors.komitmen && (
                            <div className="invalid-feedback d-block">
                                {errors.komitmen}
                            </div>
                        )}
                    </Form.Group>

                    <div className="card-footer d-flex justify-content-center mt-4 gap-2">
                        <Button
                            type="submit"
                            disabled={!data.komitmen || isSubmitting}
                            className={
                                !data.komitmen || isSubmitting
                                    ? "opacity-50"
                                    : ""
                            }
                        >
                            {isSubmitting ? (
                                <>
                                    Loading...{" "}
                                    <span className="spinner-border spinner-border-sm" />
                                </>
                            ) : (
                                <>
                                    Simpan{" "}
                                    <i className="fa fa-paper-plane ms-1"></i>
                                </>
                            )}
                        </Button>
                    </div>
                </>
            )}
        </Form>
    );
}
