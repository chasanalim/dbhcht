import { Link, usePage } from "@inertiajs/react";
import React, { useState } from "react";
import Dropdown from "@/Components/Dropdown";

export default function Navbar(props) {
    const { auth } = usePage().props;

    const activesidebar = () => {
        const main = document.getElementById("main");
        main.classList.toggle("activesidebar");
    };

    // Get current route name to determine active sidebar
    const currentRoute = route().current();
    const getActiveMenu = () => {
        switch (true) {
            case currentRoute.startsWith('admin.downloads'):
                return 'Panduan Lampiran File';
            case currentRoute.startsWith('admin.users'):
                return 'Users';
            case currentRoute.startsWith('admin.dashboard'):
                return 'Dashboard';
            case currentRoute.startsWith('admin.banmod-lama'):
                return 'Penerima Banmod Lama';
            default:
                return '';
        }
    };

    return (
        <header>
            <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom shadow-sm">
                <div className="container-fluid">
                    <button
                        onClick={activesidebar}
                        className="btn btn-link text-dark"
                    >
                        <i className="bi bi-list fs-4"></i>
                    </button>

                    <div className="sidebar-active ms-1">
                        <span className="fw-bold">{getActiveMenu()}</span>
                    </div>

                    <div className="ms-auto me-3">
                        <div className="dropdown">
                            <button
                                className="btn btn-light dropdown-toggle"
                                type="button"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                            >
                                {auth.user.name}
                            </button>
                            <ul className="dropdown-menu dropdown-menu-end">
                                <li>
                                    <Link
                                        href={route("logout")}
                                        method="post"
                                        as="button"
                                        className="dropdown-item"
                                    >
                                        Log Out
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </nav>
        </header>
    );
}
