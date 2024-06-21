import Layout from "../layouts/default";
import axios from "axios";
import Head from "next/head";
import { useState, useEffect } from "react";
import Styles from "../styles/Home.module.css";

const SkeletonLine = () => <div className={`${Styles.skeletonLine} mb-3`}></div>;

export async function getServerSideProps() {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BACKEND}/api/bantuans`
    );
    const bantuans = response.data.data.data;

    return {
      props: {
        bantuans,
      },
    };
  } catch (error) {
    console.error("Error fetching bantuans:", error);
    return {
      props: {
        bantuans: [],
        error: error.message || "Error fetching bantuans",
      },
    };
  }
}

function Bantuan({ bantuans, error }) {
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");

  useEffect(() => {
    if (error) {
      setFetchError(error);
    }
    setLoading(false);
  }, [error]);

  return (
    <Layout>
      <Head>
        <title>Bantuan Layanan Kesehatan Mental</title>
      </Head>
      <section id="team" className="team section-bg">
        <div className="container" data-aos="fade-up">
          <div className="title-section mb-5">
            Bantuan Layanan Kesehatan Mental
          </div>
          <div className="row">
            {loading ? (
              [...Array(4)].map((_, index) => (
                <div className="col-lg-6 mb-4" key={index}>
                  <SkeletonLine />
                  <SkeletonLine />
                  <SkeletonLine />
                </div>
              ))
            ) : fetchError ? (
              <div className="col-12">
                <p>Error loading data: {fetchError}</p>
              </div>
            ) : bantuans.length === 0 ? (
              <div className="col-12">
                <p>Belum ada bantuan yang tersedia.</p>
              </div>
            ) : (
              bantuans.map((bantuan) => (
                <div
                  className="col-lg-6 mb-4"
                  data-aos="zoom-in"
                  data-aos-delay="100"
                  key={bantuan.id}
                >
                  <div className="member d-flex align-items-start">
                    <div className="pic">
                      <img
                        src={bantuan.image}
                        className="img-fluid"
                        alt={bantuan.title}
                      />
                    </div>
                    <div className="member-info">
                      <h4>{bantuan.title}</h4>
                      <span>{bantuan.tipe}</span>
                      <div className="social">
                        <a href={bantuan.link_url} target="_blank" rel="noopener noreferrer">
                          <i className="ri-chrome-line"></i>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
}

export default Bantuan;
