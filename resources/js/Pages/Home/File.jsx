import Layout from "@/Layouts/Layout";
import { Head } from "@inertiajs/react";
import React from "react";
import FileCard from "@/Components/FileCard";

export default function File({ meta, banmod, pelatihan }) {
    return (
        <Layout>
            <Head title={meta.title} />
            <div className="py-4">
                <div className="container">
                    <div className="card shadow-sm">
                        <div className="card-body">
                            <h2 className="fs-2 fw-bold mb-4">
                                Daftar File Banmod 2025
                            </h2>
                            <div className="row g-4">
                                {banmod.map((file) => (
                                    <div
                                        className="col-md-6 col-lg-4"
                                        key={file.id}
                                    >
                                        <FileCard file={file} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="py-4">
                <div className="container">
                    <div className="card shadow-sm">
                        <div className="card-body">
                            <h2 className="fs-2 fw-bold mb-4">
                                Daftar File Pelatihan Kerja DBHCHT 2025
                            </h2>
                            <div className="row g-4">
                                {pelatihan.map((file) => (
                                    <div
                                        className="col-md-6 col-lg-4"
                                        key={file.id}
                                    >
                                        <FileCard file={file} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </Layout>
    );
}
