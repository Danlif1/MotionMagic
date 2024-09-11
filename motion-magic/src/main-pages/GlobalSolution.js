import React, {useCallback, useEffect, useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import SolutionSteps from './SolutionSteps'; // Assuming you have this for rendering the solution
import ShowEquations from './ShowEquations'; // Assuming you have this for rendering equations
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {
    faThumbsUp,
    faStar,
    faEye,
    faCaretDown,
    faCaretUp,
    faCommentDots,
    faHeart, faComment, faSync, faShareAlt
} from '@fortawesome/free-solid-svg-icons';
import './globalsolution.css';
import axios from "axios";
import {token} from "../login_signup/login/Login"; // Add your custom CSS
import display_pic from "./display_pic";
import {name_picture} from "./Home";
import FullSolution from "./FullSolution";
import {Modal} from "react-bootstrap";
import CommentsList from "./CommentsList";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import {toast} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import FullSolutionPDF from './FullSolutionPDF'; // Import the FullSolutionPDF component
import { Document, Page, PDFDownloadLink } from '@react-pdf/renderer';
import PDFDocument from "./PDFDocument";

const GlobalSolution = ({problem, pid}) => {
    console.log('again',problem);
    const [isOpen, setIsOpen] = useState(false);
    const [likes, setLikes] = useState(problem.Likes);
    const [liked, setLiked] = useState(problem.Likes.includes(name_picture.userName));
    const [showCommentsModal, setShowCommentsModal] = useState(false);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [error,setError] = useState('');
    const toggleOpen = () => {
        setIsOpen(!isOpen);
    };
    const handleCommentClick = () => {
        setShowCommentsModal(true);
    };

    const handleCloseModal = () => {
        setShowCommentsModal(false);
    };
    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        let tc = newComment.trim();
        if (newComment.trim() === '') return;


        // Clear the input field
        setNewComment('');

        // Optional: Send the new comment to the server
        try {
            const response = await axios.post(`http://localhost:5000/api/problem/${pid}/comment`, {
                    commentProblem: tc,
                },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    }
                });
            if (response.status === 200) {

                await fetchComments();
            } else {
                toast.error(response.data.message, {
                    position: "bottom-left",
                    autoClose: 3000,
                });
            }
        } catch (error) {
            toast.error(error.response.data.message, {
                position: "bottom-left",
                autoClose: 3000,
            });
            console.error('Error adding the comment:', error);
        }
    };
    const fetchComments = useCallback(async () => {
        console.log('Fetching Comments')
        try {
            const response = await axios.get(`http://localhost:5000/api/problem/${pid}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if(response.status===200) {
                setComments(response.data.problem['Comments']);
                console.log(response.data);
                setError('')
            } else{
                setError(response.data.message)
            }
        } catch (error) {
            console.error("Error fetching problems:", error);
            if (error.response && error.response.status === 401) {
                // Handle unauthorized access, maybe redirect to login
                setError(error.response || 'Unauthorized access');
            } else {
                setError('Error: '+error);
            }
        }
    }, [token]);
    useEffect(() => {
        setLikes(problem.Likes);
        setLiked(problem.Likes.includes(name_picture.userName))
    }, [problem])
    useEffect(()=>{

        console.log('comments is now', comments)
        setComments(problem.Comments);
    },[problem])
    const toggleLike = async () => {
        try {
            const response = await axios.put(`http://localhost:5000/api/problem/${pid}/like`,
                {}, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    }
                });

            if (response.status === 200) {
                const message = response.data.message;
                if (message === 'Liked problem') {
                    setLikes([...likes, name_picture.userName]); // Add like
                    setLiked(true)
                } else if (message === 'Removed like') {
                    setLikes(likes.filter(user => user !== name_picture.userName)); // Remove like
                    setLiked(false)
                }
            }
        } catch (error) {
            console.error("Error liking the problem:", error);
        }
    };
    const formattedDate = new Date(problem.Time).toLocaleString();

    return (
        <div className="container mb-3">
            <div className="card" style={{minWidth: '1000px'}}>
                <div className="card-header">
                    <div className="d-flex justify-content-between align-items-center">
                        {/* Creator and Time */}
                        <div className="d-flex align-items-center">
                            <img
                                src={display_pic(problem.CreatorProfilePic)}
                                width="35"
                                height="35"
                                className="d-inline-block align-top rounded-circle mr-2"
                                alt="Profile Picture"
                            />
                            {/*<span style={{marginLeft: '10px'}}>*/}
                            {/*{displayName}*/}
                            {/*    </span>*/}
                            <div style={{display: 'flex', flexDirection: 'column', marginLeft: '10px'}}>
                                <span>{problem.Creator}</span>
                                <small style={{color: 'gray', marginTop: '-5px'}}
                                       className="creator-name">@{problem.CreatorUsername}</small>
                            </div>
                            {/*<span className="creator-name">{problem.Creator} </span>*/}
                            <span className="timestamp ml-3" style={{marginLeft: '10px'}}>{formattedDate}</span>
                            <button className="collapse-button ml-3" onClick={toggleOpen}>
                                {isOpen ? (
                                    <FontAwesomeIcon size="lg" icon={faCaretUp}/>
                                ) : (
                                    <FontAwesomeIcon size="lg" icon={faCaretDown}/>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
                <div className="card-body" style={{wordBreak: 'break-all',whiteSpace: 'nowrap'}}>
                    <div className={`card-body ${isOpen ? '' : 'collapsed-content'}`} >
                        {/*<h5>Equations:</h5>*/}
                        {/*<ShowEquations equationsData={problem.Equations}/>*/}
                        {/*<h5>Solution:</h5>*/}
                        {/*<SolutionSteps serverResponseSolution={problem.Solution}/>*/}
                        <FullSolution problem={problem} showTable={true} showFinalTableSol={true}/>
                    </div>
                </div>
                <div className="card-footer d-flex justify-content-between align-items-center">

                    <div className="d-flex align-items-center">
                        <button className={`heart-button`} onClick={toggleLike}>
                            {liked ? (
                                <FontAwesomeIcon icon={faHeart} style={{color: "#fc7373"}}/>
                            ) : (
                                <FontAwesomeIcon icon={faHeart}/>
                            )}

                        </button>
                        <span className="ml-1" style={{marginLeft: '3px', color: "gray"}}> {likes.length}</span>


                        <button className=" icon-button ml-3" onClick={handleCommentClick} style={{marginLeft: '10px'}}>
                            <FontAwesomeIcon icon={faComment}/>
                            <span className="ml-1"> Comment</span>

                        </button>
                        <span className="icon-button ml-3" >

                            <PDFDownloadLink
                                document={<PDFDocument problem={problem} />}
                                fileName={`solution_${pid}`}
                                className="share-button"
                                style={{marginLeft:'10px',color:'gray',textDecoration:'none'}}
                            >
            {({ loading }) => (loading ? 'Generating PDF...' : <><FontAwesomeIcon icon={faShareAlt}/> Extract PDF</> )}
          </PDFDownloadLink>
                        </span>
                    </div>

                    <span style={{color: 'gray',}}>
                        <FontAwesomeIcon icon={faEye}/>
                        <span className="ml-1"> {problem.Views}</span>
                    </span>
                </div>
            </div>
            <Modal show={showCommentsModal} onHide={handleCloseModal} size="xl" centered>
                <Modal.Body style={{display: 'flex',overflow:'hidden'}} className={'blabla'}>
                    {/* Left Side: Solution */}
                    <div style={{flex: 1, paddingRight: '20px', borderRight: '1px solid #ccc',overflowY:'auto'}} className={'rightsidesolution'}>
                        <FullSolution problem={problem} showTable={true}/>
                    </div>

                    {/* Right Side: Comments */}
                    <div style={{
                        flex: 1,
                        paddingLeft: '20px',
                        position: 'relative',
                        display: 'flex',
                        flexDirection: 'column'
                    }}>
                        <div style={{position: 'relative', top: 5, left: 0}}>
                            <div className="d-flex justify-content-between align-items-center">
                                <div className="comment-left d-flex align-items-center">
                                    <img
                                        src={display_pic(problem.CreatorProfilePic)}
                                        width="35"
                                        height="35"
                                        className="d-inline-block align-top rounded-circle mr-2"
                                        alt="Profile Picture"
                                    />
                                    {/*<span style={{marginLeft: '10px'}}>*/}
                                    {/*{displayName}*/}
                                    {/*    </span>*/}
                                    <div style={{display: 'flex', flexDirection: 'column', marginLeft: '10px'}}>
                                        <span>{problem.Creator}</span>
                                        <small style={{color: 'gray', marginTop: '-5px'}}
                                               className="creator-name">@{problem.CreatorUsername}</small>
                                    </div>
                                </div>
                                <Button variant="light" href="#" className="mr-2 custom-button refresh-button"
                                        onClick={fetchComments}>
                                    <FontAwesomeIcon icon={faSync}/>
                                </Button>
                            </div>

                        </div>
                        <div style={{marginTop: '20px'}}>
                            <h5>Comments</h5>

                        </div>
                        <div style={{flex: 1, overflowY: 'auto'}} className='commentslist'>
                            {error && (
                                <div className="alert alert-danger">
                                    {error}
                                </div>
                            )}
                            {!error && (
                                <CommentsList comments={comments.toReversed()}/>
                            )}
                            {!error && comments.length===0 && (
                                <div className='text-muted'>
                                    No comments on this problem yet.
                                </div>
                            ) }

                        </div>
                        <Form onSubmit={handleCommentSubmit} className="mt-3"
                              style={{position: 'relative', bottom: 0, width: '100%', flex: 0}}>
                            <Form.Group>
                                <Form.Control
                                    type="text"
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    placeholder="Add a comment..."
                                />
                            </Form.Group>
                            <Button variant="primary" type="submit">
                            Submit
                            </Button>
                        </Form>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default GlobalSolution;
