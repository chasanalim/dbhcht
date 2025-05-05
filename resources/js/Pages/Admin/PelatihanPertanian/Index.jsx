import AdminLayout from "@/Layouts/admin/AdminLayout";
import { Head, Link, router } from "@inertiajs/react";
import { useEffect, useRef } from "react";
import $ from "jquery";
import "datatables.net-bs5";
import "datatables.net-bs5/css/dataTables.bootstrap5.min.css";
import { Toast, Tooltip } from "bootstrap";
// Import bootstrap JS
import "bootstrap/dist/js/bootstrap.bundle.min.js";

export default function Index({ title, can, flash }) {
    const tableRef = useRef();

    useEffect(() => {
        const dt = $(tableRef.current).DataTable({
            processing: true,
            serverSide: true,
            responsive: true,
            ajax: {
                url: route("admin.pertanian.index"),
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
                        let buttons = "";

                        // if (can.edit) {
                        buttons += `
                                <button
                                    onclick="window.location.href='${data.edit_url}'"
                                    class="btn btn-warning btn-sm me-2"
                                    data-bs-toggle="tooltip"
                                    title="Edit Data">
                                    <i class="bi bi-pencil-square"></i>
                                </button>`;
                        // }

                        // if (can.delete) {
                        buttons += `
                                <button
                                    onclick="deleteItem('${data.delete_url}')"
                                    class="btn btn-danger btn-sm"
                                    data-bs-toggle="tooltip"
                                    title="Hapus Data">
                                    <i class="bi bi-trash"></i>
                                </button>`;
                        // }

                        return buttons;
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
                    data: "nama_lengkap",
                    name: "nama_lengkap",
                },
                {
                    data: "jenis_kelamin",
                    name: "jenis_kelamin",
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
                    data: "kode_kelurahan",
                    name: "kode_kelurahan",
                },
                {
                    data: "kode_kecamatan",
                    name: "kode_kecamatan",
                },
                {
                    data: "no_hp",
                    name: "no_hp",
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
                                                <th>JENIS KELAMIN</th>
                                                <th>ALAMAT</th>
                                                <th>RT </th>
                                                <th>RW</th>
                                                <th>KELURAHAN</th>
                                                <th>KECAMATAN</th>
                                                <th>NO HP</th>
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
