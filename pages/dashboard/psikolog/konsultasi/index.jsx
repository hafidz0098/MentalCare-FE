import Layout from "../../../../layouts/admin";
import { useState, useEffect } from "react";
import Link from "next/link";
import Head from "next/head";
import Router from "next/router";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import Swal from "sweetalert2";
import Sidebar from "../../../../components/sidebarPsikolog";
import { format } from "date-fns";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import "primereact/resources/themes/saga-blue/theme.css"; // Tema CSS (Anda dapat memilih tema lain jika Anda mau)
import "primereact/resources/primereact.min.css"; // Core CSS
import "primeicons/primeicons.css"; // Icon CSS
import excerpt from "../../../../utils/excerpt";
export const runtime = 'edge';

export async function getServerSideProps() {
  try {
    // HTTP request to fetch konsultasi data
    const req = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BACKEND}/api/konsultasi`
    );

    // Extracting data from response
    const konsuls = req.data.data.data;

    return {
      props: {
        konsuls, // Assigning konsuls data
      },
    };
  } catch (error) {
    console.error("Error fetching konsultasi data:", error);
    return {
      props: {
        konsuls: [], // Return empty array if there's an error
      },
    };
  }
}

function ShowKonsuls(props) {
  const { konsuls } = props;
  const router = useRouter();

  //refresh data
  const refreshData = () => {
    router.replace(router.asPath);
  };

  //get token
  const token = Cookies.get("token");

  //state user
  const [user, setUser] = useState({});

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
              <h2 className="fs-2 m-0">Halo, {user.name}</h2>
            </div>
          </nav>

          <div className="container-fluid px-4">
            <div className="row my-5">
              <h3 className="fs-4 mb-3">Daftar Konsultasi</h3>
              <div className="col">
                <div className="table-responsive">
                  <DataTable
                    value={konsuls}
                    stripedRows
                    paginator
                    rows={5}
                    rowsPerPageOptions={[5, 10, 20]}
                    tableStyle={{ minWidth: "50rem" }}
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
                    <Column field="status" header="Status"></Column>
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
                        <Link
                          href={`/dashboard/psikolog/konsultasi/${rowData.id}`}
                        >
                          <button className="btn btn-sm btn-primary border-0 shadow-sm mb-3 me-3">
                            <i className="fa fa-reply"></i>
                          </button>
                        </Link>
                      )}
                    ></Column>
                  </DataTable>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default ShowKonsuls;
