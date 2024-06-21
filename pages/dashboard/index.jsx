import Layout from "../../layouts/admin";
import { useState, useEffect } from "react";
import Head from "next/head";
import Router from "next/router";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import Sidebar from "../../components/sidebar";
import jwtDecode from "jwt-decode"; // Import jwt-decode to decode the token

// Skeleton line component
const SkeletonLine = () => (
  <div className="skeleton-line-dash mb-3"></div>
);

export async function getServerSideProps() {
  try {
    const req = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BACKEND}/api/konsultasi`
    );
    const konsuls = req.data.data.data;

    return {
      props: {
        konsuls: konsuls || [], // Ensure konsuls is an array
      },
    };
  } catch (error) {
    console.error("Error fetching konsultasi data:", error);
    return {
      props: {
        konsuls: [],
      },
    };
  }
}

function Dashboard(props) {
  const router = useRouter();

  // Refresh data
  const refreshData = () => {
    router.replace(router.asPath);
  };

  // Get token
  const token = Cookies.get("token");

  // Decode the user info from the token
  let user = {};
  if (token) {
    try {
      user = jwtDecode(token);
    } catch (error) {
      console.error("Error decoding token:", error);
    }
  }

  // State isLoading
  const [isLoading, setIsLoading] = useState(true);

  // Calculate total, answered, and pending consultations
  const totalConsultations = props.konsuls ? props.konsuls.length : 0;
  const answeredConsultations = props.konsuls
    ? props.konsuls.filter((konsul) => konsul.status === "responded").length
    : 0;
  const pendingConsultations = props.konsuls
    ? props.konsuls.filter((konsul) => konsul.status === "pending").length
    : 0;

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false); // Set isLoading to false after 2 seconds
    }, 2000);

    return () => clearTimeout(timer); // Clean up timer on component unmount
  }, []); // No dependencies, runs once on mount

  useEffect(() => {
    if (!token) {
      Router.push("/login");
    } else {
      const el = document.getElementById("wrapper");
      const toggleButton = document.getElementById("menu-toggle");

      toggleButton.onclick = function () {
        el.classList.toggle("toggled");
      };

      // Check user role and redirect if it's admin
      if (user.role === "admin") {
        router.push("/dashboard/admin");
      } else if (user.role === "user") {
        router.push("/dashboard/user");
      } else if (user.role === "psikolog") {
        router.push("/dashboard/psikolog");
      }
    }
  }, [token, user, router]); // Add router as dependency for useEffect

  return (
    <Layout>
      <Head>
        <title>Dashboard</title>
      </Head>
      <div className="d-flex" id="wrapper">
        <Sidebar />

        <div id="page-content-wrapper">
          <nav className="navbar navbar-expand-lg navbar-light bg-transparent py-4 px-4">
            <div className="d-flex align-items-center">
              <i
                className="fa fa-bars third-text fs-4 me-3"
                id="menu-toggle"
              ></i>
            </div>
          </nav>
          <div className="container">
            <div className="row">
              <div className="col-md-4 col-xl-3">
                {isLoading ? (
                  <SkeletonLine />
                ) : (
                  <div className="card-dash bg-c-blue order-card">
                    <div className="card-block">
                      <h6 className="m-b-20">Total Konsultasi</h6>
                      <h2 className="text-right">
                        <span>0</span>
                      </h2>
                    </div>
                  </div>
                )}
              </div>

              <div className="col-md-4 col-xl-3">
                {isLoading ? (
                  <SkeletonLine />
                ) : (
                  <div className="card-dash bg-c-yellow order-card">
                    <div className="card-block">
                      <h6 className="m-b-20">Konsultasi Pending</h6>
                      <h2 className="text-right">
                        <span>0</span>
                      </h2>
                    </div>
                  </div>
                )}
              </div>

              <div className="col-md-4 col-xl-3">
                {isLoading ? (
                  <SkeletonLine />
                ) : (
                  <div className="card-dash bg-c-green order-card">
                    <div className="card-block">
                      <h6 className="m-b-20">Konsultasi Terjawab</h6>
                      <h2 className="text-right">
                        <span>0</span>
                      </h2>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Dashboard;
