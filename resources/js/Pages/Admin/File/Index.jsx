import AdminLayout from '@/Layouts/admin/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useEffect } from 'react';
import $ from 'jquery';
import 'datatables.net';

export default function Index({ title }) {
    useEffect(() => {
        const dt = $('#lampiranTable').DataTable({
            processing: true,
            serverSide: true,
            ajax: {
                url: route('admin.downloads.index'),
                headers: {
                    'X-Requested-With': 'XMLHttpRequest'
                }
            },
            columns: [
                { data: 'nama', name: 'nama' },
                { data: 'nama', name: 'nama' },
                { data: 'deskripsi', name: 'deskripsi' },
                {
                    data: 'file_name',
                    name: 'file_name',
                    render: function(data) {
                        return `
                            <a href="/storage/files/${data}" target="_blank" class="btn btn-primary btn-sm">
                                <i class="bi bi-file-earmark-arrow-down"></i>
                            </a>
                        `;
                    }
                },
                { data: 'kategori', name: 'kategori' },
                {
                    data: 'action',
                    name: 'action',
                    orderable: false,
                    searchable: false,
                    render: function(data) {
                        return `
                            <button onclick="window.location.href='${data.edit_url}'" class="btn btn-success btn-sm me-2">
                                <i class="bi bi-pencil-square"></i>
                            </button>
                            <button onclick="deleteItem('${data.delete_url}')" class="btn btn-danger btn-sm">
                                <i class="bi bi-trash3"></i>
                            </button>
                        `;
                    }
                }
            ]
        });

        return () => {
            dt.destroy();
        };
    }, []);

    const deleteItem = (url) => {
        if (confirm('Apakah anda yakin menghapus data ini?')) {
            router.delete(url, {
                onSuccess: () => {
                    $('#lampiranTable').DataTable().ajax.reload();
                }
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
                            <div className="card-body">
                                <Link
                                    href={route('admin.downloads.create')}
                                    className="btn btn-primary mb-3"
                                >
                                    Tambah Lampiran
                                </Link>

                                <table id="lampiranTable" className="table table-striped table-bordered">
                                    <thead>
                                        <tr>
                                            <th>No</th>
                                            <th>Nama File</th>
                                            <th>Deskripsi</th>
                                            <th>File</th>
                                            <th>Kategori</th>
                                            <th>Aksi</th>
                                        </tr>
                                    </thead>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
