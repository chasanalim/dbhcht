import React, { Fragment } from "react";
import { Form } from "react-bootstrap";
import Select from "react-select";

export default function SelectKategoriPendaftar({
    value = "",
    onChange = (item) => {},
    errors
}) {
    const options = [
        { value: "umum", label: "Umum" },
        { value: "buruh_tani_tembakau", label: "Buruh Tani Tembakau" },
        { value: "buruh_pabrik_rokok", label: "Buruh Pabrik Rokok" },
        { value: "buruh_phk", label: "Buruh yang Terkena PHK" },
        { value: "disabilitas", label: "Disabilitas" },
        // { value: "perempuan_kk", label: "Perempuan Kepala Keluarga" },
    ];

    return (
        <Fragment>
            <Select
                options={options}
                value={options.find(option => option.value === value)}
                onChange={(selectedOption) => onChange(selectedOption?.value || "")}
                placeholder="Pilih kategori pendaftar..."
                isClearable
            />
            {!!errors && (
                <Form.Text className="text-danger">{errors}</Form.Text>
            )}
        </Fragment>
    );
}