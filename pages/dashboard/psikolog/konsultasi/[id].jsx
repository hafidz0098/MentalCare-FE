import Layout from "../../../../layouts/admin";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Head from "next/head";
import Router from "next/router";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import Swal from "sweetalert2";
import Sidebar from "../../../../components/sidebarPsikolog";
import { format } from "date-fns";
import { Avatar } from "primereact/avatar";
export const runtime = 'experimental-edge';

export async function getServerSideProps({ params }) {
  try {
    const req = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BACKEND}/api/konsultasi/${params.id}`
    );
    const res = await req.data.data.reply;
    const kons = await req.data.data;

    return {
      props: {
        replies: res,
        konsuls: kons,
      },
    };
  } catch (error) {
    console.error("Error fetching konsuls:", error);
    return {
      props: {
        replies: [],
        konsuls: [],
      },
    };
  }
}

function ShowKonsulMessage(props) {
  const { replies } = props;
  const { konsuls } = props;
  const scrollRef = useRef(null);
  const [message, setMessage] = useState("");
  const router = useRouter(); // Menggunakan useRouter untuk mengakses nilai params
  const { id } = router.query; // Mendapatkan nilai params.id

  //state validation
  const [validation, setValidation] = useState({});

  const storeReply = async (e) => {
    e.preventDefault();

    //define formData
    const formData = new FormData();

    //append data to "formData"
    formData.append("konsultasi_id", id);
    formData.append("message", message);

    //send data to server
    await axios
      .post(
        `${process.env.NEXT_PUBLIC_API_BACKEND}/api/konsultasi/reply`,
        formData
      )
      .then(() => {
        Swal.fire("Good job!", "Berhasil menambahkan balasan baru!", "success");
        setMessage("");
        refreshData();
      })
      .catch((error) => {
        //assign validation on state
        setValidation(error.response.data);
      });
  };

  //refresh data
  const refreshData = () => {
    router.replace(router.asPath);
  };
  const token = Cookies.get("token");
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

    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
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

          <div className="row">
            <div className="col m-3">
              <div className="panel" id="message">
                <div className="panel-heading">
                  <h3 className="panel-title">Message</h3>
                </div>
                <div className="panel-body">
                  <ul className="list-group list-group-full">
                    <div
                      ref={scrollRef}
                      style={{ height: "380px", overflow: "auto" }}
                    >
                      <li className="list-group-item">
                        <div className="media">
                          <div className="media-left mb-2">
                            <Avatar
                              icon="pi pi-user"
                              size="large"
                              shape="circle"
                            />
                          </div>
                          <div className="media-body">
                            <h5 className="list-group-item-heading">
                              <small className="pull-right date">
                                {format(
                                  new Date(konsuls.created_at),
                                  "dd MMM yyyy HH:mm"
                                )}
                              </small>
                              {konsuls.name}
                            </h5>
                            <p className="list-group-item-text">
                              {konsuls.message}
                            </p>
                          </div>
                        </div>
                      </li>

                      {replies.map((rep) => (
                        <li className="list-group-item" key={rep.id}>
                          <div className="media">
                            <div className="media-left mb-2">
                              <Avatar
                                icon="pi pi-user"
                                size="large"
                                shape="circle"
                              />
                            </div>
                            <div className="media-body">
                              <h5 className="list-group-item-heading">
                                <small className="pull-right date">
                                  {format(
                                    new Date(rep.created_at),
                                    "dd MMM yyyy HH:mm"
                                  )}
                                </small>
                                {rep.sender}
                              </h5>
                              <p className="list-group-item-text">
                                {rep.message}
                              </p>
                            </div>
                          </div>
                        </li>
                      ))}
                    </div>
                    <form onSubmit={storeReply}>
                      <div className="form-group mb-3">
                        <label className="form-label mt-3">Kirim balasan</label>
                        <textarea
                          className="form-control"
                          style={{ height: "100px" }}
                          type="text"
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          placeholder="Masukkan Pesan"
                        />
                      </div>
                      {validation.message && (
                        <div className="alert alert-danger">
                          {validation.message}
                        </div>
                      )}
                      <button
                        className="btn btn-primary border-0 shadow-sm"
                        type="submit"
                      >
                        Kirim
                      </button>
                    </form>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default ShowKonsulMessage;
