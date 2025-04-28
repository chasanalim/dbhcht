import { Form, Button, ListGroup } from "react-bootstrap";
import React from "react";

import SelectAlasanPelatihan from "@/Components/Select/SelectAlasanPelatihan";
import SelectJenisPelatihanKeterampilan from "@/Components/Select/SelectJenisPelatihanKeterampilan";
import SelectPendidikan from "@/Components/Select/SelectPendidikan";
import SelectKecamatan from "@/Components/Select/SelectKecamatan";
import SelectKelurahan from "@/Components/Select/SelectKelurahan";
import SelectRt from "@/Components/Select/SelectRt";
import SelectRw from "@/Components/Select/SelectRw";
import { useForm } from "@inertiajs/react";

export default function FormKeterampilan() {
    const { data, setData, errors, post, reset } = useForm({
        tahun: "",
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

        // nama_usaha: "",
        // tahun_berdiri: "",
        // bidang_usaha: "",
        // alamat_usaha: "",
        // kec_usaha: "",
        // kel_usaha: "",
        // rw_usaha: "",
        // rt_usaha: "",
        // nib: "",
        // legalitas_status: "",
        // legalitas_jenis: [],

        // modal: "",
        // omset: "",
        // kapasitas_satuan: "",
        // kapasitas_jumlah: "",
        // jangkauan: "",

        // file_foto: null,
        // file_ktp: null,
        // file_kk: null,
        // file_pernyataan: null,

        // prioritas_1: "",
        // prioritas_2: "",
        // prioritas_3: "",

        // alasan: "",
        // kesesuaian: "",
        // pengalaman: "",

        // komitmen: false,
    });
    let fileIndex = 1;

    const handleUploadFoto = (e, field_name, preview_name) => {
        // const choosenFiles = Array.prototype.slice.call(e.target.files);
        let reader = new FileReader();
        let file = e.target.files[0];

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
        const choosenFiles = Array.prototype.slice.call(e.target.files);

        setData((prevState) => ({
            ...prevState,
            [field_name]: multiple ? choosenFiles : e.target.files,
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        post(route("banmod.store"), {
            forceFormData: true,
        });
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
                    isInvalid={errors[fieldName]}
                />
                <Form.Control.Feedback type="invalid">
                    {errors[fieldName]}
                </Form.Control.Feedback>

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
        console.log("Usia: ", age);
        setData((prevState) => ({
            ...prevState,
            tgl_lhr: birthDate,
            usia: age,
        }));
    };

    return (
        <>
            <div className="big-text text-muted mb-4">
                Data Peserta
                <div className="underline"></div>
            </div>

            <Form onSubmit={handleSubmit}>
                {/* NIK */}
                <Form.Group className="mb-3">
                    <Form.Label className="required">NIK</Form.Label>
                    <Form.Control
                        type="text"
                        value={data.nik || ""}
                        onChange={(e) =>
                            setData({ ...data, nik: e.target.value })
                        }
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
                        onChange={(e) =>
                            setData({ ...data, no_kk: e.target.value })
                        }
                        isInvalid={!!errors.no_kk}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.no_kk}
                    </Form.Control.Feedback>
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

                {/* Tanggal Lahir */}
                <div className="row mb-3">
                    <Form.Label className="required">
                        Tempat/Tgl. Lahir
                    </Form.Label>
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
                        onChange={(val) =>
                            setData({ ...data, pendidikan: val })
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
                        onChange={(val) => setData("alasan", val)}
                        errors={errors.alasan}
                    />
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
                    Upload Berkas
                    <div className="underline"></div>
                </div>

                {renderFileUpload(
                    "Foto KTP",
                    "file_ktp",
                    ".png,.jpg,.jpeg",
                    false,
                    "imagePreviewKTP"
                )}
                {renderFileUpload("Kartu Keluarga (KK)", "file_kk")}

                <div className="big-text text-muted mb-4">
                    Pernyataan Komitmen
                    <div className="underline"></div>
                </div>
                <Form.Check
                    type="checkbox"
                    label="Saya menyatakan bahwa data yang dimasukkan benar dan bersedia mengikuti pelatihan sampai selesai"
                    checked={data.komitmen}
                    onChange={(e) => setData("komitmen", e.target.checked)}
                />
                <hr />

                <div className="card-footer d-flex justify-content-center mt-4 gap-2">
                    <Button type="submit">
                        Simpan{" "}
                        <i
                            className="fa fa-paper-plane ms-1"
                            aria-hidden="true"
                        ></i>
                    </Button>
                </div>
            </Form>
        </>
    );
}
