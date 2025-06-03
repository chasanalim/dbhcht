import AdminLayout from "@/Layouts/admin/AdminLayout";
import { Head, Link, router } from "@inertiajs/react";
import { useEffect, useRef, useState } from "react";
import $, { data } from "jquery";
import "datatables.net-bs5";
import "datatables.net-bs5/css/dataTables.bootstrap5.min.css";
import { Toast, Tooltip } from "bootstrap";
// Import bootstrap JS
import "bootstrap/dist/js/bootstrap.bundle.min.js";

export default function Index({ title, can, flash, dataRoute }) {
    const tableRef = useRef();
    const [verificationFilter, setVerificationFilter] = useState("all");
    const handleVerificationFilterChange = (e) => {
        setVerificationFilter(e.target.value);
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
                    render: function (data) {
                        let buttons = [];

                        // // if (can.edit) {
                        // buttons.push(`
                        //         <a href="${data.edit_url}" class="btn btn-sm btn-warning" title="Edit">
                        //             <i class="bi bi-pencil-square"></i>
                        //         </a>
                        //     `);
                        // // }

                        // // if (can.delete) {
                        // buttons.push(`
                        //         <a href="javascript:void(0)"
                        //            onclick="deleteItem('${data.delete_url}')"
                        //            class="btn btn-sm btn-danger"
                        //            title="Hapus">
                        //             <i class="bi bi-trash"></i>
                        //         </a>
                        //     `);
                        // // }

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
                // {
                //     data: "kk",
                //     name: "kk",
                // },
                {
                    data: "name",
                    name: "name",
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
                '[data-bs-toggle="tooltip"]'
            );
            tooltips.forEach((tooltipNode) => {
                const tooltip = Tooltip.getInstance(tooltipNode);
                if (tooltip) {
                    tooltip.dispose();
                }
            });
        };
    }, [flash, verificationFilter]);

    const handleExport = (type) => {
        const url = route("admin.export.banmod", {
            verification_status: verificationFilter,
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
