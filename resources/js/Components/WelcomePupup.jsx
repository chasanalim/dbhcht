import { useEffect, useRef, useState } from "react";
import { Modal, Carousel } from "react-bootstrap";

const WELCOME_IMAGES = [
    "/assets/banner.png",
    "/assets/banner2.png",
    "/assets/banner3.png",
];

export default function WelcomePopup() {
    const modalRef = useRef(null);
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        const modal = new Modal(modalRef.current);
        modal.show();
    }, []);

    const handleSelect = (selectedIndex, e) => {
        if (e.direction) {
            setActiveIndex(selectedIndex);
        }
    };

    return (
        <div
            className="modal fade"
            tabIndex="-1"
            ref={modalRef}
            aria-hidden="true"
        >
            <div className="modal-dialog modal-dialog-centered modal-lg">
                <div className="modal-content border-0 bg-transparent position-relative">

                    <button
                        type="button"
                        className="btn-close bg-white position-absolute top-0 end-0 m-2"
                        data-bs-dismiss="modal"
                    ></button>

                    <Carousel
                        activeIndex={activeIndex}
                        onSelect={handleSelect}
                        interval={5000}
                        pause="hover"
                        wrap
                    >
                        {WELCOME_IMAGES.map((src, index) => (
                            <Carousel.Item key={index}>
                                <img
                                    src={src}
                                    alt={`Banner ${index + 1}`}
                                    className="img-fluid rounded shadow w-100"
                                />
                            </Carousel.Item>
                        ))}
                    </Carousel>
                </div>
            </div>
        </div>
    );
}


