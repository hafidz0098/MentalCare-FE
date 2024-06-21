import { useState, useEffect } from "react";
import Router from "next/router";
import Layout from "../../../../../layouts/admin";
import axios from "axios";
import Cookies from "js-cookie";
import React from "react";
import Swal from "sweetalert2";
import Sidebar from "../../../../../components/sidebarAdmin";

export const runtime = 'experimental-edge';

export async function getServerSideProps({ params }) {
  const req = await axios.get(
    `${process.env.NEXT_PUBLIC_API_BACKEND}/api/bantuans/${params.id}`
  );
  const res = await req.data.data;

  return {
    props: {
      bantuan: res, // <-- assign response
    },
  };
}

function BantuanEdit(props) {
  //destruct
  const { bantuan } = props;

  //state
  const [image, setImage] = useState("");
  const [title, setTitle] = useState("");
  const [tipe, setTipe] = useState([]);
  const [link_url, setLink_url] = useState("");

  //state validation
  const [validation, setValidation] = useState({});

  //function "handleFileChange"
  const handleFileChange = (e) => {
    //define variable for get value image data
    const imageData = e.target.files[0];

    //check validation file
    if (!imageData.type.match("image.*")) {
      //set state "image" to null
      setImage("");

      return;
    }

    //assign file to state "image"
    setImage(imageData);
  };

  //method "updateBantuan"
  const updateBantuan = async (e) => {
    e.preventDefault();

    //define formData
    const formData = new FormData();

    //append data to "formData"
    formData.append("image", image);
    formData.append("title", title);
    formData.append("tipe", tipe);
    formData.append("link_url", link_url);
    formData.append("_method", "PUT");

    //send data to server
    await axios
      .post(
        `${process.env.NEXT_PUBLIC_API_BACKEND}/api/bantuans/${bantuan.id}`,
        formData
      )
      .then(() => {
        Swal.fire("Good job!", "Berhasil mengubah bantuan layanan!", "success");

        //redirect
        Router.push("/dashboard/admin/bantuans");
      })
      .catch((error) => {
        //assign validation on state
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

    setTitle(bantuan.title);
    setTipe(bantuan.tipe);
    setLink_url(bantuan.link_url);

    toggleButton.onclick = function () {
      el.classList.toggle("toggled");
    };
  }, []);

  return (
    <Layout>
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
              <h3 className="fs-4 mb-3">Edit Bantuan</h3>
              <div className="col">
                <div className="card border-0 rounded shadow-sm">
                  <div className="card-body">
                    <form onSubmit={updateBantuan}>
                      <div className="form-group mb-3">
                        <label className="form-label fw-bold">Gambar</label>
                        <input
                          type="file"
                          className="form-control"
                          onChange={handleFileChange}
                        />
                      </div>
                      {validation.image && (
                        <div className="alert alert-danger">
                          {validation.image}
                        </div>
                      )}

                      <div className="form-group mb-3">
                        <label className="form-label fw-bold">Judul</label>
                        <input
                          className="form-control"
                          type="text"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          placeholder="Masukkan Judul"
                        />
                      </div>
                      {validation.title && (
                        <div className="alert alert-danger">
                          {validation.title}
                        </div>
                      )}

                      <div className="form-group mb-3">
                        <label className="form-label fw-bold">Tipe</label>
                        <input
                          className="form-control"
                          type="text"
                          value={tipe}
                          onChange={(e) => setTipe(e.target.value)}
                          placeholder="Masukkan Tipe"
                        />
                      </div>
                      {validation.tipe && (
                        <div className="alert alert-danger">
                          {validation.tipe}
                        </div>
                      )}

                      <div className="form-group mb-3">
                        <label className="form-label fw-bold">Link Url</label>
                        <input
                          className="form-control"
                          type="text"
                          value={link_url}
                          onChange={(e) => setLink_url(e.target.value)}
                          placeholder="Masukkan Link Url"
                        />
                      </div>
                      {validation.video && (
                        <div className="alert alert-danger">
                          {validation.link_url}
                        </div>
                      )}

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

export default BantuanEdit;
