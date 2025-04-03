import React, { Fragment, useState } from "react";
import { Form } from "react-bootstrap";
import Select from "react-select";
const options = [
    { value: "1", label: "DAKSA" },
    { value: "2", label: "NETRA" },
    { value: "3", label: "RUNGU" },
    { value: "4", label: "WICARA" },
];

export default function SelectDisabilitas({ onChange = (item) => {}, errors }) {
    const [loading, setLoading] = useState(false);
    return (
        <Fragment>
            <Select
                isMulti
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
