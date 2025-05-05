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
        <div className="position-relative py-5 bg-light">
            <div className="container">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h3 className="fw-bold mb-0">Daftar Pelatihan Tersedia</h3>
                    <div className="d-flex gap-2">
                        <button
                            onClick={() => scroll(-300)}
                            className={`btn ${
                                scrollX <= 0
                                    ? "btn-secondary disabled"
                                    : "btn-primary"
                            }`}
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <button
                            onClick={() => scroll(300)}
                            className={`btn ${
                                scrollX >= maxScroll
                                    ? "btn-secondary disabled"
                                    : "btn-primary"
                            }`}
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>

                <div
                    ref={containerRef}
                    onScroll={handleScroll}
                    className="d-flex gap-4 overflow-auto hide-scrollbar px-2"
                    style={{ scrollSnapType: "x mandatory" }}
                >
                    {trainings.map((training, idx) => (
                        <div
                            key={idx}
                            className="flex-shrink-0"
                            style={{
                                minWidth: "350px",
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
