import React from "react";
// import "bootstrap/dist/css/bootstrap.min.css";
// import "bootstrap/dist/js/bootstrap.bundle.min.js";
import Navigation from "./partials/Navigation";
import { Head, usePage } from "@inertiajs/react";
import Sidebar from "./partials/Sidebar";

export default function AdminLayout({ children }) {
    const { auth } = usePage().props;

    if (!auth?.user) {
        return <Navigate to="/login" />;
    }

    return (
        <>
            <Head>
                <meta name="description" content="Your page description" />
            </Head>
            {/* Bootstrap icons */}
            <link
                rel="stylesheet"
                href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css"
            />

            <div id="main">
                <Sidebar />
                <div className="main-content">
                    <Navigation />
                    {/* Tabs section */}
                    <main className="">{children}</main>
                </div>
            </div>

            {/* Bootstrap js cdn link */}
            <script src="https://cdn.jsdelivr.net/npm/jquery@3.6.0/dist/jquery.min.js"></script>
            <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.8/dist/umd/popper.min.js"></script>
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
        </>
    );
}
