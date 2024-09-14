import React, {useCallback, useEffect, useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';
import './solve.css';
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';
import * as math from 'mathjs';
import {token} from '../login_signup/login/Login'
import axios from 'axios';
import SolutionSteps from "./SolutionSteps";
import {name_picture} from "./Home";
import TopBar from "./TopBar";
import ShowEquations from "./ShowEquations"; // Import axios for making HTTP requests
const isValidExpression = (str) => {
    try {
        math.parse(str);
        return true;
    } catch (e) {
        return false;
    }
};
const testParsing = (expression) => {
    try {
        const result = math.parse(expression);
        console.log('Parsed result:', result.toString());
        return true;
    } catch (e) {
        console.error('Parsing error:', e);
        return false;
    }
};

testParsing('2 + 2');
testParsing('2 + 2');

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
    const [equationsData, setEquationsData] = useState([]);
    const [canSolve, setCanSolve] = useState(true);
    const [serverResponse, setServerResponse] = useState([]);


    function signOut() {
        navigate('/',{replace:true});
    }
    function gotosolve(){
        navigate('/solve',{replace:true});
    }
    function gotohistory(){
        navigate('/history',{replace:true});
    }
    function gotoglobalsolutions(){
        navigate('/global-solutions',{replace:true});
    }
    useEffect(() => {
        if (Object.keys(finalRiderData).length > 0) {
            console.log('paths: ',paths)
            console.log('riders: ',riders)
            console.log('riderData: ',riderData)
            setEquationsFromFinal();

        }
    }, [finalRiderData]);
    useEffect(() => {
        console.log('ed:',equationsData)
        if (equationsData.length > 0) {
            console.log('Sending solve request')
            sendSolveRequest();
        }
    }, [equationsData]);

    const sendSolveRequest = async () => {
        try {
            const response = await axios.post('http://localhost:5000/api/solve', {
                equations: equationsData.flat(),
                _paths:paths,
                riders:riders,
                riderData:riderData
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`, // Include authentication token
                    'Content-Type': 'application/json'
                }
            });
            console.log('Server response sol:', response.data['solution'])
            setServerResponse(response.data['solution']); // Store the response
            console.log('Server response:', response.data); // Log the response for debugging
            console.log('serverResponse is ',serverResponse)
        } catch (error) {
            console.error('Error sending solve request:', error);
            setError('Failed to solve equations. Please try again.');
        }
    };
    // const sendSolveRequest = async () => {
    //     try {
    //         console.log(`token: ${token}`)
    //         const response = await fetch('http://localhost:5000/api/solve', {
    //             method: 'POST',
    //             headers: {
    //                 'Authorization': `Bearer ${token}`, // Include authentication token
    //                 'Content-Type': 'application/json'
    //             },
    //             body: JSON.stringify({
    //                 equations: equationsData.flat() // Flatten and send equations
    //             })
    //         });
    //
    //         // Check if the response is not ok (e.g., 404, 500 errors)
    //         if (!response.ok) {
    //             throw new Error(`HTTP error! status: ${response.status}`);
    //         }
    //
    //         const data = await response.json();
    //         setServerResponse(data); // Store the response
    //         console.log('Server response:', data); // Log the response for debugging
    //     } catch (error) {
    //         console.error('Error sending solve request:', error);
    //         setError('Failed to solve equations. Please try again.');
    //     }
    // };
    const debounce = (func, delay) => {
        let timer;
        return (...args) => {
            clearTimeout(timer);
            timer = setTimeout(() => func(...args), delay);
        };
    };


    const validateInput = useCallback(
        debounce((value,riderName, path, field) => {
            if (!isValidExpression(value)) {
                setError('Invalid mathematical expression in:'+riderName+"'s table, "+path+', '+field);
                setCanSolve(false)
            } else {
                setError(''); // Clear the error if valid
                setCanSolve(true)
            }
        }, 500), // 500ms debounce delay
        []
    );
    const handleAddPoint = () => {
        let trimmedp = newPoint.trim()
        if (trimmedp === '') return;
        const pExists = points.some(point => point === trimmedp)
        if(pExists){
            setError(`Point already exists`);
            return;
        }
        if(!validInputPointRider(trimmedp)){
            setError(`Invalid input point: ${trimmedp}`);
            return;
        }
        const updatedPoints = [...points, trimmedp];
        setPoints(updatedPoints);
        setNewPoint('');

        if (updatedPoints.length > 1) {
            const newPath = `${updatedPoints[updatedPoints.length - 2]}↔${newPoint.trim()}`;
            const updatedPaths = [...paths, newPath];
            setPaths(updatedPaths);
            updateRiderDataWithNewPath(newPath);
        }
        setError(``);
    };
    const updateRiderDataWithNewPath = (newPath) => {
        setRiderData((prevRiderData) => {
            const newRiderData = { ...prevRiderData };

            riders.forEach((rider) => {
                if (!newRiderData[rider.name]) {
                    newRiderData[rider.name] = [];
                }
                // Check if the path already exists for this rider
                const pathExists = newRiderData[rider.name].some((pathData) => pathData.path === newPath);
                if (!pathExists) {
                    newRiderData[rider.name].push({ path: newPath, time: '', velocity: '', distance: '' });
                }
            });

            return newRiderData;
        });
    };


    const handleAddRider = () => {
        // Trim the new rider's name and check if it's empty
        const trimmedRiderName = newRider.trim();
        if (trimmedRiderName === '') {
            return;
        }
        if(!validInputPointRider(trimmedRiderName)) {
            setError(`Invalid input rider: ${trimmedRiderName}`);
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
                    time: pathData.time ,
                    velocity: pathData.velocity,
                    distance: pathData.distance
                }
            ));
            return acc;
        },{})
        )
        )


    }
    const setEquationsFromFinal = () => {
        console.log('final: ')
        console.log(finalRiderData)
        setEquationsData(() => (riders.map((rider) =>
        (finalRiderData[rider.name]?.map((pathData) =>
            get_eq(pathData.time,pathData.velocity,pathData.distance))).filter((el)=>el))))
        //setEquationsData((prev)=>prev.filter((el)=>el))

    }
    const handleSolve = () => {
        for (let riderName in riderData) {
            const riderPaths = riderData[riderName];
            for (let i = 0; i < riderPaths.length; i++) {
                const {time, velocity, distance} = riderPaths[i];
                if ((!time || !velocity || !distance) && (time||velocity||distance)) {
                    setError(`Empty input found in ${riderName}'s table for path ${paths[i]}`);
                    return; // Stop execution if an empty input is found
                }
            }
        }
        setError('')
        setSolutionVisible(true); // Toggle visibility of solution
        finalizeData()
        console.log(riderData); // You can see the values entered in the table for debugging
        console.log(finalRiderData);
        console.log(equationsData)
    };

    const handleTableInputChange = (riderName, pathIndex, field, value) => {
        //validate input
        validateInput(value,riderName, paths[pathIndex], field);
        // change rider data regardless of check result
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
    const validInputPointRider = (str) =>{
        const expressionPattern = /[\+\-\*\/\^ ]/; //from chatgpt

        // Check if the string matches the pattern
        return !expressionPattern.test(str);
    }
    const needsParentheses = (str) => {
        const trimmedStr = str.trim();

        const expressionPattern = /[\+\-\*\/\^ ]/; //from chatgpt

        // Check if the string matches the pattern
        return expressionPattern.test(trimmedStr);
    };
    const get_eq =(t,v,d) => {
        if(!t && !v && !d){
            return ''
        }
        let nt = Number(t)
        let nv = Number(v)
        let it = Number.isFinite(nt)
        let iv = Number.isFinite(nv)
        let et=t;
        let ev = v;
        if(needsParentheses(t)){
            et = '('+t+')'
        }
        if(needsParentheses(v)){
            ev = '('+v+')'
        }
        if (!it && !iv) {
            //setError('Equations are not linear')
            return `${et}*${ev}=${d}`
        }
        if (it && !iv) {
            if(nt!==1) {
                return `${et}*${ev}=${d}`
            }
            return `${ev}=${d}`
        }
        else if (!it && iv) {
            if(nv!==1)
                return `${ev}*${et}=${d}`
            return `${et}=${d}`
        }
        return `${nt*nv}=${d}`
    }

    return (
        <>
        <TopBar strToDisplay={name_picture.profilePicture} displayName={name_picture.displayname} gotohistory={gotohistory}
                gotosolve={gotosolve} signOut={signOut} username={name_picture.userName} gotoglobalsolutions={gotoglobalsolutions}/>
        <div>
            <div style={{paddingTop: '3px'}}>
                <span className="d-inline-block">
                    <h1 className="d-inline container-lg">Motion Problem Solver</h1>
                    <Button variant="light" href="#" className="mr-2 custom-button home" onClick={gohome}>Home</Button>
                </span>
                <div style={{margin: '10px'}}>
                   <h4> Here you can input your motion problem. All inputs need to be mathematically valid expressions,
                       and there can be no empty inputs.</h4>
                </div>
                <h2 style={{margin: '10px'}}>Problem parameters:</h2>
                <span className="inputs" style={{margin: '10px'}}>
                    <input
                        type="text"
                        value={newPoint}
                        onChange={handleInputChange}
                        className="form-control d-inline w-auto mr-2"
                        placeholder="Add a new point"
                    />
                    <button className="btn btn-primary mr-2" style={{marginBottom: '4px', marginLeft: '5px'}}
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
                                style={{marginBottom: '4px', marginLeft: '5px'}}
                                onClick={handleAddRider}>Add Rider</button>
                    </span>
                </span>
                <span>
                    <Button variant="success" className="ml-2" onClick={handleSolve}
                            disabled={!canSolve}>Solve</Button> {/* Solve Button */}
                </span>
                {error && (
                    <div className='text-danger' style={{marginLeft: '10px'}}>
                        {error}
                    </div>
                )}
            </div>
            <div>
                <h3 style={{margin: '10px'}}>Current Points</h3>
                <div style={{margin: '10px'}} className="d-flex flex-wrap">
                    {points.map((point, index) => (
                        <div key={index} className="p-2"><InlineMath math={point}/></div>
                    ))}
                </div>
            </div>
            <div>
                {riders.map((rider, riderIndex) => (
                    <div key={riderIndex} className="mt-4">
                        <h3 style={{margin: '10px'}}>{rider.name}'s Table</h3>
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
                                            <td>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Time"
                                                    value={riderData[rider.name]?.[pathIndex]?.time || ''}
                                                    onChange={(e) => handleTableInputChange(rider.name, pathIndex, 'time', e.target.value)}
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Velocity"
                                                    value={riderData[rider.name]?.[pathIndex]?.velocity || ''}
                                                    onChange={(e) => handleTableInputChange(rider.name, pathIndex, 'velocity', e.target.value)}
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Distance"
                                                    value={riderData[rider.name]?.[pathIndex]?.distance || ''}
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
                <div style={{margin: '10px'}}>
                    <h3 >Solution</h3>
                    <div className="p-2">Points: {points.join(', ')}</div>
                    {riders.map((rider, riderIndex) => (
                        <div key={riderIndex} className="mt-2">
                            <h4>{rider.name}</h4>
                            <div className="p-2">Paths: {rider.paths.join(', ')}</div>
                            {finalRiderData[rider.name]?.map((data, index) => (
                                <div key={index} className="p-2">
                                    <InlineMath math={data.path}/> - Time: <InlineMath math={data.time}/>,
                                    Velocity: <InlineMath math={data.velocity}/>, Distance: <InlineMath
                                    math={data.distance}/>

                                </div>
                            ))}
                        </div>
                    ))}
                   <ShowEquations equationsData={equationsData.flat()}/>
                    <div>
                        {solutionVisible && serverResponse.length>0  &&(
                            <div>
                                <h3>Solution Steps:</h3>
                                {/*<p>{serverResponse}</p>*/}
                                <SolutionSteps serverResponseSolution={serverResponse} finalVarSolutionsScope={serverResponse[1]} sg={true}/>

                            </div>
                        )}
                    </div>
                </div>

            )

            }

        </div>
        </>
    );
};

export default Solve;
