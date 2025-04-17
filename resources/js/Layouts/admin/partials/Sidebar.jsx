import React, { useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { Link, usePage } from "@inertiajs/react";
import NavLink from "@/Components/NavLink";
import { Dropdown } from "bootstrap";
import * as bootstrap from "bootstrap";

export default function Sidebar() {
    const { auth, userProfileImage } = usePage().props;
    // Initialize dropdowns
    useEffect(() => {
        // Get all dropdowns
        const dropdownElementList =
            document.querySelectorAll(".dropdown-toggle");

        // Initialize each dropdown
        dropdownElementList.forEach((dropdownToggle) => {
            new bootstrap.Dropdown(dropdownToggle, {
                offset: [0, 0],
                boundary: "window",
            });
        });
    }, []);

    return (
        <div className="sidebar h-100 pt-3">
            <div className="px-4" style={{ maxWidth: "100%" }}>
                <div className="text-center">
                    <NavLink
                        style={{ borderBottom: "none" }}
                        href={route("home")}
                        active={route().current("home")}
                    >
                        <span className="text-decoration-none fs-3 text-center text-info fw-bold">
                            DBHCHT
                        </span>
                    </NavLink>
                </div>
                <div className="profile text-center mb-3 position-relative">
                    <div className="profile_text mt-4">
                        <span className="d-block fs-6 mb-0 text-uppercase">
                            {auth.user.name}
                        </span>
                        <span className="d-block fs-7">{auth.user.email}</span>
                    </div>
                    <hr className="text-white border-2" />
                </div>
                <div className="sidebarnav">
                    <ul className="list-unstyled text-white mt-3">
                        <li>
                            <h6 className="text-uppercase mt-3 menu">
                                Dashboard
                            </h6>
                        </li>
                        <li>
                            <NavLink
                                href={route("admin.dashboard")}
                                active={route().current("admin.dashboard")}
                                className={`sidebar-link rounded-3 py-2 px-3 mb-1 d-flex text-decoration-none text-white ${
                                    route().current("admin.dashboard")
                                        ? "active"
                                        : ""
                                }`}
                            >
                                <i className="bi bi-clipboard-data fs-5 "></i>
                                <span className="text-white mt-1 ms-2">
                                    Dashboard
                                </span>
                            </NavLink>
                        </li>
                        <li>
                            <h6 className="text-uppercase mt-3 menu">
                                Bantuan Modal
                            </h6>
                        </li>
                        <li>
                            <NavLink
                                href={route("admin.banmod.index")}
                                active={route().current("admin.banmod.index")}
                                className={`sidebar-link rounded-3 py-2 px-3 mb-1 d-flex text-decoration-none text-white ${
                                    route().current("admin.banmod.index")
                                        ? "active"
                                        : ""
                                }`}
                            >
                                <i className="bi bi-people fs-5"></i>
                                <span className="text-white mt-1 ms-2">Daftar Peserta</span>
                            </NavLink>
                        </li>
                        <li>
                            <h6 className="text-uppercase mt-3 menu">
                                Pelatihan UMKM
                            </h6>
                        </li>
                        <li>
                            <NavLink
                                href={route("admin.umkm.index")}
                                active={route().current(
                                    "admin.umkm.index"
                                )}
                                className={`sidebar-link rounded-3 py-2 px-3 mb-1 d-flex text-decoration-none text-white ${
                                    route().current("admin.umkm.index")
                                        ? "active"
                                        : ""
                                }`}
                            >
                                <i className="bi bi-people fs-5"></i>
                                <span className="text-white mt-1 ms-2">Daftar Peserta</span>
                            </NavLink>
                        </li>
                        <li>
                            <h6 className="text-uppercase mt-3 menu">
                                Pelatihan Penerima banmod
                            </h6>
                        </li>
                        <li>
                            <NavLink
                                href={route("admin.pelatihan-banmod.index")}
                                active={route().current(
                                    "admin.pelatihan-banmod.index"
                                )}
                                className={`sidebar-link rounded-3 py-2 px-3 mb-1 d-flex text-decoration-none text-white ${
                                    route().current("admin.pelatihan-banmod.index")
                                        ? "active"
                                        : ""
                                }`}
                            >
                                <i className="bi bi-people fs-5"></i>
                                <span className="text-white mt-1 ms-2">Daftar Peserta</span>
                            </NavLink>
                        </li>
                        <li>
                            <h6 className="text-uppercase mt-3 menu">
                                Pelatihan Pertanian
                            </h6>
                        </li>
                        <li>
                            <NavLink
                                href={route("admin.pertanian.index")}
                                active={route().current(
                                    "admin.pertanian.index"
                                )}
                                className={`sidebar-link rounded-3 py-2 px-3 mb-1 d-flex text-decoration-none text-white ${
                                    route().current("admin.pertanian.index")
                                        ? "active"
                                        : ""
                                }`}
                            >
                                <i className="bi bi-people fs-5"></i>
                                <span className="text-white mt-1 ms-2">Daftar Peserta</span>
                            </NavLink>
                        </li>
                        <li>
                            <h6 className="text-uppercase mt-3 menu">
                                Pelatihan Pencari Kerja
                            </h6>
                        </li>
                        <li>
                            <NavLink
                                href={route("admin.kerja.index")}
                                active={route().current(
                                    "admin.kerja.index"
                                )}
                                className={`sidebar-link rounded-3 py-2 px-3 mb-1 d-flex text-decoration-none text-white ${
                                    route().current("admin.kerja.index")
                                        ? "active"
                                        : ""
                                }`}
                            >
                                <i className="bi bi-people fs-5"></i>
                                <span className="text-white mt-1 ms-2">Daftar Peserta</span>
                            </NavLink>
                        </li>

                        <li>
                            <h6 className="text-uppercase mt-3 menu">
                                Master Data
                            </h6>
                        </li>
                        <li>
                            <NavLink
                                href={route("admin.downloads.index")}
                                active={route().current(
                                    "admin.downloads.index"
                                )}
                                className={`sidebar-link rounded-3 py-2 px-3 mb-1 d-flex text-decoration-none text-white ${
                                    route().current("admin.downloads.index")
                                        ? "active"
                                        : ""
                                }`}
                            >
                                <i className="bi bi-cloud-arrow-down fs-5"></i>
                                <span className="text-white mt-1 ms-2">
                                    Panduan Lampiran File
                                </span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                href={route("admin.banmod-lama")}
                                active={route().current("admin.banmod-lama")}
                                className={`sidebar-link rounded-3 py-2 px-3 mb-1 d-flex text-decoration-none text-white ${
                                    route().current("admin.banmod-lama")
                                        ? "active"
                                        : ""
                                }`}
                            >
                                <i className="bi bi-person-fill-lock fs-5"></i>
                                <span className="text-white mt-1 ms-2">
                                    Penerima Banmod Lama
                                </span>
                            </NavLink>
                        </li>
                        <li>
                            <h6 className="text-uppercase mt-3 menu">
                                Manajemen User
                            </h6>
                        </li>
                        <li>
                            <NavLink
                                href={route("admin.downloads.index")}
                                active={route().current(
                                    "admin.downloads.index"
                                )}
                                className={`sidebar-link rounded-3 py-2 px-3 mb-1 d-flex text-decoration-none text-white ${
                                    route().current("admin.downloads.index")
                                        ? "active"
                                        : ""
                                }`}
                            >
                                <i className="bi bi-cloud-arrow-down fs-5"></i>
                                <span className="text-white mt-1 ms-2 ms-2">
                                    User
                                </span>
                            </NavLink>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
