import { Link, router, usePage } from "@inertiajs/react";
import classNames from "classnames";
import React, { useState, useEffect } from "react";
import {
    Button,
    Container,
    Image,
    Nav,
    Navbar,
    NavDropdown,
} from "react-bootstrap";

export default function LayoutNavigation() {
    const { pengaturan, navigations, auth } = usePage().props;
    // console.log(auth.roles);
    const isAuth = !!auth.user;

    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 0); // Add class if scrolled
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <Navbar
            collapseOnSelect
            sticky="top"
            expand="lg"
            className={classNames("navbar-background custom-navbar", {
                scrolled: isScrolled,
            })}
            style={{
                background: "linear-gradient(90deg,#4f8cff 60%,#6ea8fe 100%)",
                boxShadow: isScrolled ? "0 2px 16px #4f8cff22" : "none",
                transition: "box-shadow 0.2s",
            }}
        >
            <Container >
                <Navbar.Brand
                    as={Link}
                    href={route("home")}
                    className="fw-bolder d-flex align-items-center gap-2"
                    style={{
                        color: "#fff",
                        fontSize: "1.5rem",
                        letterSpacing: "-1px",
                    }}
                >
                    <Image
                        src="/assets/logo.png"
                        height={50}
                        className="object-fit-contain"
                    />
                </Navbar.Brand>
                <Navbar.Toggle
                    aria-controls="responsive-navbar-nav"
                    style={{ borderColor: "#ffb700" }}
                />
                <Navbar.Collapse
                    id="responsive-navbar-nav"
                    className="navbar-style"
                >
                    <Nav className="ms-auto d-flex align-items-start">
                        {navigations?.map((item, i) => {
                            if (item.show) {
                                const isActive = item.route?.includes(
                                    route().current()
                                );
                                return (
                                    <Nav.Link
                                        key={i}
                                        as={Link}
                                        href={route(item.route)}
                                        className={classNames(
                                            "fw-semibold rounded-pill px-4 py-2",
                                            { active: isActive }
                                        )}
                                        style={{
                                            background: isActive
                                                ? "#ffb700"
                                                : "transparent",
                                            color: isActive
                                                ? "#22223b"
                                                : "#fff",
                                            fontWeight: 700,
                                            boxShadow: isActive
                                                ? "0 2px 16px #ffb70022"
                                                : "none",
                                            border: "none",
                                            transition: "all 0.2s",
                                        }}
                                    >
                                        {item.icon && (
                                            <i
                                                className={`${item.icon} me-2`}
                                                style={{
                                                    color: isActive
                                                        ? "#22223b"
                                                        : "#fff",
                                                    transition: "color 0.2s",
                                                }}
                                            ></i>
                                        )}
                                        <span>{item.label}</span>
                                    </Nav.Link>
                                );
                            }
                            return null;
                        })}
                        {isAuth && (
                            <Nav className="me-auto">
                                <NavDropdown
                                    title={
                                        <>
                                            <i
                                                className="bi bi-person me-2"
                                                style={{ color: "#ffb700" }}
                                            ></i>
                                            <span
                                                style={{ color: "#fff" }}
                                            >{`Hi, ${auth.user?.name}`}</span>
                                        </>
                                    }
                                    id="basic-nav-dropdown"
                                    // menuVariant="dark"
                                >
                                    <NavDropdown.Item
                                        as={Link}
                                        href={route("admin.profile.edit")}
                                        className={classNames({
                                            active:
                                                route().current() ===
                                                "admin.profile.edit",
                                        })}
                                    >
                                        <span>My Profile</span>
                                    </NavDropdown.Item>
                                    <NavDropdown.Item
                                        as={Link}
                                        href={route("admin.dashboard")}
                                    >
                                        <span>Dashboard Admin</span>
                                    </NavDropdown.Item>
                                    <NavDropdown.Divider />
                                    <NavDropdown.Item
                                        as={Link}
                                        method="post"
                                        href={route("logout")}
                                    >
                                        <span>Logout</span>
                                    </NavDropdown.Item>
                                </NavDropdown>
                            </Nav>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}
