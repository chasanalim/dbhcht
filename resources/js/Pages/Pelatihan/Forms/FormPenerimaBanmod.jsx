import { Form, Button, ListGroup } from "react-bootstrap";
import React, { useState } from "react";
import axios from "axios";

import SelectKecamatan from "@/Components/Select/SelectKecamatan";
import SelectKelurahan from "@/Components/Select/SelectKelurahan";
import SelectRt from "@/Components/Select/SelectRt";
import SelectRw from "@/Components/Select/SelectRw";
import { useForm } from "@inertiajs/react";
import SelectTahun from "@/Components/Select/SelectTahun";

export default function FormPenerimaBanmod() {
    const [nikStatus, setNikStatus] = useState(null); // Status pengecekan NIK
    const [pesertaData, setPesertaData] = useState(null); // Data peserta jika NIK ditemukan
    const [isEditable, setIsEditable] = useState(true); // Menentukan apakah form bisa diedit
    const [errorMessage, setErrorMessage] = useState(""); // Pesan error
    const [isConfirmed, setIsConfirmed] = useState(null); // null | true | false
    const [dataPenerima, setDataPenerima] = useState(null);
    const [tampilKonfirmasi, setTampilKonfirmasi] = useState(false);
    const [editMode, setEditMode] = useState(false);

    const { data, setData, errors, post, reset } = useForm({
        tahun: "",
        nik: "",
        no_kk: "",
        nama_lengkap: "",
        tempat_lahir: "",
        tgl_lahir: "",
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

    // Fungsi untuk mengecek NIK di database
    const cekNik = async () => {
        setErrorMessage("");
        setNikStatus("");
        setTampilKonfirmasi(false);
        setEditMode(false);
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
                    nama_lengkap: d.nama_lengkap,
                    no_kk: d.no_kk,
                    kecamatan: d.kecamatan,
                    kelurahan: d.kelurahan,
                    rw: d.rw,
                    rt: d.rt,
                    alamat: d.alamat,
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

    // Fungsi untuk menangani perubahan NIK
    const handleNikChange = (e) => {
        setData("nik", e.target.value);
        setNikStatus("");
        setErrorMessage("");
        setDataPenerima(null);
        setTampilKonfirmasi(false);
        setEditMode(false);
    };

    // Fungsi untuk menangani konfirmasi apakah data sudah sesuai
    const handleDataConfirmation = (isConfirmed) => {
        if (isConfirmed) {
            setIsEditable(false); // Jika ya, form tidak bisa diedit
        } else {
            setIsEditable(true); // Jika tidak, form bisa diedit
        }
    };

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

    return (
        <>
            <div className="big-text text-muted mb-4">
                Data Peserta
                <div className="underline"></div>
            </div>

            <Form.Group className="row mb-1">
                <div className="col-md-12 col-12 mb-3">
                    <Form.Label className="required">
                        Tahun Penerimaan Bantuan
                    </Form.Label>
                    <SelectTahun
                        onChange={(item) =>
                            setData((prevState) => ({
                                ...prevState,
                                tahun: item.value,
                            }))
                        }
                        errors={errors.tahun}
                    />
                </div>
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>NIK</Form.Label>
                <Form.Control
                    type="text"
                    value={data.nik}
                    onChange={handleNikChange}
                    isInvalid={!!errors.nik || !!errorMessage}
                />
                {errorMessage && (
                    <div className="text-danger">{errorMessage}</div>
                )}
                {nikStatus && <div className="text-success">{nikStatus}</div>}
                <Button className="mt-2" variant="primary" onClick={cekNik}>
                    Cek NIK
                </Button>
            </Form.Group>

            {/* Munculkan data jika ditemukan */}
            {dataPenerima && (
                <>
                    <hr />
                    <Form.Group className="mb-3">
                        <Form.Label>Nama</Form.Label>
                        <Form.Control
                            type="text"
                            value={data.nama_lengkap}
                            readOnly={!editMode}
                            onChange={(e) => setData("nama", e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>No KK</Form.Label>
                        <Form.Control
                            type="text"
                            value={data.no_kk}
                            readOnly={!editMode}
                            onChange={(e) => setData("no_kk", e.target.value)}
                        />
                    </Form.Group>

                    {/* Konfirmasi */}
                    {tampilKonfirmasi && (
                        <div className="mb-3">
                            <Form.Label>
                                Apakah data sudah sesuai dan tidak ada
                                perubahan?
                            </Form.Label>
                            <div className="d-flex gap-2">
                                <Button
                                    variant="outline-success"
                                    onClick={() => setEditMode(false)}
                                >
                                    Ya, sesuai
                                </Button>
                                <Button
                                    variant="outline-warning"
                                    onClick={() => setEditMode(true)}
                                >
                                    Tidak, saya ingin edit
                                </Button>
                            </div>
                        </div>
                    )}
                </>
            )}

            {!dataPenerima && errorMessage && (
                <div className="alert alert-warning mt-3">
                    NIK YANG ANDA MASUKKAN SALAH ATAU ANDA BUKAN PENERIMA
                    BANTUAN MODAL. INFO LEBIH LANJUT KIRIM WA KE{" "}
                    <strong>0811398319</strong> DENGAN FORMAT:
                    <br />
                    <strong>NIK_NAMA_KELURAHAN_KELUHAN/PERTANYAAN</strong>
                </div>
            )}

            {/* <div className="big-text text-muted mb-4">
                Alamat Usaha
                <div className="underline"></div>
            </div> */}
            {/* Alamat Usaha */}
            {/* <Form.Group className="row mb-1">
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

            <Form.Group className="mb-3">
                <Form.Label>Jenis Pelatihan Industri</Form.Label>
                <Form.Select
                    value={data.jenis_pelatihan}
                    onChange={(e) => setData("jenis_pelatihan", e.target.value)}
                >
                    <option value="">Pilih Jenis</option>
                    {[
                        "Tenun",
                        "Batik/Ecoprint",
                        "Sulam/Bordir",
                        "Rajut",
                        "Aksesoris",
                        "Anyaman",
                        "Kerajinan Lainnya",
                        "Penjahit Pakaian",
                        "Kerajinan Tas",
                        "Bengkel",
                        "Roti",
                        "Kue Kering",
                        "Kue Basah",
                        "Catering",
                        "Olahan Daging/Ikan",
                        "Keripik",
                        "Minuman (Jamu)",
                        "Minuman (Kekinian)",
                        "Fotokopi/Percetakan",
                    ].map((j, i) => (
                        <option key={i} value={j}>
                            {j}
                        </option>
                    ))}
                </Form.Select>
            </Form.Group>

            {[
                {
                    label: "Perkembangan Omzet Pendapatan Kotor Usaha",
                    name: "perkembangan_omzet",
                },
                {
                    label: "Perkembangan Jumlah Tenaga Kerja",
                    name: "perkembangan_tenaga_kerja",
                },
            ].map(({ label, name }, i) => (
                <Form.Group key={i} className="mb-3">
                    <Form.Label>{label}</Form.Label>
                    <Form.Select
                        value={data[name]}
                        onChange={(e) => setData(name, e.target.value)}
                    >
                        <option value="">Pilih Jawaban</option>
                        <option value="a">Bertambah / Meningkat</option>
                        <option value="b">Tetap</option>
                        <option value="c">Berkurang / Turun</option>
                    </Form.Select>
                </Form.Group>
            ))}

            {[
                {
                    label: "Mengikuti pelatihan untuk meningkatkan keterampilan dan kemampuan",
                    name: "ikut_keterampilan",
                },
                {
                    label: "Mengikuti pelatihan untuk meningkatkan kualitas produk",
                    name: "ikut_kualitas_produk",
                },
                {
                    label: "Mengikuti pelatihan untuk memperoleh solusi atas permasalahan usaha",
                    name: "ikut_solusi_usaha",
                },
                {
                    label: "Mengikuti pelatihan untuk minat di bidang tersebut",
                    name: "ikut_minat_dibidang",
                },
                {
                    label: "Mengikuti pelatihan untuk mengisi waktu luang",
                    name: "ikut_waktu_luang",
                },
                {
                    label: "Mengikuti pelatihan karena diajak teman",
                    name: "ikut_ajak_teman",
                },
            ].map(({ label, name }, i) => (
                <Form.Group key={i} className="mb-3">
                    <Form.Label>{label}</Form.Label>
                    <Form.Select
                        value={data[name]}
                        onChange={(e) => setData(name, e.target.value)}
                    >
                        <option value="">Pilih Jawaban</option>
                        <option value="a">Sangat Setuju</option>
                        <option value="b">Setuju</option>
                        <option value="c">Kurang Setuju</option>
                    </Form.Select>
                </Form.Group>
            ))}

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
            {renderFileUpload("NIB", "file_nib")} */}

            <div className="big-text text-muted mb-4">
                Pernyataan Komitmen
                <div className="underline"></div>
            </div>
            <Form.Check
                type="checkbox"
                label="Saya menyatakan data yang saya masukkan benar dan bersedia mengikuti pelatihan sampai selesai"
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
        </>
    );
}
