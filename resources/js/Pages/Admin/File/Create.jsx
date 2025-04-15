import AdminLayout from "@/Layouts/admin/AdminLayout";
import { Head, useForm } from "@inertiajs/react";
import { Form } from "react-bootstrap";

export default function Create({ title, file, action, method = 'POST' }) {
    const { data, setData, post, put, processing, errors, progress } = useForm({
        nama: file?.nama || "",
        deskripsi: file?.deskripsi || "",
        file_name: null,
        kategori: file?.kategori || "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (method === 'PUT') {
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
                                        <div className="col-md-6">
                                            <div className="mb-3">
                                                <label className="form-label required">
                                                    Kategori
                                                </label>
                                                <select
                                                    className={`form-select ${errors.kategori ? 'is-invalid' : ''}`}
                                                    value={data.kategori}
                                                    onChange={(e) => setData('kategori', e.target.value)}
                                                >
                                                    <option value="">Pilih Kategori</option>
                                                    <option value="banmod">Bantuan Modal</option>
                                                    <option value="pelatihan">Pelatihan</option>
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
                                                    onChange={(e) => setData('nama', e.target.value)}
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
                                                    className={`form-control ${errors.deskripsi ? 'is-invalid' : ''}`}
                                                    value={data.deskripsi}
                                                    onChange={(e) => setData('deskripsi', e.target.value)}
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
                                                    File <span className="text-muted">(pdf, doc, docx | maks 2MB)</span>
                                                </label>
                                                <input
                                                    type="file"
                                                    className={`form-control ${errors.file_name ? 'is-invalid' : ''}`}
                                                    onChange={(e) => setData('file_name', e.target.files[0])}
                                                />
                                                {errors.file_name && (
                                                    <div className="invalid-feedback">
                                                        {errors.file_name}
                                                    </div>
                                                )}
                                                {file?.file_name && (
                                                    <div className="mt-1">
                                                        <small className="text-muted">
                                                            File saat ini: {file.file_name}
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
                                            {processing ? 'Menyimpan...' : 'Simpan'}
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
