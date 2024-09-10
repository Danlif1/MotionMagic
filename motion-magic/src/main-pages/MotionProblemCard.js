import React, {useEffect, useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import SolutionSteps from "./SolutionSteps";
import ShowEquations from "./ShowEquations";
import './motionproblemcard.css'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faBicycle,
    faCaretDown,
    faCaretUp,
    faComment,
    faEye,
    faHeart, faLock,
    faTrash,
    faUpload
} from '@fortawesome/free-solid-svg-icons';
import {token} from '../login_signup/login/Login'
import {Modal} from "react-bootstrap";
import Button from "react-bootstrap/Button";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import FullSolution from "./FullSolution"; // Import styles for react-toastify
const MotionProblemCard = ({problem,pid,refresh}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isPublic,setIsPublic] = useState(problem.Public);
    const [showPublishModal, setShowPublishModal] = useState(false);

    useEffect(()=>{
        console.log(problem)
        setIsPublic(problem.Public);
    },[problem])
    const toggleOpen = () => {

        setIsOpen(!isOpen);
    };
    const handleDelete = async () => {

        try {
            const response = await axios.delete(`http://localhost:5000/api/deleteProblem/${pid}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.status === 200) {
                toast.success(response.data.message, {
                    position: "bottom-left",
                    autoClose: 3000,
                });
                refresh()




            } else {
                toast.error(response.data.message, {
                    position: "bottom-left",
                    autoClose: 2000,
                });
            }
        } catch (error) {
            if (error.response) {
                toast.error(error.response.data.message, {
                    position: "bottom-left",
                    autoClose: 2000,
                });
            } else {
                console.error('Error deleting problem:', error);
                toast.error('An error occurred while trying to delete the problem.', {
                    position: "bottom-left",
                    autoClose: 2000,
                });
            }
        }
        setShowDeleteModal(false); // Close the modal after attempting deletion
    };
    const yo = () => {
        console.log('in yo')
    }
    const handlePublish =  async () => {
        console.log('in')
        try {
            const response = await axios.patch(`http://localhost:5000/api/problem/${pid}`, {}, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.status === 200) {
                // Toggle isPublic based on the new state
                const message = response.data.message;
                console.log('got:',message);
                if(message==='Published problem'){
                    setIsPublic(true);
                } else if (message==='Unpublished problem'){
                    setIsPublic(false);
                } else {
                    console.log(message);

                }


                // Show success notification
                toast.success(response.data.message, {
                    position: "bottom-left",
                    autoClose: 3000,
                });
            } else {
                toast.error(response.data.message, {
                    position: "bottom-left",
                    autoClose: 3000,
                });
            }
        } catch (error) {
            if (error.response) {
                toast.error(error.response.data.message, {
                    position: "bottom-left",
                    autoClose: 3000,
                });
            } else {
                console.error('Error publishing/unpublishing problem:', error);
                toast.error('An error occurred while trying to publish/unpublish the problem.', {
                    position: "bottom-left",
                    autoClose: 3000,
                });
            }
        }
        setShowPublishModal(false); // Close the modal after attempting publication
    };
    const formattedDate = new Date(problem.Time).toLocaleString();

    return (
        <div className="container mb-3"> {/* Adjust the maxWidth as needed */}
            <div className="card" style={{minWidth: '1000px'}}>
                <div className="card-header">
                    <div className="d-flex justify-content-between align-items-center">
                        <div className="card-header-content">
                            <span><FontAwesomeIcon icon={faBicycle}/>  Motion Problem At {formattedDate}</span>
                            <button className="collapse-button card-column" onClick={toggleOpen}
                                    style={{marginLeft: '10px'}}>
                                {isOpen ? <FontAwesomeIcon size="lg" icon={faCaretUp}/> :
                                    <FontAwesomeIcon size="lg" icon={faCaretDown}/>}
                            </button>
                            <span>
                            {isPublic ? <span className='text-success'>PUBLIC</span>:<span className='text-danger'>PRIVATE</span>}
                            </span>
                        </div>
                        <div className="card-header-content">

                            <button className="delete-button card-column" onClick={() => setShowDeleteModal(true)}>
                                <FontAwesomeIcon icon={faTrash}/>
                            </button>
                        </div>
                    </div>
                </div>
                <div className="card-body">
                    <div className={`card-body ${isOpen ? '' : 'collapsed-content'}`}>
                        {/* Show partial content when collapsed, full content when expanded */}
                        {/*<h5>Equations:</h5>*/}
                        {/*<ShowEquations equationsData={problem.Equations}/>*/}
                        {/*<h5>Solution:</h5>*/}
                        {/*<SolutionSteps serverResponseSolution={problem.Solution}/>*/}
                        <FullSolution problem={problem} showTable={true} showFinalTableSol={true}/>
                    </div>
                </div>
                <div className="card-footer d-flex justify-content-between align-items-center">

                    <div className="d-flex align-items-center">

                            {!isPublic ? (
                                <button className={`icon-button publish-button`}
                                        onClick={() => setShowPublishModal(true)}>
                                <span>
                                <FontAwesomeIcon icon={faUpload}/> Publish
                                    </span>
                                </button>
                                    ) : (
                                        <button className={`icon-button lock-button`} onClick={handlePublish}>
                                    <FontAwesomeIcon icon={faLock}/> Make Private
                                        </button>
                                    )}






                                </div>


                                </div>
                            {/* Delete Confirmation Modal */}
                <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Confirm Delete</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        Are you sure you want to delete this problem?
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                            Cancel
                        </Button>
                        <Button variant="danger" onClick={handleDelete}>
                            Delete
                        </Button>
                    </Modal.Footer>
                </Modal>
                <Modal show={showPublishModal} onHide={() => setShowPublishModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Confirm Publish</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <h6 style={{fontSize:17}}>
                        Are you sure you want to publish this problem?
                        </h6>
                        <div>
                        <small style={{color:"gray"}}>This will make the problem available for all users to see.</small>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowPublishModal(false)}>
                            Cancel
                        </Button>
                        <Button variant="success" onClick={handlePublish}>
                            Publish
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
            {/*<ToastContainer/>*/}
        </div>
    );
};

export default MotionProblemCard;