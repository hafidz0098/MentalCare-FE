import Layout from "../layouts/default";
import { useState, useEffect } from "react";
import Head from "next/head";
import Router from "next/router";
import axios from "axios";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import Link from "next/link";
import { Button } from "primereact/button";
export const runtime = 'edge';
function Login() {
  //define state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  //define state validation
  const [validation, setValidation] = useState([]);

  //function "loginHanlder"
  const loginHandler = async (e) => {
    e.preventDefault();

    // Check if any of the fields is empty
    if (!email || !password) {
      Swal.fire("Oops!", "Silakan isi semua field sebelum login.", "error");
      return; // Stop the function if any field is empty
    }

    //initialize formData
    const formData = new FormData();

    //append data to formData
    formData.append("email", email);
    formData.append("password", password);

    //send data to server
    await axios
      .post(`${process.env.NEXT_PUBLIC_API_BACKEND}/api/login`, formData)
      .then((response) => {
        //set token on cookies
        Cookies.set("token", response.data.token);
        //redirect to dashboard
        Router.push("/");
      })
      .catch((error) => {
        //assign error to state "validation"
        setValidation(error.response.data);
      });
  };

  //hook useEffect
  useEffect(() => {
    //check token
    if (Cookies.get("token")) {
      //redirect page dashboard
      Router.push("/dashboard");
    }
  }, []);

  return (
    <Layout>
      <Head>
        <title>Login Account</title>
      </Head>
      <div className="section-login">
        <div className="container">
          <div className="row justify-content-center">
            <div className="mx-auto col-10 col-md-8 col-lg-6mx-auto col-10 col-md-8 col-lg-6">
              <div className="card border-0 rounded shadow-sm">
                <div className="card-body">
                  <h4 className="fw-bold">Login</h4>
                  <hr />
                  {validation.message && (
                    <div className="alert alert-danger">
                      {validation.message}
                    </div>
                  )}
                  <form onSubmit={loginHandler}>
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
                    <div className="d-grid gap-2">
                      <Button
                        label="Login"
                        type="submit"
                        className="btn btn-primary"
                      />
                    </div>
                    <div className="mt-4">
                      Belum punya akun?{" "}
                      <Link href="/register"> Daftar Sekarang</Link>
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

export default Login;
