import React from "react";
import Select from "react-select";

export default function SelectPrioritasPelatihan({
    prioritasKe,
    selectedValues = [],
    options = [],
    onChange,
    value,
    errors,
}) {
    const filteredOptions = (options || []).filter(
        (opt) => !selectedValues.includes(opt.value)
    );

    const customStyles = {
        control: (provided) => ({
            ...provided,
            borderColor: errors ? "#dc3545" : provided.borderColor,
            boxShadow: "none",
        }),
    };

    return (
        <div className="mb-3">
            <label className="form-label">Pilih Pelatihan</label>
            <Select
                options={filteredOptions}
                value={filteredOptions.find((opt) => opt.value === value)}
                onChange={(selected) => onChange(selected?.value || "")}
                styles={customStyles}
                className={errors ? "is-invalid" : ""}
                placeholder="Pilih pelatihan..."
                isClearable
            />
            {errors && <div className="invalid-feedback d-block">{errors}</div>}
        </div>
    );
}
