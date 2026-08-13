import { useState } from "react";
import { Modal, Carousel } from "react-bootstrap";

const WELCOME_IMAGES = [
    "/assets/banner.png",
    "/assets/banner2.png",
    "/assets/banner3.png",
];

export default function WelcomePopup() {
    const [show, setShow] = useState(true);
    const [activeIndex, setActiveIndex] = useState(0);

    const handleSelect = (selectedIndex, e) => {
        if (e.direction) {
            setActiveIndex(selectedIndex);
        }
    };

    return (
        <Modal
            show={show}
            onHide={() => setShow(false)}
            centered
            size="lg"
            contentClassName="border-0 bg-transparent"
            dialogClassName="modal-dialog-centered"
        >
            <Modal.Header className="border-0 bg-transparent p-0 justify-content-end">
                <button
                    type="button"
                    className="btn-close bg-white"
                    aria-label="Close"
                    onClick={() => setShow(false)}
                ></button>
            </Modal.Header>
            <Modal.Body className="p-0 bg-transparent rounded shadow overflow-hidden">
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
                                className="img-fluid w-100"
                                style={{ display: "block" }}
                            />
                        </Carousel.Item>
                    ))}
                </Carousel>
            </Modal.Body>
        </Modal>
    );
}


