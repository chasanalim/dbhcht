import React, { Fragment, useState } from "react";
import { Form } from "react-bootstrap";
import Select from "react-select";
const options = [
    { value: "450 VA", label: "450 VA" },
    { value: "900 VA", label: "900 VA" },
    { value: "1300 VA", label: "1300 VA" },
    { value: "2200 VA", label: "2200 VA" },
    { value: "3500-5500 VA", label: "3500-5500 VA" },
    { value: "6600 VA/LEBIH", label: "6600 VA/LEBIH" },
];

export default function SelectListrik({ onChange = (item) => {}, errors }) {
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
