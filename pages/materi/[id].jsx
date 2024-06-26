import React, { useEffect, useState } from 'react';
import Layout from '../../layouts/default';
import axios from "axios";
import ReactPlayer from 'react-player';
import Styles from "../../styles/artikel.module.css";
import { useRouter } from "next/router";
import Swal from 'sweetalert2';
import { format } from "date-fns";
import Link from 'next/link';
import jwtDecode from 'jwt-decode';
import Cookies from 'js-cookie';
import { RadioButton } from "primereact/radiobutton";

export async function getServerSideProps({ params }) {
    try {
        const postreq = await axios.get(`${process.env.NEXT_PUBLIC_API_BACKEND}/api/posts/${params.id}`);
        const postres = postreq.data.data;

        const postId = postres.id;
        const quizreq = await axios.get(`${process.env.NEXT_PUBLIC_API_BACKEND}/api/quizbypost/${postId}`);
        const quizres = quizreq.data.data;

        return {
            props: {
                post: postres,
                quiz: quizres
            },
        }
    } catch (error) {
        console.error("Error fetching data:", error);
        return {
            props: {
                post: null,
                quiz: null
            },
        }
    }
}

function Post(props) {
    const { post, quiz } = props;
    const [showPlayer, setShowPlayer] = useState(false);
    const router = useRouter();
    const { id } = router.query;

    useEffect(() => {
        setShowPlayer(true);
    }, []);

    const handleQuizSubmit = async () => {
        if (!quiz || quiz.length === 0 || !quiz[0].question) {
            Swal.fire({
                title: 'Error',
                text: 'Quiz belum tersedia!',
                icon: 'error'
            });
            return;
        }

        const quizQuestion = quiz[0].question;
        const options = {
            a: quiz[0].option_a,
            b: quiz[0].option_b,
            c: quiz[0].option_c,
            d: quiz[0].option_d
        };

        const optionHtml = `
            <p>${quizQuestion}</p>
            <div className="flex align-items-center">
                <input type="radio" id="option-d" name="quiz" value="${options.a}">
                <label htmlFor=${options.a}} className="ml-2">${options.a}</label>
            </div>
            <div className="flex align-items-center">
                <input type="radio" id="option-d" name="quiz" value="${options.b}">
                <label htmlFor=${options.b}} className="ml-2">${options.b}</label>
            </div>
            <div className="flex align-items-center">
                <input type="radio" id="option-d" name="quiz" value="${options.c}">
                <label htmlFor=${options.c}} className="ml-2">${options.c}</label>
            </div>
            <div className="flex align-items-center">
                <input type="radio" id="option-d" name="quiz" value="${options.d}">
                <label htmlFor=${options.d}} className="ml-2">${options.d}</label>
            </div>
            
        `;

        const { value: answer, dismiss } = await Swal.fire({
            title: "Quiz",
            html: optionHtml,
            focusConfirm: false,
            preConfirm: () => {
                const selectedOption = document.querySelector('input[name="quiz"]:checked');
                if (selectedOption) {
                    return selectedOption.value;
                } else {
                    Swal.showValidationMessage('You need to choose an answer!');
                }
            },
            showCancelButton: true,
            confirmButtonText: 'Submit',
            cancelButtonText: 'Cancel',
            showLoaderOnConfirm: true,
            customClass: {
                htmlContainer: 'swal2-html-container-custom'
            },
            allowOutsideClick: () => !Swal.isLoading()
        });

        if (answer) {
            try {
                const quizId = quiz[0].id;
                const postId = post.id;

                const token = Cookies.get("token");
                if (!token) {
                    Swal.showValidationMessage('User not authenticated');
                    return;
                }

                const decodedToken = jwtDecode(token);
                const userId = decodedToken.sub;
                if (!userId) {
                    Swal.showValidationMessage('Invalid token');
                    return;
                }

                const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BACKEND}/api/attemptquiz`, {
                    quiz_id: quizId,
                    user_answer: answer,
                    post_id: postId,
                    user_id: userId
                });

                if (response.data.data.skor === 100) {
                    Swal.fire({
                        title: 'Jawaban benar',
                        html: `Nilai: ${response.data.data.skor}`,
                        icon: 'success'
                    });
                } else {
                    Swal.fire({
                        title: 'Jawaban salah',
                        html: `Nilai: ${response.data.data.skor}`,
                        icon: 'error'
                    });
                }

                console.log(response);
            } catch (error) {
                Swal.showValidationMessage(`Request failed: ${error}`);
            }
        }
    };

    if (!post) {
        return <div>Loading...</div>;
    }

    return (
        <Layout>
            <div className={Styles.detail_artikel}>
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-9" key={post.id}>
                            <div className={Styles.card_detail_artikel}>
                                <div className="card-img">
                                    <img src={post.image} alt="" className="img-fluid"/>
                                </div>
                                <div className={Styles.card_title_detail}>
                                    <h2>{post.title}</h2>
                                </div>
                                <p>Tanggal Posting : {format(
                                    new Date(post.created_at),
                                    "dd MMM yyyy"
                                )}</p>
                                <div className={Styles.card_content_detail} dangerouslySetInnerHTML={{ __html: post.content }}></div>
                                <div className={Styles.video_container}>
                                    {showPlayer && <ReactPlayer url={post.video} />}
                                </div>
                                <div className={Styles.card_quiz}>
                                    <div className="container" data-aos="zoom-in">
                                        <div className="text-center">
                                            <h3>Yuk kerjakan mini kuis!</h3>
                                            <p>Terdapat mini kuis yang dapat kamu kerjakan untuk menguji pemahamanmu terkait materi yang baru kamu pelajari</p>
                                            <button className={Styles.card_quiz_btn} onClick={handleQuizSubmit}>Kerjakan kuis</button>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-center mt-4">
                                    <h5 className="mb-4">Masih kurang paham? Yuk tanyakan ke psikolog</h5>
                                    <Link href="/konsultasi" className='btn btn-custom'>Tanya ke psikolog</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

export default Post;
