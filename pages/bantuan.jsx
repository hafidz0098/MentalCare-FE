import Layout from "../layouts/default";
import axios from "axios";
import Head from "next/head";

export async function getServerSideProps() {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BACKEND}/api/bantuans`
    );
    const bantuans = response.data.data.data;

    return {
      props: {
        bantuans: bantuans,
      },
    };
  } catch (error) {
    console.error("Error fetching bantuans:", error);
    return {
      props: {
        bantuans: [],
      },
    };
  }
}

function Bantuan(props) {
  const { bantuans } = props;

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
          <div class="row">
            {bantuans.length === 0 ? (
              <div className="col-12">
                <p>Belum ada bantuan yang tersedia.</p>
              </div>
            ) : (
              bantuans.map((bantuan) => (
                <div
                  class="col-lg-6 mb-4"
                  data-aos="zoom-in"
                  data-aos-delay="100"
                  key={bantuan.id}
                >
                  <div class="member d-flex align-items-start">
                    <div class="pic">
                      <img
                        src={bantuan.image}
                        class="img-fluid"
                        alt=""
                      />
                    </div>
                    <div class="member-info">
                      <h4>{bantuan.title}</h4>
                      <span>{bantuan.tipe}</span>
                      <div class="social">
                        <a href={bantuan.link_url} target="_blank">
                          <i class="ri-chrome-line"></i>
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
