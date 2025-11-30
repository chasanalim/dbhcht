import Layout from "@/Layouts/Layout";
import { Head, Link } from "@inertiajs/react";
import { Col, Container, Image, Row } from "react-bootstrap";
import React from "react";
import TrainingCarousel from "@/Components/TrainingCarousel";
import CountUp from "react-countup";
import VisibilitySensor from "react-visibility-sensor";

const trainings = [
    {
        id: 1,
        title: "Pelatihan Keterampilan untuk Pencari Kerja",
        description:
            "Pelatihan teknis dan soft skill untuk meningkatkan daya saing pencari kerja.",
        image: "https://cdn.antaranews.com/cache/1200x800/2024/01/28/17064193727897.jpeg",
        requirements: [
            { label: "Usia Min", value: "18 tahun" },
            { label: "Usia Maks", value: "45 tahun" },
            // { label: "Status", value: "-" },
        ],
        duration: "2 Minggu",
        location: "Kota Kediri",
        jenis: "keterampilan",
        comingSoon: false,
    },
    {
        id: 2,
        title: "Pelatihan Keterampilan untuk Penerima Banmod",
        description:
            "Pelatihan lanjutan bagi penerima bantuan modal untuk mengembangkan usahanya.",
        image: "https://mcc.or.id/wp-content/uploads/2025/02/n209-3.webp",
        requirements: [{ label: "Penerima", value: "Program Banmod DBHCHT" }],
        duration: "2 Minggu",
        location: "Balai Latihan Usaha",
        jenis: "penerimabanmod",
        comingSoon: false,
    },
    {
        id: 3,
        title: "Pelatihan UMKM",
        description:
            "Peningkatan kapasitas pelaku UMKM dalam manajemen usaha dan pemasaran.",
        image: "https://uny.ac.id/sites/default/files/styles/large/public/2024-09/proses%20membuat.jpg?itok=4BsuWSUJ",
        requirements: [{ label: "Status", value: "Pelaku UMKM aktif" }],
        duration: "1 Minggu",
        location: "Gedung UMKM Center",
        jenis: "umkm",
        comingSoon: false,
    },
    {
        id: 4,
        title: "Pelatihan Pertanian",
        description:
            "Teknik pertanian modern dan pemanfaatan alat pertanian terbaru.",
        image: "https://dokar.kendalkab.go.id/upload/berita/1688524912IMG_20230704_163951.jpg",
        requirements: [{ label: "Pekerjaan", value: "Petani aktif" }],
        duration: "2 Minggu",
        location: "Balai Pertanian",
        jenis: "petani",
        comingSoon: false,
    },
    // {
    //     id: 5,
    //     title: "Pelatihan Digital Marketing",
    //     description:
    //         "Pelatihan untuk memperluas pasar secara online dan memanfaatkan media sosial.",
    //     image: "/assets/top-viewtop-view-manager-employee-doing-teamwork-business-office-looking-charts-laptop-display.jpg",
    //     requirements: [],
    //     duration: "",
    //     location: "",
    //     comingSoon: true,
    // },
];

