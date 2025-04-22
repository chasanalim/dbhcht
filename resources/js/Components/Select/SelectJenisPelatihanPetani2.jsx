import React, { Fragment, useEffect, useState } from "react";
import Select from "react-select";

export default function SelectJenisPelatihanPetani2({
    onChange,
    value,
    errors,
}) {
    const options = [
        { value: "bawang_merah", label: "Pelatihan budidaya bawang merah" },
        { value: "hidroponik", label: "Pelatihan hidroponik" },
        {
            value: "jagung",
            label: "Pelatihan budidaya jagung (slptt) untuk kelompok tani",
        },
        { value: "jamur", label: "Pelatihan budidaya aneka jamur" },
        {
            value: "mikroorganisme",
            label: "Pelatihan pembuatan mikroorganisme",
        },
        { value: "perikanan", label: "Pelatihan budidaya perikanan" },
        {
            value: "tanaman_sehat",
            label: "Pelatihan Manajemen Budidaya Tanaman Sehat di Pekarangan Pangan Lestari Kelompok Wanita Tani ",
        },
        { value: "peternakan", label: "Pelatihan budidaya peternakan " },
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
