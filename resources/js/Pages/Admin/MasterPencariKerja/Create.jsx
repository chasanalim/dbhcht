import AdminLayout from "@/Layouts/admin/AdminLayout";
import { Head, useForm } from "@inertiajs/react";
import { Form } from "react-bootstrap";

export default function Create({
    title,
    master,
    action,
    method = "POST",
}) {
    const { data, setData, post, put, processing, errors } = useForm({
        nik: master?.nik || "",
        nama: master?.nama || "",
        tempat_lahir: master?.tempat_lahir || "",
        tanggal_lahir: master?.tanggal_lahir || "",
        jenis_kelamin: master?.jenis_kelamin || "",
        alamat: master?.alamat || "",
        rt: master?.rt || "",
        rw: master?.rw || "",
        kelurahan: master?.kelurahan || "",
        kecamatan: master?.kecamatan || "",
        jenis_pelatihan: master?.jenis_pelatihan || "",
        tahun: master?.tahun || "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (method === "PUT") {
            put(action);
        } else {
            post(action);
        }
    };

    return (
        <AdminLayout>
            <Head title={title} />

            <div className="container-fluid py-4">
                <div className="row">
                    <div className="col-12">
                        <div className="card">
                            <div className="card-header pb-0">
                                <div className="card-title">
                                    <h5 className="fw-bold">{title}</h5>
                                </div>
                            </div>
                            <div className="card-body">
                                <form onSubmit={handleSubmit}>
                                    <div className="row">
                                        <div className="col-md-4">
                                            <Form.Group className="mb-3">
                                                <Form.Label className="required">
                                                    NIK
                                                </Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    value={data.nik}
                                                    onChange={(e) =>
                                                        setData(
                                                            "nik",
                                                            e.target.value
                                                        )
                                                    }
                                                    isInvalid={!!errors.nik}
                                                    placeholder="Masukkan NIK"
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                    {errors.nik}
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                        </div>

                                        <div className="col-md-4">
                                            <Form.Group className="mb-3">
                                                <Form.Label className="required">
                                                    Nama Lengkap
                                                </Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    value={data.nama}
                                                    onChange={(e) =>
                                                        setData(
                                                            "nama",
                                                            e.target.value
                                                        )
                                                    }
                                                    isInvalid={!!errors.nama}
                                                    placeholder="Masukkan Nama"
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                    {errors.nama}
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                        </div>

                                        <div className="col-md-4">
                                            <Form.Group className="mb-3">
                                                <Form.Label>
                                                    Tempat Lahir
                                                </Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    value={data.tempat_lahir}
                                                    onChange={(e) =>
                                                        setData(
                                                            "tempat_lahir",
                                                            e.target.value
                                                        )
                                                    }
                                                    isInvalid={!!errors.tempat_lahir}
                                                    placeholder="Tempat lahir"
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                    {errors.tempat_lahir}
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                        </div>

                                        <div className="col-md-4">
                                            <Form.Group className="mb-3">
                                                <Form.Label>
                                                    Tanggal Lahir
                                                </Form.Label>
                                                <Form.Control
                                                    type="date"
                                                    value={data.tanggal_lahir}
                                                    onChange={(e) =>
                                                        setData(
                                                            "tanggal_lahir",
                                                            e.target.value
                                                        )
                                                    }
                                                    isInvalid={!!errors.tanggal_lahir}
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                    {errors.tanggal_lahir}
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                        </div>

                                        <div className="col-md-4">
                                            <Form.Group className="mb-3">
                                                <Form.Label>
                                                    Jenis Kelamin
                                                </Form.Label>
                                                <Form.Control
                                                    as="select"
                                                    value={data.jenis_kelamin}
                                                    onChange={(e) =>
                                                        setData(
                                                            "jenis_kelamin",
                                                            e.target.value
                                                        )
                                                    }
                                                    isInvalid={!!errors.jenis_kelamin}
                                                >
                                                    <option value="">
                                                        -- Pilih Jenis Kelamin --
                                                    </option>
                                                    <option value="L">
                                                        Laki-laki
                                                    </option>
                                                    <option value="P">
                                                        Perempuan
                                                    </option>
                                                </Form.Control>
                                                <Form.Control.Feedback type="invalid">
                                                    {errors.jenis_kelamin}
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                        </div>

                                        <div className="col-md-4">
                                            <Form.Group className="mb-3">
                                                <Form.Label>
                                                    Alamat
                                                </Form.Label>
                                                <Form.Control
                                                    as="textarea"
                                                    rows={2}
                                                    value={data.alamat}
                                                    onChange={(e) =>
                                                        setData(
                                                            "alamat",
                                                            e.target.value
                                                        )
                                                    }
                                                    isInvalid={!!errors.alamat}
                                                    placeholder="Alamat lengkap"
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                    {errors.alamat}
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                        </div>

                                        <div className="col-md-4">
                                            <Form.Group className="mb-3">
                                                <Form.Label>RT</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    value={data.rt}
                                                    onChange={(e) =>
                                                        setData(
                                                            "rt",
                                                            e.target.value
                                                        )
                                                    }
                                                    isInvalid={!!errors.rt}
                                                    placeholder="RT"
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                    {errors.rt}
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                        </div>

                                        <div className="col-md-4">
                                            <Form.Group className="mb-3">
                                                <Form.Label>RW</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    value={data.rw}
                                                    onChange={(e) =>
                                                        setData(
                                                            "rw",
                                                            e.target.value
                                                        )
                                                    }
                                                    isInvalid={!!errors.rw}
                                                    placeholder="RW"
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                    {errors.rw}
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                        </div>

                                        <div className="col-md-4">
                                            <Form.Group className="mb-3">
                                                <Form.Label>
                                                    Kelurahan
                                                </Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    value={data.kelurahan}
                                                    onChange={(e) =>
                                                        setData(
                                                            "kelurahan",
                                                            e.target.value
                                                        )
                                                    }
                                                    isInvalid={!!errors.kelurahan}
                                                    placeholder="Kelurahan"
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                    {errors.kelurahan}
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                        </div>

                                        <div className="col-md-4">
                                            <Form.Group className="mb-3">
                                                <Form.Label>
                                                    Kecamatan
                                                </Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    value={data.kecamatan}
                                                    onChange={(e) =>
                                                        setData(
                                                            "kecamatan",
                                                            e.target.value
                                                        )
                                                    }
                                                    isInvalid={!!errors.kecamatan}
                                                    placeholder="Kecamatan"
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                    {errors.kecamatan}
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                        </div>

                                        <div className="col-md-4">
                                            <Form.Group className="mb-3">
                                                <Form.Label>
                                                    Jenis Pelatihan
                                                </Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    value={data.jenis_pelatihan}
                                                    onChange={(e) =>
                                                        setData(
                                                            "jenis_pelatihan",
                                                            e.target.value
                                                        )
                                                    }
                                                    isInvalid={!!errors.jenis_pelatihan}
                                                    placeholder="Jenis pelatihan"
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                    {errors.jenis_pelatihan}
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                        </div>

                                        <div className="col-md-4">
                                            <Form.Group className="mb-3">
                                                <Form.Label>Tahun</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    value={data.tahun}
                                                    onChange={(e) =>
                                                        setData(
                                                            "tahun",
                                                            e.target.value
                                                        )
                                                    }
                                                    isInvalid={!!errors.tahun}
                                                    placeholder="Tahun pelaksanaan"
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                    {errors.tahun}
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                        </div>
                                    </div>

                                    <div className="d-flex justify-content-center">
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="btn btn-primary"
                                        >
                                            {processing
                                                ? "Menyimpan..."
                                                : "Simpan"}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
