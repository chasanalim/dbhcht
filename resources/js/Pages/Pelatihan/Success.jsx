import Layout from "@/Layouts/Layout";
import { Head, usePage } from "@inertiajs/react";
import React from "react";
import { Card, Container } from "react-bootstrap";
import confetti from "canvas-confetti";

export default function SuccessPage({ meta }) {
    const { env } = usePage().props;

    React.useEffect(() => {
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
        });
    }, []);

    return (
        <Layout>
            <Head title={meta.title} />
            <Container className="py-5">
                <Card className="border-0 shadow-sm">
                    <Card.Body className="text-center p-5">
                        <div className="mb-4">
                            <i
                                className="bi bi-check-circle-fill text-success"
                                style={{ fontSize: "4rem" }}
                            ></i>
                        </div>

                        <h2
                            className="mb-4 fw-bold"
                            style={{ color: "#2d3748" }}
                        >
                            Pendaftaran Berhasil!
                        </h2>

                        <div className="mb-4" style={{ color: "#718096" }}>
                            <p className="mb-3">
                                Terima kasih telah mendaftar Program{" "}
                                {meta.jenis} Kota Kediri. Data Anda telah kami
                                terima dan akan diproses lebih lanjut.
                            </p>
                            <p className="mb-3">
                                Mohon menunggu informasi selanjutnya melalui
                                WhatsApp yang telah Anda daftarkan.
                            </p>
                            <p>
                                Jika ada pertanyaan, silakan hubungi kami
                                melalui:
                            </p>
                        </div>

                        <div
                            className="contact-info p-4 mb-4"
                            style={{
                                background: "#f7fafc",
                                borderRadius: "10px",
                            }}
                        >
                            <div className="mb-2">
                                <i className="bi bi-whatsapp me-2 text-success"></i>
                                <a
                                    href={`https://wa.me/${env["app_wa_pelatihan"]}`}
                                    className="text-decoration-none"
                                >
                                    {env["app_wa_pelatihan"]}
                                </a>
                            </div>
                            <div>
                                <i className="bi bi-envelope me-2 text-primary"></i>
                                <a
                                    href={`mailto:${env["app_email_pelatihan"]}`}
                                    className="text-decoration-none"
                                >
                                    {env["app_email_pelatihan"]}
                                </a>
                            </div>
                        </div>

                        <div className="d-flex justify-content-center">
                            <a href="/" className="btn btn-primary px-4 py-2">
                                <i className="bi bi-house-door me-2"></i>
                                Kembali ke Beranda
                            </a>
                        </div>
                    </Card.Body>
                </Card>
            </Container>
        </Layout>
    );
}
