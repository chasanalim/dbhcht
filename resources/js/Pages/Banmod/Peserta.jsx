import Layout from "@/Layouts/Layout";
import { Head } from "@inertiajs/react";
import React from "react";
import { Container } from "react-bootstrap";

export default function Peserta({ meta }) {
    return (
        <Layout>
            <Head title={meta.title} />
            <Container className="py-5"></Container>
        </Layout>
    );
}
