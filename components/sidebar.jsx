import { useState, useEffect } from "react";
import Link from "next/link";
import Router from "next/router";
import axios from "axios";
import Cookies from "js-cookie";

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
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Add isLoggedIn state

  useEffect(() => {
    const fetchUser = async () => {
      const token = Cookies.get("token");

      // Check if the token exists
      if (token) {
        // Set axios header with Authorization + Bearer token
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        try {
          // Simulate delay for demonstration purpose
          await new Promise(resolve => setTimeout(resolve, 1000));
          // Fetch user data from the API
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_API_BACKEND}/api/user`
          );
          setUser(response.data);
          setLoading(false); // Set loading to false when data fetching is done
          setIsLoggedIn(true); // Set isLoggedIn to true when user is successfully fetched
        } catch (error) {
          // Handle error fetching user data
          console.error("Error fetching user data:", error);
          setLoading(false); // Set loading to false even if there's an error
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

  if (!isLoggedIn) { // Show SkeletonSidebar until user is logged in
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
            <i className="fa fa-home me-2"></i>Home
          </a>
        </Link>

        {user && user.role === "admin" && (
          <>
            <Link href="/dashboard/admin" legacyBehavior>
              <a className="list-group-item list-group-item-action bg-transparent second-text">
                <i className="fa fa-square me-2"></i>Dashboard
              </a>
            </Link>
            <Link href="/dashboard/admin/posts" legacyBehavior>
              <a className="list-group-item list-group-item-action bg-transparent second-text">
                <i className="fa fa-file-text me-2"></i>List Materi
              </a>
            </Link>

            <Link href="/dashboard/admin/quiz" legacyBehavior>
              <a className="list-group-item list-group-item-action bg-transparent second-text">
                <i className="fa fa-plus me-2"></i>List Quiz
              </a>
            </Link>

            <Link href="/dashboard/admin/psikolog" legacyBehavior>
              <a className="list-group-item list-group-item-action bg-transparent second-text">
                <i className="fa fa-users me-2"></i>List Psikolog
              </a>
            </Link>

            <Link href="/dashboard/admin/bantuans" legacyBehavior>
              <a className="list-group-item list-group-item-action bg-transparent second-text">
                <i className="fa fa-plus me-2"></i>List Bantuan
              </a>
            </Link>
          </>
        )}

        {user && user.role === "psikolog" && (
          <>
            <Link href="/dashboard/psikolog" legacyBehavior>
              <a className="list-group-item list-group-item-action bg-transparent second-text">
                <i className="fa fa-square me-2"></i>Dashboard
              </a>
            </Link>
            <Link href="/dashboard/psikolog/konsultasi" legacyBehavior>
              <a className="list-group-item list-group-item-action bg-transparent second-text">
                <i className="fa fa-file-text me-2"></i>List Konsultasi
              </a>
            </Link>
          </>
        )}

        {user && user.role === "user" && (
          <>
            <Link href="/dashboard/user" legacyBehavior>
              <a className="list-group-item list-group-item-action bg-transparent second-text">
                <i className="fa fa-square me-2"></i>Dashboard
              </a>
            </Link>

            <Link href="/dashboard/user/konsultasi" legacyBehavior>
            <a className="list-group-item list-group-item-action bg-transparent second-text">
                <i className="fa fa-file-text me-2"></i>List Konsultasiku
            </a>
            </Link>

            <Link href="/dashboard/user/riwayat" legacyBehavior>
            <a className="list-group-item list-group-item-action bg-transparent second-text">
                <i className="fa fa-file-text me-2"></i>Riwayat Kuis
            </a>
            </Link>
          </>
        )}

        <button
          onClick={logoutHandler}
          className="list-group-item list-group-item-action bg-transparent second-text"
        >
          <i className="fa fa-power-off me-2"></i>Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
