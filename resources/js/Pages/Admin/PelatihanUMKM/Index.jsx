import AdminLayout from "@/Layouts/admin/AdminLayout";
import { Head, Link, router } from "@inertiajs/react";
import { useEffect, useRef, useState } from "react";
import $ from "jquery";
import "datatables.net-bs5";
import "datatables.net-bs5/css/dataTables.bootstrap5.min.css";
import { Toast, Tooltip } from "bootstrap";
// Import bootstrap JS
import "bootstrap/dist/js/bootstrap.bundle.min.js";

export default function Index({ title, can, flash, pelatihan }) {
    const tableRef = useRef();

    const [selectedPelatihan1, setSelectedPelatihan1] =
        useState("Semua Pelatihan");
    const [selectedPelatihan2, setSelectedPelatihan2] =
        useState("Semua Pelatihan");
    const [selectedPelatihan3, setSelectedPelatihan3] =
        useState("Semua Pelatihan");
    const [disabledFilters, setDisabledFilters] = useState({
        prioritas_1: false,
        prioritas_2: false,
        prioritas_3: false,
    });

    const [verificationFilter, setVerificationFilter] = useState("all");
    const handlePelatihan1Change = (e) => {
        const value = e.target.value;
        setSelectedPelatihan1(value);

        if (value !== "Semua Pelatihan") {
            setDisabledFilters({
                prioritas_1: false,
                prioritas_2: true,
                prioritas_3: true,
            });
            // Reset other filters when this one is selected
            setSelectedPelatihan2("Semua Pelatihan");
            setSelectedPelatihan3("Semua Pelatihan");
        } else {
            setDisabledFilters({
                prioritas_1: false,
                prioritas_2: false,
                prioritas_3: false,
            });
        }
    };

    const handlePelatihan2Change = (e) => {
        const value = e.target.value;
        setSelectedPelatihan2(value);

        if (value !== "Semua Pelatihan") {
            setDisabledFilters({
                prioritas_1: true,
                prioritas_2: false,
                prioritas_3: true,
            });
            // Reset other filters when this one is selected
            setSelectedPelatihan1("Semua Pelatihan");
            setSelectedPelatihan3("Semua Pelatihan");
        } else {
            setDisabledFilters({
                prioritas_1: false,
                prioritas_2: false,
                prioritas_3: false,
            });
        }
    };

    const handlePelatihan3Change = (e) => {
        const value = e.target.value;
        setSelectedPelatihan3(value);

        if (value !== "Semua Pelatihan") {
            setDisabledFilters({
                prioritas_1: true,
                prioritas_2: true,
                prioritas_3: false,
            });
            // Reset other filters when this one is selected
            setSelectedPelatihan1("Semua Pelatihan");
            setSelectedPelatihan2("Semua Pelatihan");
        } else {
            setDisabledFilters({
                prioritas_1: false,
                prioritas_2: false,
                prioritas_3: false,
            });
        }
    };

    const handleVerificationFilterChange = (e) => {
        setVerificationFilter(e.target.value);
    };

    useEffect(() => {
        const dt = $(tableRef.current).DataTable({
            processing: true,
            serverSide: true,
            responsive: true,
            ajax: {
                url: route("admin.umkm.index"),
                type: "GET",
                data: function (d) {
                    d.prioritas_1 = selectedPelatihan1;
                    d.prioritas_2 = selectedPelatihan2;
                    d.prioritas_3 = selectedPelatihan3;
                    d.verification_status = verificationFilter;
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
                    data: "action",
                    name: "action",
                    orderable: false,
                    searchable: false,
                    width: "10%",
                    className: "text-center",
                    render: function (data) {
                        let buttons = [];

                        // if (can.edit) {
                        // buttons.push(`
                        //         <a href="${data.edit_url}" class="btn btn-sm btn-warning" title="Edit">
                        //             <i class="bi bi-pencil-square"></i>
                        //         </a>
                        //     `);
                        // }

                        // if (can.delete) {
                        // buttons.push(`
                        //         <a href="javascript:void(0)"
                        //            onclick="deleteItem('${data.delete_url}')"
                        //            class="btn btn-sm btn-danger"
                        //            title="Hapus">
                        //             <i class="bi bi-trash"></i>
                        //         </a>
                        //     `);
                        // }

                        buttons.push(`
                            <a href="${data.detail_url}" class="btn btn-sm btn-info" title="Detail">
                                <i class="bi bi-eye"></i>
                            </a>
                        `);

                        return `<div class="btn-group">${buttons.join(
                            ""
                        )}</div>`;
                    },
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
                    data: "nama_lengkap",
                    name: "nama_lengkap",
                },
                {
                    data: "tempat_lahir",
                    name: "tempat_lahir",
                },
                {
                    data: "tgl_lahir",
                    name: "tgl_lahir",
                },
                {
                    data: "jalan",
                    name: "jalan",
                },
                {
                    data: "kecamatan",
                    name: "kecamatan",
                },
                // {
                //     data: "kelurahan",
                //     name: "kelurahan",
                // },
                // {
                //     data: "rw",
                //     name: "rw",
                // },
                // {
                //     data: "rt",
                //     name: "rt",
                // },

                {
                    data: "no_hp",
                    name: "no_hp",
                },
                {
                    data: "prioritas_1",
                    name: "prioritas_1",
                },
                {
                    data: "prioritas_2",
                    name: "prioritas_2",
                },
                {
                    data: "prioritas_3",
                    name: "prioritas_3",
                },
                {
                    data: "skor",
                    name: "skor",
                    className: "text-center",
                    render: function (data) {
                        return `<span class="badge bg-success p-2">${parseFloat(
                            data
                        ).toFixed(2)}</span>`;
                    },
                },
                {
                    data: "verifikasi_dokumen",
                    name: "verifikasi_dokumen",
                    className: "text-center",
                    searchable: true,
                    render: function (data) {
                        const allVerified = data?.all_verified || false;
                        const allApproved = data?.all_approved || false;

                        if (allVerified && allApproved) {
                            return `<span class="badge bg-success">Terverifikasi</span>`;
                        } else if (allVerified && !allApproved) {
                            return `<span class="badge bg-danger">Tidak Memenuhi Syarat</span>`;
                        }
                        return `<span class="badge bg-warning">Belum diverifikasi</span>`;
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
    }, [
        flash,
        selectedPelatihan1,
        selectedPelatihan2,
        selectedPelatihan3,
        verificationFilter,
    ]);

    const handleExport = (type) => {
        const url = route("admin.export.umkm", {
            verification_status: verificationFilter,
            prioritas_1: selectedPelatihan1,
            prioritas_2: selectedPelatihan2,
            prioritas_3: selectedPelatihan3,
            ext: type,
        });
        window.open(url, "_blank");
    };

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
                                <h5 className="my-2 fw-bold">{title} 2025</h5>
                            </div>

                            <div className="row g-3 p-3">
                                <div className="col-12 col-md-6 col-xl-3">
                                    <div className="d-flex flex-column">
                                        <label className="form-label fw-bold">
                                            Prioritas 1:
                                        </label>
                                        <select
                                            className={`form-select form-select-sm ${
                                                disabledFilters.prioritas_1
                                                    ? "bg-light"
                                                    : ""
                                            }`}
                                            value={selectedPelatihan1}
                                            onChange={handlePelatihan1Change}
                                            disabled={
                                                disabledFilters.prioritas_1
                                            }
                                        >
                                            {pelatihan.map((item) => (
                                                <option
                                                    key={item.name}
                                                    value={item.name}
                                                >
                                                    {item.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="col-12 col-md-6 col-xl-3">
                                    <div className="d-flex flex-column">
                                        <label className="form-label fw-bold">
                                            Prioritas 2:
                                        </label>
                                        <select
                                            className={`form-select form-select-sm ${
                                                disabledFilters.prioritas_2
                                                    ? "bg-light"
                                                    : ""
                                            }`}
                                            value={selectedPelatihan2}
                                            onChange={handlePelatihan2Change}
                                            disabled={
                                                disabledFilters.prioritas_2
                                            }
                                        >
                                            {pelatihan.map((item) => (
                                                <option
                                                    key={item.name}
                                                    value={item.name}
                                                >
                                                    {item.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="col-12 col-md-6 col-xl-3">
                                    <div className="d-flex flex-column">
                                        <label className="form-label fw-bold">
                                            Prioritas 3:
                                        </label>
                                        <select
                                            className={`form-select form-select-sm ${
                                                disabledFilters.prioritas_3
                                                    ? "bg-light"
                                                    : ""
                                            }`}
                                            value={selectedPelatihan3}
                                            onChange={handlePelatihan3Change}
                                            disabled={
                                                disabledFilters.prioritas_3
                                            }
                                        >
                                            {pelatihan.map((item) => (
                                                <option
                                                    key={item.name}
                                                    value={item.name}
                                                >
                                                    {item.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="col-12 col-md-6 col-xl-3">
                                    <div className="d-flex flex-column">
                                        <label className="form-label fw-bold">
                                            Status Verifikasi:
                                        </label>
                                        <select
                                            className="form-select form-select-sm"
                                            value={verificationFilter}
                                            onChange={
                                                handleVerificationFilterChange
                                            }
                                        >
                                            <option value="all">
                                                Semua Status
                                            </option>
                                            <option value="verified">
                                                Terverifikasi
                                            </option>
                                            <option value="rejected">
                                                Tidak Memenuhi Syarat
                                            </option>
                                            <option value="pending">
                                                Belum diverifikasi
                                            </option>
                                        </select>
                                    </div>
                                </div>
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
                                                <th>AKSI</th>
                                                <th>NIK</th>
                                                <th>NO KK</th>
                                                <th>NAMA</th>
                                                <th>TEMPAT LAHIR</th>
                                                <th>TGL LAHIR</th>
                                                <th>ALAMAT</th>
                                                <th>KECAMATAN</th>

                                                <th>NO HP</th>
                                                <th>PRIORITAS 1</th>
                                                <th>PRIORITAS 2</th>
                                                <th>PRIORITAS 3</th>
                                                <th>SKOR</th>
                                                <th>VERIFIKASI DOKUMEN</th>
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
