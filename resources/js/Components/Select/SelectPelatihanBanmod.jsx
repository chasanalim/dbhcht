import React, { Fragment } from "react";
import { Form } from "react-bootstrap";
import Select from "react-select";

const options = [
    { value: "Tenun", label: "Tenun" },
    { value: "Batik/Ecoprint", label: "Batik/Ecoprint" },
    { value: "Sulam/Bordir", label: "Sulam/Bordir" },
    { value: "Rajut", label: "Rajut" },
    {
        value: "Aksesoris (Gelang, Kalung)",
        label: "Aksesoris (Gelang, Kalung)",
    },
    { value: "Anyaman", label: "Anyaman" },
    { value: "Kerajinan Lainnya", label: "Kerajinan Lainnya" },
    { value: "Penjahitan Pakaian", label: "Penjahitan Pakaian" },
    {
        value: "Penjahitan Tas, Dompet, dll",
        label: "Penjahitan Tas, Dompet, dll",
    },
    { value: "Bengkel", label: "Bengkel" },
    { value: "Makanan (Roti)", label: "Makanan (Roti)" },
    { value: "Makanan (Kue Kering)", label: "Makanan (Kue Kering)" },
    { value: "Makanan (Kue Basah)", label: "Makanan (Kue Basah)" },
    { value: "Makanan (Catering)", label: "Makanan (Catering)" },
    {
        value: "Makanan (Olahan Daging/Ikan)",
        label: "Makanan (Olahan Daging/Ikan)",
    },
    {
        value: "Makanan (Keripik, Krupuk, Rempeyek)",
        label: "Makanan (Keripik, Krupuk, Rempeyek)",
    },
    { value: "Minuman (Jamu)", label: "Minuman (Jamu)" },
    { value: "Minuman (Kekinian)", label: "Minuman (Kekinian)" },
    { value: "Fotokopi/Percetakan", label: "Fotokopi/Percetakan" },
    { value: "Sablon Kaos", label: "Sablon Kaos" },
];

export default function SelectJenisPelatihan({
    value,
    onChange = () => {},
    errors,
}) {
    return (
        <Fragment>
            <Select
                options={options}
                value={
                    value
                        ? options.find((option) => option.value === value)
                        : null
                }
                onChange={(item) => onChange(item)}
                placeholder="Pilih Jenis Pelatihan"
                isClearable
            />
            {!!errors && (
                <Form.Text className="text-danger">{errors}</Form.Text>
            )}
        </Fragment>
    );
}
