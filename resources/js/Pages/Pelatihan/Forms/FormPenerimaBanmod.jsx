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

export default function FormPenerimaBanmod() {
    const [nikStatus, setNikStatus] = useState(null);
    const [dataPenerima, setDataPenerima] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");
    const [tampilKonfirmasi, setTampilKonfirmasi] = useState(false);
    const [editMode, setEditMode] = useState(false);

    const { data, setData, errors, post, reset } = useForm({
        tahun_penerimaan: "",
        nik: "",
        nama_lengkap: "",
        no_kk: "",
        no_hp: "",

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

        // Files
        file_ktp: null,
        file_kk: null,
        file_nib: null,
        file_domisili: null,

        komitmen: false,
    });

    // Fungsi untuk mengecek NIK
    const cekNik = async () => {
        setErrorMessage("");
        setNikStatus("");
        try {
            const response = await axios.get(
                `/pelatihan/banmod/cek-nik/${data.nik}`
            );
            if (response.data.success) {
                const d = response.data.data;
                setDataPenerima(d);
                setNikStatus("NIK valid!");
                setData((prev) => ({
                    ...prev,
                    nama_lengkap: d.nama,
                    no_kk: d.kk,
                    kecamatan_ktp: d.kec,
                    kelurahan_ktp: d.kel,
                    rw_ktp: d.rw,
                    rt_ktp: d.rt,
                    jalan_ktp: d.alamat,
                }));
                setTampilKonfirmasi(true);
            } else {
                setErrorMessage(
                    "NIK tidak ditemukan atau Anda bukan penerima bantuan."
                );
                setDataPenerima(null);
            }
        } catch (error) {
            setErrorMessage("Terjadi kesalahan saat cek NIK.");
        }
    };

    // Add these state handlers for file uploads
    const handleUploadFoto = (e, field_name, preview_name) => {
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
        const files = Array.prototype.slice.call(e.target.files);

        setData((prevState) => ({
            ...prevState,
            [field_name]: multiple ? files : files[0],
        }));
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

    // Add file index counter
    let fileIndex = 1;

    // Add renderFileUpload function
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
                                    📄 {data[fieldName]?.name}
                                    <a
                                        href={URL.createObjectURL(
                                            data[fieldName]
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

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(data);
        post(route("pelatihan-banmod.store"), {
            forceFormData: true,
            onSuccess: () => {
                reset();
                setTampilKonfirmasi(false);
                setDataPenerima(null);
                setNikStatus(null);
            },
        });
    };

    return (
        <Form onSubmit={handleSubmit} encType="multipart/form-data">
            {/* Form Title */}
            <h4 className="text-center fw-bold mb-4">
                FORM PENDAFTARAN PELATIHAN KETRAMPILAN KERJA BAGI PENERIMA
                BANTUAN MODAL
            </h4>

            {/* Form Description */}
            <div className="alert alert-info mb-4">
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
            </div>

            {/* Section A: Identitas Pendaftar */}
            <div className="big-text text-muted mb-4">
                A. Identitas Pendaftar
                <div className="underline"></div>
            </div>

            {/* Tahun Penerimaan */}
            <Form.Group className="mb-3">
                <Form.Label className="required">
                    Tahun Penerimaan Bantuan
                </Form.Label>
                <SelectTahun
                    value={data.tahun_penerimaan}
                    onChange={(item) => setData("tahun_penerimaan", item.value)}
                    errors={errors.tahun_penerimaan}
                />
            </Form.Group>

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
                            setData("nik", e.target.value);
                            setNikStatus("");
                            setErrorMessage("");
                            setDataPenerima(null);
                            setTampilKonfirmasi(false);
                        }}
                    />
                    <Button
                        className="z-0"
                        variant="outline-primary"
                        onClick={cekNik} // Changed from ceknik to cekNik
                    >
                        Cek NIK
                    </Button>
                    <Form.Control.Feedback type="invalid">
                        {errors.nik}
                    </Form.Control.Feedback>
                </InputGroup>
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
                            readOnly={!editMode}
                            isInvalid={!!errors.nama_lengkap}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.nama_lengkap}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label className="required">No KK</Form.Label>
                        <Form.Control
                            type="text"
                            value={data.no_kk}
                            readOnly={!editMode}
                            onChange={(e) => setData("no_kk", e.target.value)}
                            isInvalid={!!errors.no_kk}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.no_kk}
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
                            {editMode ? (
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
                            ) : (
                                <Form.Control
                                    type="text"
                                    value={data.kecamatan_ktp}
                                    readOnly
                                    isInvalid={!!errors.kecamatan_ktp}
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
                            {editMode ? (
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
                            ) : (
                                <Form.Control
                                    type="text"
                                    value={data.kelurahan_ktp}
                                    readOnly
                                    isInvalid={!!errors.kelurahan_ktp}
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
                            {editMode ? (
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
                                            rw_ktp: item.text,
                                        }))
                                    }
                                    errors={errors.rw_ktp}
                                />
                            ) : (
                                <Form.Control
                                    type="text"
                                    value={data.rw_ktp}
                                    readOnly
                                    isInvalid={!!errors.rw_ktp}
                                />
                            )}
                            <Form.Control.Feedback type="invalid">
                                {errors.rw_ktp}
                            </Form.Control.Feedback>
                        </div>
                        <div className="col-md-6 col-12 mb-3">
                            <Form.Label className="required">RT</Form.Label>
                            {editMode ? (
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
                                            rt_ktp: item.text,
                                        }))
                                    }
                                    errors={errors.rt_ktp}
                                />
                            ) : (
                                <Form.Control
                                    type="text"
                                    value={data.rt_ktp}
                                    readOnly
                                    isInvalid={!!errors.rt_ktp}
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
                            readOnly={!editMode}
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
                                            "Data telah dikonfirmasi ✓"
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
                                            "Silakan edit data yang perlu diubah"
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
                                            "Perubahan data telah disimpan ✓"
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
                                        rw_usaha: item.text,
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
                            Jenis Pelatihan Industri
                        </Form.Label>
                        <SelectJenisPelatihan
                            value={data.jenis_pelatihan_industri}
                            onChange={(item) =>
                                setData(
                                    "jenis_pelatihan_industri",
                                    item?.value || ""
                                )
                            }
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
                        B. Berkas yang Diupload
                        <div className="underline"></div>
                    </div>

                    {renderFileUpload(
                        "KTP",
                        "file_ktp",
                        ".png,.jpg,.jpeg",
                        false,
                        "imagePreviewKTP"
                    )}
                    {renderFileUpload("Kartu Keluarga (KK)", "file_kk", ".pdf")}
                    {renderFileUpload("NIB", "file_nib", ".pdf")}
                    {renderFileUpload(
                        "Surat Keterangan Domisili",
                        "file_domisili",
                        ".pdf"
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
                            label="Saya menyatakan bahwa data yang saya isi adalah benar dan dapat dipertanggungjawabkan serta menyetujui penggunaannya oleh penyelenggara untuk keperluan verifikasi dan pelaksanaan program sesuai kebijakan privasi yang berlaku."
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

                    {/* Submit Button */}
                    <div className="d-flex justify-content-center mt-4">
                        <Button
                            type="submit"
                            disabled={!data.komitmen}
                            className={!data.komitmen ? "opacity-50" : ""}
                        >
                            Kirim <i className="fa fa-paper-plane ms-1"></i>
                        </Button>
                    </div>
                </>
            )}

            {/* Error Message for Invalid NIK */}
            {!dataPenerima && errorMessage && (
                <div className="alert alert-warning mt-3">
                    NIK YANG ANDA MASUKKAN SALAH ATAU ANDA BUKAN PENERIMA
                    BANTUAN MODAL. INFO LEBIH LANJUT KIRIM WA KE{" "}
                    <strong>0811398319</strong> DENGAN FORMAT:
                    <br />
                    <strong>NIK_NAMA_KELURAHAN_KELUHAN/PERTANYAAN</strong>
                </div>
            )}
        </Form>
    );
}
