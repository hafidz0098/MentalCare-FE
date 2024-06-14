import Layout from "../../../../layouts/admin";
import { useState, useEffect } from "react";
import Link from "next/link";
import Head from "next/head";
import Router from "next/router";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import Swal from "sweetalert2";
import Sidebar from "../../../../components/sidebarAdmin";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import "primereact/resources/themes/saga-blue/theme.css"; // Tema CSS (Anda dapat memilih tema lain jika Anda mau)
import "primereact/resources/primereact.min.css"; // Core CSS
import "primeicons/primeicons.css"; // Icon CSS
// import excerpt from "../../../utils/excerpt";

const SkeletonLine = () => (
  <div className="skeleton-line mb-3"></div>
);

export async function getServerSideProps() {
  //http request
  const req = await axios.get(
    `${process.env.NEXT_PUBLIC_API_BACKEND}/api/posts`
  );
  const res = await req.data.data.data;

  return {
    props: {
      posts: res, // <-- assign response
    },
  };
}

function ShowPost(props) {
  const { posts } = props;
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);

  //refresh data
  const refreshData = () => {
    router.replace(router.asPath);
  };

  //function "deletePost"
  const deletePost = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Deleted!",
          text: "Your file is being deleted.",
          icon: "success",
          showConfirmButton: false,
        });

        try {
          // Sending
          await axios.delete(
            `${process.env.NEXT_PUBLIC_API_BACKEND}/api/posts/${id}`
          );
          // Refresh data
          refreshData();
          Swal.update({
            title: "Deleted!",
            text: "Your file has been deleted.",
            icon: "success",
            showConfirmButton: true,
          });
        } catch (error) {
          // Handle error
          Swal.fire(
            "Error!",
            "An error occurred while deleting the file.",
            "error"
          );
        }
      }
    });
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

    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    // Bersihkan timeout jika komponen di-unmount sebelum timeout selesai
    return () => clearTimeout(timeout);
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
              <h2 className="fs-2 m-0">Dashboard</h2>
            </div>
          </nav>

          <div className="container-fluid px-4">
            <div className="row my-5">
              <h3 className="fs-4 mb-3">Daftar Artikel</h3>
              <Link href="/dashboard/admin/posts/create">
                <button className="btn btn-sm btn-primary border-0 shadow-sm mb-3 me-3">
                  Tambah Artikel
                </button>
              </Link>
              <div className="col">
                {isLoading ? (
                  // Tampilkan loading skeleton jika isLoading true
                  <div><SkeletonLine /><SkeletonLine /><SkeletonLine /><SkeletonLine /></div>
                  
                ) : (
                  // Tampilkan DataTable jika isLoading false
                  <DataTable
                  value={posts}
                  paginator
                  rows={5}
                  rowsPerPageOptions={[5, 10, 20]}
                >
                  <Column
                    header="No."
                    body={(_, { rowIndex }) => rowIndex + 1}
                  />
                  <Column field="title" header="Judul"></Column>
                  <Column
                    field="content"
                    header="Konten"
                    body={(rowData) => (
                      <span style={{ whiteSpace: "nowrap" }}>
                        <div
                          dangerouslySetInnerHTML={{
                            __html: rowData.content,
                          }}
                        />
                      </span>
                    )}
                  ></Column>
                  <Column
                    header="Aksi"
                    body={(rowData) => (
                      <div>
                        <Link
                          href={`/dashboard/admin/posts/edit/${rowData.id}`}
                        >
                          <button className="btn btn-sm btn-primary border-0 shadow-sm mb-3 me-3">
                            <i className="fa fa-edit"></i>
                          </button>
                        </Link>
                        <Link href={`/materi/${rowData.id}`} target="_blank">
                          <button className="btn btn-sm btn-warning border-0 shadow-sm mb-3 me-3">
                            <i className="fa fa-eye"></i>
                          </button>
                        </Link>
                        <button
                          onClick={() => deletePost(rowData.id)}
                          className="btn btn-sm btn-danger border-0 shadow-sm mb-3"
                        >
                          <i className="fa fa-trash"></i>
                        </button>
                      </div>
                    )}
                  ></Column>
                </DataTable>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default ShowPost;
