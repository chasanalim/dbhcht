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
                url: route("admin.banmod-lama"),
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
                    data: "nik",
                    name: "nik",
                    orderable: true,
                    searchable: true,
                },
                {
                    data: "no_kk",
                    name: "no_kk",
                    orderable: true,
                    searchable: true,
                },
                {
                    data: "nama_lengkap",
                    name: "nama_lengkap",
                },
                {
                    data: "jenis_kelamin",
                    name: "jenis_kelamin",
                    render: function (data) {
                        return data === "P"
                            ? 'PEREMPUAN'
                            : 'LAKI-LAKI';
                    },
                },
                {
                    data: "kecamatan_ktp",
                    name: "kecamatan_ktp",
                },
                {
                    data: "kelurahan_ktp",
                    name: "kelurahan_ktp",
                },
                {
                    data: "rt",
                    name: "rt",
                },
                {
                    data: "rw",
                    name: "rw",
                },
                {
                    data: "alamat_ktp",
                    name: "alamat_ktp",
                },
                {
                    data: "tahun_dapat_bantuan",
                    name: "tahun_dapat_bantuan",
                },
                {
                    data: "jenis_usaha",
                    name: "jenis_usaha",
                    width: "40%",
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
                                        className="table table-sm table-striped table-hover"
                                    >
                                        <thead>
                                            <tr>
                                                <th>No</th>
                                                <th>NIK</th>
                                                <th>NO KK</th>
                                                <th>NAMA LENGKAP</th>
                                                <th>JK</th>
                                                <th>KECAMATAN</th>
                                                <th>KELURAHAN</th>
                                                <th>RT</th>
                                                <th>RW</th>
                                                <th>ALAMAT</th>
                                                <th>TAHUN DAPAT BANTUAN</th>
                                                <th>JENIS USAHA</th>
                                            </tr>
                                        </thead>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


        </AdminLayout>
    );
}
