import React, { Fragment } from "react";
import { Form } from "react-bootstrap";
import Select from "react-select";

export default function SelectJenisPelatihanEkraf({
    value = "",
    onChange = (item) => {},
    errors
}) {
    const options = [
        { value: "fashion_design", label: "Fashion Design" },
        { value: "craft_handmade", label: "Kerajinan Tangan (Craft)" },
        { value: "digital_marketing", label: "Digital Marketing" },
        { value: "photography", label: "Photography & Videography" },
        { value: "culinary_arts", label: "Culinary Arts" },
        { value: "music_production", label: "Produksi Musik" },
        { value: "graphic_design", label: "Desain Grafis" },
        { value: "animation", label: "Animasi & Motion Graphics" },
        { value: "game_development", label: "Game Development" },
        { value: "content_creation", label: "Content Creation" },
        { value: "e_commerce", label: "E-Commerce Management" },
        { value: "interior_design", label: "Interior Design" },
    ];

    return (
        <Fragment>
            <Select
                options={options}
                value={options.find(option => option.value === value)}
                onChange={(selectedOption) => onChange(selectedOption?.value || "")}
                placeholder="Pilih jenis pelatihan..."
                isClearable
            />
            {!!errors && (
                <Form.Text className="text-danger">{errors}</Form.Text>
            )}
        </Fragment>
    );
}