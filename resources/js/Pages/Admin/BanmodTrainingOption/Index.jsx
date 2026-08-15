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
    const [showAddModal, setShowAddModal] = useState(false);
    const [newValue, setNewValue] = useState("");
    const [newLabel, setNewLabel] = useState("");
    const [newOrder, setNewOrder] = useState("");
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const dt = $(tableRef.current).DataTable({
            processing: true,
            serverSide: true,
            responsive: true,
            ajax: {
                url: route("admin.banmod-options.index"),
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
                    data: "value",
                    name: "value",
                    width: "25%",
                },
                {
                    data: "label",
                    name: "label",
                    width: "25%",
                },
                {
                    data: "is_active",
                    name: "is_active",
                    width: "10%",
                    className: "text-center",
                    render: function (data) {
                        return data
                            ? `<span class="badge bg-success">Aktif</span>`
                            : `<span class="badge bg-secondary">Nonaktif</span>`;
                    },
                },
                {
                    data: "order",
                    name: "order",
                    width: "10%",
                    className: "text-center",
                },
                {
                    data: "action",
                    name: "action",
                    orderable: false,
                    searchable: false,
                    width: "15%",
                    className: "text-center",
                    render: function (data) {
                        return `
                            <button
                                onclick="toggleOption('${data.toggle_url}')"
                                class="btn btn-sm btn-info me-2"
                                data-bs-toggle="tooltip"
                                title="Aktif / Nonaktif">
                                <i class="bi bi-toggle-on"></i>
                            </button>
                            <button
                                onclick="deleteOption('${data.delete_url}')"
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

    const handleAddSubmit = (e) => {
        e.preventDefault();
        setErrors({});

        router.post(
            route("admin.banmod-options.store"),
            {
                value: newValue,
                label: newLabel,
                order: newOrder,
                is_active: 1,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setShowAddModal(false);
                    setNewValue("");
                    setNewLabel("");
                    setNewOrder("");
                    $(tableRef.current).DataTable().ajax.reload();
                },
                onError: (errs) => {
                    setErrors(errs || {});
                },
            }
        );
    };

    window.toggleOption = (url) => {
        router.post(
            url,
            {},
            {
                preserveScroll: true,
                onSuccess: () => {
                    $(tableRef.current).DataTable().ajax.reload();
                },
            }
        );
    };

    window.deleteOption = (url) => {
        if (!window.confirm("Apakah Anda yakin ingin menghapus opsi ini?")) {
            return;
        }

        router.delete(url, {
            preserveScroll: true,
            onSuccess: () => {
                $(tableRef.current).DataTable().ajax.reload();
            },
        });
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
                                    onClick={() => setShowAddModal(true)}
                                >
                                    <i className="bi bi-plus-lg me-1"></i>
                                    Tambah Opsi
                                </button>
                            </div>

                            <div className="card-body">
                                <div className="alert alert-info py-2 small">
                                    <i className="bi bi-info-circle me-1"></i>
                                    Opsi dengan status{" "}
                                    <strong>Aktif</strong> akan tampil di form
                                    pendaftaran Banmod. Nonaktifkan tanpa perlu
                                    build ulang aplikasi.
                                </div>

                                <div className="table-responsive">
                                    <table
                                        ref={tableRef}
                                        className="table table-sm table-striped table-hover"
                                    >
                                        <thead>
                                            <tr>
                                                <th>No</th>
                                                <th>VALUE</th>
                                                <th>NAMA PELATIHAN</th>
                                                <th>STATUS</th>
                                                <th>URUTAN</th>
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

            {showAddModal && (
                <div
                    className="modal fade show d-block"
                    style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
                    tabIndex="-1"
                    role="dialog"
                >
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <form onSubmit={handleAddSubmit}>
                                <div className="modal-header">
                                    <h5 className="modal-title">
                                        Tambah Opsi Pelatihan Banmod
                                    </h5>
                                    <button
                                        type="button"
                                        className="btn-close"
                                        onClick={() => setShowAddModal(false)}
                                    ></button>
                                </div>
                                <div className="modal-body">
                                    <div className="mb-3">
                                        <label className="form-label fw-bold">
                                            Value{" "}
                                            <span className="text-danger">
                                                *
                                            </span>
                                        </label>
                                        <input
                                            type="text"
                                            className={`form-control ${
                                                errors.value ? "is-invalid" : ""
                                            }`}
                                            value={newValue}
                                            onChange={(e) =>
                                                setNewValue(e.target.value)
                                            }
                                            placeholder="Contoh: Penjahit Pemula"
                                        />
                                        {errors.value && (
                                            <div className="invalid-feedback d-block">
                                                {errors.value}
                                            </div>
                                        )}
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label fw-bold">
                                            Label{" "}
                                            <span className="text-danger">
                                                *
                                            </span>
                                        </label>
                                        <input
                                            type="text"
                                            className={`form-control ${
                                                errors.label ? "is-invalid" : ""
                                            }`}
                                            value={newLabel}
                                            onChange={(e) =>
                                                setNewLabel(e.target.value)
                                            }
                                            placeholder="Contoh: Penjahit Pemula"
                                        />
                                        {errors.label && (
                                            <div className="invalid-feedback d-block">
                                                {errors.label}
                                            </div>
                                        )}
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label fw-bold">
                                            Urutan (opsional)
                                        </label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            value={newOrder}
                                            onChange={(e) =>
                                                setNewOrder(e.target.value)
                                            }
                                            min="0"
                                        />
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={() => setShowAddModal(false)}
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
