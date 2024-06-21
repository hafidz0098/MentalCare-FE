import { useState, useEffect } from "react";
import Router from "next/router";
import Layout from "../../../../../layouts/admin";
import axios from "axios";
import Cookies from "js-cookie";
import React, { useRef } from "react";
import Swal from "sweetalert2";
import { Editor } from "@tinymce/tinymce-react";
import Sidebar from "../../../../../components/sidebarAdmin";

const SkeletonLine = () => (
  <div className="skeleton-line mb-3"></div>
);

//fetch with "getServerSideProps"
export async function getServerSideProps({ params }) {
  //http request
  const req = await axios.get(
    `${process.env.NEXT_PUBLIC_API_BACKEND}/api/posts/${params.id}`
  );
  const res = await req.data.data;

  return {
    props: {
      post: res, // <-- assign response
    },
  };
}

function PostEdit(props) {
  const editorRef = useRef(null);
  

  //destruct
  const { post } = props;

  //state
  const [image, setImage] = useState("");
  const [title, setTitle] = useState(post.title);
  const [topiks, setTopiks] = useState([]);
  const [content, setContent] = useState(post.content);
  const [video, setVideo] = useState(post.video);
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const handleEditorChange = (content, editor) => {
    setContent(content);
  };
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

  //method "updatePost"
  const updatePost = async (e) => {
    e.preventDefault();

    //define formData
    const formData = new FormData();

    //append data to "formData"
    formData.append("image", image);
    formData.append("title", title);
    formData.append("topik_id", selectedTopics);
    formData.append("content", content);
    formData.append("video", video);
    formData.append("_method", "PUT");

    //send data to server
    await axios
      .post(
        `${process.env.NEXT_PUBLIC_API_BACKEND}/api/posts/${post.id}`,
        formData
      )
      .then(() => {
        Swal.fire("Good job!", "Berhasil mengubah artikel!", "success");

        //redirect
        Router.push("/dashboard/admin/posts");
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

    await axios
      .get(`${process.env.NEXT_PUBLIC_API_BACKEND}/api/topiks`)
      .then((response) => {
        setTopiks(response.data.data.data); // Update the state with the received topics
      })
      .catch((error) => {
        console.error("Error fetching topics:", error);
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

    setTitle(post.title);
    setContent(post.content);
    setVideo(post.video);
    setSelectedTopics(post.topik_id);

    toggleButton.onclick = function () {
      el.classList.toggle("toggled");
    };

    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    // Bersihkan timeout jika komponen di-unmount sebelum timeout selesai
    return () => clearTimeout(timeout);
  }, []);

  const logoutHandler = async () => {
    //set axios header dengan type Authorization + Bearer token
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    //fetch Rest API
    await axios
      .post(`${process.env.NEXT_PUBLIC_API_BACKEND}/api/logout`)
      .then(() => {
        //remove token from cookies
        Cookies.remove("token");

        //redirect halaman login
        Router.push("/login");
      });
  };

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
              <h3 className="fs-4 mb-3">Edit Artikel</h3>
              <div className="col">
                {isLoading ? (
                  // Tampilkan loading skeleton jika isLoading true
                  <div><SkeletonLine /><SkeletonLine /><SkeletonLine /><SkeletonLine /></div>
                  
                ) : (
                  // Tampilkan DataTable jika isLoading false
                  <div className="card border-0 rounded shadow-sm">
                  <div className="card-body">
                    <form onSubmit={updatePost}>
                      <div className="form-group mb-3">
                        <label className="form-label fw-bold">Image</label>
                        <input
                          type="file"
                          className="form-control"
                          onChange={handleFileChange}
                        />
                      </div>

                      <div className="form-group mb-3">
                        <label className="form-label fw-bold">Judul</label>
                        <input
                          className="form-control"
                          type="text"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          placeholder="Masukkan Title"
                        />
                      </div>
                      {validation.title && (
                        <div className="alert alert-danger">
                          {validation.title}
                        </div>
                      )}
                      <div className="form-group mb-3">
                        <label className="form-label fw-bold">Topik</label>
                        <select
                          className="form-select"
                          aria-label="Default select example"
                          value={selectedTopics}
                          onChange={(e) => setSelectedTopics(e.target.value)} // Remove Array.from for single selection
                        >
                          <option value="" disabled>
                            Pilih Topik
                          </option>
                          {topiks.map((topik) => (
                            <option key={topik.id} value={topik.id}>
                              {topik.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="form-group mb-3">
                        <label className="form-label fw-bold">Konten</label>
                        <Editor
                          apiKey="y64g9p8st4vq2vpk35a0ial1gf2mjhm2xggag4e7bdh5nkpa"
                          onInit={(evt, editor) => (editorRef.current = editor)}
                          value={content}
                          onEditorChange={handleEditorChange}
                          init={{
                            height: 300,
                            menubar: false,
                            plugins: [
                              "advlist",
                              "autolink",
                              "lists",
                              "link",
                              "image",
                              "charmap",
                              "preview",
                              "anchor",
                              "searchreplace",
                              "visualblocks",
                              "code",
                              "fullscreen",
                              "insertdatetime",
                              "media",
                              "table",
                              "code",
                              "help",
                              "wordcount",
                            ],
                            toolbar:
                              "undo redo | blocks | " +
                              "bold italic forecolor | alignleft aligncenter " +
                              "alignright alignjustify | bullist numlist outdent indent | " +
                              "removeformat | help",
                            content_style:
                              "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                          }}
                        />
                      </div>
                      {validation.content && (
                        <div className="alert alert-danger">
                          {validation.content}
                        </div>
                      )}

                      <div className="form-group mb-3">
                        <label className="form-label fw-bold">Link Video</label>
                        <input
                          className="form-control"
                          type="text"
                          value={video}
                          onChange={(e) => setVideo(e.target.value)}
                          placeholder="Masukkan Link Video"
                        />
                      </div>
                      {validation.video && (
                        <div className="alert alert-danger">
                          {validation.video}
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
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default PostEdit;
