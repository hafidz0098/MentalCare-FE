import { useState, useEffect } from "react";
import Link from "next/link";
import Router from "next/router";
import axios from "axios";
import Cookies from "js-cookie";

const Navbar = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const token = Cookies.get("token");

      // Check if the token exists
      if (token) {
        // Set axios header with Authorization + Bearer token
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        try {
          // Fetch user data from the API
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_API_BACKEND}/api/user`
          );
          setUser(response.data);
        } catch (error) {
          // Handle error fetching user data
          console.error("Error fetching user data:", error);
        }
      }
    };

    fetchUser();
  }, []);

  const logoutHandler = async () => {
    const token = Cookies.get("token");

    // Check if the token exists
    if (token) {
      // Set axios header with Authorization + Bearer token
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      try {
        // Fetch the logout endpoint
        await axios.post(`${process.env.NEXT_PUBLIC_API_BACKEND}/api/logout`);
        // Remove token from cookies
        Cookies.remove("token");
        // Redirect to the login page
        Router.push("/login");
      } catch (error) {
        // Handle error
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
          // Jika user sudah login, tampilkan dropdown
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
          // Jika user belum login, tampilkan tombol login
          <Link href="/login" className="btn btn-oren login-btn">
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
