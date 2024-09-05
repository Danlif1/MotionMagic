import React, {useEffect, useState} from 'react';
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
    faHeart, faComment
} from '@fortawesome/free-solid-svg-icons';
import './globalsolution.css';
import axios from "axios";
import {token} from "../login_signup/login/Login"; // Add your custom CSS
import {name_picture} from "./Home";
import FullSolution from "./FullSolution";

const GlobalSolution = ({problem, pid}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [likes,setLikes] = useState(problem.Likes);
    const [liked, setLiked] = useState(problem.Likes.includes(name_picture.userName));
    const toggleOpen = () => {
        setIsOpen(!isOpen);
    };
    useEffect(() => {
        setLikes(problem.Likes);
        setLiked(problem.Likes.includes(name_picture.userName))
    }, [problem])
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
                                src={problem.CreatorProfilePic}
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
                <div className="card-body">
                    <div className={`card-body ${isOpen ? '' : 'collapsed-content'}`}>
                        {/*<h5>Equations:</h5>*/}
                        {/*<ShowEquations equationsData={problem.Equations}/>*/}
                        {/*<h5>Solution:</h5>*/}
                        {/*<SolutionSteps serverResponseSolution={problem.Solution}/>*/}
                        <FullSolution problem={problem} showTable={true}/>
                    </div>
                </div>
                <div className="card-footer d-flex justify-content-between align-items-center">

                    <div className="d-flex align-items-center">
                        <button className={`icon-button heart-button`} onClick={toggleLike}>
                            {liked ? (
                                <FontAwesomeIcon icon={faHeart} style={{color: "#fc7373"}}/>
                            ) : (
                                <FontAwesomeIcon icon={faHeart}/>
                            )}

                        </button>
                        <span className="ml-1" style={{marginLeft:'3px',color:"gray"}}> {likes.length}</span>


                        <button className="icon-button ml-3" style={{marginLeft: '10px'}}>
                            <FontAwesomeIcon icon={faComment}/>
                            <span className="ml-1"> Comment</span>

                        </button>
                    </div>

                    <span style={{color: 'gray',}}>
                        <FontAwesomeIcon icon={faEye}/>
                        <span className="ml-1"> {problem.Views}</span>
                    </span>
                </div>
            </div>
        </div>
    );
};

export default GlobalSolution;
