import React from "react";
import { Col, Container, Row, Image } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";

export default function LayoutFooter() {
    return (
        <footer className="py-0">
            <div className="position-relative text-white text-align-center bg-secondary">
                <Container>
                    <Row className="text-white py-5">
                        <Col md={4}>
                            <h5 className="fw-bold">Hubungi Kami</h5>
                            <div className="underline2 d-none d-md-block"></div>
                            <ul className="py-3 small">
                                <li>
                                    <i className="bi bi-geo-alt-fill me-2"></i>
                                    Jl. Basuki Rahmat No.15, Pocanan, Kota
                                    Kediri Kecamatan, Kota Kediri, Jawa Timur
                                    64129
                                </li>
                                <li>
                                    <i className="bi bi-telephone-fill me-2"></i>
                                    (0354) 682955
                                </li>
                            </ul>
                            <Row className="justify-content-start align-items-start">
                                <Col>
                                    <i className="bi bi-instagram fs-4"></i>
                                </Col>
                                <Col>
                                    <i className="bi bi-facebook fs-4"></i>
                                </Col>
                                <Col>
                                    <i className="bi bi-twitter fs-4"></i>
                                </Col>
                                <Col>
                                    <i className="bi bi-youtube fs-4"></i>
                                </Col>
                            </Row>
                        </Col>
                        <Col md={6}>
                            <h5 className="fw-bold">
                                Tentang Banmod - Pelatihan DBHCHT
                            </h5>
                            <div className="underline2 d-none d-md-block"></div>
                            <p className="py-3 small text-white">
                                <span className="fw-bold">
                                    Banmod - Pelatihan DBHCHT
                                </span>{" "}
                                Bantuan Modal dari Dana Bagi Hasil Cukai Hasil
                                Tembakau (DBH CHT) adalah salah satu bentuk
                                pemanfaatan dana yang berasal dari pungutan
                                cukai atas hasil tembakau (seperti rokok) yang
                                dibagikan kepada pemerintah daerah. Dana ini
                                digunakan untuk mendukung berbagai program yang
                                berhubungan dengan dampak dari konsumsi hasil
                                tembakau dan pemberdayaan masyarakat, salah
                                satunya dalam bentuk bantuan modal usaha serta pelatihan ketrampilan.
                            </p>
                        </Col>

                        <Col md={2}>
                            <h5 className="fw-bold">Statistik Kunjungan</h5>
                            <div className="underline2 d-none d-md-block"></div>
                            <div className="statistik d-flex flex-column align-items-center w-100 mt-4 rounded py-3">
                                <span className="small px-3 py-1 rounded bg-primary mb-1">
                                    <i className="bi bi-bar-chart-fill"></i>
                                </span>
                                <span style={{ fontSize: "11px" }}>
                                    Total View
                                </span>
                                <span className="fs-3">12345</span>
                                <span
                                    className="small px-3 py-1 rounded bg-primary w-75 text-center"
                                    style={{ fontSize: "11px" }}
                                >
                                    <i className="online bi bi-circle-fill small text-success"></i>{" "}
                                    10 Online
                                </span>
                            </div>
                        </Col>
                    </Row>
                    <hr />
                    <p className="text-center pb-3 text-white">
                        Copyright &copy; {new Date().getFullYear()} - Pemerintah
                        Kota Kediri.
                    </p>
                </Container>
            </div>
        </footer>
    );
}
