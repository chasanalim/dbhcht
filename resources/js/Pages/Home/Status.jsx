import Layout from "@/Layouts/Layout";
import { Head } from "@inertiajs/react";
import {
    Alert,
    Button,
    Card,
    Col,
    Container,
    Form,
    Row,
    Table,
} from "react-bootstrap";
import React, { useState } from "react";
import axios from "axios";

export default function Index({ meta }) {
    const [nik, setNik] = useState("");
    const [nikLength, setNikLength] = useState(0);
    const [error, setError] = useState("");
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setResults(null);
        setLoading(true);

        try {
            const response = await axios.get(`/cek-nik/${nik}`);
            setResults(response.data.data);
        } catch (error) {
            setError(error.response?.data?.message || "Terjadi kesalahan");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <Head title={meta.title} />

            <Container className="py-5">
                <Row className="justify-content-center">
                    <Col md={10}>
                        <Card>
                            <Card.Header className="bg-primary text-white">
                                <h4 className="mb-0">Cek Status Pendaftaran</h4>
                            </Card.Header>
                            <Card.Body>
                                <Form onSubmit={handleSubmit}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Masukkan NIK</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={nik}
                                            onChange={(e) => {
                                                const value =
                                                    e.target.value.replace(
                                                        /\D/g,
                                                        ""
                                                    );
                                                if (value.length <= 16) {
                                                    setNik(value);
                                                    setNikLength(value.length);
                                                }
                                            }}
                                            maxLength={16}
                                            className={`${
                                                nikLength === 16
                                                    ? "border-success"
                                                    : ""
                                            }`}
                                        />
                                        <small
                                            className={`d-block mt-1 ${
                                                nikLength === 16
                                                    ? "text-success"
                                                    : nikLength > 0
                                                    ? "text-warning"
                                                    : "text-muted"
                                            }`}
                                        >
                                            {nikLength}/16 digit
                                        </small>
                                    </Form.Group>
                                    <Button
                                        type="submit"
                                        className="bg-secondary border-0"
                                        disabled={nikLength !== 16 || loading}
                                    >
                                        {loading ? "Mencari..." : "Cek Status"}
                                    </Button>
                                </Form>

                                {error && (
                                    <Alert variant="danger" className="mt-3">
                                        {error}
                                    </Alert>
                                )}

                                {results && results.length > 0 && (
                                    <div className="mt-5">
                                        <h5 className="fw-bold mb-4 text-secondary">
                                            Hasil Pencarian
                                        </h5>
                                        <Row className="g-4">
                                            {results.map((item, index) => (
                                                <Col
                                                    key={index}
                                                    xs={12}
                                                    md={12}
                                                    lg={6}
                                                >
                                                    <Card
                                                        className="border-0 shadow-sm rounded-4 h-100 hover-card"
                                                        style={{
                                                            transition:
                                                                "transform 0.2s, box-shadow 0.2s",
                                                        }}
                                                    >
                                                        <Card.Header className="bg-gray border-1 pb-0">
                                                            <Card.Title className="fw-semibold text-primary fs-5 mb-2">
                                                                {
                                                                    item.jenis_pelatihan
                                                                }
                                                            </Card.Title>
                                                        </Card.Header>

                                                        <Card.Body className="text-muted">
                                                            <p className="mb-1">
                                                                <strong className="text-dark">
                                                                    Tanggal
                                                                    Daftar:
                                                                </strong>
                                                                <br />
                                                                {item.created_at ||
                                                                    "-"}
                                                            </p>
                                                            <p className="mb-1">
                                                                <strong className="text-dark">
                                                                    NIK:
                                                                </strong>
                                                                <br />
                                                                {item.nik}
                                                            </p>
                                                            <p className="mb-1">
                                                                <strong className="text-dark">
                                                                    Nama:
                                                                </strong>
                                                                <br />
                                                                {item.nama}
                                                            </p>
                                                            <p className="mt-2">
                                                                <strong className="text-dark">
                                                                    Status:
                                                                </strong>
                                                                <br />
                                                                <span
                                                                    className={`badge  rounded-pill bg-${
                                                                        item.status ===
                                                                        "Lolos"
                                                                            ? "success"
                                                                            : item.status ===
                                                                              "Tidak Lolos"
                                                                            ? "danger"
                                                                            : item.status ===
                                                                              "Ditolak - Lolos di Pelatihan Lain"
                                                                            ? "danger"
                                                                            : item.status ===
                                                                              "Blacklist"
                                                                            ? "dark"
                                                                            : "warning"
                                                                    }`}
                                                                >
                                                                    {
                                                                        item.status
                                                                    }
                                                                </span>
                                                            </p>
                                                        </Card.Body>
                                                    </Card>
                                                </Col>
                                            ))}
                                        </Row>
                                    </div>
                                )}
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </Layout>
    );
}
