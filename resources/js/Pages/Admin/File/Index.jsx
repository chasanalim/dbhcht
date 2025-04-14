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
                { data: 'kategori', name: 'kategori' },
                {
                    data: 'action',
                    name: 'action',
                    orderable: false,
                    searchable: false,
                    render: function(data) {
                        return `
                            <button onclick="window.location.href='${data.edit_url}'" class="btn btn-success btn-sm me-2">
                                Edit
                            </button>
                            <button onclick="deleteItem('${data.delete_url}')" class="btn btn-danger btn-sm">
                                Delete
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
        if (confirm('Are you sure you want to delete this item?')) {
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
                                            <th>Nama</th>
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
