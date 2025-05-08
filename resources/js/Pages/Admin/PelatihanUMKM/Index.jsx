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
                        buttons.push(`
                                <a href="${data.edit_url}" class="btn btn-sm btn-warning" title="Edit">
                                    <i class="bi bi-pencil-square"></i>
                                </a>
                            `);
                        // }

                        // if (can.delete) {
                        buttons.push(`
                                <a href="javascript:void(0)"
                                   onclick="deleteItem('${data.delete_url}')"
                                   class="btn btn-sm btn-danger"
                                   title="Hapus">
                                    <i class="bi bi-trash"></i>
                                </a>
                            `);
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
                        return `<span class="badge bg-success p-2">${parseFloat(data).toFixed(1)}</span>`;
                    }
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
    }, [flash, selectedPelatihan1, selectedPelatihan2, selectedPelatihan3]);

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
                            <div className="d-flex align-items-center gap-3 justify-content-center mt-2">
                                <div className="d-flex align-items-center">
                                    <label className="m-2 text-sm fw-bold w-100">
                                        Prioritas 1:
                                    </label>
                                    <select
                                        className={`form-select form-select-sm m-2 ${
                                            disabledFilters.prioritas_1
                                                ? "bg-light"
                                                : ""
                                        }`}
                                        style={{ minWidth: "350px" }}
                                        value={selectedPelatihan1}
                                        onChange={handlePelatihan1Change}
                                        disabled={disabledFilters.prioritas_1}
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
                                <div className="d-flex align-items-center">
                                    <label className="m-2 text-sm fw-bold w-100">
                                        Prioritas 2:
                                    </label>
                                    <select
                                        className={`form-select form-select-sm m-2 ${
                                            disabledFilters.prioritas_2
                                                ? "bg-light"
                                                : ""
                                        }`}
                                        style={{ minWidth: "350px" }}
                                        value={selectedPelatihan2}
                                        onChange={handlePelatihan2Change}
                                        disabled={disabledFilters.prioritas_2}
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
                                <div className="d-flex align-items-center">
                                    <label className="m-2 text-sm fw-bold w-100">
                                        Prioritas 3:
                                    </label>
                                    <select
                                        className={`form-select form-select-sm m-2 ${
                                            disabledFilters.prioritas_3
                                                ? "bg-light"
                                                : ""
                                        }`}
                                        style={{ minWidth: "350px" }}
                                        value={selectedPelatihan3}
                                        onChange={handlePelatihan3Change}
                                        disabled={disabledFilters.prioritas_3}
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
                                                {/* <th>KELURAHAN</th>
                                                <th>RW</th>
                                                <th>RT</th> */}
                                                <th>NO HP</th>
                                                <th>PRIORITAS 1</th>
                                                <th>PRIORITAS 2</th>
                                                <th>PRIORITAS 3</th>
                                                <th>SKOR</th>
                                                {/* <th>DAYA LISTRIK</th>
                                                <th>DISABILITAS</th>
                                                <th>KATEGORI</th>
                                                <th>JENIS KATEGORI</th>
                                                <th>KLASTER USAHA</th>
                                                <th>TANGGUNGAN KELUARGA</th>
                                                <th>LAMA USAHA</th>
                                                <th>JUMLAH TENAGA</th>
                                                <th>BRUTO</th>
                                                <th>STATUS TEMPAT TINGGAL</th>
                                                <th>ASET</th>
                                                <th>HUTANG</th>
                                                <th>JUMLAH LEGALITAS</th>
                                                <th>JUMLAH TEKNOLOGI</th>
                                                <th>JUMLAH PENYERAPAN NAKER</th>
                                                <th>FOTO</th>
                                                <th>KTP</th>
                                                <th>KK</th>
                                                <th>NIB</th>
                                                <th>SKU</th>
                                                <th>SKD</th>
                                                <th>PRODUK</th>
                                                <th>PERNYATAAN</th>
                                                <th>PERIZINAN</th>
                                                <th>SIINAS</th>
                                                <th>BP</th>
                                                <th>SERTIFIKAT PELATIHAN</th> */}
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
