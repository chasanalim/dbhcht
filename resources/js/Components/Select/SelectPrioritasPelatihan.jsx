import React from "react";
import Select from "react-select";

const options = [
    "Pelatihan Kurasi Produk",
    "Pelatihan Konten Kreator",
    "Pelatihan Desain Grafis",
    "Pelatihan Manajemen Usaha dan Keuangan",
    "Pelatihan Media Sosial dan E-Commerce",
    "Pelatihan Peningkatan Kualitas SDM Pelaku Usaha",
    "Pelatihan Strategi Foto Produk",
    "Pelatihan Peningkatan Kualitas Produk Bakery",
    "Pelatihan Barista",
    "Pelatihan Bakery",
    "Pelatihan Desain Kemasan dan Packaging",
    "Pelatihan Produk Desain Motif Tenun/Batik",
    "Pelatihan Produk Frozen Food",
    "Pelatihan Produk Handicraft",
    "Pelatihan Jajanan Kekinian",
    "Pelatihan Korean Food",
    "Pelatihan Reparasi Resep Masakan dan Kue Tradisional",
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
                Pilih Pelatihan Prioritas {prioritasKe}
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
