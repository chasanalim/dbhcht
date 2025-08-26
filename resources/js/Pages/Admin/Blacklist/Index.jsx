import AdminLayout from "@/Layouts/admin/AdminLayout";
import { Head, Link, router } from "@inertiajs/react";
import { useEffect, useRef, useState } from "react";
import $ from "jquery";
import "datatables.net-bs5";
import "datatables.net-bs5/css/dataTables.bootstrap5.min.css";
import { Toast, Tooltip } from "bootstrap";
// Import bootstrap JS
import "bootstrap/dist/js/bootstrap.bundle.min.js";

export default function Index({ title, flash }) {
    const tableRef = useRef();

    useEffect(() => {
        const dt = $(tableRef.current).DataTable({
            processing: true,
            serverSide: true,
            responsive: true,
            ajax: {
                url: route("admin.blacklist"),
                type: "GET",
                error: function (xhr, error, thrown) {
                    console.error("DataTables Error:", {
                        xhr: xhr,
                        error: error,
                        thrown: thrown,
                    });
                    // Show error message to user
                    alert(
                        "Terjadi kesalahan saat memuat data. Silakan coba lagi."
                    );
                },
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
                    className: "text-center",
                },
                {
                    data: "nik",
                    name: "nik",
                    orderable: true,
                    searchable: true,
                },
                {
                    data: "no_kk",
                    name: "no_kk",
                },
                {
                    data: "nama",
                    name: "nama",
                },
                // {
                //     data: "tmp_lhr",
                //     name: "tmp_lhr",
                // },
                // {
                //     data: "tgl_lhr",
                //     name: "tgl_lhr",
                // },
                {
                    data: "alamat",
                    name: "alamat",
                },
                {
                    data: "kecamatan",
                    name: "kecamatan",
                },
                {
                    data: "kelurahan",
                    name: "kelurahan",
                },
                {
                    data: "jenis_pelatihan",
                    name: "jenis_pelatihan",
                },
                // {
                //     data: "nama_rt",
                //     name: "nama_rt",
                // },
                // {
                //     data: "phone_number",
                //     name: "phone_number",
                // },
                {
                    data: "status",
                    name: "status",
                    className: "text-center",
                    searchable: true,
                    render: function (data) {
                        return `<span clasaName="badge bg-warning">Blacklist</span>`;
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
    const handleExport = (type) => {
        const url = route("admin.export.blacklist", {
            ext: type,
        });
        window.open(url, "_blank");
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
                            </div>
                            <div className="row g-3 p-3">
                                <div className="col-auto ms-auto">
                                    <button
                                        className="btn btn-sm btn-success me-2"
                                        onClick={() => handleExport("excel")}
                                    >
                                        <i className="bi bi-file-excel me-1"></i>{" "}
                                        Export Excel
                                    </button>
                                    <button
                                        className="btn btn-sm btn-danger me-2"
                                        onClick={() => handleExport("pdf")}
                                    >
                                        <i className="bi bi-file-pdf me-1"></i>{" "}
                                        Export PDF
                                    </button>
                                </div>
                            </div>
                            <div className="card-body">
                                <div className="table-responsive">
                                    <table
                                        ref={tableRef}
                                        className="table table-sm table-striped table-hover"
                                    >
                                        <thead>
                                            <tr>
                                                <th>No</th>
                                                <th>NIK</th>
                                                <th>NO KK</th>
                                                <th>NAMA</th>
                                                {/* <th>TEMPAT LAHIR</th> */}
                                                {/* <th>TGL LAHIR</th> */}
                                                {/* <th>JENIS KELAMIN</th> */}
                                                <th>ALAMAT</th>
                                                <th>KECAMATAN</th>
                                                <th>KELURAHAN</th>
                                                <th>JENIS PELATIHAN</th>

                                                <th>STATUS</th>
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
        </AdminLayout>
    );
}
