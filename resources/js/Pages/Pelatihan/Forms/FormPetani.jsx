import { Form, Button, ListGroup } from "react-bootstrap";
import { useForm } from "@inertiajs/react";

import SelectJenisKelamin from "@/Components/Select/SelectJenisKelamin";
import SelectPendidikan from "@/Components/Select/SelectPendidikan";
import SelectDisabilitas from "@/Components/Select/SelectDisabilitas";
import SelectMasaAktifKolompok from "@/Components/Select/SelectMasaAktifKolompok";
import SelectBidangUsahaKelompok from "@/Components/Select/SelectBidangUsahaKelompok";
import SelectKecamatan from "@/Components/Select/SelectKecamatan";
import SelectKelurahan from "@/Components/Select/SelectKelurahan";
import SelectRt from "@/Components/Select/SelectRt";
import SelectRw from "@/Components/Select/SelectRw";
import SelectKelompokPelatihanPetani from "@/Components/Select/SelectKelompokPelatihanPetani";
import SelectJenisPelatihanPetani1 from "@/Components/Select/SelectJenisPelatihanPetani1";
import SelectJenisPelatihanPetani2 from "@/Components/Select/SelectJenisPelatihanPetani2";
import SelectSkorPelatihanPetani from "@/Components/Select/SelectSkorPelatihanPetani";

export default function FormPetani() {
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
        kategori: "",
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
        imagePreviewKey = null,
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
                    <div
                        className="text-muted mt-1"
                        style={{ fontSize: "12px" }}
                    >
                        {description}
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
                                setData("alamat_domisili", e.target.value)
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

            {/* Profil Kelompok*/}
            <div className="big-text text-muted mb-4 mt-5">
                Profil Kelompok
                <div className="underline"></div>
            </div>

            {/* Nama Usaha */}
            <Form.Group className="mb-3">
                <Form.Label className="required">Nama Kelompok</Form.Label>
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
                    Tahun Pendirian Kelompok
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

            {/* Masa Aktif Kelompok */}
            <Form.Group className="mb-3">
                <Form.Label className="required">
                    Masa Aktif Kelompok
                </Form.Label>
                <SelectMasaAktifKolompok
                    value={data.masa_aktif_kelompok}
                    onChange={(item) =>
                        setData({ ...data, masa_aktif_kelompok: item.value })
                    }
                    errors={errors.masa_aktif_kelompok}
                />
            </Form.Group>

            {/* Bidang Usaha Kelompok */}
            <Form.Group className="mb-3">
                <Form.Label className="required">
                    Bidang Usaha Kelompok
                </Form.Label>
                <SelectBidangUsahaKelompok
                    value={data.bidang_usaha_kelompok}
                    onChange={(item) =>
                        setData({ ...data, bidang_usaha_kelompok: item.value })
                    }
                    errors={errors.bidang_usaha_kelompok}
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
            {renderFileUpload(
                "SK Pengukuhan Penyuluh Swadaya",
                "file_pengukuhan_penyuluh_swadaya",
                ".png,.jpg,.jpeg",
                false,
                "imagePreviewPengukuhanPenyuluhSwadaya",
                "*Keterangan: Khusus Untuk Calon Peserta Peningkatan Kapasitas Kelembagaan Penyuluhan Pertanian"
            )}
            {renderFileUpload(
                "Rekomendasi Kelompok",
                "file_rekomendasi_kelompok",
                ".png,.jpg,.jpeg",
                false,
                "imagePreviewRekomendasiKelompok",
                "*Keterangan: Khusus Untuk Calon Peserta Pengembangan Kapasitas Kelembagaan Petani"
            )}

            <div className="big-text text-muted mb-4">
                Jenis Pelatihan
                <div className="underline"></div>
            </div>

            {/* Kelompok Pelatihan */}
            <Form.Group className="row mb-1">
                <div className="col-md-12 col-12 mb-3">
                    <Form.Label className="required">
                        Kelompok Pelatihan
                    </Form.Label>
                    <SelectKelompokPelatihanPetani
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

            {/* Jenis Pelatihan */}
            {(data.jenis_kategori == 1 || data.jenis_kategori == 2) && (
                <Form.Group className="mb-3">
                    <Form.Label className="required">
                        Jenis Pelatihan
                    </Form.Label>
                    {data.jenis_kategori == 1 ? (
                        <SelectJenisPelatihanPetani1
                            value={data.jenis_pelatihan_petani}
                            onChange={(item) =>
                                setData({
                                    ...data,
                                    jenis_pelatihan_petani: item.value,
                                })
                            }
                            errors={errors.jenis_pelatihan_petani}
                        />
                    ) : (
                        <SelectJenisPelatihanPetani2
                            value={data.jenis_pelatihan_petani}
                            onChange={(item) =>
                                setData({
                                    ...data,
                                    jenis_pelatihan_petani: item.value,
                                })
                            }
                            errors={errors.jenis_pelatihan_petani}
                        />
                    )}
                </Form.Group>
            )}

            <hr />

            <div className="big-text text-muted mb-4">
                Alasan Mengikuti Pelatihan
                <div className="underline"></div>
            </div>

            {/* Alasan Mengikuti Pelatihan (Skoring) */}
            <Form.Group className="row mb-1">
                <div className="col-md-12 col-12 mb-3">
                    <Form.Label className="required">
                        Alasan Mengikuti Pelatihan
                    </Form.Label>
                    <SelectSkorPelatihanPetani
                        onChange={(item) =>
                            setData((prevState) => ({
                                ...prevState,
                                kategori: item.id,
                            }))
                        }
                        errors={errors.kategori}
                    />
                </div>
            </Form.Group>

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
