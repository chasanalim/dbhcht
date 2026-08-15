import AdminLayout from "@/Layouts/admin/AdminLayout";
import { Head, Link, router } from "@inertiajs/react";
import { useEffect, useRef, useState } from "react";
import $, { data } from "jquery";
import "datatables.net-bs5";
import "datatables.net-bs5/css/dataTables.bootstrap5.min.css";
import { Toast, Tooltip } from "bootstrap";
// Import bootstrap JS
import "bootstrap/dist/js/bootstrap.bundle.min.js";

export default function Index({ title, can, flash, dataRoute, klasters }) {
    const tableRef = useRef();
    const [verificationFilter, setVerificationFilter] = useState("all");
    const [klasterFilter, setKlasterFilter] = useState("all");
    const handleVerificationFilterChange = (e) => {
        setVerificationFilter(e.target.value);
    };
    const handleKlasterFilterChange = (e) => {
        setKlasterFilter(e.target.value);
    };
    useEffect(() => {
        const dt = $(tableRef.current).DataTable({
            processing: true,
            serverSide: true,
            responsive: true,
            ajax: {
                url: dataRoute,
                type: "GET",
                data: function (d) {
                    d.verification_status = verificationFilter;
                    d.klaster_usaha = klasterFilter;
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
                    width: "2%",
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

                        buttons.push(`
                            <a href="${data.detail_url}" class="btn btn-sm btn-info me-1" title="Detail">
                                <i class="bi bi-eye"></i>
                            </a>
                        `);

                        // Add Lolos dana / Tolak dana buttons only for pending records,
                        // using the actual row values instead of the action payload.
                        const rowStatus = Number(row?.status ?? 0);
                        const rowVerifikasi = row?.verifikasi_dokumen;

                        if (rowStatus === 0 && rowVerifikasi) {
                            const allVerified = Boolean(
                                rowVerifikasi.all_verified,
                            );
                            const allApproved = Boolean(
                                rowVerifikasi.all_approved,
                            );

                            const kategori =
                                Number.parseInt(row?.kategori ?? 0, 10) || 0;
                            const kategoriMatch =
                                (kategori >= 1 && kategori <= 3) ||
                                kategori === 5 ||
                                kategori === 7;

                            if (kategoriMatch && allVerified && allApproved) {
                                buttons.push(`
                                    <button onclick="updateStatus('${data.status_url}', 1)" class="btn btn-sm btn-success me-1" title="Lolos">
                                        <i class="bi bi-check-lg"></i>
                                    </button>
                                `);

                                buttons.push(`
                                    <button onclick="updateStatus('${data.status_url}', 2)" class="btn btn-sm btn-danger" title="Tolak">
                                        <i class="bi bi-x-lg"></i>
                                    </button>
                                `);
                            } else if (kategoriMatch && allVerified && !allApproved) {
                                buttons.push(`
                                    <button onclick="updateStatus('${data.status_url}', 2)" class="btn btn-sm btn-danger" title="Tolak">
                                        <i class="bi bi-x-lg"></i>
                                    </button>
                                `);
                            }
                        } else if (rowStatus === 1) {
                            buttons.push(`
                                <button onclick="updateStatus('${data.status_url}', 3)" class="btn btn-sm btn-dark" title="Blacklist">
                                    <i class="bi bi-file-x"></i>
                                </button>
                            `);
                        } 

                        return `<div class="btn-group">${buttons.join(
                            "",
                        )}</div>`;
                    },
                },
                {
                    data: "nik",
                    name: "nik",
                    orderable: true,
                    searchable: true,
                },
                // {
                //     data: "kk",
                //     name: "kk",
                // },
                {
                    data: "name",
                    name: "name",
                },
                {
                    data: "desil",
                    name: "desil",
                    className: "text-center",
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
                    data: "phone_number",
                    name: "phone_number",
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
                // {
                //     data: "alamat_domisili",
                //     name: "alamat_domisili",
                // },
                // {
                //     data: "alamat_usaha",
                //     name: "alamat_usaha",
                // },
                {
                    data: "kategori_usaha.nama",
                    name: "kategori_usaha.nama",
                },
                {
                    data: "klaster_usaha.nama",
                    name: "klaster_usaha.nama",
                },
                {
                    data: "skor",
                    name: "skor",
                    className: "text-center",
                    render: function (data) {
                        return `<span class="badge bg-success p-2">${parseFloat(
                            data,
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
                    '[data-bs-toggle="tooltip"]',
                );
                tooltips.forEach((tooltipNode) => {
                    new Tooltip(tooltipNode);
                });
                // $("[title]").tooltip({
                //     placement: "top",
                //     trigger: "hover",
                // });
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
                '[data-bs-toggle="tooltip"]',
            );
            tooltips.forEach((tooltipNode) => {
                const tooltip = Tooltip.getInstance(tooltipNode);
                if (tooltip) {
                    tooltip.dispose();
                }
            });
        };
    }, [flash, verificationFilter, klasterFilter]);

    const handleExport = (type) => {
        const url = route("admin.export.banmod", {
            verification_status: verificationFilter,
            klaster_usaha: klasterFilter,
            kategori: title.includes("IKM")
                ? 4
                : title.includes("Buruh Pabrik Rokok")
                  ? 1
                  : title.includes("Buruh Tani Tembakau")
                    ? 2
                    : title.includes("Pekerja Pabrik Rokok")
                      ? 3
                      : title.includes("Masyarakat Miskin")
                        ? 5
                        : null,
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
                                current_table: "pendaftaran_banmods",
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
        } else if (status === 4) {
            if (confirm("Apakah anda yakin ingin menandai peserta ini lolos di pelatihan lain?")) {
                try {
                    const response = await axios.post(url, {
                        status: status,
                    });

                    const toastEl = document.getElementById("toast");
                    const toastBody = toastEl.querySelector(".toast-body");
                    toastBody.textContent = response.data.message;

                    const toastElement = toastEl;
                    toastElement.className = toastElement.className.replace(
                        /bg-\w+/,
                        "bg-success"
                    );

                    const toast = new Toast(toastEl);
                    toast.show();

                    $(tableRef.current).DataTable().ajax.reload();
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
                                <h5 className="my-2 fw-bold">{title}</h5>
                            </div>
                            <div className="d-flex justify-content-center mt-3">
                                <div className="col-12 col-xl-3">
                                    <div className="d-flex align-items-center">
                                        <label className="form-label fw-bold ms-2 w-100">
                                            Klaster Usaha:
                                        </label>
                                        <select
                                            className="form-select form-select-sm"
                                            value={klasterFilter}
                                            onChange={handleKlasterFilterChange}
                                        >
                                            {klasters?.map((klaster) => (
                                                <option
                                                    key={klaster.id}
                                                    value={klaster.id}
                                                >
                                                    {klaster.nama}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="col-12 col-xl-3">
                                    <div className="d-flex align-items-center">
                                        <label className="form-label fw-bold ms-2 w-100">
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
                                                <th>NAMA</th>
                                                <th>DESIL</th>
                                                <th>NO HP</th>
                                                <th>ALAMAT</th>
                                                <th>RT</th>
                                                <th>RW</th>
                                                <th>KELURAHAN</th>
                                                <th>KECAMATAN</th>
                                                <th>KATEGORI</th>
                                                <th>KLASTER USAHA</th>
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
