import { useState, useEffect } from "react";
import Link from "next/link";
import Router from "next/router";
import jwtDecode from "jwt-decode";
import Cookies from "js-cookie";

const Sidebar = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserFromToken = () => {
      const token = Cookies.get("token");

      if (token) {
        try {
          const decoded = jwtDecode(token);
          setUser(decoded.user); // Ambil data user dari token yang sudah di-decode
        } catch (error) {
          console.error("Error decoding token:", error);
          // Handle error decoding token, misalnya token tidak valid
          setUser(null);
        }
      } else {
        // Handle case ketika tidak ada token
        setUser(null);
      }
    };

    fetchUserFromToken();
  }, []);

  const logoutHandler = async () => {
    const token = Cookies.get("token");

    if (token) {
      try {
        // Hapus token dari cookie
        Cookies.remove("token");
        // Redirect ke halaman login
        Router.push("/login");
      } catch (error) {
        console.error("Logout error:", error);
      }
    }
  };
  return (
    <div className="primary-bg" id="sidebar-wrapper">
      <div className="sidebar-heading text-center py-4 second-text fs-4 fw-bold text-uppercase">
        Dashboard
      </div>
      <div className="list-group list-group-flush my-3">
        <Link href="/" legacyBehavior>
          <a className="list-group-item list-group-item-action bg-transparent second-text">
            <i className="fa fa-home me-3"></i>Home
          </a>
        </Link>

        <Link href="/dashboard/user" legacyBehavior>
          <a className="list-group-item list-group-item-action bg-transparent second-text">
            <i className="fa fa-square me-3"></i>Dashboard
          </a>
        </Link>


        <Link href="/dashboard/user/konsultasi" legacyBehavior>
        <a className="list-group-item list-group-item-action bg-transparent second-text">
            <i className="fa fa-file-text me-3"></i>List Konsultasiku
        </a>
        </Link>


        <Link href="/dashboard/user/riwayat" legacyBehavior>
        <a className="list-group-item list-group-item-action bg-transparent second-text">
            <i className="fa fa-file-text me-3"></i>Riwayat Kuis
        </a>
        </Link>

        <button
          onClick={logoutHandler}
          className="list-group-item list-group-item-action bg-transparent second-text"
        >
          <i className="fa fa-power-off me-3"></i>Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
