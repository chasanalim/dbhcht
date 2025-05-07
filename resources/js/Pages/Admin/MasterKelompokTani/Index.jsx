import AdminLayout from "@/Layouts/admin/AdminLayout";
import { Head, Link, router } from "@inertiajs/react";
import { useEffect, useRef } from "react";
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
                url: route("admin.kelompoktani.index"),
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
                    className: "text-center",
                },
                {
                    data: "action",
                    name: "action",
                    orderable: false,
                    searchable: false,
                    width: "10%",
                    className: "text-center",
                    render: function (data) {
                        let buttons = `
                <button
                    onclick="window.location.href='${data.edit_url}'"
                    class="btn btn-warning btn-sm me-2"
                    data-bs-toggle="tooltip"
                    title="Edit Data">
                    <i class="bi bi-pencil-square"></i>
                </button>`;
                        return buttons;
                    },
                },
                {
                    data: "kecamatan",
                    name: "kecamatan",
                    orderable: true,
                    searchable: true,
                },
                {
                    data: "kelurahan",
                    name: "kelurahan",
                    orderable: true,
                    searchable: true,
                },
                {
                    data: "nama_kelompok",
                    name: "nama_kelompok",
                    orderable: true,
                    searchable: true,
                },
                {
                    data: "no_register",
                    name: "no_register",
                    orderable: true,
                    searchable: true,
                },
                {
                    data: "nik_ketua",
                    name: "nik_ketua",
                    orderable: true,
                    searchable: true,
                },
                {
                    data: "nama_ketua",
                    name: "nama_ketua",
                    orderable: true,
                    searchable: true,
                },
                {
                    data: "nik_anggota",
                    name: "nik_anggota",
                    orderable: true,
                    searchable: true,
                },
                {
                    data: "nama_anggota",
                    name: "nama_anggota",
                    orderable: true,
                    searchable: true,
                },
                {
                    data: "tahun_berdiri",
                    name: "tahun_berdiri",
                    orderable: true,
                    searchable: true,
                },
                {
                    data: "tingkat_kemampuan",
                    name: "tingkat_kemampuan",
                    orderable: true,
                    searchable: true,
                },
                {
                    data: "keterangan",
                    name: "keterangan",
                    orderable: true,
                    searchable: true,
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

    return (
        <AdminLayout>
            <Head title={title} />

            <div className="container-fluid py-4">
                <div className="row">
                    <div className="col-12">
                        <div className="card">
                            <div className="card-header pb-0 d-flex justify-content-between align-items-center">
                                <h5 className="mb-2 fw-bold">{title}</h5>
                            </div>
                            <div className="card-body">
                                <div className="table-responsive">
                                    <table
                                        ref={tableRef}
                                        className="table table-sm table-hover"
                                    >
                                        <thead>
                                            <tr>
                                                <th>No</th>
                                                <th>Aksi</th>
                                                <th>Kecamatan</th>
                                                <th>Kelurahan</th>
                                                <th>Nama Kelompok</th>
                                                <th>No Register</th>
                                                <th>NIK Ketua</th>
                                                <th>Nama Ketua</th>
                                                <th>NIK Anggota</th>
                                                <th>Nama Anggota</th>
                                                <th>Tahun Berdiri</th>
                                                <th>Tingkat Kemampuan</th>
                                                <th>Keterangan</th>
                                            </tr>
                                        </thead>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

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
