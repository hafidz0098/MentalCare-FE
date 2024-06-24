import Layout from "../../../layouts/admin";
import { useState, useEffect } from "react";
import Head from "next/head";
import Router from "next/router";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import Sidebar from "../../../components/sidebar";
import jwtDecode from "jwt-decode"; // Import jwt-decode to decode the token

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
    const reqKonsul = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BACKEND}/api/konsulbyuser`,
      config
    );

    const reqQuiz = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BACKEND}/api/riwayatquiz`,
      config
    );

    const totQuiz = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BACKEND}/api/quiz`
    );

    const konsuls = reqKonsul.data?.data?.data || [];
    const quizs = reqQuiz.data?.data?.data || [];
    const totalQuiz = totQuiz.data.data.data;

    return {
      props: {
        konsuls,
        quizs,
        totalQuiz,
      },
    };
  } catch (error) {
    console.error("Error fetching konsultasi data:", error);
    return {
      props: {
        konsuls: 0,
        quizs: 0,
        totalQuiz: 0,
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
  const totalConsultations = props.konsuls?.length || 0;
  const answeredConsultations = props.konsuls?.filter(
    (konsul) => konsul.status === "responded"
  ).length || 0;
  const pendingConsultations = props.konsuls?.filter(
    (konsul) => konsul.status === "pending"
  ).length || 0;
  const uniqueQuizIds = new Set();
  const totalQuiz = props.quizs?.reduce((count, quiz) => {
    if (quiz.status === "Lulus" && !uniqueQuizIds.has(quiz.materi)) {
      uniqueQuizIds.add(quiz.materi);
      return count + 1;
    }
    return count;
  }, 0) || 0;
  const quizzes = props.totalQuiz?.length || 0;

  useEffect(() => {
    if (!token) {
      Router.push("/login");
    } else {
      setIsLoading(false); // Set isLoading to false as we are not fetching user data

      const el = document.getElementById("wrapper");
      const toggleButton = document.getElementById("menu-toggle");

      toggleButton.onclick = function () {
        el.classList.toggle("toggled");
      };
    }
  }, [token]);

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
                  <div className="card-dash bg-c-blue order-card">
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
                  <SkeletonLine />
                ) : (
                  <div className="card-dash bg-c-blue order-card">
                    <div className="card-block">
                      <h6 className="m-b-20">Konsultasi Terjawab</h6>
                      <h2 className="text-right">
                        <span>{answeredConsultations}</span>
                      </h2>
                    </div>
                  </div>
                )}
              </div>
              <div className="col-md-4 col-xl-3">
                {isLoading ? (
                  <SkeletonLine />
                ) : (
                  <div className="card-dash bg-c-blue order-card">
                    <div className="card-block">
                      <h6 className="m-b-20">Kuis Terselesaikan</h6>
                      <h2 className="text-right">
                        <span>{totalQuiz} / {quizzes}</span>
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
