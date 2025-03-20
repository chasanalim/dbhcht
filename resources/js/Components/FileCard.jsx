import React from "react";

export default function FileCard({ file  }) {
    const downloadFile = () => {
        window.location.href = `/template/download/${file.file_name}`;
    };

    return (
        <>
            <style>
                {`
                .hover-shadow {
                    transition: all 0.3s ease;
                }

                .hover-shadow:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
                }
                `}
            </style>
            <div className="card h-100 shadow-sm border-0 transition-all hover-shadow">
                <div className="card-body">
                    <div className="d-flex align-items-start mb-3">
                        <div className="text-danger fs-1 me-3">
                            <i className="bi bi-file-earmark-pdf-fill"></i>
                        </div>
                        <div>
                            <h5 className="card-title fw-semibold mb-1">
                                {file.name}
                            </h5>
                            <p className="card-text text-muted small">
                                {file.description}
                            </p>
                        </div>
                    </div>

                    <div className="d-flex justify-content-between align-items-center mt-4">
                        <div className="small text-muted">
                            <p className="mb-1">Ukuran: {file.size}</p>
                            <p className="mb-0">Diupload: {file.uploaded_at}</p>
                        </div>

                        <button
                            onClick={downloadFile}
                            className="btn btn-primary btn-sm d-flex align-items-center"
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
