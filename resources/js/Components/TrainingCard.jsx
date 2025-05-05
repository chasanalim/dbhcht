import React from "react";
import { Clock, MapPin, BadgeCheck } from "lucide-react";
import { Link } from "@inertiajs/react";

export default function TrainingCard({ training }) {
    return (
        <div
            className={`card shadow-sm border-0 h-100 ${
                training.comingSoon ? "opacity-75" : ""
            }`}
            style={{
                width: "100%",
                maxWidth: "350px",
                minWidth: "280px",
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
                />
                {training.comingSoon && (
                    <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-dark bg-opacity-50">
                        <span className="badge bg-primary fs-5 px-4 py-2">
                            Segera Hadir
                        </span>
                    </div>
                )}
            </div>

            <div className="card-body d-flex flex-column">
                <h5 className="card-title">{training.title}</h5>
                <p
                    className="card-text text-muted"
                    style={{
                        overflow: "hidden",
                        display: "-webkit-box",
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: "vertical",
                    }}
                >
                    {training.description}
                </p>

                {training.requirements?.length > 0 && (
                    <div className="mb-2">
                        <h6 className="text-muted small fw-semibold">
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
                        <button className="btn btn-secondary w-100" disabled>
                            Segera Hadir
                        </button>
                    ) : (
                        <Link
                            href={`/pelatihan/form?jenis=${training.jenis}`}
                            className="btn btn-primary w-100"
                        >
                            Ikuti Pelatihan
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
}
