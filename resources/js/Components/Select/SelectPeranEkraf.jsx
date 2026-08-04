import React, { Fragment } from "react";
import { Form } from "react-bootstrap";
import Select from "react-select";

export default function SelectPeranEkraf({
    value = "",
    onChange = (item) => {},
    errors
}) {
    const options = [
        { value: "pemilik_usaha", label: "Pemilik Usaha" },
        { value: "pekerja", label: "Pekerja Ekonomi Kreatif" },
    ];

    return (
        <Fragment>
            <Select
                options={options}
                value={options.find(option => option.value === value)}
                onChange={(selectedOption) => onChange(selectedOption?.value || "")}
                placeholder="Pilih peran Anda..."
                isClearable
            />
            {!!errors && (
                <Form.Text className="text-danger">{errors}</Form.Text>
            )}
        </Fragment>
    );
}
