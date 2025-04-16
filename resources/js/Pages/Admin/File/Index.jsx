import AdminLayout from "@/Layouts/admin/AdminLayout";
import { Head, Link, router } from "@inertiajs/react";
import { useEffect, useRef } from "react";
import $ from "jquery";
import "datatables.net-bs5";
import "datatables.net-bs5/css/dataTables.bootstrap5.min.css";
import { Toast, Tooltip } from "bootstrap";
// Import bootstrap JS
import "bootstrap/dist/js/bootstrap.bundle.min.js";

export default function Index({ title, can, flash }) {
    const tableRef = useRef();

    useEffect(() => {
        const dt = $(tableRef.current).DataTable({
            processing: true,
            serverSide: true,
            responsive: true,
            ajax: {
                url: route("admin.downloads.index"),
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
                    orderable: true,
                    searchable: true,
                    width: "20%",
                },
                {
                    data: "deskripsi",
                    name: "deskripsi",
                    width: "30%",
                },
                {
                    data: "file_download",
                    name: "file_download",
                    width: "10%",
                    className: "text-center",
                    render: function (url) {
                        return `
                            <a href="${url}"
                               class="btn btn-primary btn-sm"
                               target="_blank"
                               data-bs-toggle="tooltip"
                               title="Download File">
                                <i class="bi bi-file-earmark-text"></i>
                            </a>
                        `;
                    },
                },
                {
                    data: "kategori",
                    name: "kategori",
                    width: "15%",
                    render: function (data) {
                        return data === "banmod"
                            ? '<span class="badge bg-info">Bantuan Modal</span>'
                            : '<span class="badge bg-success">Pelatihan</span>';
                    },
                },
                {
                    data: "action",
                    name: "action",
                    orderable: false,
                    searchable: false,
                    width: "20%",
                    className: "text-center",
                    render: function (data) {
                        let buttons = "";

                        // if (can.edit) {
                        buttons += `
                                <button
                                    onclick="window.location.href='${data.edit_url}'"
                                    class="btn btn-warning btn-sm me-2"
                                    data-bs-toggle="tooltip"
                                    title="Edit Data">
                                    <i class="bi bi-pencil-square"></i>
                                </button>`;
                        // }

                        // if (can.delete) {
                        buttons += `
                                <button
                                    onclick="deleteItem('${data.delete_url}')"
                                    class="btn btn-danger btn-sm"
                                    data-bs-toggle="tooltip"
                                    title="Hapus Data">
                                    <i class="bi bi-trash"></i>
                                </button>`;
                        // }

                        return buttons;
                    },
                },
            ],
            drawCallback: function () {
                // Initialize tooltips
                const tooltips = document.querySelectorAll(
                    '[data-bs-toggle="tooltip"]'
                );
                tooltips.forEach((tooltipNode) => {
                    new Tooltip(tooltipNode);
                });
            },
        });

        // Handle flash messages
        if (flash?.message) {
            const toastEl = document.getElementById("toast");
            if (toastEl) {
                const toast = new Toast(toastEl);
                toast.show();
            }
        }

        return () => {
            dt.destroy();
            // Dispose tooltips
            const tooltips = document.querySelectorAll(
                '[data-bs-toggle="tooltip"]'
            );
            tooltips.forEach((tooltipNode) => {
                const tooltip = Tooltip.getInstance(tooltipNode);
                if (tooltip) {
                    tooltip.dispose();
                }
            });
        };
    }, [flash]);

    const deleteItem = (url) => {
        if (confirm("Apakah anda yakin ingin menghapus data ini?")) {
            router.delete(url, {
                onSuccess: () => {
                    $(tableRef.current).DataTable().ajax.reload();
                },
            });
        }
    };

    window.deleteItem = deleteItem;

    return (
        <AdminLayout>
            <Head title={title} />

            <div className="container-fluid py-4">
                <div className="row">
                    <div className="col-12">
                        <div className="card">
                            <div className="card-header pb-0 d-flex justify-content-between align-items-center">
                                <h5 className="mb-0 fw-bold">{title}</h5>
                                {/* {can.create && ( */}
                                <Link
                                    href={route("admin.downloads.create")}
                                    className="btn btn-primary mb-3"
                                >
                                    <i className="bi bi-plus-circle me-2"></i>
                                    Tambah Lampiran
                                </Link>
                                {/* )} */}
                            </div>
                            <div className="card-body">
                                <div className="table-responsive">
                                    <table
                                        ref={tableRef}
                                        className="table table-striped table-hover"
                                    >
                                        <thead>
                                            <tr>
                                                <th>No</th>
                                                <th>Nama File</th>
                                                <th>Deskripsi</th>
                                                <th>File</th>
                                                <th>Kategori</th>
                                                <th>Aksi</th>
                                            </tr>
                                        </thead>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Toast Notification */}
            {flash.message && (
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
                            <div className="toast-body">{flash.message}</div>
                            <button
                                type="button"
                                className="btn-close btn-close-white me-2 m-auto"
                                data-bs-dismiss="toast"
                                aria-label="Close"
                            ></button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
