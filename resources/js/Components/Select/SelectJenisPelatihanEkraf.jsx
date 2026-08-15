import React, { Fragment } from "react";
import { Form } from "react-bootstrap";
import Select from "react-select";

export default function SelectJenisPelatihanEkraf({
    value = "",
    onChange = (item) => {},
    errors,
    options = [],
}) {
    return (
        <Fragment>
            <Form.Label className="required mb-2">Jenis Pelatihan</Form.Label>

            <Select
                options={options}
                value={options.find((option) => option.value === value)}
                onChange={(selectedOption) =>
                    onChange(selectedOption?.value || "")
                }
                placeholder="Pilih jenis pelatihan..."
                isClearable
            />

            {!!errors && (
                <Form.Text className="text-danger d-block mt-1">
                    {errors}
                </Form.Text>
            )}
        </Fragment>
    );
}
