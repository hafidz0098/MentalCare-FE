import Layout from "../../../layouts/admin";
import { useState, useEffect } from "react";
import Head from "next/head";
import Router from "next/router";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import Sidebar from "../../../components/sidebar";

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
    const reqPost = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BACKEND}/api/posts`,
      config
    );

    const reqQuiz = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BACKEND}/api/quiz`,
      config
    );

    const reqBantuan = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BACKEND}/api/bantuans`,
      config
    );

    const reqPsi = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BACKEND}/api/psikolog`,
      config
    );



    const posts = reqPost.data.data.data;
    const quizs = reqQuiz.data.data.data;
    const bantuans = reqBantuan.data.data.data;
    const Psikologs = reqPsi.data.data;

    return {
      props: {
        posts,
        quizs,
        bantuans,
        Psikologs
      },
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    return {
      props: {
        posts: [],
        quizs: [],
        bantuans: [],
        Psikologs: [],
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
  const totalPost = props.posts.length;
  const totalBantuan = props.bantuans.length;
  const totalPsikolog = props.Psikologs.length;

  const totalQuiz = props.quizs.length;

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
          <div className="container">
            <div className="row">
              <div className="col-md-4 col-xl-3">
                {isLoading ? (
                  <SkeletonLine />
                ) : (
                  <div className="card-dash bg-c-yellow order-card">
                    <div className="card-block">
                      <h6 className="m-b-20">Total Materi</h6>
                      <h2 className="text-right">
                        <span>{totalPost}</span>
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
                      <h6 className="m-b-20">Total Quiz</h6>
                      <h2 className="text-right">
                        <span>{totalQuiz}</span>
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
                      <h6 className="m-b-20">Total Bantuan Layanan</h6>
                      <h2 className="text-right">
                        <span>{totalBantuan}</span>
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
                      <h6 className="m-b-20">Total Psikolog</h6>
                      <h2 className="text-right">
                        <span>{totalPsikolog}</span>
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
