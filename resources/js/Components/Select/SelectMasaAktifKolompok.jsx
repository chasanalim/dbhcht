import axios from "axios";
import React, { Fragment, useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import Select from "react-select";

export default function SelectMasaAktifKolompok({
    onChange = (item) => {},
    errors,
}) {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const url = route(
                "regpelatihanpetani.masaaktifkelompoktani.masaaktifkelompoktani"
            );
            const { data } = await axios.get(url);
            setData(data);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <Fragment>
            <Select
                options={data}
                getOptionValue={(option) => option.id}
                getOptionLabel={(option) => option.jawaban}
                onChange={(item) => onChange(item)}
                isLoading={loading}
            />
            {!!errors && (
                <Form.Text className="text-danger">{errors}</Form.Text>
            )}
        </Fragment>
    );
}
