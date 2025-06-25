import React from "react";
import { Clock, MapPin, BadgeCheck } from "lucide-react";
import { Link } from "@inertiajs/react";

export default function TrainingCard({ training }) {
    return (
        <div
            className={`card border-0 h-100 ${
                training.comingSoon ? "opacity-75" : ""
            }`}
            style={{
                width: "100%",
                maxWidth: "350px",
                minWidth: "280px",
                borderRadius: "1.25rem",
                boxShadow: "0 4px 24px 0 rgba(31,38,135,0.10)",
                overflow: "hidden",
                background: "#fff",
            }}
        >
            <div
                className="position-relative"
                style={{ height: "200px", overflow: "hidden" }}
            >
                <img
                    src={training.image}
                    alt={training.title}
                    className="card-img-top object-fit-cover w-100 h-100"
                    style={{
                        borderTopLeftRadius: "1.25rem",
                        borderTopRightRadius: "1.25rem",
                        objectFit: "cover",
                    }}
                />
                {training.comingSoon && (
                    <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-dark bg-opacity-50">
                        <span className="badge bg-primary fs-5 px-4 py-2">
                            Segera Hadir
                        </span>
                    </div>
                )}
            </div>

            <div
                className="card-body d-flex flex-column"
                style={{ padding: "1.5rem" }}
            >
                <h5
                    className="card-title fw-bold"
                    style={{ color: "#22223b", fontSize: "1.15rem" }}
                >
                    {training.title}
                </h5>
                <p
                    className="card-text text-muted"
                    style={{
                        overflow: "hidden",
                        display: "-webkit-box",
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: "vertical",
                        fontSize: "1rem",
                        marginBottom: "0.8rem",
                    }}
                >
                    {training.description}
                </p>

                {training.requirements?.length > 0 && (
                    <div className="mb-2">
                        <h6 className="text-muted small fw-semibold mb-1">
                            Persyaratan:
                        </h6>
                        <ul className="list-unstyled mb-2">
                            {training.requirements.map((req, i) => (
                                <li
                                    key={i}
                                    className="d-flex align-items-center small text-primary"
                                >
                                    <BadgeCheck size={14} className="me-1" />
                                    <strong className="me-1">
                                        {req.label}:
                                    </strong>{" "}
                                    {req.value}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                <div className="d-flex justify-content-between text-muted small mb-3">
                    {training.duration && (
                        <div className="d-flex align-items-center">
                            <Clock size={14} className="me-1" />
                            {training.duration}
                        </div>
                    )}
                    {training.location && (
                        <div className="d-flex align-items-center">
                            <MapPin size={14} className="me-1" />
                            {training.location}
                        </div>
                    )}
                </div>

                <div className="mt-auto">
                    {training.comingSoon ? (
                        <button
                            className="btn w-100"
                            style={{
                                background: "#e9ecef",
                                color: "#6c757d",
                                borderRadius: "2rem",
                                fontWeight: 700,
                                fontSize: "1.05rem",
                                border: "none",
                                cursor: "not-allowed",
                            }}
                            disabled
                        >
                            Segera Hadir
                        </button>
                    ) : (
                        <Link
                            href={`/pelatihan/form?jenis=${training.jenis}`}
                            className="btn w-100"
                            style={{
                                background:
                                    "linear-gradient(90deg,#4f8cff 60%,#6ea8fe 100%)",
                                color: "#fff",
                                borderRadius: "2rem",
                                fontWeight: 700,
                                fontSize: "1.05rem",
                                boxShadow: "0 2px 16px #4f8cff22",
                                border: "none",
                                transition: "transform 0.15s",
                            }}
                        >
                            Ikuti Pelatihan
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
}
