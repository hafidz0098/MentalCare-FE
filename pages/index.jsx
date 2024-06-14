import Layout from "../layouts/default";
import Head from "next/head";
import Link from "next/link";
import axios from "axios";
import Styles from "../styles/Home.module.css";
import Image from "next/image";

export async function getServerSideProps() {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BACKEND}/api/topiks`
    );
    const topiks = response.data.data.data;

    return {
      props: {
        topiks: topiks,
      },
    };
  } catch (error) {
    console.error("Error fetching topiks:", error);
    return {
      props: {
        topiks: [],
      },
    };
  }
}

function Home(props) {
  const { topiks } = props;
  const latestTopiks = topiks.slice(0, 7);

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
              Ayo belajar tentang kesehatan mental bersama MentalCare yang siap memberikan kamu informasi yang lengkap seputar kesehatan mental
              </p>
              <Link
                href="/topik"
                className={`btn btn-custom ${Styles.heroBtn}`}
              >
                Selengkapnya
              </Link>
            </div>
            <div className="col-img col-lg-6 col-sm-12">
              <img src="mental.png" alt="" />
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
            <div className="col-lg-3 col-md-6 col-sm-12 d-flex align-items-stretch">
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
            <div className="col-lg-3 col-md-6 col-sm-12 d-flex align-items-stretch">
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
            <div className="col-lg-3 col-md-6 col-sm-12 d-flex align-items-stretch">
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
            <div className="col-lg-3 col-md-6 col-sm-12 d-flex align-items-stretch">
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
          </div>
        </div>
      </div>
      <div className={Styles.topik}>
        <div className="container mb-5">
          <div className="title-section">
            Topik Kesehatan Mental yang Bisa Kamu Pelajari
          </div>
          <div class="icon-boxes position-relative">
            <div class="container position-relative">
              <div class="row gy-4 mt-5 justify-content-center">
                {latestTopiks.length === 0 ? (
                  <div className="col-12">
                    <p>Belum ada topik yang tersedia.</p>
                  </div>
                ) : (
                  latestTopiks.map((topik) => (
                    <div
                      class="col-xl-3 col-md-6"
                      data-aos="fade-up"
                      data-aos-delay="100"
                      key={topik.id}
                    >
                      <div class="icon-box">
                        <div class="gambar_topik">
                          <img
                            src={`${process.env.NEXT_PUBLIC_API_BACKEND}/storage/topiks/${topik.image}`}
                            alt=""
                            srcset=""
                          />
                        </div>
                        <h4 class="title">
                          <a
                            href={`/topik/materi/${topik.id}`}
                            class="stretched-link"
                          >
                            {topik.name}
                          </a>
                        </h4>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
          <div className="text-center">
            <Link
              href="/topik"
              className={`btn btn-custom mt-5 ${Styles.heroBtn}`}
            >
              Lihat Topik Selengkapnya
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Home;
