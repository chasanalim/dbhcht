import Layout from "@/Layouts/Layout";
import { Head } from "@inertiajs/react";
import React, { useEffect, useRef } from "react";
import { Container } from "react-bootstrap";
import $ from "jquery";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "datatables.net-bs5";
import "datatables.net-bs5/css/dataTables.bootstrap5.min.css";

export default function PesertaPage({ meta }) {
    const tableRef = useRef();

    useEffect(() => {
        const dt = $(tableRef.current).DataTable({
            processing: true,
            serverSide: true,
            responsive: true,
            ajax: {
                url: route("peserta.get"),
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
                    render: function (data) {
                        const firstPart = data.substring(0, 6);
                        const lastPart = data.substring(data.length - 4);
                        return `XX${firstPart}XXXXX${lastPart}`;
                    },
                },
                { data: "name", name: "name" },
                // { data: "alamat", name: "alamat" },
                { data: "nama_rt", name: "nama_rt", className: "text-center" },
                { data: "nama_rw", name: "nama_rw", className: "text-center" },
                {
                    data: "nama_kelurahan",
                    name: "nama_kelurahan",
                    className: "text-center",
                },
                {
                    data: "nama_kecamatan",
                    name: "nama_kecamatan",
                    className: "text-center",
                },
            ],
        });
    }, []);

    return (
        <Layout>
            <Head title={meta.title} />
            <Container className="py-5">
                <style>
                    {`
        .table thead th,
        .table thead td {
            color:rgb(79, 140, 255) !important;
            background: #f8fafc !important;
            font-weight: bold;
            border-bottom: 2px solid #e0e7ff;
            letter-spacing: 0.5px;
        }
        `}
                </style>
                <div className="container-fluid py-4">
                    <div className="row">
                        <div className="col-12">
                            <div
                                className="card border-0 shadow-sm"
                                style={{
                                    borderRadius: "1.5rem",
                                    boxShadow: "0 2px 16px #4f8cff11",
                                    background: "#fff",
                                }}
                            >
                                <div
                                    className="card-header pb-0 d-flex justify-content-between align-items-center"
                                    style={{
                                        borderRadius: "1.5rem 1.5rem 0 0",
                                        background:
                                            "linear-gradient(90deg,#4f8cff 60%,#6ea8fe 100%)",
                                        color: "#fff",
                                        border: "none",
                                        minHeight: 70,
                                    }}
                                >
                                    <h5
                                        className="my-2 fw-bold"
                                        style={{ color: "#fff" }}
                                    >
                                        {meta.title} 2025
                                    </h5>
                                </div>
                                <div
                                    className="card-body"
                                    style={{
                                        borderRadius: "0 0 1.5rem 1.5rem",
                                    }}
                                >
                                    <div className="table-responsive">
                                        <table
                                            ref={tableRef}
                                            className="table table-sm table-hover align-middle"
                                            style={{
                                                borderRadius: "1rem",
                                                overflow: "hidden",
                                            }}
                                        >
                                            <thead>
                                                <tr
                                                    style={{
                                                        background: "#f8fafc",
                                                    }}
                                                >
                                                    <th className="fw-bold text-primary">
                                                        No
                                                    </th>
                                                    <th className="fw-bold text-primary">
                                                        NIK
                                                    </th>
                                                    <th className="fw-bold text-primary">
                                                        NAMA
                                                    </th>
                                                    {/* <th className="fw-bold text-primary">
                                                        ALAMAT
                                                    </th> */}
                                                    <th className="fw-bold text-primary">
                                                        RT
                                                    </th>
                                                    <th className="fw-bold text-primary">
                                                        RW
                                                    </th>
                                                    <th className="fw-bold text-primary">
                                                        KELURAHAN
                                                    </th>
                                                    <th className="fw-bold text-primary">
                                                        KECAMATAN
                                                    </th>
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
                {meta.flash.message && (
                    <div
                        className="position-fixed top-0 end-0 p-3"
                        style={{ zIndex: 5 }}
                    >
                        <div
                            id="toast"
                            className="toast align-items-center text-white bg-success border-0 shadow-lg"
                            role="alert"
                            aria-live="assertive"
                            aria-atomic="true"
                            style={{
                                borderRadius: "1rem",
                                minWidth: 280,
                                fontWeight: 500,
                                fontSize: "1rem",
                            }}
                        >
                            <div className="d-flex">
                                <div className="toast-body">
                                    {meta.flash.message}
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
                )}
            </Container>
        </Layout>
    );
}
