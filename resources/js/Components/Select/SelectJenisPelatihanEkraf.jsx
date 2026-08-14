import React, { Fragment } from "react";
import { Form } from "react-bootstrap";
import Select from "react-select";

export default function SelectJenisPelatihanEkraf({
    value = "",
    onChange = (item) => {},
    errors,
}) {
    const options = [
        // { value: "fotografi", label: "Fotografi" },
        // { value: "videografi", label: "Videografi" },
        // { value: "desain_grafis", label: "Desain Grafis" },
        { value: "dkv", label: "Desain Komunikasi Visual" },
        { value: "mua", label: "Makeup Artist (MUA)" },
        { value: "diversifikasi_kriya", label: "Diversifikasi Kriya" },
        { value: "tour_guide", label: "Tour Guide" },
        { value: "kuliner_tradisional", label: "Kuliner Tradisional Food" },
        { value: "pelatihan_export", label: "Pelatihan Export" },
    ];

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
