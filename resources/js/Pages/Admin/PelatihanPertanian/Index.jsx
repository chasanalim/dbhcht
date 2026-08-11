import { Head, Link, router } from "@inertiajs/react";
import { useEffect, useRef, useState } from "react";
import $ from "jquery";
import "datatables.net-bs5";
import "datatables.net-bs5/css/dataTables.bootstrap5.min.css";
import { Toast, Tooltip, Popover } from "bootstrap";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import axios from "axios";
import AdminLayout from "@/Layouts/admin/AdminLayout";

export default function Index({ title, can, flash, categories }) {
    const tableRef = useRef();
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [verificationFilter, setVerificationFilter] = useState("all");
    const [selectedStatus, setSelectedStatus] = useState("all");
    const [showBlacklistModal, setShowBlacklistModal] = useState(false);
    const [blacklistNotes, setBlacklistNotes] = useState("");
    const [pendingBlacklistUrl, setPendingBlacklistUrl] = useState(null);
    const [pendingBlacklistStatus, setPendingBlacklistStatus] = useState(null);
    const [stats, setStats] = useState({
        total: 0,
        lolos: 0,
        gagal: 0,
        blacklist: 0,
        lolosLain: 0,
    });

    const handleCategoryChange = (e) => {
        setSelectedCategory(e.target.value);
    };
    const handleVerificationFilterChange = (e) => {
        setVerificationFilter(e.target.value);
    };

    const handleStatusChange = (e) => {
        setSelectedStatus(e.target.value);
    };

    /**
     * Fetch statistics
     */
    const fetchStats = async () => {
        try {
            const response = await axios.get(route("admin.pertanian.index"), {
                params: {
                    jenis_pelatihan_petani: selectedCategory,
                    verification_status: verificationFilter,
                    stats: true,
                },
            });

            if (response.data.stats) {
                setStats(response.data.stats);
            }
        } catch (error) {
            console.error("Error fetching stats:", error);
        }
    };

    useEffect(() => {
        fetchStats();
    }, [selectedCategory, verificationFilter]);

    useEffect(() => {
        const dt = $(tableRef.current).DataTable({
            processing: true,
            serverSide: true,
            responsive: true,
            ajax: {
                url: route("admin.pertanian.index"),
                type: "GET",
                data: function (d) {
                    d.jenis_pelatihan_petani = selectedCategory;
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
                    width: "10%",
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
                            } else if (
                                row.verifikasi_dokumen.all_verified &&
                                !row.verifikasi_dokumen.all_approved
                            ) {
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
                    data: "nik",
                    name: "nik",
                    orderable: true,
                    searchable: true,
                },
                {
                    data: "kk",
                    name: "kk",
                },
                {
                    data: "kelompok_tani.nama_kelompok",
                    name: "kelompok_tani.nama_kelompok",
                },
                {
                    data: "nama_lengkap",
                    name: "nama_lengkap",
                },
                {
                    data: "jenis_kelamin",
                    name: "jenis_kelamin",
                    render: function (data) {
                        return data === "P" ? "PEREMPUAN" : "LAKI-LAKI";
                    },
                },
                {
                    data: "alamat",
                    name: "alamat",
                },
                {
                    data: "nama_rt",
                    name: "nama_rt",
                },
                {
                    data: "nama_rw",
                    name: "nama_rw",
                },
                {
                    data: "nama_kelurahan",
                    name: "nama_kelurahan",
                },
                {
                    data: "nama_kecamatan",
                    name: "nama_kecamatan",
                },
                {
                    data: "no_hp",
                    name: "no_hp",
                },
                {
                    data: "jenis_pelatihan_petani.nama",
                    name: "jenis_pelatihan_petani.nama",
                },
                {
                    data: "tanggal_pendaftaran",
                    name: "created_at",
                    render: function (data) {
                        return data || '-';
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
                    render: function (data, type, row) {
                        if (data === 0) {
                            return `<span class="badge bg-warning">-</span>`;
                        } else if (data === 1) {
                            return `<span class="badge bg-success">Lolos</span>`;
                        } else if (data === 2) {
                            return `<span class="badge bg-danger">Tidak Lolos</span>`;
                        } else if (data === 3) {
                            const keterangan = row.keterangan
                                ? row.keterangan
                                : "Tidak ada keterangan";

                            return `
                                <div class="d-flex align-items-center justify-content-center gap-2">
                                    <span class="badge bg-dark">Blacklist</span>
                                    <span
                                        class="badge bg-secondary cursor-pointer info-badge"
                                        data-bs-toggle="popover"
                                        data-bs-placement="left"
                                        data-bs-html="true"
                                        data-bs-content="${keterangan
                                            .replace(/"/g, "&quot;")
                                            .replace(/\n/g, "<br>")}"
                                        data-bs-trigger="hover"
                                        title="Keterangan Blacklist"
                                    >
                                        <i class="bi bi-info-circle"></i>
                                    </span>
                                </div>
                            `;
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
                    const existingTooltip = Tooltip.getInstance(tooltipNode);
                    if (existingTooltip) {
                        existingTooltip.dispose();
                    }
                    new Tooltip(tooltipNode);
                });

                const popovers = document.querySelectorAll(
                    '[data-bs-toggle="popover"]'
                );
                popovers.forEach((popoverNode) => {
                    const existingPopover = Popover.getInstance(popoverNode);
                    if (existingPopover) {
                        existingPopover.dispose();
                    }
                    new Popover(popoverNode, {
                        html: true,
                        trigger: "hover",
                        placement: "left",
                    });
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
        const url = route("admin.export.pertanian", {
            verification_status: verificationFilter,
            jenis_pelatihan_industri: selectedCategory,
            status: selectedStatus,
            ext: type,
        });
        window.open(url, "_blank");
    };

    const handleBlacklistConfirm = async () => {
        if (!blacklistNotes.trim()) {
            alert("Silakan masukkan keterangan blacklist!");
            return;
        }

        try {
            const response = await axios.post(pendingBlacklistUrl, {
                status: pendingBlacklistStatus,
                notes: blacklistNotes,
            });

            if (pendingBlacklistStatus === 1) {
                try {
                    await axios.post(route("admin.auto-reject-nik"), {
                        current_table: "pelatihan_kerjas",
                        current_id: response.data.current_id || null,
                        nik: response.data.nik || null,
                    });
                } catch (autoRejectError) {
                    console.error(
                        "Error auto-rejecting other NIK records:",
                        autoRejectError
                    );
                }
            }

            const toastEl = document.getElementById("toast");
            const toastBody = toastEl.querySelector(".toast-body");
            toastBody.textContent = response.data.message;

            const toastElement = toastEl;
            toastElement.className = toastElement.className.replace(
                /bg-\w+/,
                ""
            );

            if (pendingBlacklistStatus === 1) {
                toastElement.classList.add("bg-success");
            } else if (pendingBlacklistStatus === 2) {
                toastElement.classList.add("bg-warning");
            } else if (pendingBlacklistStatus === 3) {
                toastElement.classList.add("bg-danger");
            }

            const toast = new Toast(toastEl);
            toast.show();

            setShowBlacklistModal(false);
            setBlacklistNotes("");
            setPendingBlacklistUrl(null);
            setPendingBlacklistStatus(null);

            $(tableRef.current).DataTable().ajax.reload();
            fetchStats();
        } catch (error) {
            console.error("Error updating status:", error);
            if (error.response?.data?.message) {
                const toastEl = document.getElementById("toast");
                const toastBody = toastEl.querySelector(".toast-body");
                toastBody.textContent = error.response.data.message;
                const toastElement = toastEl;
                toastElement.className = toastElement.className.replace(
                    /bg-\w+/,
                    "bg-danger"
                );
                const toast = new Toast(toastEl);
                toast.show();
            }
        }
    };

    const updateStatus = async (url, status) => {
        let confirmMessage = "";

        if (status === 1) {
            confirmMessage =
                "Apakah anda yakin ingin meloloskan peserta ini?\n\nPerhatian: Jika peserta ini lolos, maka semua pendaftaran pelatihan lain (UMKM, Pertanian, Banmod) dengan NIK yang sama akan otomatis ditolak.";
            if (confirm(confirmMessage)) {
                try {
                    const response = await axios.post(url, {
                        status: status,
                    });

                    if (status === 1) {
                        try {
                            await axios.post(route("admin.auto-reject-nik"), {
                                current_table: "pelatihan_kerjas",
                                current_id: response.data.current_id || null,
                                nik: response.data.nik || null,
                            });
                        } catch (autoRejectError) {
                            console.error(
                                "Error auto-rejecting other NIK records:",
                                autoRejectError
                            );
                        }
                    }

                    const toastEl = document.getElementById("toast");
                    const toastBody = toastEl.querySelector(".toast-body");
                    toastBody.textContent = response.data.message;

                    const toastElement = toastEl;
                    toastElement.className = toastElement.className.replace(
                        /bg-\w+/,
                        ""
                    );
                    toastElement.classList.add("bg-success");

                    const toast = new Toast(toastEl);
                    toast.show();

                    $(tableRef.current).DataTable().ajax.reload();
                    fetchStats();
                } catch (error) {
                    console.error("Error updating status:", error);
                    if (error.response?.data?.message) {
                        const toastEl = document.getElementById("toast");
                        const toastBody = toastEl.querySelector(".toast-body");
                        toastBody.textContent = error.response.data.message;
                        const toastElement = toastEl;
                        toastElement.className = toastElement.className.replace(
                            /bg-\w+/,
                            "bg-danger"
                        );
                        const toast = new Toast(toastEl);
                        toast.show();
                    }
                }
            }
        } else if (status === 2) {
            // Alasan wajib diisi saat menggagalkan peserta, agar halaman
            // /cek-status menampilkan keterangan yang benar untuk peserta.
            const alasan = prompt(
                "Masukkan alasan penggagalan peserta ini (wajib diisi):"
            );
            if (!alasan || !alasan.trim()) {
                alert("Alasan penggagalan wajib diisi.");
                return;
            }
            if (confirm("Apakah anda yakin ingin menggagalkan peserta ini?")) {
                try {
                    const response = await axios.post(url, {
                        status: status,
                        notes: alasan,
                    });

                    const toastEl = document.getElementById("toast");
                    const toastBody = toastEl.querySelector(".toast-body");
                    toastBody.textContent = response.data.message;

                    const toastElement = toastEl;
                    toastElement.className = toastElement.className.replace(
                        /bg-\w+/,
                        "bg-warning"
                    );

                    const toast = new Toast(toastEl);
                    toast.show();

                    $(tableRef.current).DataTable().ajax.reload();
                    fetchStats();
                } catch (error) {
                    console.error("Error updating status:", error);
                    if (error.response?.data?.message) {
                        const toastEl = document.getElementById("toast");
                        const toastBody = toastEl.querySelector(".toast-body");
                        toastBody.textContent = error.response.data.message;
                        const toastElement = toastEl;
                        toastElement.className = toastElement.className.replace(
                            /bg-\w+/,
                            "bg-danger"
                        );
                        const toast = new Toast(toastEl);
                        toast.show();
                    }
                }
            }
        } else if (status === 3) {
            setPendingBlacklistUrl(url);
            setPendingBlacklistStatus(status);
            setShowBlacklistModal(true);
        }
    };

    // Add to window object so it can be called from DataTables
    window.updateStatus = updateStatus;

    return (
        <AdminLayout>
            <Head title={title} />

            <div className="container-fluid py-4">
                <div className="row">
                    <div className="col-12">
                        <div className="card">
                            <div className="card-header pb-0 d-flex justify-content-between align-items-center">
                                <h5 className="my-2 fw-bold">{title} </h5>
                            </div>
                            <div className="row g-3 p-3">
                                <div className="col-12 col-md-6 col-xl-3">
                                    <div className="d-flex flex-column">
                                        <label className="form-label fw-bold">
                                            Filter Pelatihan:
                                        </label>
                                        <select
                                            className="form-select form-select-sm"
                                            style={{ minWidth: "300px" }}
                                            value={selectedCategory}
                                            onChange={handleCategoryChange}
                                        >
                                            {categories.map((category) => (
                                                <option
                                                    key={category.id}
                                                    value={category.id}
                                                >
                                                    {category.nama}
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
                                            onChange={handleStatusChange}
                                        >
                                            <option value="all">All</option>
                                            <option value="1">Lolos</option>
                                            <option value="2">Gagal</option>
                                            <option value="3">Blacklist</option>
                                            <option value="4">
                                                Lolos Pelatihan Lain
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

                            {/* Statistics Row */}
                            <div className="row g-2 px-3 pb-3">
                                <div className="col-6 col-sm-4 col-md-2">
                                    <div className="bg-light rounded p-2 text-center">
                                        <div className="fw-bold fs-6 text-primary">
                                            {stats.total}
                                        </div>
                                        <small className="text-muted">
                                            Total
                                        </small>
                                    </div>
                                </div>
                                <div className="col-6 col-sm-4 col-md-2">
                                    <div className="bg-light rounded p-2 text-center">
                                        <div className="fw-bold fs-6 text-success">
                                            {stats.lolos}
                                        </div>
                                        <small className="text-muted">
                                            Lolos
                                        </small>
                                    </div>
                                </div>
                                <div className="col-6 col-sm-4 col-md-2">
                                    <div className="bg-light rounded p-2 text-center">
                                        <div className="fw-bold fs-6 text-danger">
                                            {stats.gagal}
                                        </div>
                                        <small className="text-muted">
                                            Gagal
                                        </small>
                                    </div>
                                </div>
                                <div className="col-6 col-sm-4 col-md-2">
                                    <div className="bg-light rounded p-2 text-center">
                                        <div className="fw-bold fs-6 text-dark">
                                            {stats.blacklist}
                                        </div>
                                        <small className="text-muted">
                                            Blacklist
                                        </small>
                                    </div>
                                </div>
                                <div className="col-6 col-sm-4 col-md-2">
                                    <div className="bg-light rounded p-2 text-center">
                                        <div className="fw-bold fs-6 text-warning">
                                            {stats.lolosLain}
                                        </div>
                                        <small className="text-muted">
                                            Lolos Pelatihan Lain
                                        </small>
                                    </div>
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
                                                <th>KELOMPOK TANI</th>
                                                <th>NAMA</th>
                                                <th>JENIS KELAMIN</th>
                                                <th>ALAMAT</th>
                                                <th>RT </th>
                                                <th>RW</th>
                                                <th>KELURAHAN</th>
                                                <th>KECAMATAN</th>
                                                <th>NO HP</th>
                                                <th>PELATIHAN</th>
                                                <th>TGL. PENDAFTARAN</th>
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

            {/* Blacklist Modal */}
            {showBlacklistModal && (
                <div
                    className="modal fade show d-block"
                    style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
                    tabIndex="-1"
                    role="dialog"
                    aria-labelledby="blacklistModalLabel"
                    aria-hidden="true"
                >
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header bg-danger text-white">
                                <h5
                                    className="modal-title"
                                    id="blacklistModalLabel"
                                >
                                    <i className="bi bi-exclamation-triangle me-2"></i>
                                    Tambah Keterangan Blacklist
                                </h5>
                                <button
                                    type="button"
                                    className="btn-close btn-close-white"
                                    onClick={() => {
                                        setShowBlacklistModal(false);
                                        setBlacklistNotes("");
                                        setPendingBlacklistUrl(null);
                                        setPendingBlacklistStatus(null);
                                    }}
                                    aria-label="Close"
                                ></button>
                            </div>
                            <div className="modal-body">
                                <div
                                    className="alert alert-warning"
                                    role="alert"
                                >
                                    <i className="bi bi-info-circle me-2"></i>
                                    Masukkan keterangan alasan peserta
                                    diblacklist. Informasi ini akan disimpan
                                    dalam sistem.
                                </div>
                                <div className="form-group">
                                    <label
                                        htmlFor="blacklistNotes"
                                        className="form-label fw-bold"
                                    >
                                        Keterangan Blacklist{" "}
                                        <span className="text-danger">*</span>
                                    </label>
                                    <textarea
                                        id="blacklistNotes"
                                        className="form-control"
                                        rows="4"
                                        value={blacklistNotes}
                                        onChange={(e) =>
                                            setBlacklistNotes(e.target.value)
                                        }
                                        placeholder="Contoh: Melakukan kecurangan dalam dokumen, Melanggar tata tertib, dll..."
                                    ></textarea>
                                    <small className="form-text text-muted">
                                        Minimal keterangan untuk alasan
                                        blacklist
                                    </small>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => {
                                        setShowBlacklistModal(false);
                                        setBlacklistNotes("");
                                        setPendingBlacklistUrl(null);
                                        setPendingBlacklistStatus(null);
                                    }}
                                >
                                    Batal
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-danger"
                                    onClick={handleBlacklistConfirm}
                                    disabled={!blacklistNotes.trim()}
                                >
                                    <i className="bi bi-check-lg me-1"></i>
                                    Konfirmasi Blacklist
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
