import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";

export default function LayoutFooter() {
    return (
        <footer
            style={{
                background: "linear-gradient(90deg,#4f8cff 60%,#6ea8fe 100%)",
                color: "#fff",
                padding: "0",
            }}
        >
            <Container fluid style={{ padding: "0" }}>
                <Row
                    className="py-5"
                    style={{
                        maxWidth: 1600,
                        margin: "0 auto",
                        padding: "0 0px",
                        display: "flex",
                        // gap: 24,
                    }}
                >
                    <Col md={4} className="mb-4 mb-md-0">
                        <h5 className="fw-bold mb-3" style={{ color: "#fff" }}>
                            Hubungi Kami
                        </h5>
                        <ul
                            className="py-2 small"
                            style={{
                                color: "#e0e7ff",
                                listStyle: "none",
                                paddingLeft: 0,
                            }}
                        >
                            <li className="mb-2">
                                <i
                                    className="bi bi-geo-alt-fill me-2"
                                    style={{ color: "#ffb700" }}
                                ></i>
                                Jl. Himalaya No.4, Sukorame, Mojoroto, Kota Kediri, Jawa Timur 64129
                            </li>
                            <li>
                                <i
                                    className="bi bi-telephone-fill me-2"
                                    style={{ color: "#ffb700" }}
                                ></i>
                                (0354) 6099113
                            </li>
                        </ul>
                        <div className="d-flex gap-3 mt-3">
                            <a
                                href="https://www.instagram.com/pemkotkediri" target="_blank"
                                className="fs-4"
                                style={{
                                    color: "#ffb700",
                                    transition: "color 0.2s",
                                }}
                            >
                                <i className="bi bi-instagram"></i>
                            </a>
                            <a
                                href="https://www.facebook.com/pemkotkediri.nda/" target="_blank"
                                className="fs-4"
                                style={{
                                    color: "#ffb700",
                                    transition: "color 0.2s",
                                }}
                            >
                                <i className="bi bi-facebook"></i>
                            </a>
                            <a
                                href="https://x.com/pemkot_kediri?lang=en"
                                className="fs-4"
                                style={{
                                    color: "#ffb700",
                                    transition: "color 0.2s",
                                }}
                            >
                                <i className="bi bi-twitter"></i>
                            </a>
                            <a
                                href="https://www.youtube.com/channel/UCX6KxXBUbivqWXTku0nnPbA"
                                className="fs-4"
                                style={{
                                    color: "#ffb700",
                                    transition: "color 0.2s",
                                }}
                            >
                                <i className="bi bi-youtube"></i>
                            </a>
                            <a
                                href="https://www.tiktok.com/@pemkotkediri"
                                className="fs-4"
                                style={{
                                    color: "#ffb700",
                                    transition: "color 0.2s",
                                }}
                            >
                                <i className="bi bi-tiktok"></i>
                            </a>
                        </div>
                    </Col>
                    <Col md={4} className="mb-4 mb-md-0">
                        <h5 className="fw-bold mb-3" style={{ color: "#fff" }}>
                            Tentang Banmod - Pelatihan DBHCHT
                        </h5>
                        <p className="small" style={{ color: "#e0e7ff" }}>
                            <span className="fw-bold" style={{ color: "#fff" }}>
                                Banmod - Pelatihan DBHCHT
                            </span>{" "}
                            Bantuan Modal dari Dana Bagi Hasil Cukai Hasil
                            Tembakau (DBH CHT) adalah salah satu bentuk
                            pemanfaatan dana yang berasal dari pungutan cukai
                            atas hasil tembakau (seperti rokok) yang dibagikan
                            kepada pemerintah daerah. Dana ini digunakan untuk
                            mendukung berbagai program yang berhubungan dengan
                            dampak dari konsumsi hasil tembakau dan pemberdayaan
                            masyarakat, salah satunya dalam bentuk bantuan modal
                            usaha serta pelatihan ketrampilan.
                        </p>
                    </Col>
                    <Col md={4} className="mb-4 mb-md-0">
                        <h5 className="fw-bold mb-3" style={{ color: "#fff" }}>
                            Statistik Kunjungan
                        </h5>
                        <div
                            className="d-flex flex-column align-items-center w-100 rounded"
                            style={{
                                background: "rgba(255,255,255,0.08)",
                                boxShadow: "0 2px 16px #4f8cff22",
                                padding: "1.5rem 1rem",
                                marginTop: 16,
                            }}
                        >
                            <span
                                className="small px-3 py-1 rounded mb-1"
                                style={{
                                    background: "#ffb700",
                                    color: "#22223b",
                                }}
                            >
                                <i className="bi bi-bar-chart-fill"></i>
                            </span>
                            <span
                                style={{ fontSize: "11px", color: "#e0e7ff" }}
                            >
                                Total View
                            </span>
                            <span
                                className="fs-3 fw-bold"
                                style={{ color: "#fff" }}
                            >
                                7983
                            </span>
                            <span
                                className="small px-3 py-1 rounded w-75 text-center"
                                style={{
                                    background: "#ffb700",
                                    color: "#22223b",
                                    fontSize: "11px",
                                }}
                            >
                                <i className="online bi bi-circle-fill small text-success"></i>{" "}
                                7 Online
                            </span>
                        </div>
                    </Col>
                </Row>
                <hr style={{ borderColor: "#fff", opacity: 0.2 }} />
                <p
                    className="text-center pb-3"
                    style={{ color: "#e0e7ff", fontWeight: 500 }}
                >
                    Copyright &copy; 2026 - Diskominfo Kota Kediri
                </p>
            </Container>
        </footer>
    );
}
