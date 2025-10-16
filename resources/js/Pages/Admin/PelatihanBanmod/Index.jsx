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
    const [selectedCategory, setSelectedCategory] = useState("Semua Pelatihan");
    const [verificationFilter, setVerificationFilter] = useState("all");
    const [selectedStatus, setSelectedStatus] = useState("all");

    const handleCategoryChange = (e) => {
        setSelectedCategory(e.target.value);
    };
    const handleVerificationFilterChange = (e) => {
        setVerificationFilter(e.target.value);
    };

    const handleStatusChange = (e) => {
        setSelectedStatus(e.target.value);
    };

    useEffect(() => {
        const dt = $(tableRef.current).DataTable({
            processing: true,
            serverSide: true,
            responsive: true,
            ajax: {
                url: route("admin.pelatihan-banmod.index"),
                type: "GET",
                data: function (d) {
                    d.jenis_pelatihan_industri = selectedCategory;
                    d.verification_status = verificationFilter;
                    d.status = selectedStatus;
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
                    width: "3%",
                    className: "text-center",
                    render: function (data, type, row) {
                        let buttons = [];

                        // Add view button
                        buttons.push(`
                            <a href="${data.detail_url}" class="btn btn-sm btn-info me-1" title="Detail">
                                <i class="bi bi-eye"></i>
                            </a>
                        `);

                        // Add status buttons if document is verified
                        if (row.status == 0) {
                            // If status is 0, show both Lolos and Gagal buttons
                            if (
                                row.verifikasi_dokumen.all_verified &&
                                row.verifikasi_dokumen.all_approved
                            ) {
                                buttons.push(`
                                    <button onclick="updateStatus('${data.status_url}', 1)" class="btn btn-sm btn-success me-1" title="Lolos">
                                        <i class="bi bi-check-lg"></i>
                                    </button>
                                `);

                                buttons.push(`
                                    <button onclick="updateStatus('${data.status_url}', 2)" class="btn btn-sm btn-danger" title="Gagal">
                                        <i class="bi bi-x-lg"></i>
                                    </button>
                                `);
                            }
                        } else if (row.status == 1) {
                            // If status is 1, hide the Lolos button, only show the Gagal button
                            if (
                                row.verifikasi_dokumen.all_verified &&
                                row.verifikasi_dokumen.all_approved
                            ) {
                                // buttons.push(`
                                //     <button onclick="updateStatus('${data.status_url}', 2)" class="btn btn-sm btn-danger me-1" title="Gagal">
                                //         <i class="bi bi-x-lg"></i>
                                //     </button>
                                // `);
                                buttons.push(`
                                    <button onclick="updateStatus('${data.status_url}', 3)" class="btn btn-sm btn-dark" title="Blacklist">
                                        <i class="bi bi-file-x"></i>
                                    </button>
                                `);
                            }
                        }
                        // else if (row.status == 2) {
                        //     // If status is 2, hide the Gagal button, only show the Lolos button
                        //     if (
                        //         row.verifikasi_dokumen.all_verified &&
                        //         row.verifikasi_dokumen.all_approved
                        //     ) {
                        //         buttons.push(`
                        //             <button onclick="updateStatus('${data.status_url}', 1)" class="btn btn-sm btn-success me-1" title="Lolos">
                        //                 <i class="bi bi-check-lg"></i>
                        //             </button>
                        //         `);
                        //     }
                        // }

                        return `<div class="btn-group">${buttons.join(
                            ""
                        )}</div>`;
                    },
                },
                {
                    data: "tahun_penerimaan",
                    name: "tahun_penerimaan",
                    orderable: true,
                    searchable: true,
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
                    data: "jalan_ktp",
                    name: "jalan_ktp",
                },
                {
                    data: "rt_ktp",
                    name: "rt_ktp",
                },
                {
                    data: "rw_ktp",
                    name: "rw_ktp",
                },
                {
                    data: "kelurahan_ktp",
                    name: "kelurahan_ktp",
                },
                {
                    data: "kecamatan_ktp",
                    name: "kecamatan_ktp",
                },
                {
                    data: "no_hp",
                    name: "no_hp",
                },
                {
                    data: "jenis_pelatihan_industri",
                    name: "jenis_pelatihan_industri",
                },
                {
                    data: "skor",
                    name: "skor",
                    orderable: true,
                    searchable: true,
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
                {
                    data: "status",
                    name: "status",
                    className: "text-center",
                    searchable: true,
                    render: function (data) {
                        if (data === 0) {
                            return `<span class="badge bg-warning">-</span>`;
                        } else if (data === 1) {
                            return `<span class="badge bg-success">Lolos</span>`;
                        } else if (data === 2) {
                            return `<span class="badge bg-danger">Tidak Lolos</span>`;
                        } else if (data === 3) {
                            return `<span class="badge bg-dark">Blacklist</span>`;
                        } else if (data === 4) {
                            return `<span class="badge bg-danger">Ditolak - Lolos di Pelatihan Lain</span>`;
                        }
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
    }, [flash, selectedCategory, verificationFilter, selectedStatus]);
    const handleExport = (type) => {
        const url = route("admin.export.pelatihanbanmod", {
            verification_status: verificationFilter,
            jenis_pelatihan_industri: selectedCategory,
            status: selectedStatus,
            ext: type,
        });
        window.open(url, "_blank");
    };

    const updateStatus = async (url, status) => {
        let confirmMessage = '';
        
        if (status === 1) {
            confirmMessage = 'Apakah anda yakin ingin meloloskan peserta ini?\n\nPerhatian: Jika peserta ini lolos, maka semua pendaftaran pelatihan lain (UMKM, Pertanian, Banmod) dengan NIK yang sama akan otomatis ditolak.';
        } else if (status === 2) {
            confirmMessage = 'Apakah anda yakin ingin menggagalkan peserta ini?';
        } else if (status === 3) {
            confirmMessage = 'Apakah anda yakin ingin membuat blacklist peserta ini?';
        }
        
        if (confirm(confirmMessage)) {
            try {
                const response = await axios.post(url, {
                    status: status,
                });

                // Jika status berubah menjadi lolos (1), panggil endpoint untuk auto-reject NIK yang sama
                if (status === 1) {
                    try {
                        await axios.post(route('admin.auto-reject-nik'), {
                            current_table: 'banmod',
                            current_id: response.data.current_id || null,
                            nik: response.data.nik || null
                        });
                    } catch (autoRejectError) {
                        console.error("Error auto-rejecting other NIK records:", autoRejectError);
                    }
                }

                // Tampilkan toast message
                const toastEl = document.getElementById("toast");
                const toastBody = toastEl.querySelector('.toast-body');
                toastBody.textContent = response.data.message;
                
                // Ubah warna toast berdasarkan status
                const toastElement = toastEl;
                toastElement.className = toastElement.className.replace(/bg-\w+/, '');
                
                if (status === 1) {
                    toastElement.classList.add('bg-success');
                } else if (status === 2) {
                    toastElement.classList.add('bg-warning');
                } else if (status === 3) {
                    toastElement.classList.add('bg-danger');
                }
                
                const toast = new Toast(toastEl);
                toast.show();

                // Reload data table
                $(tableRef.current).DataTable().ajax.reload();
            } catch (error) {
                console.error("Error updating status:", error);
                if (error.response?.data?.message) {
                    const toastEl = document.getElementById("toast");
                    const toastBody = toastEl.querySelector('.toast-body');
                    toastBody.textContent = error.response.data.message;
                    const toastElement = toastEl;
                    toastElement.className = toastElement.className.replace(/bg-\w+/, 'bg-danger');
                    const toast = new Toast(toastEl);
                    toast.show();
                }
            }
        }
    };

    window.updateStatus = updateStatus;

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
                                            Filter Pelatihan:
                                        </label>
                                        <select
                                            className="form-select form-select-sm"
                                            // style={{ minWidth: "300px" }}
                                            value={selectedCategory}
                                            onChange={handleCategoryChange}
                                        >
                                            {pelatihan.map((category) => (
                                                <option
                                                    key={category.name}
                                                    value={category.name}
                                                >
                                                    {category.name}
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
                                <div className="col-12 col-md-6 col-xl-2">
                                    <div className="d-flex flex-column">
                                        <label className="form-label fw-bold">
                                            Status:
                                        </label>
                                        <select
                                            className="form-select form-select-sm"
                                            value={selectedStatus}
                                            onChange={
                                                handleStatusChange
                                            }
                                        >
                                            <option value="all">All</option>
                                            <option value="1">Lolos</option>
                                            <option value="2">Gagal</option>
                                            <option value="3">Blacklist</option>
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
                                                <th>TAHUN PENERIMAAN</th>
                                                <th>NIK</th>
                                                <th>NO KK</th>
                                                <th>NAMA</th>
                                                <th>ALAMAT</th>
                                                <th>RT</th>
                                                <th>RW</th>
                                                <th>KELURAHAN</th>
                                                <th>KECAMATAN</th>
                                                <th>NO HP</th>
                                                <th>KETRAMPILAN</th>
                                                <th>SKOR</th>
                                                <th>VERIFIKASI DOKUMEN</th>
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
                        <div className="toast-body">
                            {flash.message}
                        </div>
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
