import { usePage } from "@inertiajs/react";
import axios from "axios";
import React, { Fragment, useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import Select from "react-select";

export default function SelectRw({
    kodeKelurahan,
    onChange = (item) => {},
    errors,
}) {
    const { env } = usePage().props;
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const url =
                env["app_url_esuket"] + "/api/rw";
            const { data } = await axios.get(url, {
                params: {
                    kode_kelurahan: kodeKelurahan,
                },
            });

            setData(data);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!!kodeKelurahan) {
            fetchData();
        }
    }, [kodeKelurahan]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <Fragment>
            <Select
                options={data}
                getOptionValue={(option) => option.id}
                getOptionLabel={(option) => option.text}
                onChange={(item) => onChange(item)}
                isLoading={loading}
            />
            {!!errors && (
                <Form.Text className="text-danger">{errors}</Form.Text>
            )}
        </Fragment>
    );
}
