import { Form, Button, ListGroup } from "react-bootstrap";
import Select from "react-select";
import { useEffect, useState } from "react";
import { useForm } from "@inertiajs/react";
import CurrencyInput from "react-currency-input-field";

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
    const { data, setData, errors, post, reset } = useForm({
        nik: "",
        no_kk: "",
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

        file_foto: null,
        file_ktp: null,
        file_kk: null,
        file_pernyataan: null,
        file_domisili: null,

        prioritas_1: "",
        prioritas_2: "",
        prioritas_3: "",

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

    const handleUploadFoto = (e, field_name, preview_name) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > 2 * 1024 * 1024) {
            alert("Ukuran file maksimal 2MB. File terlalu besar: " + file.name);
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

    const formatFileSize = (bytes) => {
        if (bytes === 0) return "0 Bytes";
        const k = 1024;
        const sizes = ["Bytes", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    };

    const handleUploadFile = (e, field_name, multiple) => {
        const rawFiles = e.target.files;
        if (!rawFiles || rawFiles.length === 0) return;

        const files = Array.from(rawFiles);

        if (files[0].size > 2 * 1024 * 1024) {
            alert(
                "Ukuran file maksimal 2MB. File terlalu besar: " + files[0].name
            );
            return;
        }

        setData((prevState) => ({
            ...prevState,
            [field_name]: multiple ? files : files[0],
        }));
    };

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsSubmitting(true);
        console.log(data);
        try {
            await post(route("pelatihan.umkm.store"), {
                forceFormData: true,
            });
            localStorage.removeItem("form_umkm_data");
        } catch (error) {
            console.error("Error:", error);
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

    const renderFileUpload = ({
        label,
        fieldName,
        accept = ".pdf",
        multiple = false,
        imagePreviewKey = null,
        index = 1,
    }) => {
        const indexLabel = `${index}.`;

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
                />

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
                {!imagePreviewKey && data[fieldName]?.length > 0 && (
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
                                    📄 {data[fieldName][0]?.name}
                                    <a
                                        href={URL.createObjectURL(
                                            data[fieldName][0]
                                        )}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="ms-2 text-decoration-underline"
                                        style={{ fontSize: "12px" }}
                                    >
                                        Preview
                                    </a>
                                </span>
                                <Button
                                    size="sm"
                                    variant="outline-danger"
                                    onClick={() =>
                                        handleRemoveFile(fieldName, 0)
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

    return (
        <>
            <Form
                onSubmit={handleSubmit}
                autoComplete="off"
                encType="multipart/form-data"
            >
                {/* Tambahan: tampilkan error umum jika ada */}
                {errors.error && (
                    <div className="alert alert-danger">{errors.error}</div>
                )}

                <div className="big-text text-muted mb-4">
                    Data Peserta
                    <div className="underline"></div>
                </div>

                {/* NIK */}
                <Form.Group className="mb-3">
                    <Form.Label className="required">NIK</Form.Label>
                    <Form.Control
                        type="text"
                        value={data.nik || ""}
                        onChange={(e) => setData("nik", e.target.value)}
                        isInvalid={!!errors.nik}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.nik}
                    </Form.Control.Feedback>
                </Form.Group>

                {/* Nomor KK */}
                <Form.Group className="mb-3">
                    <Form.Label className="required">Nomor KK</Form.Label>
                    <Form.Control
                        type="text"
                        value={data.no_kk || ""}
                        onChange={(e) => setData("no_kk", e.target.value)}
                        isInvalid={!!errors.no_kk}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.no_kk}
                    </Form.Control.Feedback>
                </Form.Group>

                {/* Jenis Kelamin */}
                <Form.Group className="mb-3">
                    <Form.Label className="required">Jenis Kelamin</Form.Label>
                    <SelectJenisKelamin
                        value={data.jenis_kelamin}
                        onChange={(value) => setData("jenis_kelamin", value)}
                        errors={errors.jenis_kelamin}
                    />
                </Form.Group>

                {/* Nama Lengkap */}
                <Form.Group className="mb-3">
                    <Form.Label className="required">Nama Lengkap</Form.Label>
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
                        <Form.Label className="required">Kecamatan</Form.Label>
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
                        <Form.Label className="required">Kelurahan</Form.Label>
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
                                    rw: item.text,
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
                                    rt: item.text,
                                }))
                            }
                            errors={errors.rt}
                        />
                    </div>
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label className="required">Alamat Lengkap</Form.Label>
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
                        onChange={(e) => setData("nama_usaha", e.target.value)}
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
                    <Form.Label className="required">Bidang Usaha</Form.Label>
                    <SelectBidangUsaha
                        value={data.bidang_usaha}
                        onChange={(item) => setData("bidang_usaha", item)}
                        errors={errors.bidang_usaha}
                    />
                </Form.Group>

                {/* Alamat Usaha */}
                <Form.Group className="row mb-1">
                    <div className="col-md-6 col-12 mb-3">
                        <Form.Label className="required">Kecamatan</Form.Label>
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
                        <Form.Label className="required">Kelurahan</Form.Label>
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
                                    rt_usaha: item.text,
                                }))
                            }
                            errors={errors.rt_usaha}
                        />
                    </div>
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label className="required">Alamat Usaha</Form.Label>
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
                                    intValue === 0 ? [] : data.legalitas_jenis,
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
                            onChange={(val) => setData("legalitas_jenis", val)}
                            errors={errors.legalitas_jenis}
                        />
                    </Form.Group>
                )}

                {/* Modal */}
                <Form.Group className="mb-3">
                    <div className="col-12 mb-3">
                        <Form.Label className="required">Modal (Rp)</Form.Label>
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
                        <div className="invalid-feedback">{errors.modal}</div>
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
                        <div className="invalid-feedback">{errors.omset}</div>
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
                                    setData("kapasitas_jumlah", e.target.value)
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
                    Upload Berkas Max 2MB
                    <div className="underline"></div>
                </div>

                {renderFileUpload({
                    label: "Foto Profil",
                    fieldName: "file_foto",
                    accept: ".png,.jpg,.jpeg",
                    imagePreviewKey: "imagePreviewFotoProfil",
                    index: 1,
                })}

                {renderFileUpload({
                    label: "Foto KTP",
                    fieldName: "file_ktp",
                    accept: ".png,.jpg,.jpeg",
                    imagePreviewKey: "imagePreviewKTP",
                    index: 2,
                })}

                {renderFileUpload({
                    label: "Kartu Keluarga (KK)",
                    fieldName: "file_kk",
                    accept: ".pdf",
                    index: 3,
                })}

                {renderFileUpload({
                    label: "Surat Pernyataan Komitmen (PDF)",
                    fieldName: "file_pernyataan",
                    accept: ".pdf",
                    index: 4,
                })}

                {renderFileUpload({
                    label: "Surat Keterangan Domisili",
                    fieldName: "file_domisili",
                    accept: ".pdf",
                    index: 5,
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
                        selectedValues={[data.prioritas_2, data.prioritas_3]}
                        errors={errors.prioritas_1}
                    />

                    <SelectPrioritasPelatihan
                        prioritasKe={2}
                        value={data.prioritas_2}
                        onChange={(val) => setData("prioritas_2", val)}
                        selectedValues={[data.prioritas_1, data.prioritas_3]}
                        errors={errors.prioritas_2}
                    />

                    <SelectPrioritasPelatihan
                        prioritasKe={3}
                        value={data.prioritas_3}
                        onChange={(val) => setData("prioritas_3", val)}
                        selectedValues={[data.prioritas_1, data.prioritas_2]}
                        errors={errors.prioritas_3}
                    />
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
                        onChange={(e) => setData("komitmen", e.target.checked)}
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
                            !data.komitmen || isSubmitting ? "opacity-50" : ""
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
            </Form>
        </>
    );
}
