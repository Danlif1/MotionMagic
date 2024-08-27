import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';
import './solve.css';
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';
function findFirstMismatchIndex(str1, str2) {
    // Determine the length of the shortest string
    const minLength = Math.min(str1.length, str2.length);

    // Iterate through each character up to the length of the shortest string
    for (let i = 0; i < minLength; i++) {
        // Check if characters at the current position are different
        if (str1[i] !== str2[i]) {
            return i; // Return the index of the first mismatch
        }
    }

    // If no mismatch found within the shortest length, check if the lengths are different
    if (str1.length !== str2.length) {
        return minLength; // Return the index where the mismatch occurs due to length difference
    }

    // If no mismatch found and lengths are equal, return -1 indicating no mismatch
    return -1;
}

const Solve = () => {
    const navigate = useNavigate();
    const [error, setError] = React.useState('');
    const [points, setPoints] = useState([]);
    const [newPoint, setNewPoint] = useState('');
    const [paths, setPaths] = useState([]);
    const [riders, setRiders] = useState([]);
    const [newRider, setNewRider] = useState('');
    const [solutionVisible, setSolutionVisible] = useState(false); // State for toggling solution display
    const [riderData, setRiderData] = useState({}); // State to store input data for each rider
    const [finalRiderData,setFinalRiderData] = useState({});
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


    const getShortestReps = () => {

    }
    const handleAddRider = () => {
        // Trim the new rider's name and check if it's empty
        const trimmedRiderName = newRider.trim();
        if (trimmedRiderName === '') {
            return;
        }

        // Check if the rider name already exists
        const riderExists = riders.some(rider => rider.name === trimmedRiderName);
        if (riderExists) {
            // Optionally, you could display a message or alert to the user
            setError('Rider already exists');

            return;
        }

        // Update riders array and riderData state
        const updatedRiders = [...riders, { name: trimmedRiderName, paths: [...paths] }];
        setRiders(updatedRiders);
        setRiderData(prevState => ({
            ...prevState,
            [trimmedRiderName]: paths.map(path => ({ path, time: '', velocity: '', distance: '' }))
        }));
        setNewRider('');
        setError('');

    };

    const handleInputChange = (e) => {
        setNewPoint(e.target.value);
    };

    const handleRiderInputChange = (e) => {
        setNewRider(e.target.value);
    };

    const gohome = () => {
        navigate('/home', { replace: true });
    };
    const finalizeData=() =>{
        setFinalRiderData(()=>(riders.reduce((acc,rider)=> {
            acc[rider.name] = riderData[rider.name].map((pathData) => (
                {
                    path: pathData.path,
                    time: pathData.time ? pathData.time : `t_{${pathData.path},${rider.name}}`,
                    velocity: pathData.velocity ? pathData.velocity : `v_{${pathData.path},${rider.name}}`,
                    distance: pathData.distance ? pathData.distance : `d_{${pathData.path},${rider.name}}`
                }
            ));
            return acc;
        },{})
        )
        )


    }
    const handleSolve = () => {
        setSolutionVisible(true); // Toggle visibility of solution
        finalizeData()
        console.log(riderData); // You can see the values entered in the table for debugging
        console.log(finalRiderData);
    };

    const handleTableInputChange = (riderName, pathIndex, field, value) => {
        setRiderData(prevState => ({
            ...prevState,
            [riderName]: prevState[riderName].map((pathData, index) => {
                if (index === pathIndex) {
                    return { ...pathData, [field]: value };
                }
                return pathData;
            })
        }));
    };
    function isNumber(value) {
        const num = Number(value);
        return Number.isFinite(num);
    }
    const display_eq =(t,v,d) => {
        let nt = Number(t)
        let nv = Number(v)
        let it = Number.isFinite(nt)
        let iv = Number.isFinite(nv)
        if (!it && !iv) {
            setError('Equations are not linear')
            return `${t}*${v}=${d}`
        }
        if (it && !iv) {
            if(nt!==1) {
                return `${t}${v}=${d}`
            }
            return `${v}=${d}`
        }
        else if (!it && iv) {
            if(nv!==1)
                return `${v}${t}=${d}`
            return `${t}=${d}`
        }
        return `${nt*nv}=${d}`
    }

    return (
        <div>
            <div style={{ paddingTop: '3px' }}>
                <span className="d-inline-block">
                    <h1 className="d-inline container-lg">Motion Problem Solver</h1>
                    <Button variant="light" href="#" className="mr-2 custom-button home" onClick={gohome}>Home</Button>
                </span>
                <h2 style={{ margin: '10px' }}>Problem parameters:</h2>
                <span className="inputs" style={{ margin: '10px' }}>
                    <input
                        type="text"
                        value={newPoint}
                        onChange={handleInputChange}
                        className="form-control d-inline w-auto mr-2"
                        placeholder="Add a new point"
                    />
                    <button className="btn btn-primary mr-2" style={{ marginBottom: '4px', marginLeft: '5px' }}
                            onClick={handleAddPoint}>Add Point</button>
                    <span style={{ marginLeft: '10px' }}>
                        <input
                            type="text"
                            value={newRider}
                            onChange={handleRiderInputChange}
                            className="form-control d-inline w-auto mr-2"
                            placeholder="Add a new rider"
                        />
                        <button className="btn btn-secondary mr-2"
                                style={{ marginBottom: '4px', marginLeft: '5px' }} onClick={handleAddRider}>Add Rider</button>
                    </span>
                </span>
                <span>
                    <Button variant="success" className="ml-2" onClick={handleSolve}>Solve</Button> {/* Solve Button */}
                </span>
                {error && (
                    <div className='text-danger' style={{ marginLeft: '10px' }}>
                        {error}
                    </div>
                )}
            </div>
            <div>
                <h3 style={{ margin: '10px' }}>Current Points</h3>
                <div className="d-flex flex-wrap">
                    {points.map((point, index) => (
                        <div key={index} className="p-2"><InlineMath math={point} /></div>
                    ))}
                </div>
            </div>
            <div>
                {riders.map((rider, riderIndex) => (
                    <div key={riderIndex} className="mt-4">
                        <h3 style={{ margin: '10px' }}>{rider.name}'s Table</h3>
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
                                            <td><InlineMath math={path} /></td>
                                            <td>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Time"
                                                    //value={riderData[rider.name]?.[pathIndex]?.time || ''}
                                                    onChange={(e) => handleTableInputChange(rider.name, pathIndex, 'time', e.target.value)}
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Velocity"
                                                    //value={riderData[rider.name]?.[pathIndex]?.velocity || ''}
                                                    onChange={(e) => handleTableInputChange(rider.name, pathIndex, 'velocity', e.target.value)}
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Distance"
                                                    //value={riderData[rider.name]?.[pathIndex]?.distance || ''}
                                                    onChange={(e) => handleTableInputChange(rider.name, pathIndex, 'distance', e.target.value)}
                                                />
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

            {solutionVisible && ( // Conditionally render the solution
                <div>
                    <h3 style={{ margin: '10px' }}>Solution</h3>
                    <div className="p-2">Points: {points.join(', ')}</div>
                    {riders.map((rider, riderIndex) => (
                        <div key={riderIndex} className="mt-2">
                            <h4>{rider.name}</h4>
                            <div className="p-2">Paths: {rider.paths.join(', ')}</div>
                            {finalRiderData[rider.name]?.map((data, index) => (
                                <div key={index} className="p-2">
                                    <InlineMath math={data.path} /> - Time: <InlineMath math={data.time}/>, Velocity: <InlineMath math={data.velocity}/>, Distance: <InlineMath math={data.distance}/>
                                    <br/>
                                    <InlineMath math={display_eq(data.time,data.velocity,data.distance)}/>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Solve;
