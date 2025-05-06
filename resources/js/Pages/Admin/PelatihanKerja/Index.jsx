import AdminLayout from "@/Layouts/admin/AdminLayout";
import { Head, Link, router } from "@inertiajs/react";
import { useEffect, useRef, useState } from "react";
import $ from "jquery";
import "datatables.net-bs5";
import "datatables.net-bs5/css/dataTables.bootstrap5.min.css";
import { Toast, Tooltip } from "bootstrap";
// Import bootstrap JS
import "bootstrap/dist/js/bootstrap.bundle.min.js";

export default function Index({ title, can, flash, dataRoute, categories }) {
    const tableRef = useRef();
    const [selectedCategory, setSelectedCategory] = useState("all");

    useEffect(() => {
        const dt = $(tableRef.current).DataTable({
            processing: true,
            serverSide: true,
            responsive: true,
            ajax: {
                url: route("admin.kerja.index"),
                type: "GET",
                data: function (d) {
                    d.jenis_pelatihan = selectedCategory;
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
                    data: "tmp_lhr",
                    name: "tmp_lhr",
                },
                {
                    data: "tgl_lhr",
                    name: "tgl_lhr",
                },
                {
                    data: "jenis_kelamin",
                    name: "jenis_kelamin",
                    render: function (data) {
                        return data == "L" ? "Laki-laki" : "Perempuan";
                    },
                },
                {
                    data: "alamat",
                    name: "alamat",
                },
                {
                    data: "nama_kecamatan",
                    name: "nama_kecamatan",
                },
                {
                    data: "nama_kelurahan",
                    name: "nama_kelurahan",
                },
                {
                    data: "nama_rw",
                    name: "nama_rw",
                },
                {
                    data: "nama_rt",
                    name: "nama_rt",
                },
                {
                    data: "phone_number",
                    name: "phone_number",
                },
                {
                    data: "ref_pendidikan.nama",
                    name: "ref_pendidikan.nama",
                },
                {
                    data: "jenis_pelatihan.nama",
                    name: "jenis_pelatihan.nama",
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
    }, [flash, selectedCategory]);

    const handleCategoryChange = (e) => {
        setSelectedCategory(e.target.value);
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
                            <div className="d-flex align-items-center gap-3 justify-content-center mt-2">
                                <div className="d-flex align-items-center">
                                    <label className="m-2 text-sm fw-bold w-100 ">
                                        Filter Pelatihan:
                                    </label>
                                    <select
                                        className="form-select form-select-sm m-2"
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
                                                <th>JENIS KELAMIN</th>
                                                <th>ALAMAT</th>
                                                <th>KECAMATAN</th>
                                                <th>KELURAHAN</th>
                                                <th>RW</th>
                                                <th>RT</th>
                                                <th>NO HP</th>
                                                <th>PENDIDIKAN</th>
                                                <th>PELATIHAN</th>
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
