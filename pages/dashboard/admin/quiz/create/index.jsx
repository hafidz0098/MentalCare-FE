import { useState, useEffect } from "react";
import Router from "next/router";
import Layout from "../../../../../layouts/admin";
import axios from "axios";
import Head from "next/head";
import Swal from "sweetalert2";
import Cookies from "js-cookie";
import React, { useRef } from "react";
import Sidebar from "../../../../../components/sidebarAdmin";

function QuizCreate() {
  // State
  const [post, setPost] = useState([]);
  const [question, setQuestion] = useState("");
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [selectedPost, setSelectedPost] = useState("");
  const [selectedPostId, setSelectedPostId] = useState("");
  const [validation, setValidation] = useState({});

  // Method "storeQuiz"
  const storeQuiz = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("post_id", selectedPostId);
    formData.append("materi", selectedPost);
    formData.append("question", question);
    formData.append("correct_answer", correctAnswer);

    await axios
      .post(`${process.env.NEXT_PUBLIC_API_BACKEND}/api/quiz`, formData)
      .then(() => {
        Swal.fire("Good job!", "Berhasil menambahkan quiz baru!", "success");
        Router.push("/dashboard/admin/quiz");
      })
      .catch((error) => {
        setValidation(error.response.data);
      });
  };

  // Fetch data
  const fetchData = async () => {
    const token = Cookies.get("token");

    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    await axios
      .get(`${process.env.NEXT_PUBLIC_API_BACKEND}/api/posts`)
      .then((response) => {
        setPost(response.data.data.data);
      })
      .catch((error) => {
        console.error("Error fetching materi:", error);
      });
  };

  useEffect(() => {
    const token = Cookies.get("token");

    if (!token) {
      Router.push("/login");
    }

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
              <i className="fa fa-bars third-text fs-4 me-3" id="menu-toggle"></i>
              <h2 className="fs-2 m-0">Dashboard</h2>
            </div>
          </nav>

          <div className="container-fluid px-4">
            <div className="row my-5">
              <h3 className="fs-4 mb-3">Tambah Quiz</h3>
              <div className="col">
                <div className="card border-0 rounded shadow-sm">
                  <div className="card-body">
                    <form onSubmit={storeQuiz}>
                      <div className="form-group mb-3">
                        <label className="form-label fw-bold">Judul Materi</label>
                        <select
                          className="form-select"
                          aria-label="Default select example"
                          value={selectedPost}
                          onChange={(e) => {
                            const selectedTitle = e.target.value;
                            setSelectedPost(selectedTitle);
                            const selectedId = post.find(pos => pos.title === selectedTitle)?.id;
                            setSelectedPostId(selectedId);
                          }}
                        >
                          <option value="" disabled>
                            Pilih Materi
                          </option>
                          {post.map((pos) => (
                            <option key={pos.id} value={pos.title}>
                              {pos.title}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="form-group mb-3" style={{ display: 'none' }}>
                        <label className="form-label fw-bold">ID</label>
                        <select
                          className="form-select"
                          aria-label="Default select example"
                          value={selectedPostId}
                          onChange={(e) => setSelectedPostId(e.target.value)}
                        >
                          <option value="" disabled>
                            Pilih Materi
                          </option>
                          {post.map((pos) => (
                            <option key={pos.id} value={pos.id} disabled>
                              {pos.id}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="form-group mb-3">
                        <label className="form-label fw-bold">Pertanyaan</label>
                        <input
                          className="form-control"
                          type="text"
                          value={question}
                          onChange={(e) => setQuestion(e.target.value)}
                          placeholder="Masukkan Pertanyaan"
                        />
                      </div>
                      {validation.question && (
                        <div className="alert alert-danger">
                          {validation.question}
                        </div>
                      )}

                      <div className="form-group mb-3">
                        <label className="form-label fw-bold">Jawaban Benar</label>
                        <input
                          className="form-control"
                          type="text"
                          value={correctAnswer}
                          onChange={(e) => setCorrectAnswer(e.target.value)}
                          placeholder="Masukkan jawaban benar"
                        />
                      </div>
                      {validation.correctAnswer && (
                        <div className="alert alert-danger">
                          {validation.correctAnswer}
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

export default QuizCreate;
