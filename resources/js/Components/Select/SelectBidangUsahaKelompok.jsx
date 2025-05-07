import React from "react";
import Select from "react-select";

const options = [
    { value: "Pertanian", label: "Pertanian" },
    { value: "Perikanan", label: "Perikanan" },
    { value: "Peternakan", label: "Peternakan" },
    { value: "Kelompok Wanita Tani", label: "Kelompok Wanita Tani" },
];

export default function SelectBidangUsahaKelompok({ value, onChange, errors }) {
    const customStyles = {
        control: (provided) => ({
            ...provided,
            borderColor: errors ? "#dc3545" : provided.borderColor,
            boxShadow: "none",
        }),
    };

    return (
        <>
            <Select
                options={options}
                value={options.find((opt) => opt.value === value)}
                onChange={(opt) => onChange(opt.value)}
                styles={customStyles}
                className={errors ? "is-invalid" : ""}
            />
            {errors && <div className="invalid-feedback d-block">{errors}</div>}
        </>
    );
}
