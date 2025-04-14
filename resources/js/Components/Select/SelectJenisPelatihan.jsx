import React, { Fragment, useEffect, useState } from "react";
import Select from "react-select";

export default function SelectJenisPelatihan({ onChange, value, errors }) {
    const options = [
        {
            value: "keterampilan",
            label: "Pelatihan Keterampilan Untuk Pencari Kerja",
        },
        {
            value: "penerimabanmod",
            label: "Pelatihan Keterampilan Untuk Penerima Banmod",
        },
        { value: "umkm", label: "Pelatihan UMKM" },
        // { value: "penyuluh", label: "Pelatihan Penyuluh" },
        { value: "petani", label: "Pelatihan Petani" },
        // { value: "industri", label: "Pelatihan Industri" },
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
