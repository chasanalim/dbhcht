import { Head, Link, useForm } from "@inertiajs/react";
import React, { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
        password: "",
        remember: false,
    });

    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false);

    const [showPassword, setShowPassword] = useState(false);

    const togglePassword = () => setShowPassword((prev) => !prev);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        post(route("login"), {
            onFinish: () => reset("password"),
        });
        setLoading(false);
    };

    const handlePassword = () => {};

    return (
        <div
            className="sign-in__wrapper banner"
            // style={{ backgroundImage: `url(${BackgroundImage})` }}
        >
            <Head title="Login" />
            {/* Overlay */}
            <div className="sign-in__backdrop"></div>
            {/* Form */}

            <Form
                className="shadow p-4 bg-white rounded"
                onSubmit={handleSubmit}
            >
                {/* Header */}
                {/* <img
                    className="img-thumbnail mx-auto d-block mb-2"
                    src={Logo}
                    alt="logo"
                /> */}
                <div className="h3 mb-3 text-center">Sign In</div>
                <Form.Group className="mb-2" controlId="username">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        type="text"
                        value={data.email}
                        placeholder="ex: john@example.com"
                        onChange={(e) => setData("email", e.target.value)}
                        required
                    />
                    {errors.email && (
                        <div className="ms-2 mt-1 fs-6 fw-light text-danger">
                            {errors.email}
                        </div>
                    )}
                </Form.Group>
                <Form.Group
                    className="mb-2 position-relative"
                    controlId="password"
                >
                    <Form.Label>Password</Form.Label>
                    <div className="input-group">
                        <Form.Control
                            type={showPassword ? "text" : "password"}
                            value={data.password}
                            placeholder="Masukkan Password"
                            onChange={(e) =>
                                setData("password", e.target.value)
                            }
                            required
                        />
                        <button
                            className="btn btn-outline-secondary"
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            aria-label={
                                showPassword ? "Hide password" : "Show password"
                            }
                        >
                            {/* <i
                                className={`bi ${
                                    showPassword ? "bi-eye-slash" : "bi-eye"
                                }`}
                            ></i> */}
                            {showPassword ? "Hide" : "Show"}
                        </button>
                    </div>
                    {errors.password && (
                        <div className="ms-2 mt-1 fs-6 fw-light text-danger">
                            {errors.password}
                        </div>
                    )}
                </Form.Group>
                <Form.Group className="mb-4" controlId="checkbox">
                    <Form.Check
                        type="checkbox"
                        label="Remember me"
                        checked={data.remember}
                        onChange={(e) => setData("remember", e.target.checked)}
                    />
                </Form.Group>
                {!loading ? (
                    <Button className="w-100" variant="primary" type="submit">
                        Log In
                    </Button>
                ) : (
                    <Button
                        className="w-100"
                        variant="primary"
                        type="submit"
                        disabled
                    >
                        Logging In...
                    </Button>
                )}
                {/* <div className="d-grid justify-content-end">
                    <Button
                        className="text-muted px-0"
                        variant="link"
                        onClick={handlePassword}
                    >
                        Forgot password?
                    </Button>
                </div> */}
            </Form>
        </div>
    );
}
