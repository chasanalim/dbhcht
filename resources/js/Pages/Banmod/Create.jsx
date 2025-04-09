import SelectBruto from "@/Components/Select/SelectBruto";
import SelectDisabilitas from "@/Components/Select/SelectDisabilitas";
import SelectKategoriUsaha from "@/Components/Select/SelectKategoriUsaha";
import SelectKecamatan from "@/Components/Select/SelectKecamatan";
import SelectKelurahan from "@/Components/Select/SelectKelurahan";
import SelectKlasterUsaha from "@/Components/Select/SelectKlasterUsaha";
import SelectLamaUsaha from "@/Components/Select/SelectLamaUsaha";
import SelectLegalitas from "@/Components/Select/SelectLegalitas";
import SelectListrik from "@/Components/Select/SelectListrik";
import SelectPenyerapanNaker from "@/Components/Select/SelectPenyerapanNaker";
import SelectRt from "@/Components/Select/SelectRt";
import SelectRw from "@/Components/Select/SelectRw";
import SelectTanggunganKeluarga from "@/Components/Select/SelectTanggunganKeluarga";
import SelectTeknologi from "@/Components/Select/SelectTeknologi";
import SelectTempatTinggal from "@/Components/Select/SelectTempatTinggal";
import SelectTenagaKerja from "@/Components/Select/SelectTenagaKerja";
import Layout from "@/Layouts/Layout";
import { Head, useForm, usePage } from "@inertiajs/react";
import React, { useEffect, useState } from "react";
import { Button, Form, ListGroup } from "react-bootstrap";
import CurrencyInput from "react-currency-input-field";

