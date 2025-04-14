import React from "react";
import Select from "react-select";

export default function SelectAlasanPelatihan({ value, onChange, errors }) {
    const options = [
        { value: "1", label: "Butuh Pekerjaan" },
        { value: "2", label: "Meningkatkan Keterampilan" },
        { value: "3", label: "Mencari Pengalaman" },
        { value: "4", label: "Mengisi Waktu Luang" },
    ];

    const customStyles = {
        control: (provided) => ({
            ...provided,
            borderColor: errors ? "#dc3545" : provided.borderColor,
            boxShadow: "none",
        }),
    };

    return (
        <div>
            <Select
                options={options}
                value={options.find((opt) => opt.value === value)}
                onChange={(item) => onChange(item.value)}
                styles={customStyles}
                className={errors ? "is-invalid" : ""}
            />
            {errors && <div className="invalid-feedback d-block">{errors}</div>}
        </div>
    );
}
