import Layout from "@/Layouts/Layout";
import { Head } from "@inertiajs/react";
import React from "react";

export default function HomePage({ meta }) {
    return (
        <Layout>
            <Head title={meta.title} />
        </Layout>
    );
}