export default function BanmodPage({ meta }) {
    // const { auth } = usePage().props;

    // const [showDomisili, setShowDomisili, showUsaha, setShowUsaha] =
    //     useState(false);

    let fileIndex = 1;

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
                    Format: {accept === ".pdf" ? "*.pdf" : "*.png, *.jpg, *.jpeg"}
                </Form.Label>

                <Form.Control
                    type="file"
                    accept={accept}
                    multiple={multiple}
                    onChange={(e) =>
                        imagePreviewKey
                            ? handleUploadFoto(e, fieldName, imagePreviewKey)
                            : handleUploadFile(e, fieldName)
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

                {/* PDF List + Preview + Remove */}
                {!imagePreviewKey && data[fieldName]?.length > 0 && (
                    <ListGroup className="mt-3">
                        {data[fieldName].map((file, idx) => (
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
                                    onClick={() => handleRemoveFile(fieldName, idx)}
                                >
                                    Hapus
                                </Button>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                )}
            </Form.Group>
        );
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
            [previewKey]: ""
        }));
    };    

    const { data, setData, errors, post, reset } = useForm({
        nik: "",
        kk: "",
        name: "",
        tmp_lhr: "",
        tgl_lhr: "",
        alamat: "",
        kode_kecamatan: "",
        nama_kecamatan: "",
        kode_kelurahan: "",
        nama_kelurahan: "",
        kode_rw: "",
        nama_rw: "",
        kode_rt: "",
        nama_rt: "",
        isDomisili: false,
        alamat_domisili: "",
        isUsaha: false,
        alamat_usaha: "",
        phone_number: "",
        daya_listrik: "",
        isDisabilitas: false,
        disabilitas: "",
        kategori: "",
        jenis_kategori: "",
        klaster_usaha: "",
        tanggungan_keluarga: "",
        lama_usaha: "",
        jumlah_tenaga: "",
        bruto: "",
        status_tempat_tinggal: "",
        aset: "",
        hutang: "",
        jumlah_legalitas: "",
        jumlah_teknologi: "",
        jumlah_penyerapan_naker: "",
        file_foto: [],
        file_ktp: [],
        file_kk: [],
        file_nib: [],
        file_sku: [],
        file_skd: [],
        file_produk: [],
        file_pernyataan: [],
        file_perizinan: [],
        file_siinas: [],
        file_bp: [],
        file_sertifikat_pelatihan: [],
        imagePreviewPasFoto: "",
        imagePreviewPasKTP: "",
    });

    const handleUploadFoto = (e, field_name, preview_name) => {
        const choosenFiles = Array.prototype.slice.call(e.target.files);
        let reader = new FileReader();
        let file = e.target.files[0];

        reader.onloadend = () => {
            setData((prevState) => ({
                ...prevState,
                [field_name]: choosenFiles,
                [preview_name]: reader.result,
            }));
        };

        reader.readAsDataURL(file);
    };

    const handleUploadFile = (e, field_name) => {
        const choosenFiles = Array.prototype.slice.call(e.target.files);

        setData((prevState) => ({
            ...prevState,
            [field_name]: choosenFiles,
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        post(route("banmod.store"), {
            forceFormData: true,
        });
    };

    return (
        <Layout>
            <Head title={meta.title} />
            <div className="py-4">
                <div className="card-hero">
                    <Form onSubmit={handleSubmit} encType="multipart/form-data">
                        {" "}
                        <div className="big-text text-muted mb-4">
                            Data Diri
                            <div className="underline"></div>
                        </div>
                        <Form.Group className="row mb-1">
                            <div className="col-md-12 col-12">
                                <div className="mb-3">
                                    <Form.Label className="required">
                                        NIK
                                    </Form.Label>
                                    <Form.Control
                                        value={data.nik}
                                        onChange={(e) =>
                                            setData((prevState) => ({
                                                ...prevState,
                                                nik: e.target.value,
                                            }))
                                        }
                                        isInvalid={errors.nik}
                                        placeholder="Nomor KTP"
                                    ></Form.Control>
                                    <Form.Control.Feedback type="invalid">
                                        {errors.nik}
                                    </Form.Control.Feedback>
                                </div>
                                <div className="mb-3">
                                    <Form.Label className="required">
                                        No. KK
                                    </Form.Label>
                                    <Form.Control
                                        value={data.kk}
                                        onChange={(e) =>
                                            setData((prevState) => ({
                                                ...prevState,
                                                kk: e.target.value,
                                            }))
                                        }
                                        isInvalid={errors.kk}
                                        placeholder="Nomor KK"
                                    ></Form.Control>
                                    <Form.Control.Feedback type="invalid">
                                        {errors.kk}
                                    </Form.Control.Feedback>
                                </div>
                                <div className="mb-3">
                                    <Form.Label className="required">
                                        Nama Lengkap
                                    </Form.Label>
                                    <Form.Control
                                        value={data.name}
                                        onChange={(e) =>
                                            setData((prevState) => ({
                                                ...prevState,
                                                name: e.target.value,
                                            }))
                                        }
                                        isInvalid={errors.name}
                                        placeholder="Nama Lengkap"
                                    ></Form.Control>
                                    <Form.Control.Feedback type="invalid">
                                        {errors.name}
                                    </Form.Control.Feedback>
                                </div>
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

                                <div className="mb-3">
                                    <Form.Label className="required">
                                        No WA
                                    </Form.Label>
                                    <Form.Control
                                        value={data.phone_number}
                                        onChange={(e) =>
                                            setData((prevState) => ({
                                                ...prevState,
                                                phone_number: e.target.value,
                                            }))
                                        }
                                        isInvalid={errors.phone_number}
                                        placeholder="628XXXXXXXXXX"
                                    ></Form.Control>
                                    <Form.Control.Feedback type="invalid">
                                        {errors.phone_number}
                                    </Form.Control.Feedback>
                                </div>
                            </div>
                        </Form.Group>
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
                                <Form.Label className="required">
                                    Alamat
                                </Form.Label>
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
                        <Form.Group className="row mb-1">
                            <div className="col-md-12 col-12 mb-3">
                                <Form.Label>Alamat Domisili</Form.Label>
                                <Form.Check
                                    type="checkbox"
                                    id="switchDomisili"
                                    label="Tidak sama dengan KTP"
                                    onChange={(e) => {
                                        setData("isDomisili", e.target.checked);
                                    }}
                                />
                            </div>
                            {data.isDomisili && (
                                <div className="col-md-12 col-12 mb-3">
                                    <Form.Control
                                        onChange={(e) =>
                                            setData(
                                                "alamat_domisili",
                                                e.target.value
                                            )
                                        }
                                        as="textarea"
                                        rows="3"
                                        value={data.alamat_domisili}
                                        isInvalid={errors.alamat_domisili}
                                        autoComplete="alamat_domisili"
                                        placeholder="Alamat Domisili"
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.alamat_domisili}
                                    </Form.Control.Feedback>
                                </div>
                            )}
                        </Form.Group>
                        <Form.Group className="row mb-1">
                            <div className="col-md-12 col-12 mb-3">
                                <Form.Label>Alamat Usaha</Form.Label>
                                <Form.Check
                                    type="checkbox"
                                    id="switchUsaha"
                                    label="Tidak sama dengan KTP"
                                    onChange={(e) => {
                                        setData("isUsaha", e.target.checked);
                                    }}
                                />
                            </div>
                            {data.isUsaha && (
                                <div className="col-md-12 col-12 mb-3">
                                    <Form.Control
                                        onChange={(e) =>
                                            setData(
                                                "alamat_usaha",
                                                e.target.value
                                            )
                                        }
                                        as="textarea"
                                        rows="3"
                                        value={data.alamat_usaha}
                                        isInvalid={errors.alamat_usaha}
                                        autoComplete="alamat_usaha"
                                        placeholder="Alamat Usaha"
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.alamat_usaha}
                                    </Form.Control.Feedback>
                                </div>
                            )}
                        </Form.Group>
                        <Form.Group className="row mb-1">
                            <div className="col-md-12 col-12 mb-3">
                                <div className="col-md-6 col-12 mb-3">
                                    <Form.Label className="required">
                                        Listrik
                                    </Form.Label>
                                    <SelectListrik
                                        onChange={(item) =>
                                            setData((prevState) => ({
                                                ...prevState,
                                                daya_listrik: item.value,
                                            }))
                                        }
                                        errors={errors.daya_listrik}
                                    />
                                </div>
                            </div>
                        </Form.Group>
                        <Form.Group className="row mb-1">
                            <div className="col-md-12 col-12 mb-3">
                                <Form.Check
                                    type="checkbox"
                                    id="switchDisabilitas"
                                    label="Apakah Anda Penyandang Disabilitas Fisik/Sensorik?"
                                    onChange={(e) => {
                                        setData(
                                            "isDisabilitas",
                                            e.target.checked
                                        );
                                    }}
                                />
                            </div>
                            {data.isDisabilitas && (
                                <div className="col-md-12 col-12 mb-3">
                                    <SelectDisabilitas
                                        onChange={(item) =>
                                            setData((prevState) => ({
                                                ...prevState,
                                                disabilitas: item,
                                            }))
                                        }
                                        errors={errors.disabilitas}
                                    />
                                </div>
                            )}
                        </Form.Group>
                        <div className="big-text text-muted mb-4">
                            Profil Usaha
                            <div className="underline"></div>
                        </div>
                        <Form.Group className="row mb-1">
                            <div className="col-md-12 col-12 mb-3">
                                <Form.Label className="required">
                                    Kategori Usaha
                                </Form.Label>
                                <SelectKategoriUsaha
                                    onChange={(item) =>
                                        setData((prevState) => ({
                                            ...prevState,
                                            kategori: item.id,
                                            jenis_kategori: item.jenis,
                                        }))
                                    }
                                    errors={errors.kategori}
                                />
                            </div>
                        </Form.Group>
                        <Form.Group className="row mb-1">
                            <div className="col-md-12 col-12 mb-3">
                                <Form.Label className="required">
                                    Klaster Usaha
                                </Form.Label>
                                <SelectKlasterUsaha
                                    kodeJenis={data.jenis_kategori}
                                    onChange={(item) =>
                                        setData((prevState) => ({
                                            ...prevState,
                                            klaster_usaha: item.value,
                                        }))
                                    }
                                    errors={errors.klaster_usaha}
                                />
                            </div>
                        </Form.Group>
                        {data.kategori == 5 && (
                            <Form.Group className="row mb-1">
                                <div className="col-md-12 col-12 mb-3">
                                    <Form.Label className="required">
                                        Jumlah Keluarga yang Ditanggung Dalam 1
                                        KK
                                    </Form.Label>
                                    <SelectTanggunganKeluarga
                                        kodeJenis={data.jenis_kategori}
                                        onChange={(item) =>
                                            setData((prevState) => ({
                                                ...prevState,
                                                tanggungan_keluarga: item.value,
                                            }))
                                        }
                                        errors={errors.tanggungan_keluarga}
                                    />
                                </div>
                            </Form.Group>
                        )}
                        <Form.Group className="row mb-1">
                            <div className="col-md-12 col-12 mb-3">
                                <Form.Label className="required">
                                    Lama Usaha
                                </Form.Label>
                                <SelectLamaUsaha
                                    kodeJenis={data.jenis_kategori}
                                    onChange={(item) =>
                                        setData((prevState) => ({
                                            ...prevState,
                                            lama_usaha: item.value,
                                        }))
                                    }
                                    errors={errors.lama_usaha}
                                />
                            </div>
                        </Form.Group>
                        {data.kategori != 5 && (
                            <Form.Group className="row mb-1">
                                <div className="col-md-12 col-12 mb-3">
                                    <Form.Label className="required">
                                        Jumlah Tenaga Kerja
                                    </Form.Label>
                                    <SelectTenagaKerja
                                        kodeJenis={data.jenis_kategori}
                                        onChange={(item) =>
                                            setData((prevState) => ({
                                                ...prevState,
                                                jumlah_tenaga: item.value,
                                            }))
                                        }
                                        errors={errors.jumlah_tenaga}
                                    />
                                </div>
                            </Form.Group>
                        )}
                        {data.kategori != 5 && (
                            <Form.Group className="row mb-1">
                                <div className="col-md-12 col-12 mb-3">
                                    <Form.Label className="required">
                                        Pendapatan Kotor per Bulan
                                    </Form.Label>
                                    <SelectBruto
                                        kodeJenis={data.jenis_kategori}
                                        onChange={(item) =>
                                            setData((prevState) => ({
                                                ...prevState,
                                                bruto: item.value,
                                            }))
                                        }
                                        errors={errors.bruto}
                                    />
                                </div>
                            </Form.Group>
                        )}
                        {data.kategori == 5 && (
                            <Form.Group className="row mb-1">
                                <div className="col-md-12 col-12 mb-3">
                                    <Form.Label className="required">
                                        Status Tempat Tinggal
                                    </Form.Label>
                                    <SelectTempatTinggal
                                        kodeJenis={data.jenis_kategori}
                                        onChange={(item) =>
                                            setData((prevState) => ({
                                                ...prevState,
                                                status_tempat_tinggal:
                                                    item.value,
                                            }))
                                        }
                                        errors={errors.status_tempat_tinggal}
                                    />
                                </div>
                            </Form.Group>
                        )}
                        <Form.Group className="row mb-1">
                            <div className="col-md-12 col-12 mb-3">
                                <Form.Label className="required">
                                    Aset (Selain Tanah & Bangunan)
                                </Form.Label>
                                <div className="col-12 mb-3">
                                    <CurrencyInput
                                        placeholder="Rp."
                                        prefix={"Rp. "}
                                        groupSeparator="."
                                        decimalSeparator=","
                                        allowDecimals={false}
                                        className={`form-control ${
                                            errors.aset ? `is-invalid` : ``
                                        }`}
                                        onValueChange={(value, name, values) =>
                                            setData((prevState) => ({
                                                ...prevState,
                                                aset: value,
                                            }))
                                        }
                                    />
                                    <div className="invalid-feedback">
                                        {errors.aset}
                                    </div>
                                </div>
                            </div>
                        </Form.Group>
                        <Form.Group className="row mb-1">
                            <div className="col-md-12 col-12 mb-3">
                                <Form.Label className="required">
                                    Hutang
                                </Form.Label>
                                <div className="col-12 mb-3">
                                    <CurrencyInput
                                        placeholder="Rp."
                                        prefix={"Rp. "}
                                        groupSeparator="."
                                        decimalSeparator=","
                                        allowDecimals={false}
                                        className={`form-control ${
                                            errors.hutang ? `is-invalid` : ``
                                        }`}
                                        onValueChange={(value, name, values) =>
                                            setData((prevState) => ({
                                                ...prevState,
                                                hutang: value,
                                            }))
                                        }
                                    />
                                    <div className="invalid-feedback">
                                        {errors.hutang}
                                    </div>
                                </div>
                            </div>
                        </Form.Group>
                        {data.kategori == 4 && (
                            <Form.Group className="row mb-1">
                                <div className="col-md-12 col-12 mb-3">
                                    <Form.Label className="required">
                                        Jumlah Legalitas dan Standarisasi
                                    </Form.Label>
                                    <SelectLegalitas
                                        kodeJenis={data.jenis_kategori}
                                        onChange={(item) =>
                                            setData((prevState) => ({
                                                ...prevState,
                                                jumlah_legalitas: item.value,
                                            }))
                                        }
                                        errors={errors.jumlah_legalitas}
                                    />
                                </div>
                                <div className="col-md-12 col-12 mb-3">
                                    <Form.Label className="required">
                                        Jumlah Teknologi Dalam Pemasaran
                                    </Form.Label>
                                    <SelectTeknologi
                                        kodeJenis={data.jenis_kategori}
                                        onChange={(item) =>
                                            setData((prevState) => ({
                                                ...prevState,
                                                jumlah_teknologi: item.value,
                                            }))
                                        }
                                        errors={errors.jumlah_teknologi}
                                    />
                                </div>
                                <div className="col-md-12 col-12 mb-3">
                                    <Form.Label className="required">
                                        Jumlah Rencana Penyerapan Tenaga Kerja
                                        Miskin
                                    </Form.Label>
                                    <SelectPenyerapanNaker
                                        kodeJenis={data.jenis_kategori}
                                        onChange={(item) =>
                                            setData((prevState) => ({
                                                ...prevState,
                                                jumlah_penyerapan_naker:
                                                    item.value,
                                            }))
                                        }
                                        errors={errors.jumlah_penyerapan_naker}
                                    />
                                </div>
                            </Form.Group>
                        )}
                        {/* <div className="big-text text-muted mb-4">
                            Upload Berkas
                            <div className="underline"></div>
                        </div>
                        <Form.Group className="mb-3">
                            <Form.Label className="required">
                                Pas Foto Berwarna
                            </Form.Label>
                            <span
                                className="ms-3"
                                style={{ color: "blue", fontSize: "11px" }}
                            >
                                jenis file (*.png, *.jpg, *.jpeg)
                            </span>
                            <Form.Control
                                type="file"
                                accept=".png,.jpg,.jpeg"
                                onChange={(e) =>
                                    handleUploadFoto(
                                        e,
                                        "file_foto",
                                        "imagePreviewPasFoto"
                                    )
                                }
                                isInvalid={errors.file_foto}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.file_foto}
                            </Form.Control.Feedback>
                            {data.imagePreviewPasFoto && (
                                <div className="mt-3">
                                    <img
                                        className="object-fit-cover"
                                        width={200}
                                        height={200}
                                        src={data.imagePreviewPasFoto}
                                    />
                                </div>
                            )}
                        </Form.Group>
                        <Form.Group className="mb-1">
                            <Form.Label className="required">
                                Foto KTP
                            </Form.Label>
                            <span
                                className="ms-3"
                                style={{ color: "blue", fontSize: "11px" }}
                            >
                                jenis file (*.png, *.jpg, *.jpeg)
                            </span>
                            <Form.Control
                                type="file"
                                accept=".png,.jpg,.jpeg"
                                onChange={(e) =>
                                    handleUploadFoto(
                                        e,
                                        "file_ktp",
                                        "imagePreviewPasKTP"
                                    )
                                }
                                isInvalid={errors.file_ktp}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.file_ktp}
                            </Form.Control.Feedback>
                            {data.imagePreviewPasKTP && (
                                <div className="mt-3">
                                    <img
                                        className="object-fit-cover"
                                        width={200}
                                        height={200}
                                        src={data.imagePreviewPasKTP}
                                    />
                                </div>
                            )}
                        </Form.Group>
                        <Form.Group className="mb-1">
                            <Form.Label className="required">
                                NIB/SKU
                            </Form.Label>
                            <Form.Control
                                type="file"
                                accept=".pdf"
                                multiple
                                onChange={(e) =>
                                    handleUploadFile(e, "file_nib")
                                }
                                isInvalid={errors.file_nib}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.file_nib}
                            </Form.Control.Feedback>
                        </Form.Group>
                        {data.file_nib.length > 0 && (
                            <ListGroup className="mb-3">
                                {data.file_nib.map((file, idx) => (
                                    <ListGroup.Item key={idx}>
                                        📄 {file.name}
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                        )} */}
                        <div className="big-text text-muted mb-4">
                            Upload Berkas
                            <div className="underline"></div>
                        </div>
                        {data.kategori && (
                            <>
                                {renderFileUpload(
                                    "Pas Foto Berwarna",
                                    "file_foto",
                                    ".png,.jpg,.jpeg",
                                    false,
                                    "imagePreviewPasFoto"
                                )}
                                {renderFileUpload(
                                    "Foto KTP",
                                    "file_ktp",
                                    ".png,.jpg,.jpeg",
                                    false,
                                    "imagePreviewPasKTP"
                                )}
                                {renderFileUpload(
                                    "Kartu Keluarga (KK)",
                                    "file_kk"
                                )}
                                {renderFileUpload(
                                    "Surat Keterangan Domisili (jika berbeda KTP)",
                                    "file_skd"
                                )}
                                {renderFileUpload(
                                    "Foto Usaha / Produk",
                                    "file_usaha",
                                    ".png,.jpg,.jpeg"
                                )}
                                {renderFileUpload(
                                    "Surat Pernyataan Komitmen",
                                    "file_komitmen"
                                )}

                                {(data.kategori === 1 ||
                                    data.kategori === 2 ||
                                    data.kategori === 3) &&
                                    renderFileUpload(
                                        "NIB / SKU",
                                        "file_nib",
                                        ".pdf",
                                        true
                                    )}

                                {data.kategori === 4 && (
                                    <>
                                        {renderFileUpload(
                                            "NIB RBA",
                                            "file_nib"
                                        )}
                                        {renderFileUpload("SKU", "file_sku")}
                                        {renderFileUpload(
                                            "Perizinan Teknis dan Standardisasi Lainnya",
                                            "file_perijinan",
                                            ".pdf",
                                            true
                                        )}
                                        {renderFileUpload(
                                            "Bukti Kepemilikan Akun SIINas",
                                            "file_siinas"
                                        )}
                                        {renderFileUpload(
                                            "Business Plan",
                                            "file_bisnis"
                                        )}
                                    </>
                                )}

                                {data.kategori === 5 && (
                                    <>
                                        {renderFileUpload("SKU", "file_sku")}
                                        {renderFileUpload(
                                            "Sertifikat Pelatihan Sesuai Usaha yang Diajukan",
                                            "file_sertifikat"
                                        )}
                                    </>
                                )}
                            </>
                        )}
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
                </div>
            </div>
        </Layout>
    );
}
