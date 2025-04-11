import React from "react";
import Select from "react-select";

export default function SelectPemasaran({ value, onChange, errors }) {
    const options = [
        { value: "lokal", label: "Lokal" },
        { value: "regional", label: "Regional" },
        { value: "nasional", label: "Nasional" },
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
