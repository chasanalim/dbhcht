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
        jenis: "keterampilan",
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
        jenis: "penerimabanmod",
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
        jenis: "umkm",
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
        jenis: "petani",
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
            <style>
                {`
@media (max-width: 768px) {
  .hero-main {
    flex-direction: column !important;
    padding: 28px 10px !important;
    gap: 24px !important;
    border-radius: 1.1rem !important;
  }
  .hero-left {
    min-width: 0 !important;
    width: 100% !important;
  }
  .hero-title {
    font-size: 2rem !important;
  }
  .hero-btns {
    flex-direction: column !important;
    gap: 0.8rem !important;
  }
  .hero-img {
    max-height: 180px !important;
    border-radius: 1rem !important;
    margin-top: 12px !important;
  }
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
                                    padding: "0.95rem 2.5rem",
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
                                    padding: "0.95rem 2.5rem",
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

            {/* Tambahkan Carousel di bawah hero */}
            <TrainingCarousel trainings={trainings} />
        </Layout>
    );
}
