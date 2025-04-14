import AdminLayout from "@/Layouts/admin/AdminLayout";
import { Head, useForm } from "@inertiajs/react";

export default function Create({ title }) {
    const { data, setData, post, processing, errors, progress } = useForm({
        nama: "",
        deskripsi: "",
        file: null,
        kategori: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("lampirans.store"));
    };

    return (
        <AdminLayout>
            <Head title={title} />

            <div className="container-fluid py-4">
                <div className="row">
                    <div className="col-12">
                        <div className="card">
                            <div className="card-body">
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <label className="form-label">Nama</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={data.nama}
                                            onChange={(e) =>
                                                setData("nama", e.target.value)
                                            }
                                        />
                                        {errors.nama && (
                                            <div className="text-danger">
                                                {errors.nama}
                                            </div>
                                        )}
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">
                                            Deskripsi
                                        </label>
                                        <textarea
                                            className="form-control"
                                            value={data.deskripsi}
                                            onChange={(e) =>
                                                setData("deskripsi", e.target.value)
                                            }
                                        />
                                        {errors.deskripsi && (
                                            <div className="text-danger">
                                                {errors.deskripsi}
                                            </div>
                                        )}
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">File</label>
                                        <input
                                            type="file"
                                            className="form-control"
                                            onChange={(e) =>
                                                setData("file", e.target.files[0])
                                            }
                                        />
                                        {errors.file && (
                                            <div className="text-danger">
                                                {errors.file}
                                            </div>
                                        )}
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">
                                            Kategori
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={data.kategori}
                                            onChange={(e) =>
                                                setData("kategori", e.target.value)
                                            }
                                        />
                                        {errors.kategori && (
                                            <div className="text-danger">
                                                {errors.kategori}
                                            </div>
                                        )}
                                    </div>

                                    {progress && (
                                        <div className="progress mb-3">
                                            <div
                                                className="progress-bar"
                                                role="progressbar"
                                                style={{ width: `${progress}%` }}
                                                aria-valuenow={progress}
                                                aria-valuemin="0"
                                                aria-valuemax="100"
                                            >
                                                {progress}%
                                            </div>
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="btn btn-primary"
                                    >
                                        Simpan
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
