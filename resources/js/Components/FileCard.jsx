import React from "react";

export default function FileCard({ file }) {
    const downloadFile = () => {
        window.location.href = `/storage/files/${file.file_name}`;
    };

    return (
        <>
            <style>
                {`
                .hover-shadow {
                    transition: all 0.3s cubic-bezier(.4,2,.3,1);
                }
                .hover-shadow:hover {
                    transform: translateY(-8px) scale(1.03);
                    box-shadow: 0 8px 32px 0 rgba(31,38,135,0.12) !important;
                }
                `}
            </style>
            <div
                className="card h-100 border-0 shadow-sm hover-shadow"
                style={{
                    borderRadius: "1.25rem",
                    boxShadow: "0 2px 16px #4f8cff11",
                    background: "#fff",
                }}
            >
                <div className="card-body my-3">
                    <div className="d-flex align-items-start mb-3">
                        <div
                            className="fs-1 me-3"
                            style={{
                                color: "#ffb700",
                                background: "#fff7e0",
                                borderRadius: "1rem",
                                padding: "0.5rem 0.7rem",
                                boxShadow: "0 2px 8px #ffb70022",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                minWidth: 56,
                                minHeight: 56,
                            }}
                        >
                            <i className="bi bi-file-earmark-pdf-fill"></i>
                        </div>
                        <div>
                            <h5
                                className="card-title fw-bold mb-1"
                                style={{ color: "#22223b" }}
                            >
                                {file.nama}
                            </h5>
                            <p className="card-text text-muted small mb-0">
                                {file.deskripsi}
                            </p>
                        </div>
                    </div>
                    <div className="d-flex justify-content-center align-items-center mt-2">
                        <button
                            onClick={downloadFile}
                            className="btn rounded-pill fw-bold px-4 py-2"
                            style={{
                                background:
                                    "linear-gradient(90deg,#4f8cff 60%,#6ea8fe 100%)",
                                color: "#fff",
                                border: "none",
                                boxShadow: "0 2px 16px #4f8cff22",
                                fontSize: "1rem",
                                letterSpacing: "0.5px",
                            }}
                        >
                            <i className="bi bi-download me-2"></i>
                            Download
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
