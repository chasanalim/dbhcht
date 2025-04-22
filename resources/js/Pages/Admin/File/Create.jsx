import AdminLayout from "@/Layouts/admin/AdminLayout";
import { Head, useForm } from "@inertiajs/react";
import { Form } from "react-bootstrap";

export default function Create({ title, file, action, method = "POST" }) {
    const { data, setData, post, put, processing, errors, progress } = useForm({
        nama: file?.nama || "",
        deskripsi: file?.deskripsi || "",
        kategori: file?.kategori || "",
        file_name: null,
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        // Create FormData object
        const formData = new FormData();
        formData.append("_method", method);
        formData.append("nama", data.nama);
        formData.append("deskripsi", data.deskripsi);
        formData.append("kategori", data.kategori);

        // Only append file if new file is selected
        if (data.file_name) {
            formData.append("file_name", data.file_name);
        }

        post(action, {
            data: formData,
            forceFormData: true,
            preserveScroll: true,
            onError: (errors) => {
                console.log("Form errors:", errors);
            },
        });
    };

    return (
        <AdminLayout>
            <Head title={title} />

            <div className="container-fluid py-4">
                {errors.error && (
                    <div className="alert alert-danger">{errors.error}</div>
                )}
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
                                        <div className="col-md-6">
                                            <div className="mb-3">
                                                <label className="form-label required">
                                                    Kategori
                                                </label>
                                                <select
                                                    className={`form-select ${
                                                        errors.kategori
                                                            ? "is-invalid"
                                                            : ""
                                                    }`}
                                                    value={data.kategori}
                                                    onChange={(e) =>
                                                        setData(
                                                            "kategori",
                                                            e.target.value
                                                        )
                                                    }
                                                >
                                                    <option value="">
                                                        Pilih Kategori
                                                    </option>
                                                    <option value="banmod">
                                                        Bantuan Modal
                                                    </option>
                                                    <option value="pelatihan-banmod">
                                                        Pelatihan Penerima Banmod
                                                    </option>
                                                    <option value="pencari-kerja">
                                                        Pelatihan Pencari Kerja
                                                    </option>
                                                    <option value="pertanian">
                                                        Pelatihan Pertanian
                                                    </option>
                                                    <option value="umkm">
                                                        Pelatihan UMKM
                                                    </option>
                                                </select>
                                                {errors.kategori && (
                                                    <div className="invalid-feedback">
                                                        {errors.kategori}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="col-md-6">
                                            <Form.Group className="mb-3">
                                                <Form.Label className="required">
                                                    Nama File
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
                                                    placeholder="Masukkan Nama File"
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                    {errors.nama}
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                        </div>

                                        <div className="col-md-6">
                                            <div className="mb-3">
                                                <label className="form-label required">
                                                    Deskripsi File
                                                </label>
                                                <textarea
                                                    className={`form-control ${
                                                        errors.deskripsi
                                                            ? "is-invalid"
                                                            : ""
                                                    }`}
                                                    value={data.deskripsi}
                                                    onChange={(e) =>
                                                        setData(
                                                            "deskripsi",
                                                            e.target.value
                                                        )
                                                    }
                                                    placeholder="Masukkan Deskripsi File"
                                                />
                                                {errors.deskripsi && (
                                                    <div className="invalid-feedback">
                                                        {errors.deskripsi}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="col-md-6">
                                            <div className="mb-3">
                                                <label className="form-label required">
                                                    File{" "}
                                                    <span className="text-muted">
                                                        (pdf, doc, docx | maks
                                                        2MB)
                                                    </span>
                                                </label>
                                                <input
                                                    type="file"
                                                    className={`form-control ${
                                                        errors.file_name
                                                            ? "is-invalid"
                                                            : ""
                                                    }`}
                                                    onChange={(e) =>
                                                        setData(
                                                            "file_name",
                                                            e.target.files[0]
                                                        )
                                                    }
                                                />
                                                {errors.file_name && (
                                                    <div className="invalid-feedback">
                                                        {errors.file_name}
                                                    </div>
                                                )}
                                                {file?.file_name && (
                                                    <div className="mt-1">
                                                        <small className="text-muted">
                                                            File saat ini:{" "}
                                                            {file.file_name}
                                                        </small>
                                                    </div>
                                                )}
                                            </div>
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
