import AdminLayout from "@/Layouts/admin/AdminLayout";
import { Head, useForm } from "@inertiajs/react";
import { Form } from "react-bootstrap";

export default function Create({
    title,
    banmod,
    action,
    method = "POST",
}) {
    const { data, setData, post, put, processing, errors, progress } = useForm({
        nik: banmod?.nik || "",
        kk: banmod?.kk || "",
        nama: banmod?.nama || "",
    });

    // console.log(roles[0].id);

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
                                                    placeholder="Masukkan Nama"
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                    {errors.nik}
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                        </div>
                                        <div className="col-md-4">
                                            <Form.Group className="mb-3">
                                                <Form.Label className="required">
                                                    NO KK
                                                </Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    value={data.kk}
                                                    onChange={(e) =>
                                                        setData(
                                                            "kk",
                                                            e.target.value
                                                        )
                                                    }
                                                    isInvalid={!!errors.kk}
                                                    placeholder="Masukkan Nama"
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                    {errors.kk}
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                        </div>
                                        <div className="col-md-4">
                                            <Form.Group className="mb-3">
                                                <Form.Label className="required">
                                                    NAMA
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
