import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';
import './solve.css'
import Button from "react-bootstrap/Button";
import {useNavigate} from "react-router-dom";

const Solve = () => {
    const navigate = useNavigate();

    const [points, setPoints] = useState([]);
    const [newPoint, setNewPoint] = useState('');
    const [paths, setPaths] = useState([]);
    const [riders, setRiders] = useState([]);
    const [newRider, setNewRider] = useState('');

    const handleAddPoint = () => {
        if (newPoint.trim() === '') return;
        const updatedPoints = [...points, newPoint.trim()];
        setPoints(updatedPoints);
        setNewPoint('');

        if (updatedPoints.length > 1) {
            const updatedPaths = [...paths, `${updatedPoints[updatedPoints.length - 2]}-${newPoint.trim()}`];
            setPaths(updatedPaths);
        }
    };

    const handleAddRider = () => {
        if (newRider.trim() === '') return;
        const updatedRiders = [...riders, { name: newRider.trim(), paths: [...paths] }];
        setRiders(updatedRiders);
        setNewRider('');
    };

    const handleInputChange = (e) => {
        setNewPoint(e.target.value);
    };

    const handleRiderInputChange = (e) => {
        setNewRider(e.target.value);
    };
    function gohome(){
        navigate('/home',{replace:true});
    }

    return (
        <div>
            <div style={{paddingTop: '3px'}}>
                <span className="d-inline-block">
                <h1 className="d-inline container-lg">Motion Problem Solver</h1>
                    <Button variant="light" href="#" className="mr-2 custom-button home" onClick={gohome}>Home</Button>
                </span>
                <h2 style={{margin:'10px'}}>Problem parameters:</h2>
                <span className=" inputs" style={{margin: '10px'}}>

                            <input
                                type="text"
                                value={newPoint}
                                onChange={handleInputChange}
                                className="form-control d-inline w-auto mr-2"
                                placeholder="Add a new point"
                            />
                            <button className="btn btn-primary mr-2 " style={{marginBottom: '4px', marginLeft: '5px'}}
                                    onClick={handleAddPoint}>Add Point</button>
                            <span style={{marginLeft: '10px'}}>

                                <input
                                    type="text"
                                    value={newRider}
                                    onChange={handleRiderInputChange}
                                    className="form-control d-inline w-auto mr-2"
                                    placeholder="Add a new rider"

                                />
                                <button className="btn btn-secondary mr-2"
                                        style={{marginBottom: '4px', marginLeft: '5px'}} onClick={handleAddRider}>Add Rider</button>
                            </span>
                    </span>


            </div>
            <div>
            <h3 style={{margin:'10px'}}>Current Points</h3>
                <div className="d-flex flex-wrap">
                    {points.map((point, index) => (
                        <div key={index} className="p-2"><InlineMath math={point}/></div>
                    ))}
                </div>
            </div>
            <div>
                {riders.map((rider, riderIndex) => (
                    <div key={riderIndex} className="mt-4">
                        <h3 style={{margin:'10px'}}>{rider.name}'s Table</h3>
                        <div className="d-flex justify-content-center">
                            <div className="table-responsive w-75">
                                <table className="table table-bordered text-center">
                                    <thead className="thead-dark">
                                    <tr>
                                        <th>Path</th>
                                        <th>Time</th>
                                        <th>Velocity</th>
                                        <th>Distance</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {paths.map((path, pathIndex) => (
                                        <tr key={pathIndex}>
                                            <td><InlineMath math={path}/></td>
                                            <td><input type="text" className="form-control" placeholder="Time"/></td>
                                            <td><input type="text" className="form-control" placeholder="Velocity"/>
                                            </td>
                                            <td><input type="text" className="form-control" placeholder="Distance"/>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Solve;
