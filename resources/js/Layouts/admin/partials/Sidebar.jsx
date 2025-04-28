import React, { useEffect, useRef, useState } from "react";
// import "bootstrap/dist/css/bootstrap.min.css";
// import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { Link, usePage } from "@inertiajs/react";
import NavLink from "@/Components/NavLink";
import { Nav, NavDropdown } from "react-bootstrap";

export default function Sidebar() {
    const { auth, userProfileImage, can } = usePage().props;
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    // Add null checks
    if (!auth?.user) {
        return null;
    }
    // Check if any submenu is active
    const isAnySubmenuActive = () => {
        return (
            route().current("admin.banmod.index") ||
            route().current("admin.banmod.buruh-pabrik-rokok") ||
            route().current("admin.banmod.buruh-tani-tembakau") ||
            route().current("admin.banmod.pekerja-pabrik-rokok") ||
            route().current("admin.banmod.ikm") ||
            route().current("admin.banmod.masyarakat-miskin")
        );
    };

    // Set dropdown open state on mount and when route changes
    useEffect(() => {
        setIsDropdownOpen(isAnySubmenuActive());
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
                {/* <div className="profile text-center mb-3 position-relative">
                    <div className="profile_text mt-4">
                        <span className="d-block fs-6 mb-0 text-uppercase text-white">
                            {auth.user.name}
                        </span>
                        <span className="d-block text-white fs-6">
                            {auth.user.email}
                        </span>
                    </div>
                    </div> */}
                <hr className="text-white border-2" />
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
                        {can.viewBanmod && (
                            <>
                                <li>
                                    <h6 className="text-uppercase mt-3 menu">
                                        Bantuan Modal
                                    </h6>
                                </li>
                                <li>
                                    <Nav className="sidebar-link rounded-3 d-flex text-decoration-none text-white">
                                        <NavDropdown
                                            show={isDropdownOpen}
                                            onToggle={(isOpen) =>
                                                setIsDropdownOpen(isOpen)
                                            }
                                            title={
                                                <div className="d-flex align-items-center justify-content-between w-100">
                                                    <div className="d-flex align-items-center">
                                                        <i className="bi bi-people fs-5 text-white"></i>
                                                        <span className="text-white mt-1 ms-2">
                                                            Daftar Peserta
                                                        </span>
                                                    </div>
                                                    <i
                                                        className="bi bi-chevron-down mt-1 text-white"
                                                        style={{
                                                            marginLeft: "95px",
                                                        }}
                                                    ></i>
                                                </div>
                                            }
                                            id="basic-nav-dropdown"
                                        >
                                            <NavDropdown.Item
                                                as={Link}
                                                method="get"
                                                href={route(
                                                    "admin.banmod.index"
                                                )}
                                                active={route().current(
                                                    "admin.banmod.index"
                                                )}
                                                className={`rounded-3 py-2 px-3 mb-1 d-flex text-decoration-none text-white ${
                                                    route().current(
                                                        "admin.banmod.index"
                                                    )
                                                        ? "active"
                                                        : ""
                                                }`}
                                            >
                                                <span>ALL</span>
                                            </NavDropdown.Item>
                                            <NavDropdown.Item
                                                as={Link}
                                                method="get"
                                                href={route(
                                                    "admin.banmod.buruh-pabrik-rokok"
                                                )}
                                                active={route().current(
                                                    "admin.banmod.buruh-pabrik-rokok"
                                                )}
                                                className={`rounded-3 py-2 px-3 mb-1 d-flex text-decoration-none text-white ${
                                                    route().current(
                                                        "admin.banmod.buruh-pabrik-rokok"
                                                    )
                                                        ? "active"
                                                        : ""
                                                }`}
                                            >
                                                <span>BURUH PABRIK ROKOK</span>
                                            </NavDropdown.Item>
                                            <NavDropdown.Item
                                                as={Link}
                                                method="get"
                                                href={route(
                                                    "admin.banmod.buruh-tani-tembakau"
                                                )}
                                                active={route().current(
                                                    "admin.banmod.buruh-tani-tembakau"
                                                )}
                                                className={`rounded-3 py-2 px-3 mb-1 d-flex text-decoration-none text-white ${
                                                    route().current(
                                                        "admin.banmod.buruh-tani-tembakau"
                                                    )
                                                        ? "active"
                                                        : ""
                                                }`}
                                            >
                                                <span>BURUH TANI TEMBAKAU</span>
                                            </NavDropdown.Item>
                                            <NavDropdown.Item
                                                as={Link}
                                                method="get"
                                                href={route(
                                                    "admin.banmod.pekerja-pabrik-rokok"
                                                )}
                                                active={route().current(
                                                    "admin.banmod.pekerja-pabrik-rokok"
                                                )}
                                                className={`rounded-3 py-2 px-3 mb-1 d-flex text-decoration-none text-white ${
                                                    route().current(
                                                        "admin.banmod.pekerja-pabrik-rokok"
                                                    )
                                                        ? "active"
                                                        : ""
                                                }`}
                                            >
                                                <span>
                                                    PEKERJA PABRIK ROKOK
                                                </span>
                                            </NavDropdown.Item>
                                            <NavDropdown.Item
                                                as={Link}
                                                method="get"
                                                href={route("admin.banmod.ikm")}
                                                active={route().current(
                                                    "admin.banmod.ikm"
                                                )}
                                                className={`rounded-3 py-2 px-3 mb-1 d-flex text-decoration-none text-white ${
                                                    route().current(
                                                        "admin.banmod.ikm"
                                                    )
                                                        ? "active"
                                                        : ""
                                                }`}
                                            >
                                                <span>
                                                    INDUSTRI KECIL DAN MENENGAH
                                                </span>
                                            </NavDropdown.Item>
                                            <NavDropdown.Item
                                                as={Link}
                                                method="get"
                                                href={route(
                                                    "admin.banmod.masyarakat-miskin"
                                                )}
                                                active={route().current(
                                                    "admin.banmod.masyarakat-miskin"
                                                )}
                                                className={`rounded-3 py-2 px-3 mb-1 d-flex text-decoration-none text-white ${
                                                    route().current(
                                                        "admin.banmod.masyarakat-miskin"
                                                    )
                                                        ? "active"
                                                        : ""
                                                }`}
                                            >
                                                <span>MASYARAKAT MISKIN</span>
                                            </NavDropdown.Item>
                                        </NavDropdown>
                                    </Nav>
                                </li>
                            </>
                        )}

                        {can.viewUmkm && (
                            <>
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
                                        <span className="text-white mt-1 ms-2">
                                            Daftar Peserta
                                        </span>
                                    </NavLink>
                                </li>
                            </>
                        )}
                        {can.viewKerja && (
                            <>
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
                                        <span className="text-white mt-1 ms-2">
                                            Daftar Peserta
                                        </span>
                                    </NavLink>
                                </li>
                            </>
                        )}
                        {can.viewPelatihanBanmod && (
                            <>
                                <li>
                                    <h6 className="text-uppercase mt-3 menu">
                                        Pelatihan Penerima banmod
                                    </h6>
                                </li>

                                <li>
                                    <NavLink
                                        href={route(
                                            "admin.pelatihan-banmod.index"
                                        )}
                                        active={route().current(
                                            "admin.pelatihan-banmod.index"
                                        )}
                                        className={`sidebar-link rounded-3 py-2 px-3 mb-1 d-flex text-decoration-none text-white ${
                                            route().current(
                                                "admin.pelatihan-banmod.index"
                                            )
                                                ? "active"
                                                : ""
                                        }`}
                                    >
                                        <i className="bi bi-people fs-5"></i>
                                        <span className="text-white mt-1 ms-2">
                                            Daftar Peserta
                                        </span>
                                    </NavLink>
                                </li>
                            </>
                        )}
                        {can.viewPertanian && (
                            <>
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
                                            route().current(
                                                "admin.pertanian.index"
                                            )
                                                ? "active"
                                                : ""
                                        }`}
                                    >
                                        <i className="bi bi-people fs-5"></i>
                                        <span className="text-white mt-1 ms-2">
                                            Daftar Peserta
                                        </span>
                                    </NavLink>
                                </li>
                            </>
                        )}

                        {(can.viewMasterLampiranFile ||
                            can.viewMasterBanmod) && (
                            <>
                                <li>
                                    <h6 className="text-uppercase mt-3 menu">
                                        Master Data
                                    </h6>
                                </li>
                            </>
                        )}
                        {can.viewMasterLampiranFile && (
                            <>
                                <li>
                                    <NavLink
                                        href={route("admin.downloads.index")}
                                        active={route().current(
                                            "admin.downloads.index"
                                        )}
                                        className={`sidebar-link rounded-3 py-2 px-3 mb-1 d-flex text-decoration-none text-white ${
                                            route().current(
                                                "admin.downloads.index"
                                            )
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
                            </>
                        )}
                        {can.viewMasterBanmod && (
                            <>
                                <li>
                                    <NavLink
                                        href={route("admin.banmodlama.index")}
                                        active={route().current(
                                            "admin.banmodlama.index"
                                        )}
                                        className={`sidebar-link rounded-3 py-2 px-3 mb-1 d-flex text-decoration-none text-white ${
                                            route().current(
                                                "admin.banmodlama.index"
                                            )
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
                                    <NavLink
                                        href={route(
                                            "admin.banmodwirausaha.index"
                                        )}
                                        active={route().current(
                                            "admin.banmodwirausaha.index"
                                        )}
                                        className={`sidebar-link rounded-3 py-2 px-3 mb-1 d-flex text-decoration-none text-white ${
                                            route().current(
                                                "admin.banmodwirausaha.index"
                                            )
                                                ? "active"
                                                : ""
                                        }`}
                                    >
                                        <i className="bi bi-person-fill-lock fs-5"></i>
                                        <span className="text-white mt-1 ms-2">
                                            Penerima Pelatihan Banmod
                                        </span>
                                    </NavLink>
                                </li>
                            </>
                        )}

                        {can.viewUser && (
                            <>
                                <li>
                                    <h6 className="text-uppercase mt-3 menu">
                                        Manajemen User
                                    </h6>
                                </li>

                                <li>
                                    <NavLink
                                        href={route("admin.user.index")}
                                        active={route().current(
                                            "admin.user.index"
                                        )}
                                        className={`sidebar-link rounded-3 py-2 px-3 mb-1 d-flex text-decoration-none text-white ${
                                            route().current("admin.user.index")
                                                ? "active"
                                                : ""
                                        }`}
                                    >
                                        <i className="bi bi-person-fill-gear fs-5"></i>
                                        <span className="text-white mt-1 ms-2 ms-2">
                                            User
                                        </span>
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink
                                        href={route("admin.privileges.index")}
                                        active={route().current(
                                            "admin.privileges.index"
                                        )}
                                        className={`sidebar-link rounded-3 py-2 px-3 mb-1 d-flex text-decoration-none text-white ${
                                            route().current(
                                                "admin.privileges.index"
                                            )
                                                ? "active"
                                                : ""
                                        }`}
                                    >
                                        <i className="bi bi-person-fill-gear fs-5"></i>
                                        <span className="text-white mt-1 ms-2 ms-2">
                                            Privileges
                                        </span>
                                    </NavLink>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </div>
    );
}
