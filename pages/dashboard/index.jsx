import Layout from "../../layouts/admin";
import { useState, useEffect } from "react";
import Head from "next/head";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import Sidebar from "../../components/sidebar";
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

    const decodedToken = jwtDecode(token);
    const userRole = decodedToken.role;

    if (userRole === "admin") {
      return {
        redirect: {
          destination: "/dashboard/admin",
          permanent: false,
        },
      };
    } else if (userRole === "user") {
      return {
        redirect: {
          destination: "/dashboard/user",
          permanent: false,
        },
      };
    } else if (userRole === "psikolog") {
      return {
        redirect: {
          destination: "/dashboard/psikolog",
          permanent: false,
        },
      };
    }

    return {
      props: {},
    };
  } catch (error) {
    console.error("Error", error);
    return {
      props: {},
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

  // Get token once
  const token = Cookies.get("token");

  // Decode the user info from the token once
  const user = token ? jwtDecode(token) : {};

  // State isLoading
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false); // Set isLoading to false after 2 seconds
    }, 2500);

    return () => clearTimeout(timer); // Clean up timer on component unmount
  }, []); // No dependencies, runs once on mount

  useEffect(() => {
    if (user.role === "admin") {
      router.push("/dashboard/admin");
    } else if (user.role === "user") {
      router.push("/dashboard/user");
    } else if (user.role === "psikolog") {
      router.push("/dashboard/psikolog");
    }
  }, [user, router]);

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
              {Object.entries(dashboardData).map(([key, value]) => (
                <div key={key} className="col-md-4 col-xl-3">
                  {isLoading ? (
                    <SkeletonLine />
                  ) : (
                    <div className="card-dash bg-c-blue order-card">
                      <div className="card-block">
                        <h6 className="m-b-20">{key}</h6>
                        <h2 className="text-right">
                          <span>{value}</span>
                        </h2>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Dashboard;
