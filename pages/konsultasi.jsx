import Layout from "../layouts/default";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import Router from "next/router";
import axios from "axios";
import Head from "next/head";
import Swal from "sweetalert2";

function Konsultasi() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [validation, setValidation] = useState([]);

  const konsulHandler = async (e) => {
    e.preventDefault();

    if (!name || !message) {
      Swal.fire(
        "Oops!",
        "Silakan isi semua field sebelum mengirim pesan konsultasi.",
        "error"
      );
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("message", message);

    //send data to server
    await axios
      .post(`${process.env.NEXT_PUBLIC_API_BACKEND}/api/konsultasi`, formData)
      .then((response) => {
        Swal.fire(
          "Good job!",
          "Berhasil mengirim pesan konsultasi!",
          "success"
        );

        setName("");
        setMessage("");

        //redirect to home
        Router.push("/konsultasi");
      })
      .catch((error) => {
        setValidation(error.response.data);
      });
  };
  const token = Cookies.get("token");
  const [user, setUser] = useState({});

  const fetchData = async () => {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    await axios
      .get(`${process.env.NEXT_PUBLIC_API_BACKEND}/api/user`)
      .then((response) => {
        setUser(response.data);
      });
  };

  useEffect(() => {
    // if (!token) {
    //   Router.push("/login");
    // }
    fetchData();
  }, []);

  return (
    <Layout>
      <Head>
        <title>Form Konsultasi Psikolog</title>
      </Head>
      <div className="container px-4 konsultasi section-bg">
        <div className="row my-5">
          <div className="title-section-konsul mb-5">
            Konsultasikan Mengenai Kesehatan Mental
          </div>
          <div className="col-lg-5">
            <img className="konsul-image" src="konsul.png" />
          </div>
          <div className="col-lg-7 mt-3">
            <div className="card border-0 rounded shadow-sm">
              <div className="card-body">
                <form onSubmit={konsulHandler}>
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
                    <div className="alert alert-danger">{validation.name}</div>
                  )}
                  <div className="form-group mb-3">
                    <label className="form-label fw-bold">Pesan</label>
                    <textarea
                      className="form-control"
                      style={{ height: "180px" }}
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Konsultasi;
