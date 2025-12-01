import React, { Fragment } from "react";
import { Form } from "react-bootstrap";
import Select from "react-select";

const options = [
    { value: "Bakery and Cake", label: "Bakery and Cake" },
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
