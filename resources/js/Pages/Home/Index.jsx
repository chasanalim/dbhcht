import Layout from "@/Layouts/Layout";
import { Head, Link } from "@inertiajs/react";
import { Col, Container, Image, Row } from "react-bootstrap";
import React from "react";
import TrainingCarousel from "@/Components/TrainingCarousel";

const trainings = [
    {
        id: 1,
        title: "Pelatihan Keterampilan untuk Pencari Kerja",
        description:
            "Pelatihan teknis dan soft skill untuk meningkatkan daya saing pencari kerja.",
        image: "/assets/coworkers-business-meeting.jpg",
        requirements: [
            { label: "Usia", value: "Minimal 18 tahun" },
            { label: "Status", value: "Belum bekerja" },
        ],
        duration: "3 Minggu",
        location: "Disnaker Kota Kediri",
        comingSoon: false,
    },
    {
        id: 2,
        title: "Pelatihan Keterampilan untuk Penerima Banmod",
        description:
            "Pelatihan lanjutan bagi penerima bantuan modal untuk mengembangkan usahanya.",
        image: "/assets/business-people-making-pile-hands-teamwork-concept.jpg",
        requirements: [{ label: "Penerima", value: "Program Banmod DBHCHT" }],
        duration: "2 Minggu",
        location: "Balai Latihan Usaha",
        comingSoon: false,
    },
    {
        id: 3,
        title: "Pelatihan UMKM",
        description:
            "Peningkatan kapasitas pelaku UMKM dalam manajemen usaha dan pemasaran.",
        image: "/assets/young-woman-arranging-her-cake-shop.jpg",
        requirements: [{ label: "Status", value: "Pelaku UMKM aktif" }],
        duration: "1 Minggu",
        location: "Gedung UMKM Center",
        comingSoon: false,
    },
    {
        id: 4,
        title: "Pelatihan Petani",
        description:
            "Teknik pertanian modern dan pemanfaatan alat pertanian terbaru.",
        image: "/assets/young-asian-farmer-harvest-ripe-rice-with-sickle-rice-field.jpg",
        requirements: [{ label: "Pekerjaan", value: "Petani aktif" }],
        duration: "2 Minggu",
        location: "Balai Pertanian",
        comingSoon: false,
    },
    {
        id: 5,
        title: "Pelatihan Digital Marketing",
        description:
            "Pelatihan untuk memperluas pasar secara online dan memanfaatkan media sosial.",
        image: "/assets/top-viewtop-view-manager-employee-doing-teamwork-business-office-looking-charts-laptop-display.jpg",
        requirements: [],
        duration: "",
        location: "",
        comingSoon: true,
    },
];

export default function Index({ meta }) {
    return (
        <Layout>
            <Head title={meta.title} />
            <div className="d-flex flex-column align-items-center justify-content-center landing">
                <Container>
                    <div className="py-4">
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
                                    Pendaftaran{" "}
                                    <b className="text-primary">
                                        Pelatihan Kerja & Bantuan Modal
                                    </b>{" "}
                                    dari DBHCHT
                                </h1>
                                <h5 className="fst-italic-theme text-muted">
                                    Program Pelatihan Kerja & Bantuan Modal
                                    diperuntukkan bagi masyarakat yang ingin
                                    meningkatkan keterampilan serta mendukung
                                    pengembangan usaha.
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

            {/* Tambahkan Carousel di bawah hero */}
            <TrainingCarousel trainings={trainings} />
        </Layout>
    );
}
