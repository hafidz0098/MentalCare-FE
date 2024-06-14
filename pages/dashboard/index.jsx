import Layout from "../../layouts/admin";
import { useState, useEffect } from "react";
import Head from "next/head";
import Router from "next/router";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import Sidebar from "../../components/sidebar";

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

  //refresh data
  const refreshData = () => {
    router.replace(router.asPath);
  };

  //get token
  const token = Cookies.get("token");

  //state user
  const [user, setUser] = useState({});

  //state isLoading
  const [isLoading, setIsLoading] = useState(true);

  //function "fetchData"
  const fetchData = async () => {
    setIsLoading(true); // Set isLoading to true when fetching data
    //set axios header dengan type Authorization + Bearer token
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    //fetch user from Rest API
    await axios
      .get(`${process.env.NEXT_PUBLIC_API_BACKEND}/api/user`)
      .then((response) => {
        //set response user to state
        setUser(response.data);
        setIsLoading(false); // Set isLoading to false when data is fetched
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
        setIsLoading(false); // Set isLoading to false on error as well
      });
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
    } else {
      fetchData();
    }

    const el = document.getElementById("wrapper");
    const toggleButton = document.getElementById("menu-toggle");

    toggleButton.onclick = function () {
      el.classList.toggle("toggled");
    };

    // Check user role and redirect if it's admin
    if (user.role === "admin") {
      router.push("/dashboard/admin");
    }
    if (user.role === "user") {
      router.push("/dashboard/user");
    }
    if (user.role === "psikolog") {
      router.push("/dashboard/psikolog");
    }
  }, [token, user]); // Add user as dependency for useEffect

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
                        <span>{totalConsultations}</span>
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
                        <span>{pendingConsultations}</span>
                      </h2>
                    </div>
                  </div>
                )}
              </div>

              <div className="col-md-4 col-xl-3">
                {isLoading ? (
                  <div>
                  <SkeletonLine />
                  </div>
                ) : (
                  <div className="card-dash bg-c-green order-card">
                    <div className="card-block">
                      <h6 className="m-b-20">Konsultasi Terjawab</h6>
                      <h2 className="text-right">
                        <span>{answeredConsultations}</span>
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
