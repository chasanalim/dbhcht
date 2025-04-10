import { Head, usePage } from "@inertiajs/react";
import { useState } from "react";
import { Form } from "react-bootstrap";
import Layout from "@/Layouts/Layout";

import SelectJenisPelatihan from "@/Components/Select/SelectJenisPelatihan";
import FormKeterampilan from "./Forms/FormKeterampilan";
import FormUMKM from "./Forms/FormUMKM";
import FormPenyuluh from "./Forms/FormPenyuluh";
import FormPetani from "./Forms/FormPetani";
import FormIndustri from "./Forms/FormIndustri";

export default function FormPelatihan() {
    const { meta } = usePage().props;

    const [data, setData] = useState({
        jenisPelatihan: "",
    });

    const [errors, setErrors] = useState({});

    return (
        <Layout>
            <Head title={meta.title} />
            <div className="py-4">
                <div className="card-hero">
                    <div className="container py-4">
                        <div className="big-text text-muted mb-4">
                            Form Pendaftaran Pelatihan
                            <div className="underline"></div>
                        </div>

                        <Form.Group className="row mb-1">
                            <div className="col-md-12 col-12 mb-3">
                                <Form.Label className="required">Jenis Pelatihan</Form.Label>
                                <SelectJenisPelatihan
                                    value={data.jenisPelatihan}
                                    onChange={(item) =>
                                        setData((prev) => ({
                                            ...prev,
                                            jenisPelatihan: item.value,
                                        }))
                                    }
                                    errors={errors.jenisPelatihan}
                                />
                            </div>
                        </Form.Group>

                        {/* Render Form Berdasarkan Pilihan */}
                        {data.jenisPelatihan === "keterampilan" && (
                            <FormKeterampilan data={data} setData={setData} errors={errors} />
                        )}
                        {data.jenisPelatihan === "umkm" && (
                            <FormUMKM data={data} setData={setData} errors={errors} />
                        )}
                        {data.jenisPelatihan === "penyuluh" && (
                            <FormPenyuluh data={data} setData={setData} errors={errors} />
                        )}
                        {data.jenisPelatihan === "petani" && (
                            <FormPetani data={data} setData={setData} errors={errors} />
                        )}
                        {data.jenisPelatihan === "industri" && (
                            <FormIndustri data={data} setData={setData} errors={errors} />
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
}
