import React from "react";
import Select from "react-select";

export default function SelectLegalitasJenis({ value = [], onChange, errors }) {
    const options = [
        { value: "halal", label: "Halal" },
        { value: "pirt", label: "PIRT" },
        { value: "bpom", label: "BPOM" },
        { value: "hki", label: "HKI-Merek" },
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
                isMulti
                options={options}
                value={options.filter((opt) => value?.includes(opt.value))}
                onChange={(items) => onChange(items.map((item) => item.value))}
                styles={customStyles}
                className={errors ? "is-invalid" : ""}
            />
            {errors && <div className="invalid-feedback d-block">{errors}</div>}
        </div>
    );
}
