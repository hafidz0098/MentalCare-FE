import { useState, useEffect } from "react";
import Head from "next/head";
import Router from "next/router";
import axios from "axios";
import Cookies from "js-cookie";
import jwt_decode from "jwt-decode";
import { useRouter } from "next/router";
import Sidebar from "../../../components/sidebar";
import Layout from "../../../layouts/admin";

export async function getServerSideProps() {
  try {
    const req = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BACKEND}/api/konsultasi`
    );
    const konsuls = req.data.data.data;

    return {
      props: {
        konsuls,
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
  const [user, setUser] = useState({});
  const token = Cookies.get("token");

  const decodeToken = () => {
    if (token) {
      // Decode token JWT untuk mendapatkan data user
      const decoded = jwt_decode(token);
      setUser(decoded);
    }
  };

  //refresh data
  const refreshData = () => {
    router.replace(router.asPath);
  };

  // Calculate total, answered, and pending consultations
  const totalConsultations = props.konsuls.length;
  const answeredConsultations = props.konsuls.filter(
    (konsul) => konsul.status === "responded"
  ).length;
  const pendingConsultations = props.konsuls.filter(
    (konsul) => konsul.status === "pending"
  ).length;

  useEffect(() => {
    if (!token) {
      Router.push("/login");
    }
    decodeToken();
    const el = document.getElementById("wrapper");
    const toggleButton = document.getElementById("menu-toggle");

    toggleButton.onclick = function () {
      el.classList.toggle("toggled");
    };
  }, []);

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
                <div className="card-dash bg-c-blue order-card">
                  <div className="card-block">
                    <h6 className="m-b-20">Total Konsultasi</h6>
                    <h2 className="text-right">
                      <span>{totalConsultations}</span>
                    </h2>
                  </div>
                </div>
              </div>

              <div className="col-md-4 col-xl-3">
                <div className="card-dash bg-c-blue order-card">
                  <div className="card-block">
                    <h6 className="m-b-20">Konsultasi Pending</h6>
                    <h2 className="text-right">
                      <span>{pendingConsultations}</span>
                    </h2>
                  </div>
                </div>
              </div>

              <div className="col-md-4 col-xl-3">
                <div className="card-dash bg-c-blue order-card">
                  <div className="card-block">
                    <h6 className="m-b-20">Konsultasi Terjawab</h6>
                    <h2 className="text-right">
                      <span>{answeredConsultations}</span>
                    </h2>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Dashboard;
