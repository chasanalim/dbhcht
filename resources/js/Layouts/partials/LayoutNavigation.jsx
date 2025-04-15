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
        >
            <Container>
                <Navbar.Brand
                    as={Link}
                    href={route("home")}
                    className="fw-bolder text-primary d-flex align-items-center gap-2"
                >
                    <Image
                        src="/assets/logo.png"
                        height={50}
                        className="object-fit-contain"
                    />
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse
                    id="responsive-navbar-nav"
                    className="navbar-style"
                >
                    <Nav className="ms-auto d-flex align-items-start">
                        {navigations?.map((item, i) => {
                            if (item.show) {
                                return (
                                    <Nav.Link
                                        key={i}
                                        as={Link}
                                        href={route(item.route)}
                                        className={classNames("me-4", {
                                            active: item.route?.includes(
                                                route().current()
                                            ), // Check active state
                                        })}
                                    >
                                        {item.icon && (
                                            <i
                                                className={`${item.icon} me-2`}
                                            ></i>
                                        )}
                                        <span>{item.label}</span>
                                    </Nav.Link>
                                );
                            }
                            return;
                        })}
                    {isAuth && (
                        <Nav className="me-auto">
                            <NavDropdown
                                title={
                                    <>
                                        <i className="bi bi-person me-2"></i>
                                        {`Hi, ${auth.user?.name}`}
                                    </>
                                }
                                id="basic-nav-dropdown"
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
                                {auth.permissions?.includes("read users") && (
                                    <NavDropdown.Item
                                        as={Link}
                                        href={route("admin.dashboard")}
                                    >
                                        <span>Dashbaord Admin</span>
                                    </NavDropdown.Item>
                                )}
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
