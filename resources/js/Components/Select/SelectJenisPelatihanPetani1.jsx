import React, { Fragment, useEffect, useState } from "react";
import Select from "react-select";

export default function SelectJenisPelatihanPetani1({
    onChange,
    value,
    errors,
}) {
    const options = [
        {
            value: "jagung",
            label: "Pelatihan budidaya jagung (slptt) untuk penyuluh swadaya",
        },
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
                onChange={(item) => onChange(item)}
                styles={customStyles}
                className={errors ? "is-invalid" : ""}
            />
            {errors && <div className="invalid-feedback d-block">{errors}</div>}
        </div>
    );
}
