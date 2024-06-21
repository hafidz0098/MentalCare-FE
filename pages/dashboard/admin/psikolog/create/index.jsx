import Layout from "../../../../../layouts/admin";
import { useState, useEffect } from "react";
import Head from "next/head";
import Router from "next/router";
import axios from "axios";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import Sidebar from "../../../../../components/sidebarAdmin";
export const runtime = 'experimental-edge';

function Register() {
  //define state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

  //define state validation
  const [validation, setValidation] = useState([]);

  //function "registerHanlder"
  const registerHandler = async (e) => {
    e.preventDefault();

    //initialize formData
    const formData = new FormData();

    //append data to formData
    formData.append("name", name);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("password_confirmation", passwordConfirmation);

    //send data to server
    await axios
      .post(
        `${process.env.NEXT_PUBLIC_API_BACKEND}/api/registerPsikolog`,
        formData
      )
      .then((response) => {
        Swal.fire("Good job!", "Berhasil mendaftarkan akun!", "success");
        //redirect to home
        Router.push("/index");
      })
      .catch((error) => {
        //assign error to state "validation"
        setValidation(error.response.data);
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
              <h3 className="fs-4 mb-3">Tambah Akun Psikolog</h3>
              <div className="col">
                <div className="card border-0 rounded shadow-sm">
                  <div className="card-body">
                    <form onSubmit={registerHandler}>
                      <div className="form-group mb-3">
                        <label className="form-label fw-bold">Nama</label>
                        <input
                          className="form-control"
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Masukkan Nama"
                        />
                      </div>
                      {validation.name && (
                        <div className="alert alert-danger">
                          {validation.name}
                        </div>
                      )}

                      <div className="form-group mb-3">
                        <label className="form-label fw-bold">Email</label>
                        <input
                          className="form-control"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Masukkan Email"
                        />
                      </div>
                      {validation.email && (
                        <div className="alert alert-danger">
                          {validation.email}
                        </div>
                      )}
                      <div className="mb-3">
                        <label className="form-label">Password</label>
                        <input
                          type="password"
                          className="form-control"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Masukkan Password"
                        />
                      </div>
                      {validation.password && (
                        <div className="alert alert-danger">
                          {validation.password[0]}
                        </div>
                      )}

                      <div className="mb-3">
                        <label className="form-label">
                          Konfirmasi Password
                        </label>
                        <input
                          type="password"
                          className="form-control"
                          value={passwordConfirmation}
                          onChange={(e) =>
                            setPasswordConfirmation(e.target.value)
                          }
                          placeholder="Masukkan Konfirmasi Password"
                        />
                      </div>

                      <button
                        className="btn btn-primary border-0 shadow-sm"
                        type="submit"
                      >
                        SIMPAN
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Register;
