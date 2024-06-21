import Layout from "../../../../layouts/admin";
import { useState, useEffect } from "react";
import Head from "next/head";
import Router from "next/router";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import Sidebar from "../../../../components/sidebarUser";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import { format } from "date-fns";
export const runtime = 'experimental-edge';

// Skeleton line component
const SkeletonLine = () => (
  <div className="skeleton-line mb-3"></div>
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
      `${process.env.NEXT_PUBLIC_API_BACKEND}/api/riwayatquiz`,
      config
    );

    console.log(req);
    const riwayat = req.data.data.data;
    
    return {
      props: {
        riwayat,
      },
    };
  } catch (error) {
    console.error("Error fetching riwayat kuis data:", error);
    return {
      props: {
        riwayat: [],
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

function ShowRiwayat(props) {
  const { riwayat } = props;
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

  //hook useEffect
  useEffect(() => {
    //check token empty
    if (!token) {
      //redirect login page
      Router.push("/login");
    }

    //call function "fetchData"
    fetchData();
    const el = document.getElementById("wrapper");
    const toggleButton = document.getElementById("menu-toggle");

    toggleButton.onclick = function () {
      el.classList.toggle("toggled");
    };
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

          <div className="container-fluid px-4">
            <div className="row my-5">
              <h3 className="fs-4 mb-3">Daftar Riwayat Pengerjaan Kuis</h3>
              <div className="col">
                <div className="table-responsive">
                  {/* Tampilkan loading skeleton jika isLoading true */}
                  {isLoading ? (
                    <div>
                      <SkeletonLine />
                      <SkeletonLine />
                      <SkeletonLine />
                      <SkeletonLine />
                    </div>
                  ) : (
                    <DataTable
                      value={riwayat}
                      paginator
                      rows={5}
                      rowsPerPageOptions={[5, 10, 20]}
                    >
                      <Column
                        header="No."
                        body={(_, { rowIndex }) => rowIndex + 1}
                      />
                      <Column
                        field="created_at"
                        header="Waktu Pengerjaan"
                        body={(rowData) => (
                          <span>
                            {format(
                              new Date(rowData.attempted_at),
                              "dd/MM/yyyy HH:mm:ss"
                            )}
                          </span>
                        )}
                      />
                      <Column field="materi" header="Materi"></Column>
                      <Column field="score" header="Score"></Column>
                      <Column
                        field="status"
                        header="Status"
                        body={(rowData) => (
                          <span className={rowData.status === 'Lulus' ? 'badge badge-finished' : 'badge badge-not-finished'}>
                            {rowData.status}
                          </span>
                        )}
                      />
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

export default ShowRiwayat;
