import Layout from "@/Layouts/Layout";
import { Head } from "@inertiajs/react";
import React from "react";
import FileCard from "@/Components/FileCard";

export default function File({ meta, banmod, pelatihanbanmod ,pencarikerja, umkm, pertanian, ekraf}) {
    return (
        <Layout>
            <Head title={meta.title} />
            <div className="py-4">
                <div className="container">
                    <div className="card shadow-sm">
                        <div className="card-body">
                            <h2 className="fs-3 fw-bold mb-3">
                                Daftar File Banmod 
                            </h2>
                            <hr className="py-0" />
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
                            <h2 className="fs-3 fw-bold mb-3">
                                Daftar File Pelatihan Penerima Banmod 
                            </h2>
                            <hr className="py-0"/>
                            <div className="row g-4">
                                {pelatihanbanmod.map((file) => (
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
                            <h2 className="fs-3 fw-bold mb-3">
                                Daftar File Pelatihan Pencari Kerja 
                            </h2>
                            <hr className="py-0"/>
                            <div className="row g-4">
                                {pencarikerja.map((file) => (
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
                            <h2 className="fs-3 fw-bold mb-3">
                                Daftar File Pelatihan UMKM 
                            </h2>
                            <hr className="py-0"/>
                            <div className="row g-4">
                                {umkm.map((file) => (
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
                            <h2 className="fs-3 fw-bold mb-3">
                                Daftar File Pelatihan Pertanian 
                            </h2>
                            <hr className="py-0"/>
                            <div className="row g-4">
                                {pertanian.map((file) => (
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
                            <h2 className="fs-3 fw-bold mb-3">
                                Daftar File Pelatihan Ekonomi Kreatif 
                            </h2>
                            <hr className="py-0"/>
                            <div className="row g-4">
                                {ekraf.map((file) => (
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
