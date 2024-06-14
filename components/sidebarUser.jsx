import { useState, useEffect } from "react";
import Link from "next/link";
import Router from "next/router";
import axios from "axios";
import Cookies from "js-cookie";

const Sidebar = () => {
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
