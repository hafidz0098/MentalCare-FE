import Layout from "../../../layouts/admin";
import { useState, useEffect } from "react";
import Head from "next/head";
import Router from "next/router";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import Sidebar from "../../../components/sidebarAdmin";

// Skeleton line component
const SkeletonLine = () => (
  <div className="skeleton-line-dash mb-3"></div>
);

export async function getServerSideProps(context) {
  try {
    const token = getTokenFromRequest(context.req);

    if (!token) {
      return {
        redirect: {
          destination: "/login",
          permanent: false,
        },
      };
    }

    // Set the authorization header
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    // Fetch data using the token
    const req = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BACKEND}/api/konsulbyuser`,
      config
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

// Function to extract token from the request
function getTokenFromRequest(req) {
  // Check if the request contains cookies
  if (req.headers.cookie) {
    // Extract cookies from the request headers
    const cookies = req.headers.cookie
      .split(";")
      .map((cookie) => cookie.trim());

    // Find the cookie containing the token
    const tokenCookie = cookies.find((cookie) => cookie.startsWith("token="));

    // If token cookie is found, extract and return the token
    if (tokenCookie) {
      return tokenCookie.split("=")[1];
    }
  }

  // If token is not found, return null
  return null;
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
    //set axios header dengan type Authorization + Bearer token
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    //fetch user from Rest API
    await axios
      .get(`${process.env.NEXT_PUBLIC_API_BACKEND}/api/user`)
      .then((response) => {
        //set response user to state
        setUser(response.data);
        setIsLoading(false); // Set isLoading to false when data is fetched
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
    }
    fetchData();
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
          <div class="container">
            <div class="row">
              <div class="col-md-4 col-xl-3">
                {isLoading ? (
                  <SkeletonLine />
                ) : (
                  <div class="card-dash bg-c-blue order-card">
                    <div class="card-block">
                      <h6 class="m-b-20">Total Topik</h6>
                      <h2 class="text-right">
                        <span>{totalConsultations}</span>
                      </h2>
                    </div>
                  </div>
                )}
              </div>

              <div class="col-md-4 col-xl-3">
                {isLoading ? (
                  <SkeletonLine />
                ) : (
                  <div class="card-dash bg-c-yellow order-card">
                    <div class="card-block">
                      <h6 class="m-b-20">Total Materi</h6>
                      <h2 class="text-right">
                        <span>{pendingConsultations}</span>
                      </h2>
                    </div>
                  </div>
                )}
              </div>

              <div class="col-md-4 col-xl-3">
                {isLoading ? (
                  <div>
                  <SkeletonLine />
                  </div>
                ) : (
                  <div class="card-dash bg-c-green order-card">
                    <div class="card-block">
                      <h6 class="m-b-20">Total Bantuan Layanan</h6>
                      <h2 class="text-right">
                        <span>{answeredConsultations}</span>
                      </h2>
                    </div>
                  </div>
                )}
              </div>
              <div class="col-md-4 col-xl-3">
                {isLoading ? (
                  <div>
                  <SkeletonLine />
                  </div>
                ) : (
                  <div class="card-dash bg-c-green order-card">
                    <div class="card-block">
                      <h6 class="m-b-20">Total Psikolog</h6>
                      <h2 class="text-right">
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
