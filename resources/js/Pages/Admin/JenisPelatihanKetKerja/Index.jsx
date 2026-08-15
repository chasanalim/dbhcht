import AdminLayout from "@/Layouts/admin/AdminLayout";
import { Head, router } from "@inertiajs/react";
import { useEffect, useRef, useState } from "react";
import $ from "jquery";
import "datatables.net-bs5";
import "datatables.net-bs5/css/dataTables.bootstrap5.min.css";
import { Toast, Tooltip } from "bootstrap";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

export default function Index({ title, flash }) {
    const tableRef = useRef();
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [nama, setNama] = useState("");
    const [pendidikan, setPendidikan] = useState("");
    const [usia, setUsia] = useState("");
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const dt = $(tableRef.current).DataTable({
            processing: true,
            serverSide: true,
            responsive: true,
            ajax: {
                url: route("admin.jenis-keterampilan.index"),
                type: "GET",
                headers: {
                    "X-Requested-With": "XMLHttpRequest",
                },
            },
            columns: [
                {
                    data: "DT_RowIndex",
                    name: "DT_RowIndex",
                    orderable: false,
                    searchable: false,
                    width: "5%",
                    className: "text-center",
                },
                {
                    data: "nama",
                    name: "nama",
                    width: "40%",
                },
                {
                    data: "pendidikan",
                    name: "pendidikan",
                    width: "20%",
                    className: "text-center",
                },
                {
                    data: "usia",
                    name: "usia",
                    width: "20%",
                    className: "text-center",
                },
                {
                    data: "action",
                    name: "action",
                    orderable: false,
                    searchable: false,
                    width: "15%",
                    className: "text-center",
                    render: function (data, type, row) {
                        return `
                            <button
                                onclick="editItem(${row.id}, '${row.nama.replace(
                                    /'/g,
                                    "\\'"
                                )}', ${row.pendidikan}, ${row.usia}, '${
                                    data.update_url
                                }')"
                                class="btn btn-sm btn-warning me-2"
                                data-bs-toggle="tooltip"
                                title="Edit Data">
                                <i class="bi bi-pencil-square"></i>
                            </button>
                            <button
                                onclick="deleteItem('${data.delete_url}')"
                                class="btn btn-sm btn-danger"
                                data-bs-toggle="tooltip"
                                title="Hapus Data">
                                <i class="bi bi-trash"></i>
                            </button>
                        `;
                    },
                },
            ],
            drawCallback: function () {
                const tooltips = document.querySelectorAll(
                    '[data-bs-toggle="tooltip"]'
                );
                tooltips.forEach((tooltipNode) => {
                    new Tooltip(tooltipNode);
                });
            },
        });

        if (flash?.message) {
            const toastEl = document.getElementById("toast");
            if (toastEl) {
                const toast = new Toast(toastEl);
                toast.show();
            }
        }

        return () => {
            dt.destroy();
        };
    }, [flash]);

    const openAdd = () => {
        setEditingId(null);
        setNama("");
        setPendidikan("");
        setUsia("");
        setErrors({});
        setShowModal(true);
    };

    window.editItem = (id, name, pendidikan, usia, updateUrl) => {
        setEditingId({ id, updateUrl });
        setNama(name);
        setPendidikan(pendidikan);
        setUsia(usia);
        setErrors({});
        setShowModal(true);
    };

    window.deleteItem = (url) => {
        if (!window.confirm("Apakah Anda yakin ingin menghapus data ini?")) {
            return;
        }

        router.delete(url, {
            preserveScroll: true,
            onSuccess: () => {
                $(tableRef.current).DataTable().ajax.reload();
            },
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrors({});

        const payload = { nama, pendidikan, usia };

        if (editingId) {
            router.put(editingId.updateUrl, payload, {
                preserveScroll: true,
                onSuccess: () => {
                    setShowModal(false);
                    setEditingId(null);
                    $(tableRef.current).DataTable().ajax.reload();
                },
                onError: (errs) => setErrors(errs || {}),
            });
        } else {
            router.post(
                route("admin.jenis-keterampilan.store"),
                payload,
                {
                    preserveScroll: true,
                    onSuccess: () => {
                        setShowModal(false);
                        $(tableRef.current).DataTable().ajax.reload();
                    },
                    onError: (errs) => setErrors(errs || {}),
                }
            );
        }
    };

    return (
        <AdminLayout>
            <Head title={title} />

            <div className="container-fluid py-4">
                <div className="row">
                    <div className="col-12">
                        <div className="card">
                            <div className="card-header pb-0 d-flex justify-content-between align-items-center">
                                <h5 className="my-2 fw-bold">{title}</h5>
                                <button
                                    type="button"
                                    className="btn btn-primary btn-sm"
                                    onClick={openAdd}
                                >
                                    <i className="bi bi-plus-lg me-1"></i>
                                    Tambah
                                </button>
                            </div>

                            <div className="card-body">
                                <div className="alert alert-info py-2 small">
                                    <i className="bi bi-info-circle me-1"></i>
                                    Data ini dipakai di form pendaftaran
                                    Pelatihan Keterampilan (Pencari Kerja).
                                    Kolom pendidikan &amp; usia digunakan untuk
                                    filter kelayakan saat pendaftaran.
                                </div>

                                <div className="table-responsive">
                                    <table
                                        ref={tableRef}
                                        className="table table-sm table-striped table-hover"
                                    >
                                        <thead>
                                            <tr>
                                                <th>No</th>
                                                <th>NAMA PELATIHAN</th>
                                                <th>PENDIDIKAN</th>
                                                <th>USIA</th>
                                                <th>AKSI</th>
                                            </tr>
                                        </thead>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {showModal && (
                <div
                    className="modal fade show d-block"
                    style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
                    tabIndex="-1"
                    role="dialog"
                >
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <form onSubmit={handleSubmit}>
                                <div className="modal-header">
                                    <h5 className="modal-title">
                                        {editingId ? "Edit" : "Tambah"} Jenis
                                        Pelatihan
                                    </h5>
                                    <button
                                        type="button"
                                        className="btn-close"
                                        onClick={() => setShowModal(false)}
                                    ></button>
                                </div>
                                <div className="modal-body">
                                    <div className="mb-3">
                                        <label className="form-label fw-bold">
                                            Nama Pelatihan{" "}
                                            <span className="text-danger">
                                                *
                                            </span>
                                        </label>
                                        <input
                                            type="text"
                                            className={`form-control ${
                                                errors.nama ? "is-invalid" : ""
                                            }`}
                                            value={nama}
                                            onChange={(e) =>
                                                setNama(e.target.value)
                                            }
                                        />
                                        {errors.nama && (
                                            <div className="invalid-feedback d-block">
                                                {errors.nama}
                                            </div>
                                        )}
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label fw-bold">
                                            Pendidikan (tingkat){" "}
                                            <span className="text-danger">
                                                *
                                            </span>
                                        </label>
                                        <input
                                            type="number"
                                            className={`form-control ${
                                                errors.pendidikan
                                                    ? "is-invalid"
                                                    : ""
                                            }`}
                                            value={pendidikan}
                                            onChange={(e) =>
                                                setPendidikan(e.target.value)
                                            }
                                            min="0"
                                        />
                                        {errors.pendidikan && (
                                            <div className="invalid-feedback d-block">
                                                {errors.pendidikan}
                                            </div>
                                        )}
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label fw-bold">
                                            Usia Maksimal{" "}
                                            <span className="text-danger">
                                                *
                                            </span>
                                        </label>
                                        <input
                                            type="number"
                                            className={`form-control ${
                                                errors.usia ? "is-invalid" : ""
                                            }`}
                                            value={usia}
                                            onChange={(e) =>
                                                setUsia(e.target.value)
                                            }
                                            min="0"
                                        />
                                        {errors.usia && (
                                            <div className="invalid-feedback d-block">
                                                {errors.usia}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={() => setShowModal(false)}
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                    >
                                        Simpan
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            <div
                className="position-fixed top-0 end-0 p-3"
                style={{ zIndex: 5 }}
            >
                <div
                    id="toast"
                    className="toast align-items-center text-white bg-success border-0"
                    role="alert"
                    aria-live="assertive"
                    aria-atomic="true"
                >
                    <div className="d-flex">
                        <div className="toast-body">{flash?.message}</div>
                        <button
                            type="button"
                            className="btn-close btn-close-white me-2 m-auto"
                            data-bs-dismiss="toast"
                            aria-label="Close"
                        ></button>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
