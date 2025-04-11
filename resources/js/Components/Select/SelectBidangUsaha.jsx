import React from "react";
import Select from "react-select";

const options = [
    { value: "kuliner", label: "Kuliner" },
    { value: "kerajinan", label: "Kerajinan" },
    { value: "fashion", label: "Fashion" },
    { value: "agribisnis", label: "Agribisnis (Pertanian, Peternakan, Perikanan)" },
    { value: "jasa", label: "Jasa/Layanan" },
    { value: "perdagangan", label: "Perdagangan" },
];

export default function SelectBidangUsaha({ value, onChange, errors }) {
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