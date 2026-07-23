import AdminLayout from "@/Layouts/admin/AdminLayout";
import { Head, useForm, Link } from "@inertiajs/react";
import { Form } from "react-bootstrap";

export default function Create({
    title,
    kelompokTani,
    action,
    method = "POST",
}) {
    const { data, setData, post, put, processing, errors } = useForm({
        kecamatan: kelompokTani?.kecamatan || "",
        kelurahan: kelompokTani?.kelurahan || "",
        nama_kelompok: kelompokTani?.nama_kelompok || "",
        no_register: kelompokTani?.no_register || "",
        nik_ketua: kelompokTani?.nik_ketua || "",
        nama_ketua: kelompokTani?.nama_ketua || "",
        nik_anggota: kelompokTani?.nik_anggota || "",
        nama_anggota: kelompokTani?.nama_anggota || "",
        tahun_berdiri: kelompokTani?.tahun_berdiri || "",
        tingkat_kemampuan: kelompokTani?.tingkat_kemampuan || "",
        keterangan: kelompokTani?.keterangan || "",
    });

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
                                        <div className="col-md-4">
                                            <Form.Group className="mb-3">
                                                <Form.Label>
                                                    Kecamatan
                                                </Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    value={data.kecamatan}
                                                    onChange={(e) =>
                                                        setData(
                                                            "kecamatan",
                                                            e.target.value
                                                        )
                                                    }
                                                    isInvalid={!!errors.kecamatan}
                                                    placeholder="Masukkan Kecamatan"
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                    {errors.kecamatan}
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                        </div>
                                        <div className="col-md-4">
                                            <Form.Group className="mb-3">
                                                <Form.Label>
                                                    Kelurahan
                                                </Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    value={data.kelurahan}
                                                    onChange={(e) =>
                                                        setData(
                                                            "kelurahan",
                                                            e.target.value
                                                        )
                                                    }
                                                    isInvalid={!!errors.kelurahan}
                                                    placeholder="Masukkan Kelurahan"
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                    {errors.kelurahan}
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                        </div>
                                        <div className="col-md-4">
                                            <Form.Group className="mb-3">
                                                <Form.Label className="required">
                                                    Nama Kelompok
                                                </Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    value={data.nama_kelompok}
                                                    onChange={(e) =>
                                                        setData(
                                                            "nama_kelompok",
                                                            e.target.value
                                                        )
                                                    }
                                                    isInvalid={!!errors.nama_kelompok}
                                                    placeholder="Masukkan Nama Kelompok"
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                    {errors.nama_kelompok}
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                        </div>
                                        <div className="col-md-4">
                                            <Form.Group className="mb-3">
                                                <Form.Label>
                                                    No Register
                                                </Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    value={data.no_register}
                                                    onChange={(e) =>
                                                        setData(
                                                            "no_register",
                                                            e.target.value
                                                        )
                                                    }
                                                    isInvalid={!!errors.no_register}
                                                    placeholder="Masukkan No Register"
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                    {errors.no_register}
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                        </div>
                                        <div className="col-md-4">
                                            <Form.Group className="mb-3">
                                                <Form.Label>
                                                    NIK Ketua
                                                </Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    maxLength={16}
                                                    value={data.nik_ketua}
                                                    onChange={(e) =>
                                                        setData(
                                                            "nik_ketua",
                                                            e.target.value.replace(/\D/g, "")
                                                        )
                                                    }
                                                    isInvalid={!!errors.nik_ketua}
                                                    placeholder="Masukkan NIK Ketua (16 digit)"
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                    {errors.nik_ketua}
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                        </div>
                                        <div className="col-md-4">
                                            <Form.Group className="mb-3">
                                                <Form.Label>
                                                    Nama Ketua
                                                </Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    value={data.nama_ketua}
                                                    onChange={(e) =>
                                                        setData(
                                                            "nama_ketua",
                                                            e.target.value
                                                        )
                                                    }
                                                    isInvalid={!!errors.nama_ketua}
                                                    placeholder="Masukkan Nama Ketua"
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                    {errors.nama_ketua}
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                        </div>
                                        <div className="col-md-4">
                                            <Form.Group className="mb-3">
                                                <Form.Label className="required">
                                                    NIK Anggota
                                                </Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    maxLength={16}
                                                    value={data.nik_anggota}
                                                    onChange={(e) =>
                                                        setData(
                                                            "nik_anggota",
                                                            e.target.value.replace(/\D/g, "")
                                                        )
                                                    }
                                                    isInvalid={!!errors.nik_anggota}
                                                    placeholder="Masukkan NIK Anggota (16 digit)"
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                    {errors.nik_anggota}
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                        </div>
                                        <div className="col-md-4">
                                            <Form.Group className="mb-3">
                                                <Form.Label className="required">
                                                    Nama Anggota
                                                </Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    value={data.nama_anggota}
                                                    onChange={(e) =>
                                                        setData(
                                                            "nama_anggota",
                                                            e.target.value
                                                        )
                                                    }
                                                    isInvalid={!!errors.nama_anggota}
                                                    placeholder="Masukkan Nama Anggota"
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                    {errors.nama_anggota}
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                        </div>
                                        <div className="col-md-4">
                                            <Form.Group className="mb-3">
                                                <Form.Label>
                                                    Tahun Berdiri
                                                </Form.Label>
                                                <Form.Control
                                                    type="number"
                                                    min={1900}
                                                    max={new Date().getFullYear()}
                                                    value={data.tahun_berdiri}
                                                    onChange={(e) =>
                                                        setData(
                                                            "tahun_berdiri",
                                                            e.target.value
                                                        )
                                                    }
                                                    isInvalid={!!errors.tahun_berdiri}
                                                    placeholder="Masukkan Tahun Berdiri"
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                    {errors.tahun_berdiri}
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                        </div>
                                        <div className="col-md-4">
                                            <Form.Group className="mb-3">
                                                <Form.Label>
                                                    Tingkat Kemampuan
                                                </Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    value={data.tingkat_kemampuan}
                                                    onChange={(e) =>
                                                        setData(
                                                            "tingkat_kemampuan",
                                                            e.target.value
                                                        )
                                                    }
                                                    isInvalid={!!errors.tingkat_kemampuan}
                                                    placeholder="Masukkan Tingkat Kemampuan"
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                    {errors.tingkat_kemampuan}
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                        </div>
                                        <div className="col-md-4">
                                            <Form.Group className="mb-3">
                                                <Form.Label>
                                                    Keterangan
                                                </Form.Label>
                                                <Form.Control
                                                    as="textarea"
                                                    rows={3}
                                                    value={data.keterangan}
                                                    onChange={(e) =>
                                                        setData(
                                                            "keterangan",
                                                            e.target.value
                                                        )
                                                    }
                                                    isInvalid={!!errors.keterangan}
                                                    placeholder="Masukkan Keterangan"
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                    {errors.keterangan}
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                        </div>
                                    </div>

                                    <div className="d-flex justify-content-center gap-2">
                                        <Link
                                            href={route("admin.kelompoktani.index")}
                                            className="btn btn-secondary"
                                        >
                                            Batal
                                        </Link>
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
