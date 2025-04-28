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
                        let buttons = "";

                        if (can.editRole) {
                        buttons += `
                                <button
                                    onclick="window.location.href='${data.edit_url}'"
                                    class="btn btn-warning btn-sm me-2"
                                    data-bs-toggle="tooltip"
                                    title="Edit Data">
                                    <i class="bi bi-pencil-square"></i>
                                </button>`;
                        }

                        if (can.deleteRole) {
                        buttons += `
                                <button
                                    onclick="deleteItem('${data.delete_url}')"
                                    class="btn btn-danger btn-sm"
                                    data-bs-toggle="tooltip"
                                    title="Hapus Data">
                                    <i class="bi bi-trash"></i>
                                </button>`;
                        }

                        return buttons
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
                                {can.createRole && (
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
