import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import './layout.css';

const ExpenseNavbar = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userName, setUserName] = useState("Guest");
    const [profilePic, setProfilePic] = useState("user.jpg");

    useEffect(() => {
        const user = JSON.parse(sessionStorage.getItem("user"));
        if (user) {
            setIsLoggedIn(true);
            setUserName(user.name || "User");
            setProfilePic(user.profilePic || "user.jpg");
        }
    }, []);

    const handleLogout = () => {
        sessionStorage.removeItem("user");
        setIsLoggedIn(false);
        setUserName("Guest");
        setProfilePic("user.jpg");
        window.location.href = "/login";
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary p-3 shadow">
            <div className="container-fluid">
                <a className="navbar-brand fw-bold" href="/">
                    💰 Expense Tracker
                </a>

                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarExpense"
                    aria-controls="navbarExpense"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarExpense">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <a className="nav-link nav-hover text-white fw-bold" href="/">Dashboard</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link nav-hover text-white fw-bold" href="/expense">Expenses</a>
                        </li>
                    </ul>

                    <div className="d-flex align-items-center gap-3">
                        <img
                            src={profilePic}
                            alt="Profile"
                            className="rounded-circle border border-white"
                            width="40"
                            height="40"
                        />
                        <div className="dropdown">
                            <button
                                className="btn btn-outline-light dropdown-toggle"
                                type="button"
                                id="dropdownMenuButton"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                            >
                                {userName}
                            </button>
                            <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="dropdownMenuButton">
                                {!isLoggedIn ? (
                                    <>
                                        <li><a className="dropdown-item" href="/login">Login</a></li>
                                        <li><a className="dropdown-item" href="/signup">Signup</a></li>
                                    </>
                                ) : (
                                    <li><button className="dropdown-item" onClick={handleLogout}>Logout</button></li>
                                )}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default ExpenseNavbar;