export default function Index({
    meta,
    banmod,
    pelatihanbanmod,
    pencarikerja,
    umkm,
    pertanian,
}) {
    return (
        <Layout>
            <Head title={meta.title} />
            <style>
                {`
                    @media (max-width: 768px) {
                        .hero-main {
                            flex-direction: column !important;
                            padding: 40px 20px !important;
                            gap: 24px !important;
                        }

                        .hero-left {
                            min-width: 0 !important;
                            width: 100% !important;
                        }

                        .hero-title {
                            font-size: 1.8rem !important;
                            line-height: 1.3 !important;
                        }

                        .hero-btns {
                            flex-direction: column !important;
                            gap: 10px !important;
                            width: 100% !important;
                        }

                        .hero-btns .btn {
                            width: 100% !important;
                            padding: 0.85rem 1rem !important;
                            font-size: 1rem !important;
                        }

                        .hero-img {
                            max-height: 200px !important;
                            width: 100% !important;
                        }
                    }

                    @media (max-width: 576px) {
                        .hero-main {
                            padding: 30px 15px !important;
                        }

                        .hero-title {
                            font-size: 1.5rem !important;
                        }

                        .hero-btns .btn {
                            font-size: 0.95rem !important;
                            padding: 0.75rem 0.8rem !important;
                        }

                        .hero-btns .btn i {
                            font-size: 0.9rem !important;
                        }
                    }

                    .hover-scale:hover {
                        transform: translateY(-5px);
                    }
                `}
            </style>
            <div
                style={{
                    minHeight: "92vh",
                    width: "100%",
                    background:
                        "linear-gradient(120deg, #f8fafc 0%, #e0e7ff 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "48px 0",
                }}
            >
                <div
                    className="hero-main"
                    style={{
                        width: "100%",
                        maxWidth: 1600,
                        background: "#fff",
                        borderRadius: "1.25rem",
                        boxShadow: "0 8px 32px 0 rgba(31,38,135,0.08)",
                        padding: "156px 64px",
                        display: "flex",
                        alignItems: "center",
                        gap: "56px",
                    }}
                >
                    {/* Kiri: Teks */}
                    <div
                        className="hero-left"
                        style={{ flex: 1, minWidth: 340 }}
                    >
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 16,
                                marginBottom: 24,
                            }}
                        >
                            <Image
                                src="/assets/logo.png"
                                height={48}
                                style={{
                                    background: "none",
                                    boxShadow: "none",
                                    marginBottom: 0,
                                }}
                            />
                            <span
                                style={{
                                    fontWeight: 700,
                                    fontSize: "1.2rem",
                                    color: "#22223b",
                                    letterSpacing: "1px",
                                }}
                            >
                                Kota Kediri
                            </span>
                        </div>
                        <h1
                            className="hero-title"
                            style={{
                                fontWeight: 900,
                                fontSize: "2.8rem",
                                lineHeight: 1.1,
                                marginBottom: "1.2rem",
                                color: "#22223b",
                                letterSpacing: "-1px",
                            }}
                        >
                            Pendaftaran{" "}
                            <span style={{ color: "#4f8cff" }}>
                                Pelatihan Kerja
                            </span>{" "}
                            &<br />
                            <span style={{ color: "#ffb700" }}>
                                Bantuan Modal
                            </span>{" "}
                            <span style={{ color: "#22223b" }}>DBHCHT</span>
                        </h1>
                        <p
                            style={{
                                color: "#6c757d",
                                fontSize: "1.15rem",
                                marginBottom: "2.2rem",
                                fontWeight: 400,
                                maxWidth: 480,
                            }}
                        >
                            Program untuk masyarakat yang ingin meningkatkan
                            keterampilan dan mengembangkan usaha.
                        </p>
                        <div
                            className="hero-btns"
                            style={{ display: "flex", gap: "1.2rem" }}
                        >
                            <Link
                                href={route("pelatihan")}
                                className="btn"
                                style={{
                                    background:
                                        "linear-gradient(90deg,#4f8cff 60%,#6ea8fe 100%)",
                                    color: "#fff",
                                    borderRadius: "2rem",
                                    padding: "0.95rem 1.5rem",
                                    fontWeight: 700,
                                    fontSize: "1.15rem",
                                    boxShadow: "0 2px 16px #4f8cff22",
                                    border: "none",
                                    transition: "transform 0.15s",
                                }}
                            >
                                <i className="bi bi-lightning-charge"></i>{" "}
                                Daftar Pelatihan
                            </Link>
                            <Link
                                href={route("banmod")}
                                className="btn"
                                style={{
                                    background:
                                        "linear-gradient(90deg,#ffb700 60%,#ffe082 100%)",
                                    color: "#22223b",
                                    borderRadius: "2rem",
                                    padding: "0.95rem 1.5rem",
                                    fontWeight: 700,
                                    fontSize: "1.15rem",
                                    boxShadow: "0 2px 16px #ffb70022",
                                    border: "none",
                                    transition: "transform 0.15s",
                                }}
                            >
                                <i className="bi bi-cash-stack"></i> Daftar
                                Banmod
                            </Link>
                            <Link
                                href={route("cek-status")}
                                className="btn"
                                style={{
                                    background:
                                        "linear-gradient(90deg,#45b07e 60%,#63cf9c 100%)",
                                    color: "#22223b",
                                    borderRadius: "2rem",
                                    padding: "0.95rem 1.5rem",
                                    fontWeight: 700,
                                    fontSize: "1.15rem",
                                    boxShadow: "0 2px 16px #ffb70022",
                                    border: "none",
                                    transition: "transform 0.15s",
                                }}
                            >
                                <i className="bi bi-cash-stack"></i> Cek Status
                            </Link>
                        </div>
                    </div>
                    {/* Kanan: Gambar */}
                    <div
                        style={{
                            flex: 1,
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <Image
                            src="/assets/hero-banner.png"
                            className="img-fluid hero-img"
                            style={{
                                borderRadius: "1.25rem",
                                maxHeight: 340,
                                objectFit: "cover",
                                background: "#f8fafc",
                                boxShadow: "0 4px 24px 0 rgba(31,38,135,0.08)",
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* Carousel Section */}
            <TrainingCarousel trainings={trainings} />

            {/* Counter Stats Section */}
            <div
                style={{
                    background: "#fff",
                    padding: "40px 0",
                    marginBottom: "60px",
                }}
            >
                <Container>
                    <h2
                        className="text-center mb-5"
                        style={{
                            fontWeight: 700,
                            color: "#22223b",
                        }}
                    >
                        Statistik Pendaftar Program
                    </h2>

                    <Row className="justify-content-center text-center g-4">
                        {[
                            {
                                label: "Bantuan Modal",
                                value: banmod,
                                icon: "bi-gift",
                                color: "#ffb700",
                            },
                            {
                                label: "Pelatihan Banmod",
                                value: pelatihanbanmod,
                                icon: "bi-person-workspace",
                                color: "#4f8cff",
                            },
                            {
                                label: "Pelatihan Kerja",
                                value: pencarikerja,
                                icon: "bi-tools",
                                color: "#198754",
                            },
                            {
                                label: "Pelatihan UMKM",
                                value: umkm,
                                icon: "bi-shop",
                                color: "#dc3545",
                            },
                            {
                                label: "Pelatihan Pertanian",
                                value: pertanian,
                                icon: "bi-tree",
                                color: "#20c997",
                            },
                            {
                                label: "Ekonomi Kreatif",
                                value: 0,
                                icon: "bi-brush",
                                color: "#6f42c1",
                            },
                        ].map((stat, index) => (
                            <Col key={index} xs={6} md={4} lg={2}>
                                <div
                                    style={{
                                        padding: "20px",
                                        borderRadius: "1rem",
                                        boxShadow: "0 4px 16px rgba(0,0,0,0.05)",
                                        height: "100%",
                                        background: "#fff",
                                        transition: "transform 0.2s",
                                        cursor: "default",
                                    }}
                                    className="hover-scale"
                                >
                                    <i
                                        className={`bi ${stat.icon} fs-1 mb-3`}
                                        style={{ color: stat.color }}
                                    ></i>
                                    <h1
                                        className="m-2"
                                        style={{
                                            fontWeight: 700,
                                            color: stat.color,
                                        }}
                                    >
                                        <VisibilitySensor
                                            partialVisibility
                                            offset={{ bottom: 10 }}
                                        >
                                            {({ isVisible }) => (
                                                <div style={{ height: 50 }}>
                                                    {isVisible ? (
                                                        <CountUp
                                                            start={0}
                                                            end={stat.value}
                                                            duration={2.5}
                                                            separator="."
                                                        />
                                                    ) : (
                                                        0
                                                    )}
                                                </div>
                                            )}
                                        </VisibilitySensor>
                                    </h1>
                                    <p
                                        className="mb-0 text-muted"
                                        style={{ fontSize: "0.9rem" }}
                                    >
                                        {stat.label}
                                    </p>
                                </div>
                            </Col>
                        ))}
                    </Row>
                </Container>
            </div>
        </Layout>
    );
}
