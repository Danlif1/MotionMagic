import React, {useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import SolutionSteps from "./SolutionSteps";
import ShowEquations from "./ShowEquations";
import './motionproblemcard.css'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { faBicycle } from '@fortawesome/free-solid-svg-icons';
const MotionProblemCard = ({problem}) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleOpen = () => {
        setIsOpen(!isOpen);
    };

    const formattedDate = new Date(problem.Time).toLocaleString();

    return (
        <div className="container mb-3"> {/* Adjust the maxWidth as needed */}
            <div className="card" style={{minWidth: '1000px'}}>
                <div className="card-header">
                    <div className="d-flex justify-content-between align-items-center">

                        <span><FontAwesomeIcon icon={faBicycle} />  Motion Problem At {formattedDate}</span>
                        <button className="btn btn-sm btn-link" onClick={toggleOpen}>
                            {isOpen ? '▲' : '▼'}
                        </button>
                    </div>
                </div>
                <div className="card-body">
                    <div className={`card-body ${isOpen ? '' : 'collapsed-content'}`}>
                        {/* Show partial content when collapsed, full content when expanded */}
                        <h5>Equations:</h5>
                        <ShowEquations equationsData={problem.Equations}/>
                        <h5>Solution:</h5>
                        <SolutionSteps serverResponseSolution={problem.Solution}/>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MotionProblemCard;