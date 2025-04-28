import React from "react";
import Select from "react-select";

const options = [
    { value: "1", label: "TIDAK/BELUM SEKOLAH" },
    { value: "2", label: "BELUM TAMAT SD/SEDERAJAT" },
    { value: "3", label: "TAMAT SD/SEDERAJA" },
    { value: "4", label: "SMP/SEDERAJAT" },
    { value: "5", label: "SMA/SEDERAJAT" },
    { value: "6", label: "DIPLOMA I/II" },
    { value: "7", label: "AKADEMI/DIPLOMA III/S. MUDA" },
    { value: "8", label: "DIPLOMA IV/STRATA I" },
    { value: "9", label: "STRATA II" },
    { value: "10", label: "STRATA III" },
];

export default function SelectPendidikan({ value, onChange, errors }) {
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
