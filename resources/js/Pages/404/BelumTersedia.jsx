import { Head, Link } from "@inertiajs/react";
import { Container, Row, Col } from "react-bootstrap";
import React from "react";
import Layout from "@/Layouts/Layout";

export default function BelumTersedia({ meta }) {
    return (
        <Layout>
            <Head title="Pendaftaran Belum Tersedia" />
            <style>
                {`
                    .coming-soon-container {
                        min-height: 90vh;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        background: linear-gradient(135deg, #a3d1ecff 0%, #3c8ed1ff 100%);
                        position: relative;
                        overflow: hidden;
                        padding: 40px 0;
                    }

                    .coming-soon-container::before {
                        content: '';
                        position: absolute;
                        width: 300px;
                        height: 300px;
                        background: rgba(255, 255, 255, 0.1);
                        border-radius: 50%;
                        top: -50px;
                        left: -50px;
                        animation: float 6s ease-in-out infinite;
                    }

                    .coming-soon-container::after {
                        content: '';
                        position: absolute;
                        width: 200px;
                        height: 200px;
                        background: rgba(255, 255, 255, 0.05);
                        border-radius: 50%;
                        bottom: -30px;
                        right: -30px;
                        animation: float 8s ease-in-out infinite reverse;
                    }

                    @keyframes float {
                        0%, 100% {
                            transform: translateY(0px);
                        }
                        50% {
                            transform: translateY(30px);
                        }
                    }

                    @keyframes slideInDown {
                        from {
                            opacity: 0;
                            transform: translateY(-50px);
                        }
                        to {
                            opacity: 1;
                            transform: translateY(0);
                        }
                    }

                    @keyframes slideInUp {
                        from {
                            opacity: 0;
                            transform: translateY(50px);
                        }
                        to {
                            opacity: 1;
                            transform: translateY(0);
                        }
                    }

                    @keyframes pulse {
                        0%, 100% {
                            transform: scale(1);
                        }
                        50% {
                            transform: scale(1.05);
                        }
                    }

                    @keyframes rotateIcon {
                        from {
                            transform: rotate(0deg);
                        }
                        to {
                            transform: rotate(360deg);
                        }
                    }

                    .content-wrapper {
                        position: relative;
                        z-index: 10;
                        text-align: center;
                        animation: slideInDown 0.8s ease-out;
                    }

                    .icon-container {
                        margin-bottom: 40px;
                        position: relative;
                    }

                    .icon-circle {
                        width: 120px;
                        height: 120px;
                        background: rgba(255, 255, 255, 0.2);
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        margin: 0 auto;
                        backdrop-filter: blur(10px);
                        border: 2px solid rgba(255, 255, 255, 0.3);
                        animation: pulse 2s ease-in-out infinite;
                    }

                    .icon-circle i {
                        font-size: 60px;
                        color: #fff;
                        animation: rotateIcon 20s linear infinite;
                    }

                    .title {
                        font-size: 3.5rem;
                        font-weight: 900;
                        color: #fff;
                        margin-bottom: 20px;
                        letter-spacing: -1px;
                        animation: slideInDown 0.8s ease-out 0.2s both;
                    }

                    .subtitle {
                        font-size: 1.3rem;
                        color: rgba(255, 255, 255, 0.9);
                        margin-bottom: 30px;
                        animation: slideInDown 0.8s ease-out 0.4s both;
                        max-width: 600px;
                        margin-left: auto;
                        margin-right: auto;
                    }

                    .description {
                        font-size: 1.1rem;
                        color: rgba(255, 255, 255, 0.8);
                        margin-bottom: 50px;
                        animation: slideInDown 0.8s ease-out 0.6s both;
                        max-width: 500px;
                        margin-left: auto;
                        margin-right: auto;
                        line-height: 1.6;
                    }

                    .buttons-container {
                        display: flex;
                        gap: 20px;
                        justify-content: center;
                        flex-wrap: wrap;
                        animation: slideInUp 0.8s ease-out 0.8s both;
                    }

                    .btn-home {
                        padding: 14px 40px;
                        font-size: 1.1rem;
                        font-weight: 600;
                        border-radius: 50px;
                        border: none;
                        transition: all 0.3s ease;
                        cursor: pointer;
                        text-decoration: none;
                        display: inline-block;
                    }

                    .btn-primary-custom {
                        background: #fff;
                        color: #cfd5eeff;
                        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
                    }

                    .btn-primary-custom:hover {
                        transform: translateY(-3px);
                        box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3);
                        background: #f0f0f0;
                        text-decoration: none;
                        color: #cfd5eeff;
                    }

                    .btn-secondary-custom {
                        background: rgba(255, 255, 255, 0.2);
                        color: #fff;
                        border: 2px solid rgba(255, 255, 255, 0.5);
                        backdrop-filter: blur(10px);
                    }

                    .btn-secondary-custom:hover {
                        background: rgba(255, 255, 255, 0.3);
                        border-color: rgba(255, 255, 255, 0.8);
                        transform: translateY(-3px);
                        text-decoration: none;
                        color: #fff;
                    }

                    .features {
                        display: flex;
                        gap: 30px;
                        margin-top: 60px;
                        justify-content: center;
                        flex-wrap: wrap;
                        animation: slideInUp 0.8s ease-out 1s both;
                    }

                    .feature-item {
                        background: rgba(255, 255, 255, 0.1);
                        padding: 25px;
                        border-radius: 15px;
                        backdrop-filter: blur(10px);
                        border: 1px solid rgba(255, 255, 255, 0.2);
                        flex: 1;
                        min-width: 200px;
                        max-width: 250px;
                        transition: all 0.3s ease;
                    }

                    .feature-item:hover {
                        background: rgba(255, 255, 255, 0.15);
                        transform: translateY(-5px);
                        border-color: rgba(255, 255, 255, 0.4);
                    }

                    .feature-item i {
                        font-size: 2.5rem;
                        color: #ffd700;
                        margin-bottom: 15px;
                        display: block;
                    }

                    .feature-item h4 {
                        color: #fff;
                        font-weight: 700;
                        margin-bottom: 10px;
                        font-size: 1.1rem;
                    }

                    .feature-item p {
                        color: rgba(255, 255, 255, 0.7);
                        font-size: 0.95rem;
                        line-height: 1.5;
                    }

                    .divider {
                        width: 60px;
                        height: 4px;
                        background: #ffd700;
                        margin: 0 auto 30px;
                        border-radius: 2px;
                        animation: slideInDown 0.8s ease-out 0.3s both;
                    }

                    @media (max-width: 768px) {
                        .coming-soon-container {
                            min-height: auto;
                            padding: 40px 20px;
                        }

                        .title {
                            font-size: 2.5rem;
                        }

                        .subtitle {
                            font-size: 1.1rem;
                        }

                        .description {
                            font-size: 1rem;
                        }

                        .buttons-container {
                            flex-direction: column;
                            gap: 15px;
                        }

                        .btn-home {
                            width: 100%;
                            padding: 12px 30px;
                        }

                        .features {
                            flex-direction: column;
                            gap: 20px;
                        }

                        .feature-item {
                            max-width: 100%;
                        }

                        .coming-soon-container::before {
                            width: 200px;
                            height: 200px;
                        }

                        .coming-soon-container::after {
                            width: 150px;
                            height: 150px;
                        }
                    }

                    @media (max-width: 480px) {
                        .coming-soon-container {
                            padding: 30px 15px;
                        }

                        .title {
                            font-size: 2rem;
                        }

                        .subtitle {
                            font-size: 1rem;
                        }

                        .icon-circle {
                            width: 100px;
                            height: 100px;
                        }

                        .icon-circle i {
                            font-size: 50px;
                        }
                    }
                `}
            </style>

            <div className="coming-soon-container">
                <Container>
                    <Row>
                        <Col lg={8} className="mx-auto">
                            <div className="content-wrapper">
                                {/* Icon */}
                                <div className="icon-container">
                                    <div className="icon-circle">
                                        <i className="bi bi-hourglass-split"></i>
                                    </div>
                                </div>

                                {/* Divider */}
                                <div className="divider"></div>

                                {/* Title */}
                                <h1 className="title">
                                    Pendaftaran Belum Tersedia
                                </h1>

                                {/* Subtitle */}
                                {/* <p className="subtitle">

                                </p> */}

                                {/* Description */}
                                {/* <p className="description">
                                    Pendaftaran akan segera dibuka. Silakan kembali lagi atau
                                    hubungi kami untuk informasi lebih lanjut tentang program
                                    pelatihan dan bantuan modal kami.
                                </p> */}

                                {/* Buttons */}
                                <div className="buttons-container">
                                    <Link
                                        href={route("home")}
                                        className="btn-home btn-primary-custom"
                                    >
                                        <i className="bi bi-house-door me-2"></i>
                                        Kembali ke Beranda
                                    </Link>
                                    {/* <a
                                        href="https://wa.me/your-number"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn-home btn-secondary-custom"
                                    >
                                        <i className="bi bi-whatsapp me-2"></i>
                                        Hubungi Kami
                                    </a> */}
                                </div>

                                {/* Features */}
                                <div className="features">
                                    <div className="feature-item">
                                        <i className="bi bi-lightning-charge"></i>
                                        <h4>Pelatihan Ketrampilan Kerja</h4>
                                        <p>Program pelatihan kerja berkualitas</p>
                                    </div>
                                    <div className="feature-item">
                                        <i className="bi bi-cash-stack"></i>
                                        <h4>Bantuan Modal</h4>
                                        <p>Dukungan untuk mengembangkan usaha</p>
                                    </div>
                                    {/* <div className="feature-item">
                                        <i className="bi bi-people-fill"></i>
                                        <h4>Komunitas</h4>
                                        <p>Bergabung dengan komunitas kami</p>
                                    </div> */}
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>
        </Layout>
    );
}
