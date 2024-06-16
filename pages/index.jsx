import Layout from "../layouts/default";
import Head from "next/head";
import Link from "next/link";
import axios from "axios";
import Styles from "../styles/Home.module.css";
import { useState, useEffect } from "react";

const SkeletonLine = () => <div className={`${Styles.skeletonLine} mb-3`}></div>;

export async function getServerSideProps() {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BACKEND}/api/topiks`,
      { timeout: 5000 } // 5 seconds timeout
    );
    const topiks = response.data?.data?.data || [];

    return {
      props: {
        topiks,
      },
    };
  } catch (error) {
    console.error("Error fetching topiks:", error);
    return {
      props: {
        topiks: [],
        error: error.message || "Error fetching topiks",
      },
    };
  }
}

function Home({ topiks = [], error }) {
  const [loading, setLoading] = useState(true);
  const [latestTopiks, setLatestTopiks] = useState([]);
  const [fetchError, setFetchError] = useState("");

  useEffect(() => {
    if (error) {
      setFetchError(error);
      setLoading(false);
    } else if (topiks.length > 0) {
      setLatestTopiks(topiks.slice(0, 7));
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [topiks, error]);

  return (
    <Layout>
      <Head>
        <title>MentalCare</title>
      </Head>
      <div className={Styles.hero}>
        <div className={`container ${Styles.container_hero}`}>
          <div className="row">
            <div className="col-text col-lg-6 col-sm-12">
              <h1 className={Styles.title}>
                Belajar Tentang Kesehatan Mental dengan Asik dan Menyenangkan
              </h1>
              <p className={Styles.desc}>
                Ayo belajar tentang kesehatan mental bersama MentalCare yang
                siap memberikan kamu informasi yang lengkap seputar kesehatan
                mental
              </p>
              <Link href="/topik" className={`btn btn-custom ${Styles.heroBtn}`}>
                Selengkapnya
              </Link>
            </div>
            <div className="col-img col-lg-6 col-sm-12">
              <img src="mental.png" alt="Mental Health" />
            </div>
          </div>
        </div>
      </div>
      <div className={Styles.kenali}>
        <div className="container">
          <div className="title-section pt-5 pb-3">
            Yuk Kenali Berbagai Macam Penyakit Mental
          </div>
          <div className="row mt-5">
            {[...Array(4)].map((_, index) => (
              <div
                className="col-lg-3 col-md-6 col-sm-12 d-flex align-items-stretch"
                key={index}
              >
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">Skizofrenia</h5>
                    <p className="card-text">
                      Gangguan skizofrenia termasuk ke dalam gangguan psikotik
                      yang membuat orang seperti melihat atau merasakan sesuatu.
                      Saat mengidap gangguan skizofrenia, seseorang sulit
                      membedakan mana kehidupan yang nyata dan mimpi.
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className={Styles.topik}>
        <div className="container mb-5">
          <div className="title-section">
            Topik Kesehatan Mental yang Bisa Kamu Pelajari
          </div>
          <div className="icon-boxes position-relative">
            <div className="container position-relative">
              <div className="row gy-4 mt-5 justify-content-center">
                {loading ? (
                  [...Array(7)].map((_, index) => (
                    <div className="col-xl-3 col-md-6" key={index}>
                      <SkeletonLine />
                      <SkeletonLine />
                      <SkeletonLine />
                    </div>
                  ))
                ) : fetchError ? (
                  <div className="col-12">
                    <p>Error loading topics: {fetchError}</p>
                  </div>
                ) : latestTopiks.length === 0 ? (
                  <div className="col-12">
                    <p>Belum ada topik yang tersedia.</p>
                  </div>
                ) : (
                  latestTopiks.map((topik) => (
                    <div
                      className="col-xl-3 col-md-6"
                      data-aos="fade-up"
                      data-aos-delay="100"
                      key={topik.id}
                    >
                      <div className="icon-box">
                        <div className="gambar_topik">
                          <img src={topik.image} alt={topik.name} />
                        </div>
                        <h4 className="title">
                          <Link
                            href={`/topik/materi/${topik.id}`}
                            className="stretched-link"
                          >
                            {topik.name}
                          </Link>
                        </h4>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
          <div className="text-center">
            <Link href="/topik" className={`btn btn-custom mt-5 ${Styles.heroBtn}`}>
              Lihat Topik Selengkapnya
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Home;
