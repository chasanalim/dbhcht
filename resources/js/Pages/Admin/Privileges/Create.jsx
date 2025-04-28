import AdminLayout from "@/Layouts/admin/AdminLayout";
import { Head, useForm } from "@inertiajs/react";
import Select from "react-select";

export default function Form({ title, role = null, permissions }) {
    const { data, setData, post, put, processing, errors } = useForm({
        name: role?.name || "",
        permissions: role?.permissions || [],
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (role) {
            put(route("admin.privileges.update", role.id));
        } else {
            post(route("admin.privileges.store"));
        }
    };

    return (
        <AdminLayout>
            <Head title={title} />

            <div className="container-fluid py-4">
                <div className="row">
                    <div className="col-12">
                        <div className="card">
                            <div className="card-header pb-0">
                                <h5 className="mb-0">{title}</h5>
                            </div>
                            <div className="card-body">
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <label className="form-label">
                                            Nama Role
                                        </label>
                                        <input
                                            type="text"
                                            className={`form-control ${
                                                errors.name ? "is-invalid" : ""
                                            }`}
                                            value={data.name}
                                            onChange={(e) =>
                                                setData("name", e.target.value)
                                            }
                                        />
                                        {errors.name && (
                                            <div className="invalid-feedback">
                                                {errors.name}
                                            </div>
                                        )}
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">
                                            Permissions
                                        </label>
                                        <Select
                                            isMulti
                                            options={permissions}
                                            value={permissions.filter(
                                                (option) =>
                                                    data.permissions.includes(
                                                        option.value
                                                    )
                                            )}
                                            onChange={(selected) =>
                                                setData(
                                                    "permissions",
                                                    selected.map(
                                                        (option) => option.value
                                                    )
                                                )
                                            }
                                            className={
                                                errors.permissions
                                                    ? "is-invalid"
                                                    : ""
                                            }
                                        />
                                        {errors.permissions && (
                                            <div className="invalid-feedback">
                                                {errors.permissions}
                                            </div>
                                        )}
                                    </div>

                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                        disabled={processing}
                                    >
                                        {processing ? "Loading..." : "Simpan"}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
