import { Head, usePage } from "@inertiajs/react";
import { useEffect } from "react";
import { Form } from "react-bootstrap";
import Layout from "@/Layouts/Layout";

import SelectJenisPelatihan from "@/Components/Select/SelectJenisPelatihan";
import FormKeterampilan from "./Forms/FormKeterampilan";
import FormUMKM from "./Forms/FormUMKM";
import FormPenyuluh from "./Forms/FormPenyuluh";
import FormPetani from "./Forms/FormPetani";
import FormIndustri from "./Forms/FormIndustri";
import FormPenerimaBanmod from "./Forms/FormPenerimaBanmod";
import FormEkonomiKreatif from "./Forms/FormEkonomiKreatif";

import { useState } from "react";

export default function FormPelatihan() {
    const { meta, jenis } = usePage().props;
    const [jenisPelatihan, setJenisPelatihan] = useState(jenis || "");

    // const [jenisPelatihan, setJenisPelatihan] = useState("");

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
                                <Form.Label className="required">
                                    Jenis Pelatihan
                                </Form.Label>
                                <SelectJenisPelatihan
                                    value={jenisPelatihan}
                                    onChange={(item) =>
                                        setJenisPelatihan(item.value)
                                    }
                                    errors={null}
                                />
                            </div>
                        </Form.Group>

                        {jenisPelatihan === "keterampilan" && (
                            <FormKeterampilan />
                        )}
                        {jenisPelatihan === "umkm" && <FormUMKM />}
                        {jenisPelatihan === "penyuluh" && <FormPenyuluh />}
                        {jenisPelatihan === "petani" && <FormPetani />}
                        {jenisPelatihan === "ekraf" && <FormEkonomiKreatif />}
                        {jenisPelatihan === "penerimabanmod" && (
                            <FormPenerimaBanmod />
                        )}
                        
                    </div>
                </div>
            </div>
        </Layout>
    );
}
