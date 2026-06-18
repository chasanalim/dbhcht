import React, { Fragment } from "react";
import { Form } from "react-bootstrap";
import Select from "react-select";

const options = [
    { value: "Penjahit Pemula", label: "Penjahit Pemula" },
    { value: "Penjahit Naik Kelas", label: "Penjahit Naik Kelas" },
    { value: "Makanan Tradisional", label: "Makanan Tradisional" },
    { value: "Digma Kerajinan", label: "Digma Kerajinan" },
    { value: "Kewirausahaan Kuliner", label: "Kewirausahaan Kuliner" },
    { value: "Kewirausahaan MUA", label: "Kewirausahaan MUA" },
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
