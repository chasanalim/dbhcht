import React from "react";
import Select from "react-select";
import { TRUE } from "sass";

const SelectJenisPelatihan = ({ value, onChange, errors, options = [] }) => {
    // Fallback ke hardcoded options jika prop options kosong
    const defaultOptions = [
        {
            value: "keterampilan",
            label: "Pelatihan Keterampilan untuk Pencari Kerja",
            isDisabled: true,
        },
        {
            value: "penerimabanmod",
            label: "Pelatihan Keterampilan Penerima Banmod",
            isDisabled: true,
        },
        {
            value: "ekraf",
            label: "Pelatihan Ekonomi Kreatif ",
            isDisabled: true,
        },
        {
            value: "umkm",
            label: "Pelatihan UMKM ",
            isDisabled: true,
        },
        {
            value: "petani",
            label: "Pelatihan Pertanian ",
            isDisabled: true,
        },
    ];

    const selectOptions = options.length > 0 ? options : defaultOptions;

    const customStyles = {
        option: (provided, state) => ({
            ...provided,
            backgroundColor:
                state.isDisabled
                    ? "#f0f0f0"
                    : state.isFocused
                    ? "#e3f2fd"
                    : "#fff",
            color: state.isDisabled ? "#2e2d2dff" : "#111111ff",
            padding: "12px",
            cursor: state.isDisabled ? "not-allowed" : "pointer",
            fontWeight: state.isDisabled ? "400" : "500",
            opacity: state.isDisabled ? 0.6 : 1,
            ":active": {
                backgroundColor:
                    state.isDisabled ? "#f0f0f0" : "#1976d2",
            },
        }),
        control: (provided, state) => ({
            ...provided,
            borderColor:
                errors ? "#dc3545" : state.isFocused ? "#1976d2" : "#ced4da",
            boxShadow:
                state.isFocused && !errors
                    ? "0 0 0 0.2rem rgba(25, 118, 210, 0.25)"
                    : "none",
            minHeight: "38px",
            backgroundColor: "#fff",
        }),
        singleValue: (provided, state) => ({
            ...provided,
            color: state.isDisabled ? "#999" : "#181818ff",
        }),
    };

    return (
        <div className="mb-3">
            <Select
                name="jenis_pelatihan"
                options={selectOptions}
                value={
                    selectOptions.find((option) => option.value === value) || null
                }
                onChange={(item) => {
                    if (!item.isDisabled) {
                        onChange(item);
                    }
                }}
                isClearable={false}
                isSearchable={true}
                placeholder="Pilih Jenis Pelatihan..."
                styles={customStyles}
                className={`form-control ${
                    errors ? "is-invalid" : ""
                }`}
                classNamePrefix="react-select"
                isOptionDisabled={(option) => option.isDisabled}
            />
            {errors && (
                <div className="invalid-feedback d-block">{errors}</div>
            )}
        </div>
    );
};

export default SelectJenisPelatihan;
