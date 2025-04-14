import React from "react";
import Select from "react-select";

export default function SelectJenisPelatihanKeterampilan({
    value,
    onChange,
    errors,
}) {
    const options = [
        "Western Food",
        "Bakery",
        "Teknisi HP",
        "Perawatan AC",
        "Teknisi Komputer",
        "Desain Grafis",
        "Jahit",
        "Pengelasan",
        "Teknik Bangunan",
        "Instalasi Listrik",
        "Tata Rias / MUA",
        "Tata Rambut / Salon",
        "Tata Rambut / Barber",
        "Barista",
        "Videografi / Video Editing",
        "Terapis SPA",
        "Satpam / Gada Pratama",
        "Administrasi Perkantoran",
        "Perhotelan / Housekeeping",
        "Teknik Sepeda Motor",
    ].map((item) => ({ value: item, label: item }));

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
