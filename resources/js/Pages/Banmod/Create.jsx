import SelectDisabilitas from "@/Components/Select/SelectDisabilitas";
import SelectKategoriUsaha from "@/Components/Select/SelectKategoriUsaha";
import SelectKecamatan from "@/Components/Select/SelectKecamatan";
import SelectKelurahan from "@/Components/Select/SelectKelurahan";
import SelectKlasterUsaha from "@/Components/Select/SelectKlasterUsaha";
import SelectListrik from "@/Components/Select/SelectListrik";
import SelectRt from "@/Components/Select/SelectRt";
import SelectRw from "@/Components/Select/SelectRw";
import Layout from "@/Layouts/Layout";
import { Head, useForm, usePage } from "@inertiajs/react";
import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";

export default function BanmodPage({ meta }) {
    // const { auth } = usePage().props;

    // const [showDomisili, setShowDomisili, showUsaha, setShowUsaha] =
    //     useState(false);
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
        jenis_kluster: "",
        klaster_usaha: "",
        lama_usaha: "",
        jumlah_tenaga: "",
        bruto: "",
        aset: "",
        hutang: "",
        jumlah_legalitas: "",
        jumlah_teknologi: "",
        jumlah_penyerapan_naker: "",
        file_foto: "",
        file_ktp: "",
        file_kk: "",
        file_nib: "",
        file_sku: "",
        file_skd: "",
        file_produk: "",
        file_pernyataan: "",
        file_perizinan: "",
        file_sinas: "",
        file_bp: "",
        file_sertifikat_pelatihan: "",
    });

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
                                <div className="col-md-12 col-12 mb-3">
                                    <Form.Label className="required">
                                        Kategori Usaha
                                    </Form.Label>
                                    <SelectKategoriUsaha
                                        onChange={(item) =>
                                            setData((prevState) => ({
                                                ...prevState,
                                                kategori: item.id,
                                                jenis_kluster: item.jenis
                                            }))
                                        }
                                        errors={errors.kategori}
                                    />
                                </div>
                            </div>
                        </Form.Group>
                        <Form.Group className="row mb-1">
                            <div className="col-md-12 col-12 mb-3">
                                <div className="col-md-12 col-12 mb-3">
                                    <Form.Label className="required">
                                        Klaster Usaha
                                    </Form.Label>
                                    <SelectKlasterUsaha
                                        kodeJenis={data.jenis_kluster}
                                        onChange={(item) =>
                                            setData((prevState) => ({
                                                ...prevState,
                                                klaster_usaha: item.value,
                                            }))
                                        }
                                        errors={errors.klaster_usaha}
                                    />
                                </div>
                            </div>
                        </Form.Group>
                        <hr />
                        <div className="card-footer d-flex justify-content-center mt-4 gap-2">
                            <Button type="submit">
                                Kirim{" "}
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
