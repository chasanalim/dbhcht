import Layout from "@/Layouts/Layout";
import { Head, Link } from "@inertiajs/react";
import { Col, Container, Image, Row } from "react-bootstrap";
import React from "react";

export default function HomePage({ meta }) {
    return (
        <Layout>
            <Head title={meta.title} />
            <div className="d-flex flex-column align-items-center justify-content-center landing">
                <Container>
                    <div className="py-5">
                        <Row className="align-items-center">
                            <Col md={6}>
                                <div className="mb-5 d-flex align-items-center gap-3">
                                    <div>
                                        <Image
                                            src="/assets/logo.png"
                                            height={75}
                                        />
                                    </div>
                                    <div>
                                        <h5 className="my-0 fw-bolder">
                                            PEMERINTAH
                                        </h5>
                                        <h5 className="my-0 text-primary">
                                            KOTA KEDIRI
                                        </h5>
                                    </div>
                                </div>
                                <h1 className="fw-bold">
                                    Pendaftaran {" "}
                                    <b className="text-primary">
                                    Pelatihan Kerja & Bantuan Modal
                                    </b>{" "}
                                    dari DBHCHT
                                </h1>
                                <h5 className="fst-italic-theme text-muted">
                                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptates dicta consectetur.
                                </h5>

                                <div className="my-4 d-flex align-items-center gap-1">
                                    <Link
                                        href={route("pelatihan")}
                                        className="btn bg-primary btn-primary"
                                        role="button"
                                    >
                                        Daftar Pelatihan Kerja
                                    </Link>
                                    <Link
                                        href={route("banmod")}
                                        className="btn btn-warning"
                                    >
                                        Daftar Bantuan Modal
                                    </Link>
                                </div>
                            </Col>
                            <Col md={6}>
                                <div>
                                    <Image
                                        src="/assets/hero-banner.png"
                                        className="img-fluid"
                                    />
                                </div>
                            </Col>
                        </Row>
                    </div>
                </Container>
            </div>
        </Layout>
    );
}
