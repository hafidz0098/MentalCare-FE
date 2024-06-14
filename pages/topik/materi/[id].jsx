import Layout from "../../../layouts/default";
import axios from "axios";
import Link from 'next/link';
import Head from "next/head";
import Styles from "../../../styles/artikel.module.css"

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

    const { params } = context;

    // Set the authorization header
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    // Fetch data using the token
    const req = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BACKEND}/api/topiks/${params.id}`,
      config
    );

    const { data } = req.data;  // Extract data object
    const posts = data;
    const topikTitle = req.data.topik_title;  // Extract topik title

    return {
      props: {
        posts,
        topikTitle,
      },
    };
  } catch (error) {
    console.error("Error fetching konsultasi data:", error);
    return {
      props: {
        posts: [],
        topikTitle: "",
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

function PostIndex({ posts, topikTitle }) {
  return (
    <Layout>
      <Head>
        <title>Artikel</title>
      </Head>
      <div className={`mt-70 ${Styles.artikel}`}>
        <div className="container">
          <div className="title-section mb-5">
            Artikel Tentang {topikTitle}
          </div>
          <div className="row gy-5 mb-5 justify-content-center">
            {posts.length === 0 ? (
              <div className="col-12">
                <p>Tidak ada artikel yang tersedia.</p>
              </div>
            ) : (
              posts.map((postItem) => (
                <div className="col-lg-3 d-flex align-items-stretch justify-content-center" key={postItem.post.id}>
                  <div className="card">
                    <img className="card-image-artikel" src={`${process.env.NEXT_PUBLIC_API_BACKEND}/storage/posts/${postItem.post.image}`} alt="..." />
                    <div className="card-body">
                      <h5 className="card-title">{postItem.post.title}</h5>
                      <p className={`mt-3 badge ${postItem.user_progress && postItem.user_progress.status === 'Finished' ? 'badge-finished' : 'badge-not-finished'}`}>
                        {postItem.user_progress ? postItem.user_progress.status : "Not Finished"}
                      </p>
                      <div className="artikel-content card-text" dangerouslySetInnerHTML={{ __html: postItem.post.content }}></div>
                      <Link href={`/materi/${postItem.post.id}`} legacyBehavior><a className="btn btn-artikel">Baca Selengkapnya</a></Link>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default PostIndex;
