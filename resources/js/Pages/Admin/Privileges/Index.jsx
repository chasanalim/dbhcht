import AdminLayout from "@/Layouts/admin/AdminLayout";
import { Head, Link } from "@inertiajs/react";
import { useEffect, useRef } from "react";
import $ from "jquery";
import "datatables.net-bs5";
import "datatables.net-bs5/css/dataTables.bootstrap5.min.css";

export default function Index({ title, can, flash }) {
    const tableRef = useRef();

    useEffect(() => {
        const dt = $(tableRef.current).DataTable({
            processing: true,
            serverSide: true,
            ajax: route("admin.privileges.index"),
            columns: [
                { data: "DT_RowIndex", name: "DT_RowIndex" },
                { data: "name", name: "name" },
                {
                    data: "permissions",
                    name: "permissions",
                    render: function (data) {
                        return data.split(', ').map(permission => `
                            <button class="btn btn-secondary btn-sm m-1">
                                ${permission}
                            </button>
                        `).join('');
                    },
                },
                {
                    data: "action",
                    width: "10%",
                    render: function (data) {
                        return `
                            ${
                                can.edit
                                    ? `
                                <a href="${data.edit_url}"
                                    class="btn btn-sm btn-primary me-2">
                                    <i class="bi bi-pencil-square"></i>
                                </a>
                            `
                                    : ""
                            }
                            ${
                                can.delete
                                    ? `
                                <button onclick="deleteItem('${data.delete_url}')"
                                        class="btn btn-sm btn-danger">
                                    <i class="bi bi-trash"></i>
                                </button>
                            `
                                    : ""
                            }
                        `;
                    },
                },
            ],
        });

        return () => {
            dt.destroy();
        };
    }, []);

    return (
        <AdminLayout>
            <Head title={title} />

            <div className="container-fluid py-4">
                <div className="row">
                    <div className="col-12">
                        <div className="card">
                            <div className="card-header pb-0 d-flex justify-content-between align-items-center">
                                <h5 className="mb-1">{title}</h5>
                                {can.create && (
                                <Link
                                    href={route("admin.privileges.create")}
                                    className="btn btn-sm btn-primary mb-1"
                                >
                                    <i className="bi bi-plus-circle me-2"></i>
                                    Tambah Role
                                </Link>
                                )}
                            </div>
                            <div className="card-body">
                                <div className="table-responsive">
                                    <table
                                        ref={tableRef}
                                        className="table table-striped"
                                    >
                                        <thead>
                                            <tr>
                                                <th>No</th>
                                                <th>Role</th>
                                                <th>Permissions</th>
                                                <th>Aksi</th>
                                            </tr>
                                        </thead>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
