import { useEffect, useRef } from "react";
import { Modal } from "bootstrap";

export default function WelcomePopup() {
    const modalRef = useRef(null);

    useEffect(() => {
        const modal = new Modal(modalRef.current);
        modal.show();
    }, []);

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

                    <img
                        src="/assets/banner.png"
                        alt="Banner"
                        className="img-fluid rounded shadow"
                    />
                </div>
            </div>
        </div>
    );
}


