import React from "react";
import Select from "react-select";

const options = [
    "Digital Marketing",
    // "Pelatihan Desain Grafis",
    "Manajemen Usaha dan Keuangan",
    "Conten Creator",
    // "Pelatihan Media Sosial dan E-Commerce",
    // "Pelatihan Peningkatan Kualitas SDM Pelaku Usaha",
    // "Pelatihan Strategi Foto Produk",
    // "Peningkatan Kualitas Produk Bakery",
    // "Pelatihan Bakery",
    "Desain Kemasan dan Packaging",
    "Desain Motif Tenun dan Batik",
    // "Pelatihan Produk Desain Motif Tenun/Batik",
    // "Pelatihan Produk Frozen Food",
    // "Pelatihan Produk Handicraft",
    // "Pelatihan Jajanan Kekinian",
    "Frozen Food",
    "Barista",
    // "Pelatihan Korean Food",
    // "Pelatihan Reparasi Resep Masakan dan Kue Tradisional",
].map((label) => ({ value: label, label }));

export default function SelectPrioritasPelatihan({
    prioritasKe,
    selectedValues = [],
    onChange,
    value,
    errors,
}) {
    const filteredOptions = options.filter(
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
            <label className="form-label">
                Pilih Pelatihan
            </label>
            <Select
                options={filteredOptions}
                value={filteredOptions.find((opt) => opt.value === value)}
                onChange={(selected) => onChange(selected?.value || "")}
                styles={customStyles}
                className={errors ? "is-invalid" : ""}
            />
            {errors && <div className="invalid-feedback d-block">{errors}</div>}
        </div>
    );
}
