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
                    className: "text-center",
                },
                {
                    data: "name",
                    name: "name",
                    className: "text-center",
                },
                {
                    data: "alamat",
                    name: "alamat",
                    className: "text-center",
                },
                {
                    data: "nama_kecamatan",
                    name: "nama_kecamatan",
                    className: "text-center",
                },
                {
                    data: "nama_kelurahan",
                    name: "nama_kelurahan",
                    className: "text-center",
                },
                {
                    data: "nama_rw",
                    name: "nama_rw",
                    className: "text-center",
                },
                {
                    data: "nama_rt",
                    name: "nama_rt",
                    className: "text-center",
                },
            ],
        });
    }, []);

    return (
        <Layout>
            <Head title={meta.title} />
            <Container className="py-5">
                <div className="container-fluid py-4">
                    <div className="row">
                        <div className="col-12">
                            <div className="card">
                                <div className="card-header pb-0 d-flex justify-content-between align-items-center">
                                    <h5 className="my-2 fw-bold">
                                        {meta.title} 2025
                                    </h5>
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
                                                    <th>NAMA</th>
                                                    <th>ALAMAT</th>
                                                    <th>KECAMATAN</th>
                                                    <th>KELURAHAN</th>
                                                    <th>RW</th>
                                                    <th>RT</th>
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
                            className="toast align-items-center text-white bg-success border-0"
                            role="alert"
                            aria-live="assertive"
                            aria-atomic="true"
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
