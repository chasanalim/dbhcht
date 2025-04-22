import React from "react";
import Select from "react-select";

const options = [
    { value: "kurangdarisatu", label: "Kurang dari 1 Tahun" },
    { value: "satusampaidua", label: "1 s.d. 2 Tahun" },
    { value: "lebihdaridua", label: "Lebih dari 2 Tahun" },
];

export default function SelectMasaAktifKolompok({ value, onChange, errors }) {
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
