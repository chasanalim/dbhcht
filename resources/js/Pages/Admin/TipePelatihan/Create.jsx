import AdminLayout from "@/Layouts/admin/AdminLayout";
import { Head, useForm } from "@inertiajs/react";
import { Form } from "react-bootstrap";

export default function Create({ title, trainingType, action, method = "POST" }) {
    const normalizeRequirements = (requirements) => {
        if (Array.isArray(requirements)) {
            return requirements.join("\n");
        }

        if (typeof requirements === "string") {
            try {
                const parsed = JSON.parse(requirements);

                if (Array.isArray(parsed)) {
                    return parsed.join("\n");
                }
            } catch (error) {
                return requirements;
            }

            return requirements;
        }

        return "";
    };

    const { data, setData, post, processing, errors, progress, transform } =
        useForm({
            value: trainingType?.value || "",
            label: trainingType?.label || "",
            title: trainingType?.title || "",
            description: trainingType?.description || "",
            image: null,
            requirements: normalizeRequirements(trainingType?.requirements),
            duration: trainingType?.duration || "",
            location: trainingType?.location || "",
            is_disabled: Boolean(trainingType?.is_disabled),
            coming_soon: Boolean(trainingType?.coming_soon),
            closed: Boolean(trainingType?.closed),
            order: trainingType?.order ?? "",
        });

    const handleSubmit = (e) => {
        e.preventDefault();

        const requirementsArray = data.requirements
            .split("\n")
            .map((item) => item.trim())
            .filter(Boolean);

        transform((formData) => ({
            ...formData,
            ...(method.toUpperCase() !== "POST" ? { _method: method } : {}),
            requirements: requirementsArray,
            is_disabled: formData.is_disabled ? 1 : 0,
            coming_soon: formData.coming_soon ? 1 : 0,
            closed: formData.closed ? 1 : 0,
        }));

        post(action, {
            forceFormData: true,
            preserveScroll: true,
            onError: (errors) => {
                console.log("Form errors:", errors);
            },
        });
    };

    return (
        <AdminLayout>
            <Head title={title} />

            <div className="container-fluid py-4">
                {errors.error && (
                    <div className="alert alert-danger">{errors.error}</div>
                )}

                <div className="row">
                    <div className="col-12">
                        <div className="card">
                            <div className="card-header pb-0">
                                <div className="card-title">
                                    <h5 className="fw-bold">{title}</h5>
                                </div>
                            </div>

                            <div className="card-body">
                                <form
                                    onSubmit={handleSubmit}
                                    encType="multipart/form-data"
                                >
                                    <div className="row">
                                        <div className="col-md-6">
                                            <Form.Group className="mb-3">
                                                <Form.Label className="required">
                                                    Value
                                                </Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    value={data.value}
                                                    onChange={(e) =>
                                                        setData(
                                                            "value",
                                                            e.target.value
                                                        )
                                                    }
                                                    isInvalid={!!errors.value}
                                                    placeholder="Contoh: pelatihan-umkm"
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                    {errors.value}
                                                </Form.Control.Feedback>
                                                <Form.Text className="text-muted">
                                                    Digunakan sebagai kode/slug
                                                    unik jenis pelatihan.
                                                </Form.Text>
                                            </Form.Group>
                                        </div>

                                        <div className="col-md-6">
                                            <Form.Group className="mb-3">
                                                <Form.Label className="required">
                                                    Label
                                                </Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    value={data.label}
                                                    onChange={(e) =>
                                                        setData(
                                                            "label",
                                                            e.target.value
                                                        )
                                                    }
                                                    isInvalid={!!errors.label}
                                                    placeholder="Contoh: Pelatihan UMKM"
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                    {errors.label}
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                        </div>

                                        <div className="col-md-6">
                                            <Form.Group className="mb-3">
                                                <Form.Label className="required">
                                                    Judul
                                                </Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    value={data.title}
                                                    onChange={(e) =>
                                                        setData(
                                                            "title",
                                                            e.target.value
                                                        )
                                                    }
                                                    isInvalid={!!errors.title}
                                                    placeholder="Masukkan judul pelatihan"
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                    {errors.title}
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                        </div>

                                        <div className="col-md-6">
                                            <Form.Group className="mb-3">
                                                <Form.Label>
                                                    Urutan
                                                </Form.Label>
                                                <Form.Control
                                                    type="number"
                                                    min="0"
                                                    value={data.order}
                                                    onChange={(e) =>
                                                        setData(
                                                            "order",
                                                            e.target.value
                                                        )
                                                    }
                                                    isInvalid={!!errors.order}
                                                    placeholder="Contoh: 1"
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                    {errors.order}
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                        </div>

                                        <div className="col-md-6">
                                            <Form.Group className="mb-3">
                                                <Form.Label>
                                                    Durasi
                                                </Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    value={data.duration}
                                                    onChange={(e) =>
                                                        setData(
                                                            "duration",
                                                            e.target.value
                                                        )
                                                    }
                                                    isInvalid={
                                                        !!errors.duration
                                                    }
                                                    placeholder="Contoh: 3 Hari"
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                    {errors.duration}
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                        </div>

                                        <div className="col-md-6">
                                            <Form.Group className="mb-3">
                                                <Form.Label>
                                                    Lokasi
                                                </Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    value={data.location}
                                                    onChange={(e) =>
                                                        setData(
                                                            "location",
                                                            e.target.value
                                                        )
                                                    }
                                                    isInvalid={
                                                        !!errors.location
                                                    }
                                                    placeholder="Contoh: Kota Kediri"
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                    {errors.location}
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                        </div>

                                        <div className="col-md-12">
                                            <Form.Group className="mb-3">
                                                <Form.Label className="required">
                                                    Deskripsi
                                                </Form.Label>
                                                <Form.Control
                                                    as="textarea"
                                                    rows={4}
                                                    value={data.description}
                                                    onChange={(e) =>
                                                        setData(
                                                            "description",
                                                            e.target.value
                                                        )
                                                    }
                                                    isInvalid={
                                                        !!errors.description
                                                    }
                                                    placeholder="Masukkan deskripsi pelatihan"
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                    {errors.description}
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                        </div>

                                        <div className="col-md-12">
                                            <Form.Group className="mb-3">
                                                <Form.Label>
                                                    Persyaratan
                                                </Form.Label>
                                                <Form.Control
                                                    as="textarea"
                                                    rows={5}
                                                    value={data.requirements}
                                                    onChange={(e) =>
                                                        setData(
                                                            "requirements",
                                                            e.target.value
                                                        )
                                                    }
                                                    isInvalid={
                                                        !!errors.requirements
                                                    }
                                                    placeholder={`Contoh:\nKTP Kota Kediri\nMemiliki usaha aktif\nBersedia mengikuti pelatihan sampai selesai`}
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                    {errors.requirements}
                                                </Form.Control.Feedback>
                                                <Form.Text className="text-muted">
                                                    Tulis satu persyaratan per
                                                    baris. Nanti akan dikirim
                                                    sebagai array.
                                                </Form.Text>
                                            </Form.Group>
                                        </div>

                                        <div className="col-md-12">
                                            <Form.Group className="mb-3">
                                                <Form.Label>
                                                    Gambar
                                                    <span className="text-muted ms-1">
                                                        (jpg, jpeg, png, webp)
                                                    </span>
                                                </Form.Label>
                                                <Form.Control
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) =>
                                                        setData(
                                                            "image",
                                                            e.target.files[0]
                                                        )
                                                    }
                                                    isInvalid={!!errors.image}
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                    {errors.image}
                                                </Form.Control.Feedback>

                                                {progress && (
                                                    <div className="progress mt-2">
                                                        <div
                                                            className="progress-bar"
                                                            style={{
                                                                width: `${progress.percentage}%`,
                                                            }}
                                                        >
                                                            {
                                                                progress.percentage
                                                            }
                                                            %
                                                        </div>
                                                    </div>
                                                )}

                                                {trainingType?.image && (
                                                    <div className="mt-2">
                                                        <small className="text-muted">
                                                            Gambar saat ini:{" "}
                                                            {trainingType.image}
                                                        </small>
                                                    </div>
                                                )}
                                            </Form.Group>
                                        </div>

                                        <div className="col-md-12">
                                            <div className="border rounded p-3 mb-3">
                                                <label className="form-label fw-semibold d-block mb-2">
                                                    Status
                                                </label>

                                                <Form.Check
                                                    type="switch"
                                                    id="is_disabled"
                                                    label="Aktifkan jenis pelatihan"
                                                    checked={data.is_disabled}
                                                    onChange={(e) =>
                                                        setData(
                                                            "is_disabled",
                                                            e.target.checked
                                                        )
                                                    }
                                                    className="mb-2"
                                                />

                                                <Form.Check
                                                    type="switch"
                                                    id="coming_soon"
                                                    label="Tampilkan sebagai Coming Soon"
                                                    checked={data.coming_soon}
                                                    onChange={(e) =>
                                                        setData(
                                                            "coming_soon",
                                                            e.target.checked
                                                        )
                                                    }
                                                    className="mb-2"
                                                />

                                                <Form.Check
                                                    type="switch"
                                                    id="closed"
                                                    label="Pendaftaran ditutup"
                                                    checked={data.closed}
                                                    onChange={(e) =>
                                                        setData(
                                                            "closed",
                                                            e.target.checked
                                                        )
                                                    }
                                                />

                                                {(errors.is_disabled ||
                                                    errors.coming_soon ||
                                                    errors.closed) && (
                                                    <div className="text-danger small mt-2">
                                                        {errors.is_disabled ||
                                                            errors.coming_soon ||
                                                            errors.closed}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="d-flex justify-content-center gap-2">
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