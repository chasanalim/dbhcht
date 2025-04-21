import { Form, Button, ListGroup } from "react-bootstrap";
import Select from "react-select";
import { useEffect, useState } from "react";
import { useForm } from "@inertiajs/react";

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
    const { data, setData, errors, post, processing, reset } = useForm({
        nik: "",
        kk: "",
        nama: "",
        jenis_kelamin: "",
        alamat_ktp: "",
        alamat_usaha: "",
        disabilitas: "",
        pendidikan: "",
        bidang_usaha: "",
        legalitas_status: "",
        legalitas_jenis: "",
        kapasitas_produksi: "",
        satuan_produksi: "",
        pemasaran: "",
        kecamatan: "",
        kelurahan: "",
        rt: "",
        rw: "",
        foto_profil: null,
        preview_foto_profil: "",
        ktp_file: null,
        kk_file: null,
        nib_file: null,
        prioritas_pelatihan_1: "",
        prioritas_pelatihan_2: "",
        prioritas_pelatihan_3: "",
        alasan: "",
        kesesuaian: "",
        pengalaman: "",
    });

    const [skorAlasanOptions, setSkorAlasanOptions] = useState([]);
    const [skorKesesuaianOptions, setSkorKesesuaianOptions] = useState([]);
    const [skorPengalamanOptions, setSkorPengalamanOptions] = useState([]);

    useEffect(() => {
        fetch("/skor/alasan")
            .then((res) => res.json())
            .then((res) => {
                setSkorAlasanOptions(
                    res.map((i) => ({
                        value: i.skor,
                        label: i.jawaban,
                    }))
                );
            });

        fetch("/skor/kesesuaian")
            .then((res) => res.json())
            .then((res) => {
                setSkorKesesuaianOptions(
                    res.map((i) => ({
                        value: i.skor,
                        label: i.jawaban,
                    }))
                );
            });

        fetch("/skor/pengalaman")
            .then((res) => res.json())
            .then((res) => {
                setSkorPengalamanOptions(
                    res.map((i) => ({
                        value: i.skor,
                        label: i.jawaban,
                    }))
                );
            });
    }, []);

    let fileIndex = 1;

    const handleUploadFoto = (e, field_name, preview_name) => {
        let reader = new FileReader();
        let file = e.target.files[0];

        reader.onloadend = () => {
            setFormData((prevState) => ({
                ...prevState,
                [field_name]: file,
                [preview_name]: reader.result,
            }));
        };

        reader.readAsDataURL(file);
    };

    const handleUploadFile = (e, field_name, multiple) => {
        const choosenFiles = Array.prototype.slice.call(e.target.files);

        setFormData((prevState) => ({
            ...prevState,
            [field_name]: multiple ? choosenFiles : e.target.files,
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        // Simpan data atau kirim ke server
        console.log(data);
    };

    const handleRemoveFile = (field, index) => {
        setFormData((prev) => {
            const updated = [...(prev[field] || [])];
            updated.splice(index, 1);
            return { ...prev, [field]: updated };
        });
    };

    const handleRemoveImage = (field, previewKey) => {
        setFormData((prev) => ({
            ...prev,
            [field]: [],
            [previewKey]: "",
        }));
    };

    const renderFileUpload = (
        label,
        fieldName,
        accept = ".pdf",
        multiple = false,
        imagePreviewKey = null
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
                                        📄 {file.name}{" "}
                                        <a
                                            href={URL.createObjectURL(file)}
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
                    onChange={(e) => setData({ ...data, nik: e.target.value })}
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
                    value={data.kk || ""}
                    onChange={(e) => setData({ ...data, kk: e.target.value })}
                    isInvalid={!!errors.kk}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.kk}
                </Form.Control.Feedback>
            </Form.Group>

            {/* Jenis Kelamin */}
            <Form.Group className="mb-3">
                <Form.Label className="required">Jenis Kelamin</Form.Label>
                <SelectJenisKelamin
                    value={data.jenis_kelamin}
                    onChange={(value) =>
                        setData({ ...data, jenis_kelamin: value })
                    }
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
                        setData({ ...data, nama_lengkap: e.target.value })
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
                    onChange={(e) =>
                        setData({ ...data, no_hp: e.target.value })
                    }
                    isInvalid={!!errors.no_hp}
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
                    <Form.Label className="required">Kelurahan</Form.Label>
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
                        onChange={(e) => setData("alamat", e.target.value)}
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

            {/* Tanggal Lahir */}
            <div className="row mb-3">
                <Form.Label className="required">Tempat/Tgl. Lahir</Form.Label>
                <div className="col-md-8">
                    <Form.Control
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
                        type="date"
                        value={data.tgl_lhr}
                        onChange={(e) =>
                            setData((prevState) => ({
                                ...prevState,
                                tgl_lhr: e.target.value,
                            }))
                        }
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
                    onChange={(val) => setData({ ...data, pendidikan: val })}
                    errors={errors.pendidikan}
                />
            </Form.Group>

            {/* Disabilitas */}
            <Form.Group className="mb-3">
                <Form.Label className="required">
                    Penyandang Disabilitas
                </Form.Label>
                <SelectDisabilitas
                    value={data.disabilitas || []}
                    onChange={(val) => setData({ ...data, disabilitas: val })}
                    errors={errors.disabilitas}
                />
            </Form.Group>

            {/* Profil Usaha*/}
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
                        setData({ ...data, nama_usaha: e.target.value })
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
                    type="month"
                    value={data.tahun_berdiri}
                    onChange={(e) =>
                        setData({ ...data, tahun_berdiri: e.target.value })
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
                    onChange={(item) =>
                        setData({ ...data, bidang_usaha: item.value })
                    }
                    errors={errors.bidang_usaha}
                />
            </Form.Group>

            {/* Alamat Usaha */}
            <Form.Group className="row mb-1">
                <div className="col-md-6 col-12 mb-3">
                    <Form.Label className="required">Kecamatan</Form.Label>
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
                    <Form.Label className="required">Kelurahan</Form.Label>
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
                        onChange={(e) => setData("alamat", e.target.value)}
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

            {/* NIB */}
            <Form.Group className="mb-3">
                <Form.Label className="required">Nomor NIB</Form.Label>
                <Form.Control
                    value={data.nib}
                    onChange={(e) => setData({ ...data, nib: e.target.value })}
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
                    value={data.memiliki_legalitas}
                    onChange={(value) =>
                        setData({
                            ...data,
                            memiliki_legalitas: value,
                            legalitas: value === "tidak" ? [] : data.legalitas,
                        })
                    }
                    errors={errors.memiliki_legalitas}
                />
            </Form.Group>

            {data.memiliki_legalitas === "ya" && (
                <Form.Group className="mb-3">
                    <Form.Label>Pilih Jenis Legalitas</Form.Label>
                    <SelectLegalitasJenis
                        value={data.legalitas}
                        onChange={(valueArray) =>
                            setData({ ...data, legalitas: valueArray })
                        }
                        errors={errors.legalitas}
                    />
                </Form.Group>
            )}

            {/* Modal */}
            <Form.Group className="mb-3">
                <Form.Label className="required">Modal (Rp)</Form.Label>
                <Form.Control
                    type="number"
                    value={data.modal}
                    onChange={(e) =>
                        setData({ ...data, modal: e.target.value })
                    }
                    isInvalid={!!errors.modal}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.modal}
                </Form.Control.Feedback>
            </Form.Group>

            {/* Omset */}
            <Form.Group className="mb-3">
                <Form.Label className="required">
                    Omset Per Bulan (Rp)
                </Form.Label>
                <Form.Control
                    type="number"
                    value={data.omset}
                    onChange={(e) =>
                        setData({ ...data, omset: e.target.value })
                    }
                    isInvalid={!!errors.omset}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.omset}
                </Form.Control.Feedback>
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
                            value={data.kapasitas}
                            onChange={(e) =>
                                setData({ ...data, kapasitas: e.target.value })
                            }
                            isInvalid={!!errors.kapasitas}
                        />
                    </div>
                    <div className="col-md-6">
                        <SelectSatuanProduksi
                            value={data.satuan_kapasitas}
                            onChange={(item) =>
                                setData({
                                    ...data,
                                    satuan_kapasitas: item.value,
                                })
                            }
                            errors={errors.satuan_kapasitas}
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
                    value={data.jangkauan_pemasaran}
                    onChange={(item) =>
                        setData({ ...data, jangkauan_pemasaran: item.value })
                    }
                    errors={errors.jangkauan_pemasaran}
                />
            </Form.Group>

            <div className="big-text text-muted mb-4">
                Upload Berkas
                <div className="underline"></div>
            </div>

            {renderFileUpload(
                "Foto Profil",
                "file_foto",
                ".png,.jpg,.jpeg",
                false,
                "imagePreviewFotoProfil"
            )}
            {renderFileUpload(
                "Foto KTP",
                "file_ktp",
                ".png,.jpg,.jpeg",
                false,
                "imagePreviewKTP"
            )}
            {renderFileUpload("Kartu Keluarga (KK)", "file_kk")}

            {renderFileUpload(
                "Surat Pernyataan Komitmen (PDF)",
                "file_pernyataan",
                ".pdf"
            )}

            <hr />

            <div className="big-text text-muted mb-4">
                Pilihan Pelatihan
                <div className="underline"></div>
            </div>

            <Form.Group className="mb-3">
                {/* <Form.Label className="required">Pilih Pelatihan</Form.Label> */}
                <SelectPrioritasPelatihan
                    prioritasKe={1}
                    value={data.prioritas1}
                    onChange={(val) => setData("prioritas1", val)}
                    selectedValues={[data.prioritas2, data.prioritas3]}
                    errors={errors.prioritas1}
                />

                <SelectPrioritasPelatihan
                    prioritasKe={2}
                    value={data.prioritas2}
                    onChange={(val) => setData("prioritas2", val)}
                    selectedValues={[data.prioritas1, data.prioritas3]}
                    errors={errors.prioritas2}
                />

                <SelectPrioritasPelatihan
                    prioritasKe={3}
                    value={data.prioritas3}
                    onChange={(val) => setData("prioritas3", val)}
                    selectedValues={[data.prioritas1, data.prioritas2]}
                    errors={errors.prioritas3}
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
                        (opt) => opt.value === data.skor_alasan_id
                    )}
                    onChange={(selected) =>
                        setData("skor_alasan_id", selected?.value)
                    }
                    className={errors.skor_alasan_id ? "is-invalid" : ""}
                />
                {errors.skor_alasan_id && (
                    <div className="invalid-feedback d-block">
                        {errors.skor_alasan_id}
                    </div>
                )}
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Kesesuaian Usaha</Form.Label>
                <Select
                    options={skorKesesuaianOptions}
                    value={skorKesesuaianOptions.find(
                        (opt) => opt.value === data.skor_kesesuaian_id
                    )}
                    onChange={(selected) =>
                        setData("skor_kesesuaian_id", selected?.value)
                    }
                    className={errors.skor_kesesuaian_id ? "is-invalid" : ""}
                />
                {errors.skor_kesesuaian_id && (
                    <div className="invalid-feedback d-block">
                        {errors.skor_kesesuaian_id}
                    </div>
                )}
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Pengalaman Pelatihan</Form.Label>
                <Select
                    options={skorPengalamanOptions}
                    value={skorPengalamanOptions.find(
                        (opt) => opt.value === data.skor_pengalaman_id
                    )}
                    onChange={(selected) =>
                        setData("skor_pengalaman_id", selected?.value)
                    }
                    className={errors.skor_pengalaman_id ? "is-invalid" : ""}
                />
                {errors.skor_pengalaman_id && (
                    <div className="invalid-feedback d-block">
                        {errors.skor_pengalaman_id}
                    </div>
                )}
            </Form.Group>

            <Form.Group className="mt-4 mb-3">
                <Form.Check
                    type="checkbox"
                    label="Saya menyatakan data yang saya masukkan benar dan bersedia mengikuti pelatihan sampai selesai"
                    checked={data.komitmen}
                    onChange={(e) =>
                        setData({ ...data, komitmen: e.target.checked })
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
                    disabled={!data.komitmen}
                    className={!data.komitmen ? "opacity-50" : ""}
                >
                    Simpan{" "}
                    <i
                        className="fa fa-paper-plane ms-1"
                        aria-hidden="true"
                    ></i>
                </Button>
            </div>
        </>
    );
}
