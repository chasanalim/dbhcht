import AdminLayout from "@/Layouts/admin/AdminLayout";
import { Head, useForm, usePage } from "@inertiajs/react";
import { Form } from "react-bootstrap";
import { useEffect, useState } from "react";

export default function Edit({ title, user, action, method = "POST" }) {
    const { flash } = usePage().props;

    const { data, setData, post, patch, processing, errors } = useForm({
        name: user?.name || "",
        nik: user?.nik || "",
        email: user?.email || "",
        phone_number: user?.phone_number || "",
        password: "",
        password_confirmation: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const showAlert = (type, message) => {
        const alertDiv = document.createElement("div");
        alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
        alertDiv.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        `;
        document.querySelector(".container-fluid").prepend(alertDiv);

        // Auto hide after 3 seconds
        setTimeout(() => {
            alertDiv.remove();
        }, 3000);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (method === "PATCH") {
            patch(action, {
                preserveScroll: true,
                onSuccess: () => {
                    setData((data) => ({
                        ...data,
                        password: "",
                        password_confirmation: "",
                    }));
                    showAlert("success", "Profile berhasil diperbarui");
                },
                onError: () => {
                    showAlert("danger", "Gagal memperbarui profile");
                },
            });
        } else {
            post(action, {
                preserveScroll: true,
            });
        }
    };

    // Show flash message if exists
    useEffect(() => {
        if (flash.message) {
            showAlert(flash.type || "info", flash.message);
        }
    }, [flash]);

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
                                        {/* Remove role field for profile update */}
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
                                                <div className="input-group">
                                                    <Form.Control
                                                        type={
                                                            showPassword
                                                                ? "text"
                                                                : "password"
                                                        }
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
                                                    <button
                                                        className="btn btn-outline-secondary"
                                                        type="button"
                                                        onClick={() =>
                                                            setShowPassword(
                                                                !showPassword
                                                            )
                                                        }
                                                    >
                                                        <i
                                                            className={`bi bi-eye${
                                                                showPassword
                                                                    ? "-slash"
                                                                    : ""
                                                            }`}
                                                        ></i>
                                                    </button>
                                                    <Form.Control.Feedback type="invalid">
                                                        {errors.password}
                                                    </Form.Control.Feedback>
                                                </div>
                                                <Form.Text className="text-muted">
                                                    <small>
                                                        Password harus memenuhi
                                                        kriteria berikut:
                                                        <ul className="mb-0">
                                                            <li>
                                                                Minimal 8
                                                                karakter
                                                            </li>
                                                            <li>
                                                                Minimal 1 huruf
                                                                kapital
                                                            </li>
                                                            <li>
                                                                Minimal 1 angka
                                                            </li>
                                                        </ul>
                                                    </small>
                                                </Form.Text>
                                            </Form.Group>
                                        </div>

                                        <div className="col-md-6">
                                            <Form.Group className="mb-3">
                                                <Form.Label className="required">
                                                    Konfirmasi Password
                                                </Form.Label>
                                                <div className="input-group">
                                                    <Form.Control
                                                        type={
                                                            showConfirmPassword
                                                                ? "text"
                                                                : "password"
                                                        }
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
                                                    <button
                                                        className="btn btn-outline-secondary"
                                                        type="button"
                                                        onClick={() =>
                                                            setShowConfirmPassword(
                                                                !showConfirmPassword
                                                            )
                                                        }
                                                    >
                                                        <i
                                                            className={`bi bi-eye${
                                                                showConfirmPassword
                                                                    ? "-slash"
                                                                    : ""
                                                            }`}
                                                        ></i>
                                                    </button>
                                                    <Form.Control.Feedback type="invalid">
                                                        {
                                                            errors.password_confirmation
                                                        }
                                                    </Form.Control.Feedback>
                                                </div>
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
