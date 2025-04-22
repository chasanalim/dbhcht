import AdminLayout from "@/Layouts/admin/AdminLayout";
import { Head, useForm } from "@inertiajs/react";
import { Form } from "react-bootstrap";

export default function Create({
    title,
    user,
    action,
    method = "POST",
    roles,
    selectedRole,
}) {
    const { data, setData, post, put, processing, errors, progress } = useForm({
        role: selectedRole || "",
        name: user?.name || "",
        nik: user?.nik || "",
        email: user?.email || "",
        phone_number: user?.phone_number || "",
        password: "",
        password_confirmation: "",
    });

    // console.log(roles[0].id);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (method === "PUT") {
            put(action);
        } else {
            post(action);
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
                                <div className="card-title">
                                    <h5 className="fw-bold">{title}</h5>
                                </div>
                            </div>
                            <div className="card-body">
                                <form onSubmit={handleSubmit}>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="mb-3">
                                                <label className="form-label required">
                                                    Role
                                                </label>
                                                <select
                                                    className={`form-select ${
                                                        errors.role
                                                            ? "is-invalid"
                                                            : ""
                                                    }`}
                                                    value={data.role}
                                                    onChange={(e) =>
                                                        setData(
                                                            "role",
                                                            e.target.value
                                                        )
                                                    }
                                                >
                                                    <option value="">
                                                        Pilih Role
                                                    </option>
                                                    {roles.map((role) => (
                                                        <option
                                                            key={role.id}
                                                            value={role.name}
                                                        >
                                                            {role.name}
                                                        </option>
                                                    ))}
                                                </select>
                                                {errors.role && (
                                                    <div className="invalid-feedback">
                                                        {errors.role}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="col-md-6">
                                            <Form.Group className="mb-3">
                                                <Form.Label className="required">
                                                    Nama
                                                </Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    value={data.name}
                                                    onChange={(e) =>
                                                        setData(
                                                            "name",
                                                            e.target.value
                                                        )
                                                    }
                                                    isInvalid={!!errors.name}
                                                    placeholder="Masukkan Nama"
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                    {errors.name}
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                        </div>

                                        <div className="col-md-6">
                                            <Form.Group className="mb-3">
                                                <Form.Label className="required">
                                                    NIK
                                                </Form.Label>
                                                <Form.Control
                                                    type="number"
                                                    value={data.nik}
                                                    onChange={(e) =>
                                                        setData(
                                                            "nik",
                                                            e.target.value
                                                        )
                                                    }
                                                    isInvalid={!!errors.nik}
                                                    placeholder="Masukkan NIK"
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                    {errors.nik}
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                        </div>

                                        <div className="col-md-6">
                                            <Form.Group className="mb-3">
                                                <Form.Label className="required">
                                                    Email
                                                </Form.Label>
                                                <Form.Control
                                                    type="email"
                                                    value={data.email}
                                                    onChange={(e) =>
                                                        setData(
                                                            "email",
                                                            e.target.value
                                                        )
                                                    }
                                                    isInvalid={!!errors.email}
                                                    placeholder="Masukkan Email Aktif"
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                    {errors.email}
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                        </div>

                                        <div className="col-md-6">
                                            <Form.Group className="mb-3">
                                                <Form.Label className="required">
                                                    No HP
                                                </Form.Label>
                                                <Form.Control
                                                    type="number"
                                                    value={data.phone_number}
                                                    onChange={(e) =>
                                                        setData(
                                                            "phone_number",
                                                            e.target.value
                                                        )
                                                    }
                                                    isInvalid={
                                                        !!errors.phone_number
                                                    }
                                                    placeholder="Masukkan No HP Aktif"
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                    {errors.phone_number}
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                        </div>

                                        <div className="col-md-6">
                                            <Form.Group className="mb-3">
                                                <Form.Label className="required">
                                                    Password
                                                </Form.Label>
                                                <Form.Control
                                                    type="password"
                                                    value={data.password}
                                                    onChange={(e) =>
                                                        setData(
                                                            "password",
                                                            e.target.value
                                                        )
                                                    }
                                                    isInvalid={
                                                        !!errors.password
                                                    }
                                                    placeholder="Masukkan Password"
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                    {errors.password}
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                        </div>

                                        <div className="col-md-6 offset-md-6">
                                            <Form.Group className="mb-3">
                                                <Form.Label className="required">
                                                    Konfirmasi Password
                                                </Form.Label>
                                                <Form.Control
                                                    type="password"
                                                    value={
                                                        data.password_confirmation
                                                    }
                                                    onChange={(e) =>
                                                        setData(
                                                            "password_confirmation",
                                                            e.target.value
                                                        )
                                                    }
                                                    isInvalid={
                                                        !!errors.password_confirmation
                                                    }
                                                    placeholder="Masukkan Konfirmasi Password"
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                    {
                                                        errors.password_confirmation
                                                    }
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                        </div>
                                    </div>

                                    <div className="d-flex justify-content-center">
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="btn btn-primary"
                                        >
                                            {processing
                                                ? "Menyimpan..."
                                                : "Simpan"}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
