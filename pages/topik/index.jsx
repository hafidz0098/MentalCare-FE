import Layout from "../../layouts/default";
import axios from "axios";
import { useState, useEffect } from "react";
import Head from "next/head";
import Styles from "../../styles/artikel.module.css";
import jwtDecode from "jwt-decode";

// Skeleton line component
const SkeletonLine = () => <div className={`${Styles.skeletonLine} mb-3`}></div>;

export async function getServerSideProps(context) {
  try {
    const token = getTokenFromCookies(context.req);

    if (!token) {
      return {
        redirect: {
          destination: "/login",
          permanent: false,
        },
      };
    }

    // Decode the token to ensure it's valid
    const decodedToken = jwtDecode(token);
    if (!decodedToken) {
      return {
        redirect: {
          destination: "/login",
          permanent: false,
        },
      };
    }

    // Set the authorization header
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    // Fetch data using the token
    const req = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BACKEND}/api/topicwithprogress`,
      config
    );

    const topiks = req.data.data;

    return {
      props: {
        topiks,
      },
    };
  } catch (error) {
    console.error("Error fetching konsultasi data:", error);
    return {
      props: {
        topiks: [],
      },
    };
  }
}

// Function to extract token from cookies
function getTokenFromCookies(req) {
  // Check if the request contains cookies
  if (req.headers.cookie) {
    // Extract cookies from the request headers
    const cookies = req.headers.cookie
      .split(";")
      .map((cookie) => cookie.trim());

    // Find the cookie containing the token
    const tokenCookie = cookies.find((cookie) => cookie.startsWith("token="));

    // If token cookie is found, extract and return the token
    if (tokenCookie) {
      return tokenCookie.split("=")[1];
    }
  }

  // If token is not found, return null
  return null;
}

function TopikIndex(props) {
  const { topiks } = props;
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Atur timeout untuk menunjukkan indikator loading selama 2 detik (misalnya)
    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    // Bersihkan timeout jika komponen di-unmount sebelum timeout selesai
    return () => clearTimeout(timeout);
  }, []);

  return (
    <Layout>
      <Head>
        <title>Topik Kesehatan Mental</title>
      </Head>
      <div className={`mt-70 ${Styles.artikel}`}>
        <div className="container">
          <div className="title-section-topik mb-3">Topik Kesehatan Mental</div>
          {isLoading ? ( // Tampilkan indikator loading jika status loading true
            <div className="row gy-4 mt-5 mb-5">
              {[...Array(4)].map((_, index) => (
                <div className="col-xl-3 col-md-6" key={index}>
                  <SkeletonLine />
                  <SkeletonLine />
                </div>
              ))}
            </div>
          ) : (
            <div className="icon-boxes position-relative">
              <div className="container position-relative">
                <div className="row gy-4 mt-5 mb-5">
                  {topiks.length === 0 ? (
                    <div className="col-12">
                      <p>Belum ada topik yang tersedia.</p>
                    </div>
                  ) : (
                    topiks.map((topik) => (
                      <div
                        className="col-xl-3 col-md-6"
                        data-aos="fade-up"
                        data-aos-delay="100"
                        key={topik.id}
                      >
                        <div className="icon-box">
                          <div className="gambar_topik">
                            <img
                              src={topik.image}
                              alt=""
                              srcSet=""
                            />
                          </div>
                          <h4 className="title">
                            <a
                              href={`/topik/materi/${topik.id}`}
                              className="stretched-link"
                            >
                              {topik.name}
                            </a>
                          </h4>
                          <hr />
                          <p>{topik.finished_count} dari {topik.post_count} sudah diselesaikan</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

export default TopikIndex;
