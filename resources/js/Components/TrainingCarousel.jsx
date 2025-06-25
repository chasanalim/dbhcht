import React, { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import TrainingCard from "./TrainingCard";

export default function TrainingCarousel({ trainings }) {
    const containerRef = useRef(null);
    const [scrollX, setScrollX] = useState(0);
    const [maxScroll, setMaxScroll] = useState(0);

    useEffect(() => {
        const container = containerRef.current;
        if (container) {
            setMaxScroll(container.scrollWidth - container.clientWidth);
        }
    }, [trainings]);

    const handleScroll = () => {
        setScrollX(containerRef.current.scrollLeft);
    };

    const scroll = (offset) => {
        containerRef.current.scrollBy({ left: offset, behavior: "smooth" });
    };

    return (
        <div
            style={{
                background: "none",
                padding: "64px 0 80px 0",
            }}
        >
            <div
                style={{
                    background: "#fff",
                    borderRadius: "1.25rem",
                    boxShadow: "0 8px 32px 0 rgba(31,38,135,0.08)",
                    padding: "56px 64px",
                    position: "relative",
                    maxWidth: 1600,
                    margin: "0 auto",
                }}
            >
                <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
                    <h3
                        className="fw-bold mb-0"
                        style={{
                            fontSize: "2rem",
                            color: "#22223b",
                            letterSpacing: "-1px",
                        }}
                    >
                        Daftar Pelatihan Tersedia
                    </h3>
                    <div className="d-flex gap-2">
                        <button
                            onClick={() => scroll(-350)}
                            className="btn"
                            style={{
                                background:
                                    "linear-gradient(90deg,#4f8cff 60%,#6ea8fe 100%)",
                                color: "#fff",
                                borderRadius: "2rem",
                                width: 48,
                                height: 48,
                                boxShadow: "0 2px 16px #4f8cff22",
                                border: "none",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: 22,
                                opacity: scrollX <= 0 ? 0.4 : 1,
                                pointerEvents: scrollX <= 0 ? "none" : "auto",
                                transition: "opacity 0.2s",
                            }}
                        >
                            <ChevronLeft size={22} />
                        </button>
                        <button
                            onClick={() => scroll(350)}
                            className="btn"
                            style={{
                                background:
                                    "linear-gradient(90deg,#ffb700 60%,#ffe082 100%)",
                                color: "#22223b",
                                borderRadius: "2rem",
                                width: 48,
                                height: 48,
                                boxShadow: "0 2px 16px #ffb70022",
                                border: "none",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: 22,
                                opacity: scrollX >= maxScroll - 10 ? 0.4 : 1,
                                pointerEvents:
                                    scrollX >= maxScroll - 10 ? "none" : "auto",
                                transition: "opacity 0.2s",
                            }}
                        >
                            <ChevronRight size={22} />
                        </button>
                    </div>
                </div>

                <div
                    ref={containerRef}
                    onScroll={handleScroll}
                    className="d-flex gap-4 overflow-auto hide-scrollbar px-2"
                    style={{
                        scrollSnapType: "x mandatory",
                        paddingBottom: 8,
                    }}
                >
                    {trainings.map((training, idx) => (
                        <div
                            key={idx}
                            className="flex-shrink-0"
                            style={{
                                minWidth: "340px",
                                maxWidth: "340px",
                                scrollSnapAlign: "start",
                            }}
                        >
                            <TrainingCard training={training} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
