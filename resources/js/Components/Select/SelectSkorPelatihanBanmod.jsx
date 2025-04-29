import React, { useState, useEffect } from "react";
import Select from "react-select";

export default function SelectSkorPelatihanBanmod({
    kategori,
    value,
    onChange,
    errors,
}) {
    const [options, setOptions] = useState([]);

    useEffect(() => {
        if (!kategori) return; // tambahin safety kalo kategori belum ada

        fetch(`/skor-pelatihan/${kategori}`)
            .then((res) => res.json())
            .then((res) => {
                const formattedOptions = res.map((item) => ({
                    value: item.skor,
                    label: item.jawaban,
                }));
                setOptions(formattedOptions);
            })
            .catch((err) => console.error("Error fetching skor:", err));
    }, [kategori]);

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
                onChange={(selected) => onChange(selected)}
                styles={customStyles}
                className={errors ? "is-invalid" : ""}
            />
            {errors && <div className="invalid-feedback d-block">{errors}</div>}
        </div>
    );
}
