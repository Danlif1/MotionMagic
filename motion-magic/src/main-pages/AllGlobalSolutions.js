import React, {useCallback, useEffect, useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'katex/dist/katex.min.css';
import {InlineMath} from 'react-katex';
import Button from 'react-bootstrap/Button';
import {useNavigate} from 'react-router-dom';
import {token} from '../login_signup/login/Login'
import axios from 'axios';
import {Container, Nav, Navbar} from "react-bootstrap";
import {name_picture} from "./Home";
import TopBar from "./TopBar"; // Import axios for making HTTP requests
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSync } from '@fortawesome/free-solid-svg-icons';
import './allglobalsolutions.css'
import GlobalSolution from "./GlobalSolution";
const AllGlobalSolutions = () => {
    const [problems, setProblems] = useState([]);
    const navigate = useNavigate();
    const [error, setError] = useState('');

    function signOut() {
        navigate('/', {replace: true});
    }

    function gotosolve() {
        navigate('/solve', {replace: true});
    }

    function gotohistory() {
        navigate('/history', {replace: true});
    }
    function gotoglobalsolutions(){
        navigate('/global-solutions',{replace:true});
    }


    // Define the function to fetch problems from the server
    const fetchProblems = useCallback(async () => {
        console.log('Fetching Problems')
        try {
            const response = await axios.get('http://localhost:5000/api/viewProblems/newest/', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if(response.status===200) {
                setProblems(response.data);
                console.log(response.data);
                setError('')
            } else{
                setError(response)
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

    // Fetch problems when the component mounts
    useEffect(() => {
        fetchProblems();
    }, [fetchProblems]);

    return (

        <>
            <TopBar strToDisplay={name_picture.profilePicture} displayName={name_picture.displayname} gotohistory={gotohistory}
                    gotosolve={gotosolve} signOut={signOut} username={name_picture.userName} gotoglobalsolutions={gotoglobalsolutions} />
            <div className="content-wrapper">
                <div className="header-container">
                    <h1 className="d-inline">Global Motion Problem Feed</h1>
                    <Button variant="light" href="#" className="mr-2 custom-button refresh-button" onClick={fetchProblems}>
                        <FontAwesomeIcon icon={faSync} />
                    </Button>
                </div>
                <div >
                    {!error && problems.map((problem) => (
                        <GlobalSolution key={problem.ID} pid={problem.ID} problem={problem}  />
                    ))}
                    {error && (
                        <div className="alert alert-danger">
                            {error}
                        </div>
                    )}
                    {problems.length === 0 && !error && (
                        <div className="header-container" style={{marginLeft: "10px"}}>
                            <h3 className="d-inline">No Motion Problems Anywhere! :(</h3>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
        ;
};

export default AllGlobalSolutions;