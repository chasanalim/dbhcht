import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { Link, usePage } from "@inertiajs/react";
import NavLink from "@/Components/NavLink";

export default function Sidebar() {
    const { auth, userProfileImage } = usePage().props;

    return (
        <div className="sidebar h-100 pt-3">
            <div className="px-4" style={{ maxWidth: "100%" }}>
                <div className="text-center">
                    <NavLink
                        style={{ borderBottom: "none" }}
                        href={route("home")}
                        active={route().current("home")}
                    >
                        <span className="text-decoration-none fs-3 text-center text-info fw-bold">DBHCHT</span>
                    </NavLink>
                </div>
                <div className="profile text-center mb-3 position-relative">
                    <div className="profile_text mt-4">
                        <span className="d-block fs-6 mb-0 text-uppercase">
                            {auth.user.name}
                        </span>
                        <span className="d-block fs-7">{auth.user.email}</span>
                    </div>
                    <hr className="text-white border-2"/>
                </div>
                <div className="sidebarnav">
                    <ul className="list-unstyled text-white mt-3">
                        <li>
                            <NavLink
                                href={route("admin.dashboard")}
                                active={route().current("admin.dashboard")}
                                className="rounded-3 py-2 px-3 mb-1 d-flex text-decoration-none text-white"
                            >
                                <i class="bi bi-clipboard-data fs-5"></i>
                                <span className="text-white mt-1">Dashboard</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                href={route("admin.downloads")}
                                active={route().current("admin.downloads")}
                                className="rounded-3 py-2 px-3 mb-1 d-flex text-decoration-none text-white"
                            >
                                <i class="bi bi-cloud-arrow-down fs-5"></i>
                                <span className="text-white mt-1">
                                    Download File
                                </span>
                            </NavLink>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
