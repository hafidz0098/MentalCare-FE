import { useState, useEffect } from "react";
import Link from "next/link";
import Router from "next/router";
import axios from "axios";
import Cookies from "js-cookie";
import jwt_decode from "jwt-decode";

const SkeletonSidebar = () => (
  <div className="primary-bg" id="sidebar-wrapper">
    <div className="sidebar-heading text-center py-4 second-text fs-4 fw-bold text-uppercase">
      Dashboard
    </div>
    <div className="list-group list-group-flush my-3 " style={{ border: "none" }}>
      {[...Array(5)].map((_, index) => (
        <div key={index} className="list-group-item list-group-item-action bg-transparent second-text">
          <div className="skeleton-line"></div>
        </div>
      ))}
    </div>
  </div>
);

const Sidebar = () => {
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Add isLoggedIn state
  const [user, setUser] = useState(null); // Initialize user state

  useEffect(() => {
    const token = Cookies.get("token");

    if (token) {
      // Decode token JWT untuk mendapatkan data user
      const decoded = jwt_decode(token);
      setUser(decoded);
      setLoading(false); // Set loading to false setelah mendapatkan data user
      setIsLoggedIn(true); // Set isLoggedIn to true setelah user berhasil login
    }
  }, []);

  const logoutHandler = async () => {
    const token = Cookies.get("token");

    if (token) {
      // Set axios header dengan Authorization + Bearer token
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      try {
        // Mengirim permintaan logout
        await axios.post(`${process.env.NEXT_PUBLIC_API_BACKEND}/api/logout`);
        // Menghapus token dari cookies
        Cookies.remove("token");
        // Redirect ke halaman login
        Router.push("/login");
      } catch (error) {
        // Menghandle error
        console.error("Logout error:", error);
      }
    }
  };

  if (!isLoggedIn) { // Menampilkan SkeletonSidebar sampai user berhasil login
    return <SkeletonSidebar />;
  }

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

        {user && user.role === "admin" && (
          <>
            <Link href="/dashboard/admin" legacyBehavior>
              <a className="list-group-item list-group-item-action bg-transparent second-text">
                <i className="fa fa-square me-3"></i>Dashboard
              </a>
            </Link>
            <Link href="/dashboard/admin/posts" legacyBehavior>
              <a className="list-group-item list-group-item-action bg-transparent second-text">
                <i className="fa fa-file-text me-3"></i>List Materi
              </a>
            </Link>

            <Link href="/dashboard/admin/quiz" legacyBehavior>
              <a className="list-group-item list-group-item-action bg-transparent second-text">
                <i className="fa fa-plus me-3"></i>List Quiz
              </a>
            </Link>

            <Link href="/dashboard/admin/psikolog" legacyBehavior>
              <a className="list-group-item list-group-item-action bg-transparent second-text">
                <i className="fa fa-users me-3"></i>List Psikolog
              </a>
            </Link>

            <Link href="/dashboard/admin/bantuans" legacyBehavior>
              <a className="list-group-item list-group-item-action bg-transparent second-text">
                <i className="fa fa-plus me-3"></i>List Bantuan
              </a>
            </Link>
          </>
        )}

        {user && user.role === "psikolog" && (
          <>
            <Link href="/dashboard/psikolog" legacyBehavior>
              <a className="list-group-item list-group-item-action bg-transparent second-text">
                <i className="fa fa-square me-3"></i>Dashboard
              </a>
            </Link>
            <Link href="/dashboard/psikolog/konsultasi" legacyBehavior>
              <a className="list-group-item list-group-item-action bg-transparent second-text">
                <i className="fa fa-file-text me-3"></i>List Konsultasi
              </a>
            </Link>
          </>
        )}

        {user && user.role === "user" && (
          <>
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
          </>
        )}

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

