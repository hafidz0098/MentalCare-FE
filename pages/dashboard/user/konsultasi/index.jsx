import Layout from "../../../../layouts/admin";
import { useState, useEffect } from "react";
import Link from "next/link";
import Head from "next/head";
import Router from "next/router";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import Sidebar from "../../../../components/sidebar";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import excerpt from "../../../../utils/excerpt";
import { format } from "date-fns";
import jwtDecode from "jwt-decode"; // Import jwt-decode to decode the token

// Skeleton line component
const SkeletonLine = () => (
  <div className="skeleton-line mb-3"></div>
);

function ShowKonsuls({ konsuls }) {
  const router = useRouter();

  // Get token and decode user info from the token
  const token = Cookies.get("token");
  let user = {};
  if (token) {
    try {
      user = jwtDecode(token);
    } catch (error) {
      console.error("Error decoding token:", error);
    }
  }

  // State for loading status
  const [isLoading, setIsLoading] = useState(true);

  // Fetch data function with delay
  const fetchData = async () => {
    try {
      if (!token) {
        Router.push("/login");
        return;
      }

      // Simulate loading delay for 2 seconds
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
    } catch (error) {
      console.error("Error fetching data:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
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

          <div className="container-fluid px-4">
            <div className="row my-5">
              <h3 className="fs-4 mb-3">Daftar Konsultasi</h3>
              <div className="col">
                <div className="table-responsive">
                  {/* Show loading skeleton if isLoading is true */}
                  {isLoading ? (
                    <div>
                      <SkeletonLine />
                      <SkeletonLine />
                      <SkeletonLine />
                      <SkeletonLine />
                    </div>
                  ) : (
                    <DataTable
                      value={konsuls}
                      paginator
                      rows={5}
                      rowsPerPageOptions={[5, 10, 20]}
                    >
                      <Column
                        header="No."
                        body={(_, { rowIndex }) => rowIndex + 1}
                      />
                      <Column field="name" header="Nama"></Column>
                      <Column
                        field="message"
                        header="Pesan"
                        body={(rowData) => (
                          <span style={{ whiteSpace: "nowrap" }}>
                            {excerpt(rowData.message, 80)}
                          </span>
                        )}
                      ></Column>
                      <Column
                        field="status"
                        header="Status"
                        body={(rowData) => (
                          <span className={rowData.status === 'pending' ? 'badge badge-pending' : 'badge badge-finished'}>
                            {rowData.status}
                          </span>
                        )}
                      />
                      <Column
                        field="updated_at"
                        header="Waktu Konsultasi"
                        body={(rowData) => (
                          <span>
                            {format(
                              new Date(rowData.updated_at),
                              "dd/MM/yyyy HH:mm:ss"
                            )}
                          </span>
                        )}
                      />
                      <Column
                        header="Aksi"
                        body={(rowData) => (
                          <Link href={`/dashboard/user/konsultasi/${rowData.id}`}>
                            <button className="btn btn-sm btn-primary border-0 shadow-sm mb-3 me-3">
                              <i className="fa fa-reply"></i>
                            </button>
                          </Link>
                        )}
                      ></Column>
                    </DataTable>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

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

export default ShowKonsuls;
