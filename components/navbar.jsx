import { useState, useEffect } from "react";
import Link from "next/link";
import Router from "next/router";
import axios from "axios";
import Cookies from "js-cookie";
import jwtDecode from "jwt-decode";

const Navbar = () => {
  const [user, setUser] = useState(() => {
    const token = Cookies.get("token");
    return token ? jwtDecode(token) : null;
  });

  const logoutHandler = async () => {
    const token = Cookies.get("token");
    if (token) {
      try {
        await axios.post(`${process.env.NEXT_PUBLIC_API_BACKEND}/api/logout`, null, {
          headers: { Authorization: `Bearer ${token}` },
        });
        Cookies.remove("token");
        Router.push("/login");
      } catch (error) {
        console.error("Logout error:", error);
      }
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark fixed-top">
      <div className="container-fluid">
        <Link href="/" legacyBehavior>
          <a className="navbar-brand">MentalCare</a>
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNavAltMarkup"
          aria-controls="navbarNavAltMarkup"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div
          className="collapse navbar-collapse justify-content-center"
          id="navbarNavAltMarkup"
        >
          <div className="navbar-nav">
            <Link href="/" legacyBehavior>
              <a className="nav-link">Home</a>
            </Link>
            <Link href="/topik" legacyBehavior>
              <a className="nav-link">Topik Materi</a>
            </Link>
            <Link href="/bantuan" legacyBehavior>
              <a className="nav-link">Bantuan Layanan</a>
            </Link>
            <Link href="/konsultasi" legacyBehavior>
              <a className="nav-link">Konsultasi Personal</a>
            </Link>
          </div>
        </div>
        {user ? (
          <div className="dropdown">
            <button
              className="btn btn-oren dropdown-toggle drop-btn"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              Halo {user.name}
            </button>
            <ul className="dropdown-menu">
              <li>
                <Link className="dropdown-item" href="/dashboard">
                  Dashboard
                </Link>
              </li>
              <li
                onClick={logoutHandler}
                className="dropdown-item"
                href="/logout"
              >
                Logout
              </li>
            </ul>
          </div>
        ) : (
          <Link href="/login" className="btn btn-oren login-btn">
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
