import React, { Fragment, useState } from "react";
import { Form } from "react-bootstrap";
import Select from "react-select";
const options = [
    { value: "2022", label: "2022" },
    { value: "2023", label: "2023" },
    { value: "2024", label: "2024" },
];
export default function SelectTahun({ onChange = (item) => {}, errors }) {
    const [loading, setLoading] = useState(false);
    return (
        <Fragment>
            <Select
                options={options}
                onChange={(item) => onChange(item)}
                isLoading={loading}
            />
            {!!errors && (
                <Form.Text className="text-danger">{errors}</Form.Text>
            )}
        </Fragment>
    );
}
