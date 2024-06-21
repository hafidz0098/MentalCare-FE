import Layout from "../layouts/default";
import { useState, useEffect } from "react";
import Head from "next/head";
import Router from "next/router";
import axios from "axios";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import Link from "next/link";

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

    // Check if any of the fields is empty
    if (!name || !email || !password || !passwordConfirmation) {
      Swal.fire("Oops!", "Silakan isi semua field sebelum daftar.", "error");
      return; // Stop the function if any field is empty
    }

    //initialize formData
    const formData = new FormData();

    //append data to formData
    formData.append("name", name);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("password_confirmation", passwordConfirmation);

    //send data to server
    await axios
      .post(`${process.env.NEXT_PUBLIC_API_BACKEND}/api/register`, formData)
      .then((response) => {
        Swal.fire("Good job!", "Berhasil mendaftarkan akun!", "success");
        //redirect to home
        Router.push("/login");
      })
      .catch((error) => {
        //assign error to state "validation"
        setValidation(error.response.data);
      });
  };

  return (
    <Layout>
      <Head>
        <title>Register Account</title>
      </Head>
      <div className="section-login">
        <div className="container">
          <div className="row justify-content-center">
            <div className="mx-auto col-10 col-md-8 col-lg-6mx-auto col-10 col-md-8 col-lg-6">
              <div className="card border-0 rounded shadow-sm">
                <div className="card-body">
                  <h4 className="fw-bold">Register</h4>
                  <hr />
                  {validation.message && (
                    <div className="alert alert-danger">
                      {validation.message}
                    </div>
                  )}
                  <form onSubmit={registerHandler}>
                    <div className="mb-3">
                      <label className="form-label">Nama</label>
                      <input
                        type="text"
                        className="form-control"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Masukkan Nama"
                      />
                    </div>
                    {validation.name && (
                      <div className="alert alert-danger">
                        {validation.name[0]}
                      </div>
                    )}
                    <div className="mb-3">
                      <label className="form-label">Email</label>
                      <input
                        type="email"
                        className="form-control"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Masukkan Alamat Email"
                      />
                    </div>
                    {validation.email && (
                      <div className="alert alert-danger">
                        {validation.email[0]}
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
                      <label className="form-label">Konfirmasi Password</label>
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

                    <div className="d-grid gap-2">
                      <button type="submit" className="btn btn-primary">
                        Daftar
                      </button>
                    </div>
                    <div className="mt-4">
                      Sudah punya akun? <Link href="/login"> Login</Link>
                    </div>
                  </form>
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
