import Layout from "../../layouts/default";
import axios from "axios";
import { useState, useEffect } from "react";
import Head from "next/head";
import Styles from "../../styles/artikel.module.css";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import Cookies from "js-cookie";

// Skeleton line component
const SkeletonLine = () => <div className={`${Styles.skeletonLine} mb-3`}></div>;

export async function getServerSideProps(context) {
  try {
    const token = getTokenFromRequest(context.req);

    if (!token) {
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
    console.error("Error fetching data:", error);
    return {
      props: {
        topiks: [],
      },
    };
  }
}

// Function to extract token from the request
function getTokenFromRequest(req) {
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
  const [globalFilter, setGlobalFilter] = useState("");

  useEffect(() => {
    // Set timeout to simulate loading state
    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    // Clear timeout if component unmounts before timeout is complete
    return () => clearTimeout(timeout);
  }, []);

  const filteredTopiks = topiks.filter((topik) =>
    topik.name.toLowerCase().includes(globalFilter.toLowerCase())
  );

  return (
    <Layout>
      <Head>
        <title>Topik Kesehatan Mental</title>
      </Head>
      <div className={`mt-70 ${Styles.artikel}`}>
        <div className="container">
          <div className="title-section-topik mb-5">Topik Kesehatan Mental</div>
          <div className="input-group mb-3">
              <span className="input-group-text" id="basic-addon1"><i className="pi pi-search"></i></span>
              <input type="text" className="form-control no-focus-outline" placeholder="Cari topik..." aria-label="Cari topik..." aria-describedby="button-addon2" value={globalFilter} onChange={(e) => setGlobalFilter(e.target.value)}/>
            </div>
          {isLoading ? ( // Show loading skeleton if loading state is true
            <div className="row gy-4 mt-2 mb-5">
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
                <div className="row gy-4 mt-2 mb-5">
                  {filteredTopiks.length === 0 ? (
                    <div className="col-12">
                      <p>Belum ada topik yang tersedia.</p>
                    </div>
                  ) : (
                    filteredTopiks.map((topik) => (
                      <div
                        className="col-xl-3 col-md-6"
                        data-aos="fade-up"
                        data-aos-delay="100"
                        key={topik.id}
                      >
                        <div className="icon-box">
                          <div className="gambar_topik">
                            <img src={topik.image} alt="" />
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
                          <p>
                            {topik.finished_count} dari {topik.post_count} sudah
                            diselesaikan
                          </p>
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
