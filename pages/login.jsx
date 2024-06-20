import Layout from "../layouts/default";
import { useState, useEffect } from "react";
import Head from "next/head";
import Router from "next/router";
import axios from "axios";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import Link from "next/link";
import { Button } from "primereact/button";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [validation, setValidation] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const loginHandler = async (e) => {
    e.preventDefault();

    // Check if any of the fields is empty
    if (!formData.email || !formData.password) {
      Swal.fire("Oops!", "Silakan isi semua field sebelum login.", "error");
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BACKEND}/api/login`,
        formData
      );
      Cookies.set("token", response.data.token);
      Router.push("/");
    } catch (error) {
      setValidation(error.response.data);
    }
  };

  useEffect(() => {
    if (Cookies.get("token")) {
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
            <div className="mx-auto col-10 col-md-8 col-lg-6">
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
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Masukkan Alamat Email"
                      />
                      {validation.email && (
                        <div className="alert alert-danger">
                          {validation.email[0]}
                        </div>
                      )}
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Password</label>
                      <input
                        type="password"
                        className="form-control"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Masukkan Password"
                      />
                      {validation.password && (
                        <div className="alert alert-danger">
                          {validation.password[0]}
                        </div>
                      )}
                    </div>
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
