import React, { useEffect, useState } from 'react';
import Layout from '../../layouts/default';
import axios from "axios";
import ReactPlayer from 'react-player';
import Styles from "../../styles/artikel.module.css";
import { useRouter } from "next/router";
import Swal from 'sweetalert2';
import { format } from "date-fns";
import Link from 'next/link';

export async function getServerSideProps({ params }) {
    const postreq = await axios.get(`${process.env.NEXT_PUBLIC_API_BACKEND}/api/posts/${params.id}`);
    const postres = await postreq.data.data;

    const postId = postres.id;
    const quizreq = await axios.get(`${process.env.NEXT_PUBLIC_API_BACKEND}/api/quizbypost/${postId}`);
    const quizres = await quizreq.data.data;

    return {
        props: {
            post: postres,
            quiz: quizres
        },
    }
}

function Post(props) {
    const { post, quiz } = props;
    const [showPlayer, setShowPlayer] = useState(false);
    // const [quizAnswer, setQuizAnswer] = useState('');
    const router = useRouter();
    const { id } = router.query;

    useEffect(() => {
        setShowPlayer(true);
    }, []);

    const handleQuizSubmit = async () => {
        // Memeriksa apakah quiz memiliki nilai atau tidak
        if (!quiz || quiz.length === 0 || !quiz[0].question) {
            Swal.fire({
                title: 'Error',
                text: 'Quiz belum tersedia!',
                icon: 'error'
            });
            return;
        }
    
        const quizQuestion = quiz[0].question;
    
        const { value: answer, dismiss } = await Swal.fire({
            title: "Quiz",
            input: 'text',
            inputLabel: quizQuestion,
            inputPlaceholder: 'Your answer',
            showCancelButton: true,
            confirmButtonText: 'Submit',
            cancelButtonText: 'Cancel',
            showLoaderOnConfirm: true,
            customClass: {
                inputLabel: 'swal2-label-custom' // Menambahkan kelas kustom ke label input
            },
            preConfirm: async (answer) => {
                if (answer === undefined) {
                    dismiss(Swal.DismissReason.cancel);
                }
                try {
                    // Mendapatkan quiz_id dari data kuis
                    const quizId = quiz[0].id;
                    const postId = post.id;
    
                    // Melakukan panggilan API untuk mengirim jawaban kuis
                    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BACKEND}/api/attemptquiz`, {
                        quiz_id: quizId,
                        user_answer: answer,
                        post_id: postId
                    });
    
                    return response.data; // Mengembalikan respons dari panggilan API
                } catch (error) {
                    // Menampilkan pesan kesalahan jika terjadi kesalahan saat mengirim jawaban
                    Swal.showValidationMessage(`Request failed: ${error}`);
                }
            },
            allowOutsideClick: () => !Swal.isLoading()
        });
    
        if (answer) {
            if (answer.data.skor === 100) {
                Swal.fire({
                    title: 'Jawaban benar',
                    html: `Nilai: ${answer.data.skor}`,
                    icon: 'success'
                });
            } else {
                Swal.fire({
                    title: 'Jawaban salah',
                    html: `Nilai: ${answer.data.skor}`,
                    icon: 'error'
                });
            }
        }
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
