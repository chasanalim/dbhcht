    import { Link, usePage } from "@inertiajs/react";
    import React, { useState } from "react";
    import Dropdown from "@/Components/Dropdown";

    export default function Navbar(props) {
        const { auth } = usePage().props;

        const activesidebar = () => {
            const main = document.getElementById("main");
            main.classList.toggle("activesidebar");
        };

        return (
            <header>
                <nav
                    className="navbar bg-white border-bottom shadow-sm position-relative d-flex align-items-center justify-content-between  py-2 px-4"
                >
                    <button onClick={activesidebar} className="togle">
                        <i className="bi bi-list fs-2"></i>
                    </button>
                    <div className="notify d-flex align-content-center justify-content-between">
                        <Dropdown>
                            <Dropdown.Trigger>
                                <span className="inline-flex rounded-md">
                                    <button
                                        type="button"
                                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 bg-white hover:text-gray-700 focus:outline-none transition ease-in-out duration-150"
                                    >
                                        {auth.user.name} {" "}

                                        <i class="bi bi-chevron-down"></i>
                                    </button>
                                </span>
                            </Dropdown.Trigger>
                            <Dropdown.Content>
                                <Dropdown.Link
                                    href={route("logout")}
                                    method="post"
                                    as="button"
                                >
                                    Log Out
                                </Dropdown.Link>
                            </Dropdown.Content>
                        </Dropdown>
                    </div>
                </nav>
            </header>
        );
    }
